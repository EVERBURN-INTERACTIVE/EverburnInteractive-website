import type { NextConfig } from 'next';
import { existsSync } from 'node:fs';
import path from 'node:path';

const flameRoot = path.join(process.cwd(), 'vendor', 'FlameCore');
const flameRuntime = path.join(flameRoot, 'src', 'runtime');
const flameShared = path.join(flameRoot, 'src', 'shared');
const flameRuntimeMarker = path.join(flameRuntime, 'runtime.ts');

if (!existsSync(flameRuntimeMarker)) {
  throw new Error(
    'FlameCore vendor copy missing. Run `npm install` (postinstall links vendor/FlameCore).',
  );
}

const flameRuntimeAlias = './vendor/FlameCore/src/runtime';
const flameSharedAlias = './vendor/FlameCore/src/shared';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@runtime': flameRuntime,
      '@shared': flameShared,
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      '@runtime': flameRuntimeAlias,
      '@runtime/*': `${flameRuntimeAlias}/*`,
      '@shared': flameSharedAlias,
      '@shared/*': `${flameSharedAlias}/*`,
    },
  },
};

export default nextConfig;
