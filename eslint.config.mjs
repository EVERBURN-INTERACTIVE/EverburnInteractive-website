import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: ['vendor/**', 'out/**', '.next/**', 'node_modules/**'],
  },
  ...nextVitals,
  {
    rules: {
      // React Compiler rules from eslint-plugin-react-hooks 7 flag valid R3F
      // camera mutation, seeded Math.random in useMemo, and hydration effects.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
    },
  },
];

export default config;
