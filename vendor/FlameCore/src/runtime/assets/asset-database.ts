import { EventEmitter } from '../utils/events';
import type {
  AssetId,
  AssetType,
  SerializedAssetRecord,
  VfsFolder,
} from './types';
import { DEFAULT_VFS_FOLDERS } from './types';

/** Events emitted by {@link AssetDatabase}. */
export interface AssetDatabaseEvents {
  added: { record: SerializedAssetRecord };
  updated: { record: SerializedAssetRecord; previous: SerializedAssetRecord };
  removed: { record: SerializedAssetRecord };
  folderAdded: { folder: VfsFolder };
  folderRemoved: { folder: VfsFolder };
  cleared: Record<string, never>;
}

/**
 * In-memory index of all asset records and VFS folders for a project.
 *
 * The runtime carries one of these so components can resolve `AssetId`s to
 * concrete records. Binary blobs are *not* held here — see
 * {@link AssetLoader} for the GPU-backed resolution path.
 */
export class AssetDatabase {
  readonly events = new EventEmitter<AssetDatabaseEvents>();

  private readonly _records = new Map<AssetId, SerializedAssetRecord>();
  private readonly _folders = new Map<string, VfsFolder>();

  constructor(initial?: {
    records?: ReadonlyArray<SerializedAssetRecord>;
    folders?: ReadonlyArray<VfsFolder>;
  }) {
    for (const folder of initial?.folders ?? DEFAULT_VFS_FOLDERS) {
      this._folders.set(folder.path, { path: folder.path });
    }
    for (const record of initial?.records ?? []) {
      this._records.set(record.id, record);
    }
  }

  /** Read-only view of every asset record currently indexed. */
  get records(): ReadonlyArray<SerializedAssetRecord> {
    return [...this._records.values()];
  }

  /** Read-only view of every VFS folder currently indexed. */
  get folders(): ReadonlyArray<VfsFolder> {
    return [...this._folders.values()];
  }

  /** Look up a record by its asset id. */
  get(id: AssetId): SerializedAssetRecord | undefined {
    return this._records.get(id);
  }

  /** All records of a given type. */
  byType<TType extends AssetType>(type: TType): ReadonlyArray<SerializedAssetRecord<TType>> {
    const out: SerializedAssetRecord<TType>[] = [];
    for (const r of this._records.values()) {
      if (r.type === type) out.push(r as SerializedAssetRecord<TType>);
    }
    return out;
  }

  /** Add a new record. Throws if an asset with the same id already exists. */
  add(record: SerializedAssetRecord): void {
    if (this._records.has(record.id)) {
      throw new Error(`Asset id "${record.id}" already exists.`);
    }
    this._records.set(record.id, record);
    this.events.emit('added', { record });
  }

  /** Patch an existing record. Returns the updated value or `undefined`. */
  update(
    id: AssetId,
    patch: Partial<Omit<SerializedAssetRecord, 'id' | '_version' | 'type' | 'createdAt'>>,
  ): SerializedAssetRecord | undefined {
    const previous = this._records.get(id);
    if (!previous) return undefined;
    const next: SerializedAssetRecord = {
      ...previous,
      ...patch,
      meta: { ...previous.meta, ...(patch.meta as object | undefined) } as SerializedAssetRecord['meta'],
      id: previous.id,
      type: previous.type,
      createdAt: previous.createdAt,
      updatedAt: Date.now(),
      _version: previous._version,
    };
    this._records.set(id, next);
    this.events.emit('updated', { record: next, previous });
    return next;
  }

  /** Remove an asset record. Returns true if a record was removed. */
  remove(id: AssetId): boolean {
    const record = this._records.get(id);
    if (!record) return false;
    this._records.delete(id);
    this.events.emit('removed', { record });
    return true;
  }

  /** Add a folder. No-op if it already exists. */
  addFolder(path: string): void {
    if (this._folders.has(path)) return;
    const folder = { path };
    this._folders.set(path, folder);
    this.events.emit('folderAdded', { folder });
  }

  /** Remove a folder. No-op if it didn't exist. */
  removeFolder(path: string): boolean {
    const folder = this._folders.get(path);
    if (!folder) return false;
    this._folders.delete(path);
    this.events.emit('folderRemoved', { folder });
    return true;
  }

  /** Replace the entire contents (used when loading a project). */
  hydrate(state: {
    records: ReadonlyArray<SerializedAssetRecord>;
    folders: ReadonlyArray<VfsFolder>;
  }): void {
    this._records.clear();
    this._folders.clear();
    for (const folder of state.folders) this._folders.set(folder.path, { path: folder.path });
    for (const record of state.records) this._records.set(record.id, record);
    this.events.emit('cleared', {});
    for (const folder of this._folders.values()) this.events.emit('folderAdded', { folder });
    for (const record of this._records.values()) this.events.emit('added', { record });
  }

  /** Empty the database (used when closing the active project). */
  clear(): void {
    this._records.clear();
    this._folders.clear();
    this.events.emit('cleared', {});
  }
}
