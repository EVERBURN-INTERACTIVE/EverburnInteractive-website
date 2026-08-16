/**
 * Particle system module (PRD 11) — public entry point.
 *
 * Re-exports the serialization-friendly data model, the SoA buffer, the
 * module library, and the emitter runtime so hosts (editor, exported sites)
 * can construct and inspect particle effects.
 */
export * from './types';
export * from './buffer';
export * from './modules';
export * from './emitter-runtime';
