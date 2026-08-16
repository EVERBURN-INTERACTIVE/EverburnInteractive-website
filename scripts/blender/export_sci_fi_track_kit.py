"""
Export modular sci-fi racing track pieces from the SciFiTrackKit Blender collection.

Each root empty (Track_*) exports to public/models/sci-fi-tracks/ as an individual GLB.
Run via Blender MCP execute_blender_code or:
  blender your_scene.blend --python scripts/blender/export_sci_fi_track_kit.py
"""

from __future__ import annotations

from pathlib import Path

import bpy

REPO_ROOT = Path(r"G:\EverburnWebsite\EverburnInteractive-website")
OUTPUT_DIR = REPO_ROOT / "public" / "models" / "sci-fi-tracks"

TRACK_ROOTS = [
    "Track_Straight",
    "Track_CurveLeft_90",
    "Track_CurveRight_90",
    "Track_Jump",
    "Track_Boost",
    "Track_Slow",
]


def export_track_root(name: str) -> Path:
    root = bpy.data.objects.get(name)
    if not root:
        raise RuntimeError(f"Missing track root: {name}")

    saved_location = tuple(root.location)
    root.location = (0, 0, 0)

    bpy.ops.object.select_all(action="DESELECT")
    root.select_set(True)
    for child in root.children_recursive:
        child.select_set(True)
    bpy.context.view_layer.objects.active = root

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUTPUT_DIR / f"{name.lower()}.glb"

    bpy.ops.export_scene.gltf(
        filepath=str(out_path),
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

    root.location = saved_location
    return out_path


def main() -> None:
    exported: list[Path] = []
    for name in TRACK_ROOTS:
        exported.append(export_track_root(name))

    for path in exported:
        size_kb = path.stat().st_size / 1024
        print(f"Exported {path.name} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
