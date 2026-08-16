import { describe, expect, it, vi } from 'vitest';
import {
  AssetDatabase,
  DEFAULT_VFS_FOLDERS,
  type SerializedAssetRecord,
} from './index';

function makeTextureRecord(id = 'a1'): SerializedAssetRecord {
  return {
    id,
    type: 'texture',
    name: `${id}.png`,
    path: `/Textures/${id}.png`,
    meta: { sourceFile: `${id}.png`, mimeType: 'image/png', sizeBytes: 100 },
    createdAt: 1,
    updatedAt: 1,
    _version: 1,
  };
}

describe('AssetDatabase', () => {
  it('seeds default folders when no initial state is given', () => {
    const db = new AssetDatabase();
    expect(db.folders.map((f) => f.path).sort()).toEqual(
      [...DEFAULT_VFS_FOLDERS.map((f) => f.path)].sort(),
    );
  });

  it('adds and removes records, emitting events', () => {
    const db = new AssetDatabase();
    const added = vi.fn();
    const removed = vi.fn();
    db.events.on('added', added);
    db.events.on('removed', removed);

    const record = makeTextureRecord();
    db.add(record);
    expect(db.get(record.id)).toEqual(record);
    expect(added).toHaveBeenCalledTimes(1);

    expect(db.remove(record.id)).toBe(true);
    expect(db.get(record.id)).toBeUndefined();
    expect(removed).toHaveBeenCalledTimes(1);
  });

  it('rejects duplicate ids on add', () => {
    const db = new AssetDatabase();
    db.add(makeTextureRecord('dup'));
    expect(() => db.add(makeTextureRecord('dup'))).toThrow(/already exists/i);
  });

  it('updates a record, merging meta and refreshing updatedAt', () => {
    const db = new AssetDatabase();
    const record = makeTextureRecord('u1');
    db.add(record);
    const next = db.update(record.id, { name: 'renamed.png' });
    expect(next?.name).toBe('renamed.png');
    expect(next?.updatedAt).toBeGreaterThanOrEqual(record.updatedAt);
  });

  it('filters by type', () => {
    const db = new AssetDatabase();
    db.add(makeTextureRecord('t1'));
    db.add({
      ...makeTextureRecord('m1'),
      type: 'mesh',
      meta: { sourceFile: 'm1.glb', mimeType: 'model/gltf-binary', sizeBytes: 200 },
    });
    expect(db.byType('texture').map((r) => r.id)).toEqual(['t1']);
    expect(db.byType('mesh').map((r) => r.id)).toEqual(['m1']);
  });

  it('hydrate replaces all state and re-emits add events', () => {
    const db = new AssetDatabase();
    db.add(makeTextureRecord('a'));
    const added = vi.fn();
    db.events.on('added', added);
    db.hydrate({
      records: [makeTextureRecord('b')],
      folders: [{ path: '/Custom' }],
    });
    expect(db.records.map((r) => r.id)).toEqual(['b']);
    expect(db.folders.map((f) => f.path)).toEqual(['/Custom']);
    expect(added).toHaveBeenCalled();
  });
});
