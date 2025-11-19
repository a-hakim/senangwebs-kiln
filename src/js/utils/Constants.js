/**
 * Global constants for SenangWebs Kiln
 */

export const SHAPE_TYPES = {
    BOX: 'box',
    SPHERE: 'sphere',
    CYLINDER: 'cylinder',
    CONE: 'cone',
    TORUS: 'torus',
    PLANE: 'plane',
    PYRAMID: 'pyramid',
    TORUS_KNOT: 'torusknot',
    TETRAHEDRON: 'tetrahedron',
    OCTAHEDRON: 'octahedron',
    ICOSAHEDRON: 'icosahedron',
    DODECAHEDRON: 'dodecahedron',
    TEXT: 'text',
    POLYGON: 'polygon',
    WEDGE: 'wedge',
    HALF_CYLINDER: 'halfcylinder',
    HALF_SPHERE: 'halfsphere',
    ROOF: 'roof',
    HEART: 'heart'
};

export const TRANSFORM_MODES = {
    TRANSLATE: 'translate',
    ROTATE: 'rotate',
    SCALE: 'scale'
};

export const CAMERA_MODES = {
    PERSPECTIVE: 'perspective',
    ORTHOGRAPHIC: 'orthographic'
};

export const SNAP_VALUES = [0.5, 0.2, 0.1, 0.05, 0.025, 0.01, 0];

export const FONT_URLS = {
    sans: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    mono: '/src/font/DM_Mono_Regular.json',
    serif: 'https://threejs.org/examples/fonts/gentilis_regular.typeface.json'
};

export const DEFAULT_COLORS = {
    VIEWPORT_BG: 0xe2e8f0,
    GRID_CENTER: 0x45556c,
    GRID_LINES: 0x90a1b9,
    OUTLINE: 0x1d293d,
    SHAPE_DEFAULT: 0x007370
};

export const GRID_SETTINGS = {
    SIZE: 20,
    DIVISIONS: 20
};

export const LIGHTING = {
    AMBIENT_INTENSITY: 0.7,
    AMBIENT_COLOR: 0xffffff,
    DIRECTIONAL_INTENSITY: 0.9,
    DIRECTIONAL_COLOR: 0xffffff,
    DIRECTIONAL_POSITION: [5, 10, 5]
};

export const CAMERA_SETTINGS = {
    FOV: 75,
    NEAR: 0.1,
    FAR: 1000,
    POSITION: [5, 5, 5]
};

export const HISTORY_MAX_SIZE = 50;

export const OUTLINE_THICKNESS = 0.04;
