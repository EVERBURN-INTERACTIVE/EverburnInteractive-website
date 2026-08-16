import * as THREE from 'three';

const HOOP_SPACING = 10;
const CEILING_Y = 4.15;
/** Side-wall quads are 4.4 tall, centered at y=2.1, so the top edge is 4.3. */
const WALL_TOP_Y = 4.3;
const WALL_PAD = 0.15;
const TUBE = 0.1;
/** Keep the whole tube above the wall quads so it cannot show through the glass. */
const ARC_LIFT = WALL_TOP_Y - CEILING_Y + TUBE + 0.08;
const _hoop = new THREE.Object3D();

function isTrackHoopMesh(obj: THREE.Object3D): obj is THREE.InstancedMesh {
  if (!(obj instanceof THREE.InstancedMesh)) {
    return false;
  }
  if (obj.userData.omsCeilingArc === true) {
    return true;
  }
  return obj.geometry instanceof THREE.TorusGeometry && obj.geometry.parameters.radius >= 2;
}

function ensureCeilingArc(mesh: THREE.InstancedMesh, hw: number): void {
  const cachedHw = mesh.userData.omsCeilingArcHw as number | undefined;
  if (mesh.userData.omsCeilingArc === true && cachedHw !== undefined && Math.abs(cachedHw - hw) < 0.04) {
    return;
  }

  const prev = mesh.geometry;
  const radial = prev instanceof THREE.TorusGeometry ? prev.parameters.radialSegments : 8;
  const tubular = prev instanceof THREE.TorusGeometry
    ? Math.max(32, prev.parameters.tubularSegments)
    : 48;
  const replacement = mesh.userData.omsCeilingArcGeo;
  // Upper semicircle in XY: from +X over +Y to -X. Local y stays >= 0.
  mesh.geometry = new THREE.TorusGeometry(hw, TUBE, radial, tubular, Math.PI);
  if (replacement instanceof THREE.BufferGeometry) {
    replacement.dispose();
  }
  mesh.userData.omsCeilingArc = true;
  mesh.userData.omsCeilingArcGeo = mesh.geometry;
  mesh.userData.omsCeilingArcHw = hw;
}

/**
 * Replace full corridor rings with ceiling-only arches.
 * Side walls stay transparent; hoop tubes never run down those faces.
 */
export function relayoutOmsTrackHoops(
  root: THREE.Object3D,
  distance: number,
  halfWidth: number,
): void {
  const hw = halfWidth + WALL_PAD;
  const y = CEILING_Y + ARC_LIFT;
  const phase = distance % HOOP_SPACING;

  root.traverse((obj) => {
    if (!isTrackHoopMesh(obj)) {
      return;
    }
    ensureCeilingArc(obj, hw);
    for (let i = 0; i < obj.count; i++) {
      _hoop.position.set(0, y, i * HOOP_SPACING - phase + 4);
      _hoop.rotation.set(0, 0, 0);
      _hoop.scale.set(1, 1, 1);
      _hoop.updateMatrix();
      obj.setMatrixAt(i, _hoop.matrix);
    }
    obj.instanceMatrix.needsUpdate = true;
  });
}

export function disposeOmsTrackHoops(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const geo = obj.userData.omsCeilingArcGeo;
    if (geo instanceof THREE.BufferGeometry) {
      geo.dispose();
      obj.userData.omsCeilingArcGeo = undefined;
      obj.userData.omsCeilingArc = undefined;
      obj.userData.omsCeilingArcHw = undefined;
    }
  });
}
