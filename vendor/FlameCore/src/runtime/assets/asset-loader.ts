import * as THREE from 'three';
import type { AssetDatabase } from './asset-database';
import type {
  AssetId,
  PrefabDescriptor,
  SerializedAssetRecord,
} from './types';
import { listGltfNodePaths, type ParsedGltf } from './gltf-utils';

/**
 * Source of binary asset payloads (blobs) keyed by asset id.
 *
 * The editor implements this against IndexedDB; exported sites implement it
 * against a static `fetch()` from the bundled `assets/` folder.
 */
export interface BlobSource {
  /** Resolve the asset's binary payload. Throws if missing. */
  fetch(id: AssetId): Promise<ArrayBuffer>;
  /** Best-effort check for existence without loading the payload. */
  has?(id: AssetId): Promise<boolean>;
}

/** A `BlobSource` backed by an in-memory `Map`. */
export class InMemoryBlobSource implements BlobSource {
  constructor(private readonly _blobs = new Map<AssetId, ArrayBuffer>()) {}

  set(id: AssetId, buffer: ArrayBuffer): void {
    this._blobs.set(id, buffer);
  }
  delete(id: AssetId): void {
    this._blobs.delete(id);
  }
  async fetch(id: AssetId): Promise<ArrayBuffer> {
    const buf = this._blobs.get(id);
    if (!buf) throw new Error(`No blob for asset "${id}".`);
    return buf;
  }
  async has(id: AssetId): Promise<boolean> {
    return this._blobs.has(id);
  }
}

/** Progress callback for mesh loading (0..1). */
export type MeshLoadProgressCallback = (progress: number) => void;

/** Options for {@link AssetLoader.loadMesh}. */
export interface LoadMeshOptions {
  /** Optional progress callback (0..1). */
  onProgress?: MeshLoadProgressCallback;
  /** When true, return a placeholder mesh instead of throwing on failure. */
  fallbackOnError?: boolean;
}

/** Loaded forms, cached per asset id. */
interface LoadedCache {
  textures: Map<AssetId, Promise<THREE.Texture>>;
  meshes: Map<AssetId, Promise<THREE.Object3D>>;
  audio: Map<AssetId, Promise<ArrayBuffer>>;
  audioBuffers: Map<AssetId, Promise<AudioBuffer>>;
  fonts: Map<AssetId, Promise<string>>;
}

/**
 * Resolves serialized {@link SerializedAssetRecord}s to live, GPU-ready
 * Three.js resources, caching results so two components that reference the
 * same texture share a single GPU upload.
 *
 * Created with `AssetLoader.create()`; lazy-loads the Three.js `GLTFLoader`
 * the first time a mesh asset is requested to avoid pulling the loader
 * into bundles that don't need it.
 */
export class AssetLoader {
  private _gltfLoader: import('three/examples/jsm/loaders/GLTFLoader.js').GLTFLoader | undefined;
  private readonly _textureLoader = new THREE.TextureLoader();
  private readonly _cache: LoadedCache = {
    textures: new Map(),
    meshes: new Map(),
    audio: new Map(),
    audioBuffers: new Map(),
    fonts: new Map(),
  };

  constructor(public readonly database: AssetDatabase, public readonly blobs: BlobSource) {}

  /** Inject a custom `BlobSource` (used by tests). */
  static create(database: AssetDatabase, blobs: BlobSource = new InMemoryBlobSource()): AssetLoader {
    return new AssetLoader(database, blobs);
  }

  /** Resolve a texture asset to a `THREE.Texture`. */
  loadTexture(id: AssetId): Promise<THREE.Texture> {
    const cached = this._cache.textures.get(id);
    if (cached) return cached;
    const promise = this._loadTexture(id).catch((err) => {
      this._cache.textures.delete(id);
      throw err;
    });
    this._cache.textures.set(id, promise);
    return promise;
  }

  /** Resolve a mesh asset (GLTF/GLB) to a `THREE.Object3D` subtree. */
  loadMesh(id: AssetId, options?: LoadMeshOptions): Promise<THREE.Object3D> {
    const cached = this._cache.meshes.get(id);
    if (cached) return cached;
    const promise = this._loadMesh(id, options).catch((err) => {
      this._cache.meshes.delete(id);
      if (options?.fallbackOnError) {
        return createPlaceholderMesh(id);
      }
      throw err;
    });
    this._cache.meshes.set(id, promise);
    return promise;
  }

  /** Resolve an audio asset to a raw `ArrayBuffer`. */
  loadAudio(id: AssetId): Promise<ArrayBuffer> {
    const cached = this._cache.audio.get(id);
    if (cached) return cached;
    const promise = this.blobs.fetch(id).catch((err) => {
      this._cache.audio.delete(id);
      throw err;
    });
    this._cache.audio.set(id, promise);
    return promise;
  }

  /**
   * Resolve an audio asset to a decoded {@link AudioBuffer}, using the
   * provided {@link AudioContext}. The decoded buffer is cached so multiple
   * components referencing the same clip share a single decode.
   */
  loadAudioBuffer(id: AssetId, audioContext: AudioContext): Promise<AudioBuffer> {
    const cached = this._cache.audioBuffers.get(id);
    if (cached) return cached;
    const promise = this.loadAudio(id)
      .then((buf) => audioContext.decodeAudioData(buf.slice(0)))
      .catch((err) => {
        this._cache.audioBuffers.delete(id);
        throw err;
      });
    this._cache.audioBuffers.set(id, promise);
    return promise;
  }

  /**
   * Resolve a font asset by registering it with the document via the
   * FontFace API. The returned string is the CSS `font-family` value to
   * use in `ctx.font`, CSS `font-family`, etc.
   *
   * Idempotent: repeated calls reuse the registered FontFace.
   */
  loadFont(id: AssetId): Promise<string> {
    const cached = this._cache.fonts.get(id);
    if (cached) return cached;
    const promise = this._loadFont(id).catch((err) => {
      this._cache.fonts.delete(id);
      throw err;
    });
    this._cache.fonts.set(id, promise);
    return promise;
  }

  /** Resolve a prefab asset to its {@link PrefabDescriptor}. */
  loadPrefab(id: AssetId): PrefabDescriptor | undefined {
    const record = this.database.get(id);
    if (!record || record.type !== 'prefab') return undefined;
    return record.inline as PrefabDescriptor | undefined;
  }

  /**
   * Fetch the raw bytes for an asset and return a same-origin object URL.
   * Caller is responsible for revoking the URL when finished. Returns
   * `undefined` if the asset is missing or its blob cannot be loaded.
   */
  async getBlobUrl(id: AssetId): Promise<string | undefined> {
    try {
      const buf = await this.blobs.fetch(id);
      const record = this.database.get(id);
      const mime = (record?.meta as { mimeType?: string } | undefined)?.mimeType ?? 'application/octet-stream';
      return URL.createObjectURL(new Blob([buf], { type: mime }));
    } catch {
      return undefined;
    }
  }

  /** Drop a cached resource (used when an asset is updated or removed). */
  invalidate(id: AssetId): void {
    this._cache.textures.get(id)?.then((t) => t.dispose()).catch(() => undefined);
    this._cache.meshes.get(id)?.then((m) => disposeObject3D(m)).catch(() => undefined);
    this._cache.textures.delete(id);
    this._cache.meshes.delete(id);
    this._cache.audio.delete(id);
    this._cache.audioBuffers.delete(id);
    this._cache.fonts.delete(id);
  }

  /** Dispose every cached GPU resource. */
  dispose(): void {
    for (const id of [...this._cache.textures.keys(), ...this._cache.meshes.keys()]) {
      this.invalidate(id);
    }
    this._cache.audio.clear();
    this._cache.audioBuffers.clear();
    this._cache.fonts.clear();
  }

  private async _loadTexture(id: AssetId): Promise<THREE.Texture> {
    const buf = await this.blobs.fetch(id);
    const record = this.database.get(id);
    const mime = (record?.meta as { mimeType?: string } | undefined)?.mimeType ?? 'image/png';
    const blob = new Blob([buf], { type: mime });
    const url = URL.createObjectURL(blob);
    try {
      const texture = await new Promise<THREE.Texture>((resolve, reject) => {
        this._textureLoader.load(
          url,
          (tex) => resolve(tex),
          undefined,
          (err) => reject(err instanceof Error ? err : new Error(String(err))),
        );
      });
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  private async _loadMesh(id: AssetId, options?: LoadMeshOptions): Promise<THREE.Object3D> {
    const parsed = await this._parseGltf(id, options);
    return parsed.scene;
  }

  /**
   * Load a mesh asset and return the full parsed GLTF payload (scene,
   * animations, node paths). Cached per asset id.
   */
  async loadGltfParsed(id: AssetId, options?: LoadMeshOptions): Promise<ParsedGltf> {
    return this._parseGltf(id, options);
  }

  private async _parseGltf(id: AssetId, options?: LoadMeshOptions): Promise<ParsedGltf> {
    options?.onProgress?.(0);
    const buf = await this.blobs.fetch(id);
    options?.onProgress?.(0.3);
    const loader = await this._getGltfLoader();
    options?.onProgress?.(0.5);
    const gltf = await loader.parseAsync(buf, '');
    options?.onProgress?.(1);
    const scene = gltf.scene;
    return {
      scene,
      animations: gltf.animations ?? [],
      nodePaths: listGltfNodePaths(scene),
    };
  }

  private async _getGltfLoader(): Promise<
    import('three/examples/jsm/loaders/GLTFLoader.js').GLTFLoader
  > {
    if (!this._gltfLoader) {
      const [gltfMod, dracoMod] = await Promise.all([
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/loaders/DRACOLoader.js'),
      ]);
      const loader = new gltfMod.GLTFLoader();
      const draco = new dracoMod.DRACOLoader();
      draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      loader.setDRACOLoader(draco);
      this._gltfLoader = loader;
    }
    return this._gltfLoader;
  }

  private async _loadFont(id: AssetId): Promise<string> {
    const record = this.database.get(id);
    if (!record || record.type !== 'font') {
      throw new Error(`Asset "${id}" is not a font.`);
    }
    const meta = record.meta as { family?: string; weight?: string; style?: string };
    const family = meta.family ?? `fc-font-${id}`;
    // SSR / non-DOM environments: just return the family string.
    if (typeof document === 'undefined' || typeof FontFace === 'undefined') {
      return family;
    }
    const buf = await this.blobs.fetch(id);
    const face = new FontFace(family, buf, {
      weight: meta.weight ?? 'normal',
      style: meta.style ?? 'normal',
    });
    await face.load();
    (document as Document & { fonts: FontFaceSet }).fonts.add(face);
    return family;
  }
}

/** Recursively dispose geometries / materials on an Object3D subtree. */
function disposeObject3D(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) for (const m of mat) m.dispose();
    else mat?.dispose();
  });
}

/**
 * Create a simple placeholder mesh shown when asset loading fails or is
 * in progress. Uses a wireframe box so it is visually distinct from content.
 */
export function createPlaceholderMesh(label?: string): THREE.Object3D {
  const group = new THREE.Group();
  group.name = label ? `placeholder:${label}` : 'placeholder';
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  });
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);
  return group;
}
