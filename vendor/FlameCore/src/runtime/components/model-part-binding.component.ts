/**
 * Binds a FlameCore actor to a named node inside a source actor's GLTF mesh.
 * @module @runtime/components/model-part-binding
 */

import * as THREE from 'three';
import type { ModelPartBindingProps } from '@shared/types/articulation';
import { BaseComponent } from '../scene/component';
import type { Actor } from '../scene/actor';
import type { Scene } from '../scene/scene';
import {
  applyWorldTransformToObject3D,
  findGltfNodeByPath,
  reparentNodePreserveWorld,
} from '../assets/gltf-utils';
import { MeshRendererComponent } from './mesh-renderer.component';
import { TransformComponent } from './transform.component';
import { ArticulationComponent } from './articulation.component';

/** Factory for default model part binding props. */
export function makeModelPartBindingProps(
  patch: Partial<Omit<ModelPartBindingProps, '_version'>> = {},
): ModelPartBindingProps {
  return {
    _version: 1,
    sourceActorId: patch.sourceActorId ?? '',
    nodePath: patch.nodePath ?? '',
    reparentNode: patch.reparentNode ?? true,
  };
}

/**
 * ModelPartBindingComponent links this actor to a sub-node of another actor's
 * loaded GLTF. When `reparentNode` is true the mesh node is moved under this
 * actor so timeline rotation on the actor drives the visible part.
 */
export class ModelPartBindingComponent extends BaseComponent<ModelPartBindingProps> {
  static readonly typeName = 'ModelPartBindingComponent';

  private _boundNode: THREE.Object3D | undefined;
  private _originalParent: THREE.Object3D | undefined;

  /** The bound Three.js node after a successful bind. */
  get boundNode(): THREE.Object3D | undefined {
    return this._boundNode;
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    void this._tryBind(scene);
  }

  onSceneDetach(scene: Scene): void {
    this._unbind();
    super.onSceneDetach(scene);
  }

  onDetach(): void {
    this._unbind();
    super.onDetach();
  }

  protected onPropsChanged(): void {
    this._unbind();
    const scene = this.actor?.scene;
    if (scene) void this._tryBind(scene);
  }

  onUpdate(_dt: number): void {
    if (this._boundNode) return;
    const scene = this.actor?.scene;
    if (scene) void this._tryBind(scene);
  }

  private async _tryBind(scene: Scene): Promise<void> {
    if (!this.actor || this._boundNode) return;
    const { sourceActorId, nodePath } = this._props;
    if (!sourceActorId || !nodePath.trim()) return;

    const source = scene.findActorById(sourceActorId);
    if (!source) return;

    const mesh = source.getComponent(MeshRendererComponent);
    const root = mesh?.assetRoot;
    if (!root) return;

    const node = findGltfNodeByPath(root, nodePath);
    if (!node) return;

    if (this._props.reparentNode) {
      this._reparentToActor(node, this.actor);
    } else {
      applyWorldTransformToObject3D(node, this.actor.object3D);
      this._boundNode = node;
    }

    const articulation = this.actor.getComponent(ArticulationComponent);
    articulation?.captureRestPose();
  }

  private _reparentToActor(node: THREE.Object3D, actor: Actor): void {
    this._originalParent = node.parent ?? undefined;

    applyWorldTransformToObject3D(node, actor.object3D);

    const transform = actor.getComponent(TransformComponent);
    if (transform) {
      const o = actor.object3D;
      transform.setProps({
        position: [o.position.x, o.position.y, o.position.z],
        rotation: [o.rotation.x, o.rotation.y, o.rotation.z],
        scale: [o.scale.x, o.scale.y, o.scale.z],
      });
    }

    reparentNodePreserveWorld(node, actor.object3D);
    node.position.set(0, 0, 0);
    node.rotation.set(0, 0, 0);
    node.scale.set(1, 1, 1);

    this._boundNode = node;
  }

  private _unbind(): void {
    if (!this._boundNode) return;
    const node = this._boundNode;
    if (this._originalParent && this._props.reparentNode) {
      this._originalParent.add(node);
    }
    this._boundNode = undefined;
    this._originalParent = undefined;
  }
}
