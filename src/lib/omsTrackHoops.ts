import * as THREE from 'three';

const HOOP_SPACING = 10;
const CEILING_Y = 4.15;
const WALL_PAD = 0.15;
const OUTER_MARGIN = 0.45;
const _hoop = new THREE.Object3D();

/**
 * Place corridor hoops on a circle that contains the track box so they sit
 * outside the lane without crossing the side-wall quads.
 */
export function relayoutOmsTrackHoops(
  root: THREE.Object3D,
  distance: number,
  halfWidth: number,
): void {
  const hw = halfWidth + WALL_PAD;
  const cy = CEILING_Y / 2;
  const outer = Math.hypot(hw, cy) + OUTER_MARGIN;
  const phase = distance % HOOP_SPACING;

  root.traverse((obj) => {
    if (!(obj instanceof THREE.InstancedMesh)) {
      return;
    }
    if (!(obj.geometry instanceof THREE.TorusGeometry)) {
      return;
    }
    const geoR = obj.geometry.parameters.radius;
    if (geoR < 2) {
      return;
    }
    const scale = outer / geoR;
    for (let i = 0; i < obj.count; i++) {
      _hoop.position.set(0, cy, i * HOOP_SPACING - phase + 4);
      _hoop.rotation.set(0, 0, 0);
      _hoop.scale.set(scale, scale, 1);
      _hoop.updateMatrix();
      obj.setMatrixAt(i, _hoop.matrix);
    }
    obj.instanceMatrix.needsUpdate = true;
  });
}
