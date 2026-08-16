/**
 * 3D text reveal driven by scroll progress.
 * @module @runtime/components/text-reveal-3d
 */

import type { TextReveal3DProps } from '@shared/types/scroll';
import { BaseComponent } from '../scene/component';
import type { Scene } from '../scene/scene';
import { getScrollTriggerSystem } from '../systems/scroll-trigger.system';
import { TextComponent, makeTextProps } from './text.component';

/** Factory for default text reveal props. */
export function makeTextReveal3DProps(
  patch: Partial<Omit<TextReveal3DProps, '_version'>> = {},
): TextReveal3DProps {
  return {
    _version: 1,
    scrollStart: patch.scrollStart ?? 0,
    scrollEnd: patch.scrollEnd ?? 1500,
    clamp: patch.clamp ?? true,
    text: patch.text ?? 'Reveal on Scroll',
    fontSizePx: patch.fontSizePx ?? 64,
    color: patch.color ?? [1, 1, 1],
    revealMode: patch.revealMode ?? 'character',
  };
}

/**
 * TextReveal3DComponent drives a {@link TextComponent}'s reveal progress from
 * scroll position. Creates a TextComponent on attach if one is not present.
 */
export class TextReveal3DComponent extends BaseComponent<TextReveal3DProps> {
  static readonly typeName = 'TextReveal3DComponent';

  private _scene: Scene | undefined;
  private _text: TextComponent | undefined;
  private _triggerId = '';

  onAttach(actor: import('../scene/actor').Actor): void {
    super.onAttach(actor);
    if (!this._actor) return;
    let text = this._actor.getComponent(TextComponent);
    if (!text) {
      text = new TextComponent(
        makeTextProps({
          text: this._props.text,
          fontSizePx: this._props.fontSizePx,
          color: this._props.color,
          revealProgress: 0,
          revealMode: this._props.revealMode,
        }),
      );
      this._actor.addComponent(text);
    }
    this._text = text;
  }

  onSceneAttach(scene: Scene): void {
    super.onSceneAttach(scene);
    this._scene = scene;
    this._triggerId = `${this._actor?.id ?? 'unknown'}:text-reveal`;
    this._registerTrigger();
  }

  onSceneDetach(scene: Scene): void {
    this._unregisterTrigger();
    this._scene = undefined;
    super.onSceneDetach(scene);
  }

  onUpdate(_dt: number): void {
    if (!this._text || !this._scene?.runtime) return;
    const scrollSys = getScrollTriggerSystem(this._scene.runtime);
    const progress = scrollSys
      ? scrollSys.computeProgress({
          scrollStart: this._props.scrollStart,
          scrollEnd: this._props.scrollEnd,
          clamp: this._props.clamp,
        })
      : 0;
    this._text.setProps({ ...this._text.props, revealProgress: progress });
  }

  protected onPropsChanged(): void {
    if (this._text) {
      this._text.setProps({
        ...this._text.props,
        text: this._props.text,
        fontSizePx: this._props.fontSizePx,
        color: this._props.color,
        revealMode: this._props.revealMode,
      });
    }
    this._unregisterTrigger();
    this._registerTrigger();
  }

  private _registerTrigger(): void {
    const runtime = this._scene?.runtime;
    if (!runtime) return;
    getScrollTriggerSystem(runtime)?.register({
      id: this._triggerId,
      scrollStart: this._props.scrollStart,
      scrollEnd: this._props.scrollEnd,
      clamp: this._props.clamp,
    });
  }

  private _unregisterTrigger(): void {
    const runtime = this._scene?.runtime;
    if (!runtime || !this._triggerId) return;
    getScrollTriggerSystem(runtime)?.unregister(this._triggerId);
  }
}
