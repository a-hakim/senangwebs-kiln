/**
 * Shape factory - Creates all 13 shape types
 */

import { SHAPE_TYPES, DEFAULT_COLORS } from '../utils/Constants.js';

export default class ShapeFactory {
    constructor(config) {
        this.config = config;
        this.fontLoader = new THREE.FontLoader();
        this.fonts = {};
        this.shapeCounters = {
            box: 0,
            sphere: 0,
            cylinder: 0,
            cone: 0,
            torus: 0,
            plane: 0,
            pyramid: 0,
            torusknot: 0,
            tetrahedron: 0,
            octahedron: 0,
            icosahedron: 0,
            dodecahedron: 0,
            text: 0,
            polygon: 0,
            wedge: 0,
            halfcylinder: 0,
            halfsphere: 0,
            roof: 0,
            heart: 0
        };
    }

    /**
     * Load fonts for text shapes
     */
    loadFonts(onComplete) {
        const fontUrls = {
            sans: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
            mono: '/src/font/DM_Mono_Regular.json',
            serif: 'https://threejs.org/examples/fonts/gentilis_regular.typeface.json'
        };

        let loadedCount = 0;
        const totalFonts = Object.keys(fontUrls).length;

        for (const [fontName, url] of Object.entries(fontUrls)) {
            this.fontLoader.load(
                url,
                (font) => {
                    this.fonts[fontName] = font;
                    loadedCount++;
                    console.log(`SWK: Font loaded: ${fontName}`);
                    
                    if (loadedCount === totalFonts && onComplete) {
                        onComplete();
                    }
                },
                undefined,
                (error) => {
                    console.error(`SWK: Failed to load font ${fontName}:`, error);
                    loadedCount++;
                    
                    if (loadedCount === totalFonts && onComplete) {
                        onComplete();
                    }
                }
            );
        }
    }

    /**
     * Create shape by type
     */
    createShape(type, options = {}) {
        const shapeType = type.toLowerCase();
        
        if (!Object.values(SHAPE_TYPES).includes(shapeType)) {
            console.error(`SWK: Unknown shape type: ${type}`);
            return null;
        }

        let geometry;
        let name;
        let isFlat = false;

        switch (shapeType) {
            case SHAPE_TYPES.BOX:
                geometry = new THREE.BoxGeometry(1, 1, 1);
                this.shapeCounters.box++;
                name = `Box ${this.shapeCounters.box}`;
                break;

            case SHAPE_TYPES.SPHERE:
                geometry = new THREE.SphereGeometry(0.5, 32, 32);
                this.shapeCounters.sphere++;
                name = `Sphere ${this.shapeCounters.sphere}`;
                break;

            case SHAPE_TYPES.CYLINDER:
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
                this.shapeCounters.cylinder++;
                name = `Cylinder ${this.shapeCounters.cylinder}`;
                break;

            case SHAPE_TYPES.CONE:
                geometry = new THREE.ConeGeometry(0.5, 1, 32);
                this.shapeCounters.cone++;
                name = `Cone ${this.shapeCounters.cone}`;
                break;

            case SHAPE_TYPES.TORUS:
                geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
                this.shapeCounters.torus++;
                name = `Torus ${this.shapeCounters.torus}`;
                break;

            case SHAPE_TYPES.PLANE:
                geometry = new THREE.PlaneGeometry(1, 1);
                this.shapeCounters.plane++;
                name = `Plane ${this.shapeCounters.plane}`;
                isFlat = true;
                break;

            case SHAPE_TYPES.PYRAMID:
                geometry = new THREE.ConeGeometry(0.7, 1, 4);
                this.shapeCounters.pyramid++;
                name = `Pyramid ${this.shapeCounters.pyramid}`;
                break;

            case SHAPE_TYPES.TORUS_KNOT:
                geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16);
                this.shapeCounters.torusknot++;
                name = `TorusKnot ${this.shapeCounters.torusknot}`;
                break;

            case SHAPE_TYPES.TETRAHEDRON:
                geometry = new THREE.TetrahedronGeometry(0.7);
                this.shapeCounters.tetrahedron++;
                name = `Tetrahedron ${this.shapeCounters.tetrahedron}`;
                break;

            case SHAPE_TYPES.OCTAHEDRON:
                geometry = new THREE.OctahedronGeometry(0.7);
                this.shapeCounters.octahedron++;
                name = `Octahedron ${this.shapeCounters.octahedron}`;
                break;

            case SHAPE_TYPES.ICOSAHEDRON:
                geometry = new THREE.IcosahedronGeometry(0.7);
                this.shapeCounters.icosahedron++;
                name = `Icosahedron ${this.shapeCounters.icosahedron}`;
                break;

            case SHAPE_TYPES.DODECAHEDRON:
                geometry = new THREE.DodecahedronGeometry(0.7);
                this.shapeCounters.dodecahedron++;
                name = `Dodecahedron ${this.shapeCounters.dodecahedron}`;
                break;

            case SHAPE_TYPES.TEXT:
                const textContent = options.text || 'Text';
                const font = options.font || 'sans';
                const height = options.height || 0.2;
                const bevel = options.bevel || 0.01;
                
                geometry = this.createTextGeometry(textContent, font, height, bevel);
                if (!geometry) {
                    console.warn('SWK: Text geometry not ready, fonts may not be loaded');
                    return null;
                }
                this.shapeCounters.text++;
                name = `Text ${this.shapeCounters.text}`;
                isFlat = true;
                break;

            case SHAPE_TYPES.POLYGON:
                const sides = options.sides || 5;
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, sides);
                this.shapeCounters.polygon++;
                name = `Polygon ${this.shapeCounters.polygon}`;
                break;

            case SHAPE_TYPES.WEDGE:
                const wedgeShape = new THREE.Shape();
                wedgeShape.moveTo(0, 0);
                wedgeShape.lineTo(1, 0);
                wedgeShape.lineTo(0, 1);
                wedgeShape.lineTo(0, 0);
                
                const wedgeSettings = {
                    steps: 1,
                    depth: 1,
                    bevelEnabled: false
                };
                
                geometry = new THREE.ExtrudeGeometry(wedgeShape, wedgeSettings);
                geometry.center(); // Center the geometry
                this.shapeCounters.wedge++;
                name = `Wedge ${this.shapeCounters.wedge}`;
                break;

            case SHAPE_TYPES.HALF_CYLINDER:
                const halfCylShape = new THREE.Shape();
                halfCylShape.absarc(0, 0, 0.5, 0, Math.PI);
                halfCylShape.lineTo(0.5, 0); // Close the shape

                const halfCylSettings = {
                    steps: 1,
                    depth: 1,
                    bevelEnabled: false,
                    curveSegments: 32
                };

                geometry = new THREE.ExtrudeGeometry(halfCylShape, halfCylSettings);
                geometry.center();
                geometry.rotateX(-Math.PI / 2); // Stand it up
                geometry.rotateZ(-Math.PI / 2); // Rotate to match previous orientation
                this.shapeCounters.halfcylinder++;
                name = `HalfCylinder ${this.shapeCounters.halfcylinder}`;
                break;

            case SHAPE_TYPES.HALF_SPHERE:
                geometry = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
                geometry.scale(1, 1, 1); // Ensure the cap is generated
                this.shapeCounters.halfsphere++;
                name = `HalfSphere ${this.shapeCounters.halfsphere}`;
                break;

            case SHAPE_TYPES.ROOF:
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 3);
                // Rotate to make it look like a roof (triangular prism lying down)
                geometry.rotateZ(Math.PI / 2);
                geometry.rotateY(Math.PI / 2);
                this.shapeCounters.roof++;
                name = `Roof ${this.shapeCounters.roof}`;
                break;

            case SHAPE_TYPES.HEART:
                const heartShape = new THREE.Shape();
                const x = 0, y = 0;
                heartShape.moveTo(x + 0.25, y + 0.25);
                heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.20, y, x, y);
                heartShape.bezierCurveTo(x - 0.30, y, x - 0.30, y + 0.35, x - 0.30, y + 0.35);
                heartShape.bezierCurveTo(x - 0.30, y + 0.55, x - 0.10, y + 0.77, x + 0.25, y + 0.95);
                heartShape.bezierCurveTo(x + 0.60, y + 0.77, x + 0.80, y + 0.55, x + 0.80, y + 0.35);
                heartShape.bezierCurveTo(x + 0.80, y + 0.35, x + 0.80, y, x + 0.50, y);
                heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

                const heartSettings = {
                    steps: 1,
                    depth: 0.2,
                    bevelEnabled: true,
                    bevelThickness: 0.02,
                    bevelSize: 0.02,
                    bevelSegments: 2
                };
                
                geometry = new THREE.ExtrudeGeometry(heartShape, heartSettings);
                geometry.center();
                geometry.rotateZ(Math.PI); // Flip it right side up
                this.shapeCounters.heart++;
                name = `Heart ${this.shapeCounters.heart}`;
                break;
        }

        // Compute geometry bounds
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometry.center();

        // Create material
        const color = options.color || DEFAULT_COLORS.SHAPE_DEFAULT;
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.5,
            metalness: 0.3,
            transparent: false,
            opacity: 1.0,
            side: shapeType === SHAPE_TYPES.HALF_SPHERE ? THREE.DoubleSide : THREE.FrontSide
        });

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = name;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Store color in userData
        mesh.userData.color = color;
        mesh.userData.shapeType = shapeType;
        mesh.userData.isUserObject = true;  
        mesh.userData.id = mesh.uuid;

        // Position the shape
        if (isFlat || shapeType === SHAPE_TYPES.TEXT) {
            mesh.position.set(0, 0, 0);
        } else {
            // Raise 3D objects above ground
            const bbox = geometry.boundingBox;
            const height = bbox.max.y - bbox.min.y;
            mesh.position.set(0, height / 2, 0);
        }

        // Store text-specific data if it's a text shape
        if (shapeType === SHAPE_TYPES.TEXT) {
            mesh.userData.textContent = options.text || 'Text';
            mesh.userData.textFont = options.font || 'sans';
            mesh.userData.textHeight = options.height || 0.2;
            mesh.userData.textBevel = options.bevel || 0.01;
        }

        // Store polygon-specific data
        if (shapeType === SHAPE_TYPES.POLYGON) {
            mesh.userData.polygonSides = options.sides || 5;
        }

        // Apply options (for restoring from history)
        if (options.position) {
            mesh.position.fromArray(options.position);
        }
        if (options.rotation) {
            mesh.rotation.fromArray(options.rotation);
        }
        if (options.scale) {
            mesh.scale.fromArray(options.scale);
        }

        return mesh;
    }

    /**
     * Create text geometry
     */
    createTextGeometry(text, fontName = 'sans', height = 0.2, bevel = 0.01) {
        if (!this.fonts[fontName]) {
            console.warn(`SWK: Font ${fontName} not loaded yet`);
            // Try to use sans as fallback
            fontName = 'sans';
            if (!this.fonts[fontName]) {
                return null;
            }
        }

        const geometry = new THREE.TextGeometry(text, {
            font: this.fonts[fontName],
            size: 1,
            height: height,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: 5
        });

        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometry.center();

        return geometry;
    }

    /**
     * Update text geometry
     */
    updateTextGeometry(mesh, text, font, height, bevel) {
        if (mesh.userData.shapeType !== SHAPE_TYPES.TEXT) {
            return false;
        }

        const newGeometry = this.createTextGeometry(text, font, height, bevel);
        if (!newGeometry) {
            return false;
        }

        // Replace geometry
        mesh.geometry.dispose();
        mesh.geometry = newGeometry;

        // Update user data
        mesh.userData.textContent = text;
        mesh.userData.textFont = font;
        mesh.userData.textHeight = height;
        mesh.userData.textBevel = bevel;

        return true;
    }

    /**
     * Update polygon geometry
     */
    updatePolygonGeometry(mesh, sides) {
        if (mesh.userData.shapeType !== SHAPE_TYPES.POLYGON) {
            return false;
        }

        // Clamp sides between 3 and 12
        sides = Math.max(3, Math.min(12, Math.floor(sides)));

        const newGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, sides);
        newGeometry.computeBoundingBox();
        newGeometry.computeBoundingSphere();
        newGeometry.center();

        // Replace geometry
        mesh.geometry.dispose();
        mesh.geometry = newGeometry;

        // Update user data
        mesh.userData.polygonSides = sides;

        return true;
    }

    /**
     * Get shape counters
     */
    getCounters() {
        return { ...this.shapeCounters };
    }

    /**
     * Set shape counters (for undo/redo)
     */
    setCounters(counters) {
        this.shapeCounters = { ...counters };
    }
}
