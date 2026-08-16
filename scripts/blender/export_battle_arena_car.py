"""
Export the Battle Arena showcase car from Blender to public/models/battle-arena-car.glb.

Run via Blender MCP execute_blender_code or:
  blender your_scene.blend --python scripts/blender/export_battle_arena_car.py
"""

from __future__ import annotations

from pathlib import Path

import bpy

REPO_ROOT = Path(r"G:\EverburnWebsite\EverburnInteractive-website")
OUTPUT_PATH = REPO_ROOT / "public" / "models" / "battle-arena-car.glb"

CAR_PARTS = [
    "Cube",
    "Cube.001",
    "Cube.002",
    "Cube.003",
    "Cube.004",
    "Cube.005",
    "Cube.006",
    "Cube.007",
]

ROOT_NAME = "BattleArena_Car"


def ensure_car_root() -> bpy.types.Object:
    root = bpy.data.objects.get(ROOT_NAME)
    if root is None:
        bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
        root = bpy.context.active_object
        root.name = ROOT_NAME

    for part_name in CAR_PARTS:
        part = bpy.data.objects.get(part_name)
        if part is None:
            continue
        if part.parent != root:
            part.parent = root
            part.matrix_parent_inverse = root.matrix_world.inverted()

    return root


def prepare_car_materials_for_export() -> None:
    """Zero emission strength when emission color is black so glTF matches Blender shading."""
    for mat in bpy.data.materials:
        if not mat.use_nodes:
            continue
        bsdf = next((n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
        if bsdf is None:
            continue
        emission = bsdf.inputs["Emission Color"].default_value
        if emission[0] + emission[1] + emission[2] < 0.01:
            bsdf.inputs["Emission Strength"].default_value = 0.0
        mat.use_backface_culling = False


def export_car() -> Path:
    prepare_car_materials_for_export()
    root = ensure_car_root()
    saved_location = tuple(root.location)
    root.location = (0, 0, 0)
    root.rotation_euler = (0, 0, 0)
    root.scale = (1, 1, 1)

    bpy.ops.object.select_all(action="DESELECT")
    root.select_set(True)
    for child in root.children_recursive:
        child.select_set(True)
    bpy.context.view_layer.objects.active = root

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

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
    )

    root.location = saved_location
    return OUTPUT_PATH


if __name__ == "__main__":
    path = export_car()
    print(f"Exported Battle Arena car to {path}")
