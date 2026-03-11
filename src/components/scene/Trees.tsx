'use client';

interface TreesProps {
  reducedMotion: boolean;
}

export function Trees({ reducedMotion }: TreesProps) {
  const trees = Array.from({ length: 20 }, (_, index) => {
    const angle = (index / 20) * Math.PI * 2;
    const radius = 26 + (index % 5);
    return {
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
    };
  });

  return (
    <group>
      {trees.map((tree, index) => (
        <group key={`tree-${index}`} position={[tree.x, 0, tree.z]} rotation={[0, index, reducedMotion ? 0 : 0.03]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.2, 0.35, 3]} />
            <meshStandardMaterial color="#5c3a1e" />
          </mesh>
          <mesh position={[0, 4, 0]}>
            <coneGeometry args={[1.2, 3.5, 7]} />
            <meshStandardMaterial color="#1f4d2a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}