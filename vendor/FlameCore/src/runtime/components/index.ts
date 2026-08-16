export * from './transform.component';
export * from './mesh-renderer.component';
export * from './camera.component';
export * from './light.component';
export * from './environment.component';
export * from './input-listener.component';
export * from './animation-player.component';
export * from './state-machine.component';
export * from './scroll-driver.component';
export * from './prefab-instance.component';
export * from './physics-body.component';
export * from './lod.component';
export * from './audio.component';
export * from './text.component';
export * from './ui.component';
export * from './ui-canvas.component';
export * from './camera-canvas.component';
export * from './parallax-layer.component';
export * from './parallax-story.component';
export * from './scene-instance.component';
export * from './physics-constraint.component';
export * from './particle-system.component';
export * from './shader-effect.component';
export * from './mask-wipe.component';
export * from './weapon-trail.component';
export * from './product-viewer.component';
export * from './configurator.component';
export * from './camera-path.component';
export * from './hero.component';
export * from './text-reveal-3d.component';
export * from './articulation.component';
export * from './model-part-binding.component';
export * from './articulation-driver.component';
export * from './gltf-animation.component';
export * from './scene-switcher.component';
export * from './one-more-second.component';

import { registerComponentType } from '../scene/registry';
import { TransformComponent } from './transform.component';
import { MeshRendererComponent } from './mesh-renderer.component';
import { CameraComponent } from './camera.component';
import { LightComponent } from './light.component';
import { EnvironmentComponent } from './environment.component';
import { InputListenerComponent } from './input-listener.component';
import { AnimationPlayerComponent } from './animation-player.component';
import { StateMachineComponent } from './state-machine.component';
import { ScrollDriverComponent } from './scroll-driver.component';
import { PrefabInstanceComponent } from './prefab-instance.component';
import { PhysicsBodyComponent } from './physics-body.component';
import { LODComponent } from './lod.component';
import { AudioComponent } from './audio.component';
import { TextComponent } from './text.component';
import {
  UIRootComponent,
  UIPanelComponent,
  UILabelComponent,
  UIButtonComponent,
  UIImageComponent,
} from './ui.component';
import {
  UICanvasComponent,
  UICanvasTextComponent,
  UICanvasImageComponent,
  UICanvasButtonComponent,
  UICanvasLoadingBarComponent,
} from './ui-canvas.component';
import { CameraCanvasComponent } from './camera-canvas.component';
import { ParallaxLayerComponent } from './parallax-layer.component';
import { ParallaxStoryComponent } from './parallax-story.component';
import { SceneInstanceComponent } from './scene-instance.component';
import { PhysicsConstraintComponent } from './physics-constraint.component';
import { ParticleSystemComponent } from './particle-system.component';
import { ShaderEffectComponent } from './shader-effect.component';
import { MaskWipeComponent } from './mask-wipe.component';
import { WeaponTrailComponent } from './weapon-trail.component';
import { ProductViewerComponent } from './product-viewer.component';
import { ConfiguratorComponent, ConfiguratorHudRelayComponent } from './configurator.component';
import { CameraPathComponent } from './camera-path.component';
import { HeroComponent } from './hero.component';
import { TextReveal3DComponent } from './text-reveal-3d.component';
import { ArticulationComponent } from './articulation.component';
import { ModelPartBindingComponent } from './model-part-binding.component';
import { ArticulationDriverComponent } from './articulation-driver.component';
import { GltfAnimationComponent } from './gltf-animation.component';
import { SceneSwitcherComponent } from './scene-switcher.component';
import { OneMoreSecondGameComponent } from './one-more-second.component';

// Side-effect: register every built-in component type with the runtime
// registry so the editor and project loader can recreate them by name.
registerComponentType(TransformComponent);
registerComponentType(MeshRendererComponent);
registerComponentType(CameraComponent);
registerComponentType(LightComponent);
registerComponentType(EnvironmentComponent);
registerComponentType(InputListenerComponent);
registerComponentType(AnimationPlayerComponent);
registerComponentType(StateMachineComponent);
registerComponentType(ScrollDriverComponent);
registerComponentType(PrefabInstanceComponent);
registerComponentType(PhysicsBodyComponent);
registerComponentType(LODComponent);
registerComponentType(AudioComponent);
registerComponentType(TextComponent);
registerComponentType(UIRootComponent);
registerComponentType(UIPanelComponent);
registerComponentType(UILabelComponent);
registerComponentType(UIButtonComponent);
registerComponentType(UIImageComponent);
registerComponentType(UICanvasComponent);
registerComponentType(CameraCanvasComponent);
registerComponentType(UICanvasTextComponent);
registerComponentType(UICanvasImageComponent);
registerComponentType(UICanvasButtonComponent);
registerComponentType(UICanvasLoadingBarComponent);
registerComponentType(ParallaxLayerComponent);
registerComponentType(ParallaxStoryComponent);
registerComponentType(SceneInstanceComponent);
registerComponentType(PhysicsConstraintComponent);
registerComponentType(ParticleSystemComponent);
registerComponentType(ShaderEffectComponent);
registerComponentType(MaskWipeComponent);
registerComponentType(WeaponTrailComponent);
registerComponentType(ProductViewerComponent);
registerComponentType(ConfiguratorComponent);
registerComponentType(ConfiguratorHudRelayComponent);
registerComponentType(CameraPathComponent);
registerComponentType(HeroComponent);
registerComponentType(TextReveal3DComponent);
registerComponentType(ArticulationComponent);
registerComponentType(ModelPartBindingComponent);
registerComponentType(ArticulationDriverComponent);
registerComponentType(GltfAnimationComponent);
registerComponentType(SceneSwitcherComponent);
registerComponentType(OneMoreSecondGameComponent);
