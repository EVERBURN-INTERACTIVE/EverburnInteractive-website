"""
Export the Battle Arena colosseum from the active Blender scene.

Collections exported: Arena, Architecture, Seating, Environment, Screens
Skipped: Atmosphere_Volume, *_LOD2, *_LOD3

Run via Blender MCP execute_blender_code or:
  blender --python scripts/blender/export_battle_arena_colosseum.py
"""

from __future__ import annotations

from pathlib import Path

import bpy

REPO_ROOT = Path(r"G:\EverburnWebsite\EverburnInteractive-website")
OUTPUT_PATH = REPO_ROOT / "public" / "models" / "battle-arena-colosseum.glb"

EXPORT_COLLECTIONS = ["Arena", "Architecture", "Seating", "Environment", "Screens"]
EXCLUDE_NAMES = {"Atmosphere_Volume"}
EXCLUDE_SUFFIXES = ("_LOD2", "_LOD3")


def _collect_export_objects() -> list[bpy.types.Object]:
    objects: list[bpy.types.Object] = []
    seen: set[str] = set()

    for cname in EXPORT_COLLECTIONS:
        col = bpy.data.collections.get(cname)
        if not col:
            print(f"Missing collection: {cname}")
            continue

        for obj in col.all_objects:
            if obj.type != "MESH":
                continue
            if obj.name in EXCLUDE_NAMES or obj.name.endswith(EXCLUDE_SUFFIXES):
                continue
            if obj.name in seen:
                continue
            seen.add(obj.name)
            objects.append(obj)

    return objects


def main() -> None:
    objects = _collect_export_objects()
    if not objects:
        raise RuntimeError("No meshes found to export")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]

    bpy.ops.export_scene.gltf(
        filepath=str(OUTPUT_PATH),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_texcoords=True,
        export_normals=True,
        export_tangents=True,
        export_unused_images=False,
    )

    size_mb = OUTPUT_PATH.stat().st_size / (1024 * 1024)
    print(f"Exported {len(objects)} meshes -> {OUTPUT_PATH} ({size_mb:.2f} MB)")


if __name__ == "__main__":
    main()
