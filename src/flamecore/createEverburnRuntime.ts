import { EnvironmentComponent, makeEnvironmentProps } from '@runtime/components/environment.component';
import { TransformComponent, makeTransformProps } from '@runtime/components/transform.component';
import { Runtime, FLAMECORE_RUNTIME_VERSION } from '@runtime/runtime';
import { Actor } from '@runtime/scene/actor';
import { Scene } from '@runtime/scene/scene';
import { RenderingSystem } from '@runtime/systems/rendering.system';
export interface EverburnFlameCoreBundle {
  runtime: Runtime;
  scene: Scene;
  version: string;
}

/** Boots FlameCore for Everburn — shared renderer/scene; R3F drives the render loop. */
export function createEverburnRuntime(canvas: HTMLCanvasElement): EverburnFlameCoreBundle {
  const runtime = Runtime.create({
    canvas,
    antialias: true,
    maxPixelRatio: 2,
    alpha: false,
  });

  const renderingSystem = runtime.getSystem(RenderingSystem);
  if (renderingSystem) {
    runtime.unregisterSystem(renderingSystem);
  }

  const scene = new Scene('Everburn', undefined, { clearColor: false });

  const envActor = new Actor('Environment');
  envActor.addComponent(new TransformComponent(makeTransformProps()));
  envActor.addComponent(
    new EnvironmentComponent(
      makeEnvironmentProps({
        backgroundMode: 'transparent',
        exposure: 1,
      }),
    ),
  );
  scene.add(envActor);

  runtime.loadScene(scene);

  canvas.dataset.flamecoreVersion = FLAMECORE_RUNTIME_VERSION;

  return {
    runtime,
    scene,
    version: FLAMECORE_RUNTIME_VERSION,
  };
}
