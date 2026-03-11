'use client';

export function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial color="#2d5a1b" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[2.5, 1.5, 8, 32]} />
        <meshStandardMaterial color="#7a5c3a" roughness={1} />
      </mesh>
    </group>
  );
}