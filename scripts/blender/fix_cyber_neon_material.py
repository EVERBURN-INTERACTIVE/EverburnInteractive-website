"""
Fix M_Cyber_Neon_Flow visibility in Blender viewport.

Run inside Blender (Scripting tab or MCP):
  import bpy; exec(open(r"path/to/fix_cyber_neon_material.py").read())

Does NOT modify mesh geometry — only UVs and material nodes.
"""

from __future__ import annotations

import os

import bpy

MAT_NAME = "M_Cyber_Neon_Flow"
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEX_DIR = os.path.join(REPO, "public", "textures", "cyber-track")


def load_image(filename: str, image_name: str) -> bpy.types.Image:
    path = os.path.join(TEX_DIR, filename)
    image = bpy.data.images.get(image_name)
    if image is None:
        image = bpy.data.images.load(path)
        image.name = image_name
    else:
        image.filepath = path
        image.reload()
    image.colorspace_settings.name = "sRGB"
    image.pack()
    return image


def assign_full_tile_uvs(mesh: bpy.types.Mesh) -> None:
    if not mesh.uv_layers:
        mesh.uv_layers.new(name="UVMap")
    uv = mesh.uv_layers.active
    corners = [(0.0, 0.0), (1.0, 0.0), (1.0, 1.0), (0.0, 1.0)]
    for poly in mesh.polygons:
        for loop_index, loop in enumerate(poly.loop_indices):
            uv.data[loop].uv = corners[loop_index % 4]
    mesh.update()


def build_visible_material(mat: bpy.types.Material, albedo: bpy.types.Image, emissive: bpy.types.Image) -> None:
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (640, 0)

    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (360, 0)
    bsdf.inputs["Metallic"].default_value = 0.2
    bsdf.inputs["Roughness"].default_value = 0.35
    bsdf.inputs["Emission Strength"].default_value = 8.0

    tex_coord = nodes.new("ShaderNodeTexCoord")
    tex_coord.location = (-560, 0)

    mapping = nodes.new("ShaderNodeMapping")
    mapping.location = (-360, 0)
    mapping.inputs["Scale"].default_value = (1.5, 1.5, 1.5)

    tex_albedo = nodes.new("ShaderNodeTexImage")
    tex_albedo.location = (-160, 160)
    tex_albedo.image = albedo

    tex_emissive = nodes.new("ShaderNodeTexImage")
    tex_emissive.location = (-160, -60)
    tex_emissive.image = emissive

    mix = nodes.new("ShaderNodeMixRGB")
    mix.location = (80, 80)
    mix.blend_type = "ADD"
    mix.inputs["Fac"].default_value = 0.55

    links.new(tex_coord.outputs["UV"], mapping.inputs["Vector"])
    links.new(mapping.outputs["Vector"], tex_albedo.inputs["Vector"])
    links.new(mapping.outputs["Vector"], tex_emissive.inputs["Vector"])
    links.new(tex_albedo.outputs["Color"], mix.inputs["Color1"])
    links.new(tex_emissive.outputs["Color"], mix.inputs["Color2"])
    links.new(mix.outputs["Color"], bsdf.inputs["Base Color"])
    links.new(tex_emissive.outputs["Color"], bsdf.inputs["Emission Color"])
    links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])


def main() -> None:
    obj = bpy.data.objects.get("Plane")
    if obj is None:
        raise RuntimeError("Object 'Plane' not found")

    mat = bpy.data.materials.get(MAT_NAME)
    if mat is None:
        mat = bpy.data.materials.new(MAT_NAME)

    albedo = load_image("cyber_neon_albedo.png", "CyberNeonAlbedo")
    emissive = load_image("cyber_neon_emissive.png", "CyberNeonEmissive")

    assign_full_tile_uvs(obj.data)
    build_visible_material(mat, albedo, emissive)

    if len(obj.data.materials) == 0:
        obj.data.materials.append(mat)
    else:
        obj.data.materials[0] = mat

    for poly in obj.data.polygons:
        poly.material_index = 0

    for area in bpy.context.window.screen.areas:
        if area.type != "VIEW_3D":
            continue
        space = area.spaces.active
        space.shading.type = "MATERIAL"
        space.shading.use_scene_lights = True
        break

    print(f"Fixed {MAT_NAME} on {obj.name}. Use Material Preview or Rendered shading.")


main()
