"""
Export OUR PROJECTS inner-tile models from the active Blender scene.

Run via Blender MCP execute_blender_code (paste in chunks) or:
  blender your_scene.blend --background --python scripts/blender/export_projects_tile_glbs.py

Edit OBJECT_HINTS if auto-detection picks the wrong meshes.
"""

from __future__ import annotations

from pathlib import Path

import bpy

# Repo-relative output (adjust if your clone lives elsewhere)
REPO_ROOT = Path(r"G:\EverburnWebsite\EverburnInteractive-website")
OUTPUT_DIR = REPO_ROOT / "public" / "models"

# Map output filename -> substring hints matched against object names (case-insensitive)
OBJECT_HINTS: dict[str, list[str]] = {
    "battle-arena-colosseum.glb": [
        "colosseum",
        "collosium",
        "colosium",
        "stadium",
        "arena",
        "battle",
    ],
    "world-portfolio-tree.glb": [
        "tree",
        "portfolio",
        "world",
        "foliage",
        "canopy",
    ],
}

EXPORT_SCALE = 1.0


def _mesh_objects() -> list[bpy.types.Object]:
    return [obj for obj in bpy.data.objects if obj.type == "MESH"]


def _find_objects(hints: list[str]) -> list[bpy.types.Object]:
    meshes = _mesh_objects()
    lowered = [(obj, obj.name.lower()) for obj in meshes]
    matched: list[bpy.types.Object] = []

    for obj, name in lowered:
        if any(hint in name for hint in hints):
            matched.append(obj)

    if matched:
        return matched

    # Fallback: single obvious mesh in scene
    if len(meshes) == 1:
        return meshes

    return []


def _export_selection(objects: list[bpy.types.Object], output_path: Path) -> None:
    if not objects:
        raise RuntimeError(f"No objects matched for {output_path.name}")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)

    bpy.context.view_layer.objects.active = objects[0]

    bpy.ops.export_scene.gltf(
        filepath=str(output_path),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_texcoords=True,
        export_normals=True,
        export_materials="EXPORT",
        export_image_format="AUTO",
    )

    print(f"Exported {len(objects)} object(s) -> {output_path}")
    for obj in objects:
        print(f"  - {obj.name}")


def main() -> None:
    print("Scene meshes:", [o.name for o in _mesh_objects()])

    for filename, hints in OBJECT_HINTS.items():
        objects = _find_objects(hints)
        if not objects:
            print(f"SKIP {filename}: no objects matched hints {hints}")
            continue
        _export_selection(objects, OUTPUT_DIR / filename)

    print("Done.")


if __name__ == "__main__":
    main()
