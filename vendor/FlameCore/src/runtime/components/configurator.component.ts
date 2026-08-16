/**
 * Product configurator component — variant management with material swapping.
 * @module @runtime/components/configurator
 */

import type { ConfiguratorProps, ConfiguratorVariant } from '@shared/types/configurator';
import type { SerializedComponentProps } from '@shared/types';
import { BaseComponent } from '../scene/component';
import { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import { MeshRendererComponent } from './mesh-renderer.component';
import { CameraComponent } from './camera.component';
import {
  UICanvasButtonComponent,
  makeUICanvasButtonProps,
} from './ui-canvas.component';
import { CameraCanvasComponent, makeCameraCanvasProps } from './camera-canvas.component';
import { getMaterialSystem } from '../systems/material.system';

/** Factory for default configurator props. */
export function makeConfiguratorProps(
  patch: Partial<Omit<ConfiguratorProps, '_version'>> = {},
): ConfiguratorProps {
  const out: ConfiguratorProps = {
    _version: 1,
    variants: patch.variants ?? [
      {
        id: 'default',
        name: 'Default',
        slots: [{ slotName: 'default', color: [0.8, 0.8, 0.8] }],
      },
    ],
    showOptionPanel: patch.showOptionPanel ?? true,
  };
  if (patch.targetActorId) out.targetActorId = patch.targetActorId;
  if (patch.activeVariantId) out.activeVariantId = patch.activeVariantId;
  return out;
}

const HUD_EVENT_PREFIX = 'configurator:';

interface HudRelayProps extends SerializedComponentProps {
  readonly _version: 1;
  ownerActorId: string;
}

/** Forwards UICanvas button clicks to the owning {@link ConfiguratorComponent}. */
export class ConfiguratorHudRelayComponent extends BaseComponent<HudRelayProps> {
  static readonly typeName = 'ConfiguratorHudRelayComponent';

  onEvent(event: { name: string; payload?: unknown }): void {
    if (event.name !== 'uiClick') return;
    const scene = this.actor?.scene;
    if (!scene) return;
    const owner = scene.findActorById(this._props.ownerActorId);
    const cfg = owner?.getComponent(ConfiguratorComponent);
    cfg?.handleHudClick(event);
  }
}

/**
 * ConfiguratorComponent drives material variants on a target mesh actor via
 * the {@link MaterialSystem}. When `showOptionPanel` is true, a screen-space
 * {@link CameraCanvasComponent} HUD is created on the main camera.
 */
export class ConfiguratorComponent extends BaseComponent<ConfiguratorProps> {
  static readonly typeName = 'ConfiguratorComponent';

  private _scene: Scene | undefined;
  private _registered = false;
  private readonly _hudActorIds: string[] = [];

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._scene = scene;
    void this._registerAndApply();
    this._syncOptionPanel();
  }

  onSceneDetach(scene: Scene): void {
    this._tearDownHud();
    this._unregister();
    this._scene = undefined;
    super.onSceneDetach(scene);
  }

  onDetach(): void {
    this._tearDownHud();
    super.onDetach();
  }

  protected onPropsChanged(): void {
    void this._registerAndApply();
    this._syncOptionPanel();
  }

  /** Handle HUD button clicks relayed from {@link ConfiguratorHudRelayComponent}. */
  handleHudClick(event: { payload?: unknown }): void {
    const payload = event.payload as { eventName?: string } | undefined;
    const name = payload?.eventName ?? '';
    if (!name.startsWith(HUD_EVENT_PREFIX)) return;
    const action = name.slice(HUD_EVENT_PREFIX.length);
    if (action.startsWith('variant:')) {
      void this.selectVariant(action.slice('variant:'.length));
    }
  }

  /** Switch to a named variant at runtime. */
  async selectVariant(variantId: string): Promise<void> {
    this.setProps({ ...this._props, activeVariantId: variantId });
    await this._applyActiveVariant();
    this._syncOptionPanel();
  }

  /** Add or replace a variant definition. */
  setVariant(variant: ConfiguratorVariant): void {
    const variants = this._props.variants.filter((v) => v.id !== variant.id);
    this.setProps({ ...this._props, variants: [...variants, variant] });
  }

  private async _registerAndApply(): Promise<void> {
    const runtime = this._scene?.runtime;
    if (!runtime) return;
    const matSys = getMaterialSystem(runtime);
    if (!matSys) return;

    const targetId = this._props.targetActorId;
    if (!targetId) return;

    const targetActor = this._scene?.findActorById(targetId);
    if (!targetActor) return;

    let root = targetActor.object3D;
    const mr = targetActor.getComponent(MeshRendererComponent);
    if (mr?.assetRoot) root = mr.assetRoot;
    else if (mr?.mesh) root = mr.mesh;

    matSys.registerTarget(targetId, root);
    this._registered = true;
    await this._applyActiveVariant();
  }

  private async _applyActiveVariant(): Promise<void> {
    const runtime = this._scene?.runtime;
    if (!runtime) return;
    const matSys = getMaterialSystem(runtime);
    if (!matSys) return;

    const targetId = this._props.targetActorId;
    if (!targetId) return;

    const variantId = this._props.activeVariantId ?? this._props.variants[0]?.id;
    const variant = this._props.variants.find((v) => v.id === variantId);
    if (!variant) return;

    await matSys.applyVariant(targetId, variant.slots);
  }

  private _unregister(): void {
    if (!this._registered || !this._scene?.runtime) return;
    const matSys = getMaterialSystem(this._scene.runtime);
    if (matSys && this._props.targetActorId) {
      matSys.unregisterTarget(this._props.targetActorId);
    }
    this._registered = false;
  }

  private _syncOptionPanel(): void {
    if (!this._scene || !this._actor) return;
    if (!this._props.showOptionPanel) {
      this._tearDownHud();
      return;
    }
    if (this._hudActorIds.length > 0) {
      this._refreshHudLabels();
      return;
    }
    this._buildHud();
  }

  private _buildHud(): void {
    const scene = this._scene;
    const host = this._actor;
    if (!scene || !host) return;

    const cameraActor = this._resolveMainCameraActor();
    if (!cameraActor) return;

    if (!cameraActor.getComponent(CameraCanvasComponent)) {
      cameraActor.addComponent(
        new CameraCanvasComponent(
          makeCameraCanvasProps({
            screenAnchor: 'bottom',
            screenSizePx: [420, 140],
            screenOffsetPx: [0, 24],
            widthPx: 420,
            heightPx: 140,
            backgroundColor: 'rgba(15,23,42,0.82)',
            canvasBorderColor: 'rgba(255,255,255,0.12)',
            canvasBorderPx: 1,
          }),
        ),
      );
    }

    const variants = this._props.variants;
    const btnW = 88;
    const btnH = 36;
    const gap = 8;
    let x = 16;

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      const btnActor = new Actor(`Variant ${v.name}`, `cfg-hud-var-${v.id}`);
      btnActor.addComponent(
        new UICanvasButtonComponent(
          makeUICanvasButtonProps({
            text: v.name,
            anchor: 'bottom-left',
            offset: [x, 100],
            width: btnW,
            height: btnH,
            layer: i + 1,
            eventName: `${HUD_EVENT_PREFIX}variant:${v.id}`,
            backgroundColor:
              this._props.activeVariantId === v.id
                ? 'rgba(37,99,235,0.95)'
                : 'rgba(60,90,255,0.55)',
          }),
        ),
      );
      btnActor.addComponent(
        new ConfiguratorHudRelayComponent({ _version: 1, ownerActorId: host.id }),
      );
      btnActor.setParent(cameraActor);
      scene.add(btnActor);
      this._hudActorIds.push(btnActor.id);
      x += btnW + gap;
    }

    const active = variants.find((v) => v.id === (this._props.activeVariantId ?? variants[0]?.id));
    if (active) {
      let sx = 16;
      for (const slot of active.slots) {
        if (!slot.color) continue;
        const [r, g, b] = slot.color;
        const sw = new Actor(`Swatch ${slot.slotName}`, `cfg-hud-slot-${slot.slotName}`);
        sw.addComponent(
          new UICanvasButtonComponent(
            makeUICanvasButtonProps({
              text: '',
              anchor: 'bottom-left',
              offset: [sx, 56],
              width: 28,
              height: 28,
              layer: 20,
              backgroundColor: rgbToHex(r, g, b),
              borderColor: '#ffffff',
              borderWidthPx: 1,
              eventName: `${HUD_EVENT_PREFIX}variant:${active.id}`,
            }),
          ),
        );
        sw.addComponent(
          new ConfiguratorHudRelayComponent({ _version: 1, ownerActorId: host.id }),
        );
        sw.setParent(cameraActor);
        scene.add(sw);
        this._hudActorIds.push(sw.id);
        sx += 36;
      }
    }
  }

  private _refreshHudLabels(): void {
    if (!this._scene) return;
    for (const id of this._hudActorIds) {
      const actor = this._scene.findActorById(id);
      const btn = actor?.getComponent(UICanvasButtonComponent);
      if (!btn) continue;
      const props = btn.serialize().props;
      const eventName = props.eventName as string;
      if (!eventName.startsWith(`${HUD_EVENT_PREFIX}variant:`)) continue;
      const variantId = eventName.slice(`${HUD_EVENT_PREFIX}variant:`.length);
      btn.setProps({
        ...props,
        backgroundColor:
          this._props.activeVariantId === variantId
            ? 'rgba(37,99,235,0.95)'
            : 'rgba(60,90,255,0.55)',
      } as never);
    }
  }

  private _tearDownHud(): void {
    if (!this._scene) {
      this._hudActorIds.length = 0;
      return;
    }
    for (const id of this._hudActorIds) {
      const actor = this._scene.findActorById(id);
      if (actor) this._scene.remove(actor);
    }
    this._hudActorIds.length = 0;
  }

  private _resolveMainCameraActor(): Actor | undefined {
    if (!this._scene) return undefined;
    const mainId = this._scene.mainCameraActorId;
    if (mainId) {
      const found = this._scene.findActorById(mainId);
      if (found?.getComponent(CameraComponent)) return found;
    }
    for (const actor of this._scene.actors) {
      if (actor.getComponent(CameraComponent)) return actor;
    }
    return undefined;
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.round(Math.max(0, Math.min(1, n)) * 255);
  return `#${[c(r), c(g), c(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
