/**
 * Global constants for SenangWebs Kiln
 */

export const SHAPE_TYPES = {
  BOX: "box",
  SPHERE: "sphere",
  CYLINDER: "cylinder",
  CONE: "cone",
  TORUS: "torus",
  PLANE: "plane",
  PYRAMID: "pyramid",
  TORUS_KNOT: "torusknot",
  TETRAHEDRON: "tetrahedron",
  OCTAHEDRON: "octahedron",
  ICOSAHEDRON: "icosahedron",
  DODECAHEDRON: "dodecahedron",
  TEXT: "text",
  POLYGON: "polygon",
  WEDGE: "wedge",
  HALF_CYLINDER: "halfcylinder",
  HALF_SPHERE: "halfsphere",
  ROOF: "roof",
  HEART: "heart",
  TUBE: "tube",
};

export const SHAPE_ICONS = {
  box: "cube",
  sphere: "sphere",
  cylinder: "cylinder",
  cone: "cone",
  torus: "torus",
  plane: "plane",
  pyramid: "pyramid",
  torusknot: "torus-knot",
  tetrahedron: "tetrahedron",
  octahedron: "octahedron",
  icosahedron: "icosahedron",
  dodecahedron: "dodecahedron",
  text: "text",
  polygon: "polygon",
  wedge: "wedge",
  halfcylinder: "cylinder-half",
  halfsphere: "sphere-half",
  roof: "roof",
  heart: "heart-extruded",
  tube: "tube",
};

export const TRANSFORM_MODES = {
  TRANSLATE: "translate",
  ROTATE: "rotate",
  SCALE: "scale",
};

export const CAMERA_MODES = {
  PERSPECTIVE: "perspective",
  ORTHOGRAPHIC: "orthographic",
};

export const SNAP_VALUES = [0.5, 0.2, 0.1, 0.05, 0.025, 0.01, 0];

export const FONT_URLS = {
  sans: "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  mono: "/src/font/DM_Mono_Regular.json",
  serif: "https://threejs.org/examples/fonts/gentilis_regular.typeface.json",
};

export const DEFAULT_COLORS = {
  VIEWPORT_BG: 0xe2e8f0,
  GRID_CENTER: 0x45556c,
  GRID_LINES: 0x90a1b9,
  OUTLINE: 0x1d293d,
  SHAPE_DEFAULT: 0x007370,
};

export const GRID_SETTINGS = {
  SIZE: 20,
  DIVISIONS: 20,
};

export const LIGHTING = {
  AMBIENT_INTENSITY: 0.7,
  AMBIENT_COLOR: 0xffffff,
  DIRECTIONAL_INTENSITY: 0.9,
  DIRECTIONAL_COLOR: 0xffffff,
  DIRECTIONAL_POSITION: [5, 10, 5],
};

export const CAMERA_SETTINGS = {
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  POSITION: [5, 5, 5],
};

export const HISTORY_MAX_SIZE = 50;

export const OUTLINE_THICKNESS = 0.04;

export const VIEW_ORIENTATIONS = {
  TOP: { name: "Top", position: [0, 10, 0] },
  BOTTOM: { name: "Bottom", position: [0, -10, 0] },
  FRONT: { name: "Front", position: [0, 0, 10] },
  BACK: { name: "Back", position: [0, 0, -10] },
  LEFT: { name: "Left", position: [-10, 0, 0] },
  RIGHT: { name: "Right", position: [10, 0, 0] },
  ISO_TFR: { name: "Iso (Front-Right)", position: [10, 10, 10] },
  ISO_TFL: { name: "Iso (Front-Left)", position: [-10, 10, 10] },
  ISO_TBR: { name: "Iso (Back-Right)", position: [10, 10, -10] },
  ISO_TBL: { name: "Iso (Back-Left)", position: [-10, 10, -10] },
};
