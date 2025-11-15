/**
 * SenangWebs Kiln (SWK) - 3D Shape Editor Library
 * A web-based 3D editor for creating and manipulating 3D shapes
 * 
 * Internal Editor Class
 */

/**
 * Main Editor Class
 */
export default class Editor {
    constructor(containerId, options = {}) {
        // Handle both selector strings (#id, .class) and element IDs
        if (typeof containerId === 'string') {
            if (containerId.startsWith('#')) {
                this.containerId = containerId.substring(1);
            } else if (containerId.startsWith('.')) {
                // For class selectors, we need the actual element
                this.containerElement = document.querySelector(containerId);
                this.containerId = this.containerElement?.id || 'swk-container';
            } else {
                this.containerId = containerId;
            }
        } else if (containerId instanceof HTMLElement) {
            this.containerElement = containerId;
            this.containerId = containerId.id || 'swk-container';
            if (!this.containerElement.id) {
                this.containerElement.id = this.containerId;
            }
        } else {
            this.containerId = String(containerId);
        }
        
        this.options = {
            canvasClass: 'swk-canvas-container',
            uiClass: 'swk-ui-container',
            ...options
        };

        // Color configuration
        this.VIEWPORT_BG_COLOR = 0xe2e8f0;
        this.GRID_COLOR_CENTER = 0x45556c;
        this.GRID_COLOR_LINES = 0x90a1b9;
        this.OUTLINE_COLOR = 0x1d293d;

        // Scene state
        this.scene = null;
        this.renderer = null;
        this.raycaster = null;
        this.mouse = null;
        this.perspectiveCamera = null;
        this.orthographicCamera = null;
        this.camera = null;
        this.controls = null;
        this.transformControls = null;
        this.currentCameraMode = 'perspective';
        this.canvasElement = null;
        this.gridHelper = null;

        // Object management
        this.objects = [];
        this.selectedObject = null;
        this.selectedObjects = [];
        this.groups = [];
        this.groupIdCounter = 0;
        this.outlineMap = new Map();
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
            text: 0
        };

        // History
        this.history = [];
        this.historyIndex = -1;
        this.MAX_HISTORY = 50;

        // UI Elements
        this.uiElements = {};
    }

    init() {
        this.setupScene();
        this.setupUI();
        this.loadFonts();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.VIEWPORT_BG_COLOR);

        const aspect = window.innerWidth / window.innerHeight;
        this.perspectiveCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        const frustumSize = 10;
        this.orthographicCamera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, frustumSize * aspect / 2,
            frustumSize / 2, frustumSize / -2, 0.1, 1000
        );

        this.camera = this.perspectiveCamera;
        this.camera.position.set(5, 5, 5);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        const container = document.getElementById(this.containerId);
        container.appendChild(this.renderer.domElement);
        this.canvasElement = this.renderer.domElement;
        this.canvasElement.style.pointerEvents = 'auto';

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        this.gridHelper = new THREE.GridHelper(20, 20, this.GRID_COLOR_CENTER, this.GRID_COLOR_LINES);
        this.scene.add(this.gridHelper);

        this.transformControls = new THREE.TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.setSpace('local');
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.controls.enabled = !event.value;
            if (!event.value) {
                this.captureState();
            }
        });
        this.transformControls.addEventListener('objectChange', () => this.updatePropertyPane());
        this.scene.add(this.transformControls);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.canvasElement.addEventListener('click', (event) => this.performRaycast(event), false);
        window.addEventListener('resize', () => this.onWindowResize());
        document.addEventListener('keydown', (event) => this.onKeyDown(event));

        console.log("Scene initialized");
    }

    setupUI() {
        // These will be populated by the HTML
        this.updateSnapSettings();
        this.setTransformMode('translate');
        this.updateOutliner();
        this.updateHistoryButtons();
    }

    // Shape Management
    addShape(type) {
        let geometry;
        
        if (type === 'text') {
            geometry = this.createTextGeometry('Text', 'sans', 0.2, 0.01);
            if (!geometry) {
                alert('Text fonts are still loading. Please try again in a moment.');
                return;
            }
        } else {
            geometry = this.createShapeGeometry(type);
            if (!geometry) return;
            
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
            geometry.center();
        }

        const material = new THREE.MeshStandardMaterial({
            color: '#007370',
            roughness: 0.5,
            metalness: 0.3
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        this.shapeCounters[type]++;
        mesh.name = `${type.charAt(0).toUpperCase() + type.slice(1)} ${this.shapeCounters[type]}`;
        
        if (type === 'plane') {
            mesh.position.y = 0;
        } else if (type === 'text') {
            mesh.position.y = 0.1;
        } else {
            mesh.position.y = 0.5;
        }
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.color = '#007370';
        
        if (type === 'plane' || type === 'text') {
            mesh.rotation.x = THREE.MathUtils.degToRad(-90);
        }
        
        if (type === 'text') {
            mesh.userData.textContent = 'Text';
            mesh.userData.textFont = 'sans';
            mesh.userData.textHeight = 0.2;
            mesh.userData.textBevel = 0.01;
        }
        
        this.scene.add(mesh);
        this.objects.push(mesh);
        this.selectObject(mesh);
        this.captureState();
    }

    createShapeGeometry(type) {
        switch (type) {
            case 'box':
                return new THREE.BoxGeometry(1, 1, 1);
            case 'sphere':
                return new THREE.SphereGeometry(0.5, 32, 32);
            case 'cylinder':
                return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
            case 'cone':
                return new THREE.ConeGeometry(0.5, 1, 32);
            case 'torus':
                return new THREE.TorusGeometry(0.5, 0.2, 16, 100);
            case 'plane':
                return new THREE.PlaneGeometry(1, 1);
            case 'pyramid':
                return new THREE.ConeGeometry(0.7, 1, 4);
            case 'torusknot':
                return new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16);
            case 'tetrahedron':
                return new THREE.TetrahedronGeometry(0.7);
            case 'octahedron':
                return new THREE.OctahedronGeometry(0.7);
            case 'icosahedron':
                return new THREE.IcosahedronGeometry(0.7);
            case 'dodecahedron':
                return new THREE.DodecahedronGeometry(0.7);
            default:
                return null;
        }
    }

    // Selection Management
    selectObject(obj) {
        if (!obj) return;

        if (obj.userData.groupId) {
            const groupId = obj.userData.groupId;
            const group = this.groups.find(g => g.id === groupId);
            if (group && group.resultMesh) {
                obj = group.resultMesh;
            }
        }

        this.selectedObjects.forEach(sel => {
            this.removeOutline(sel);
            const selGroup = this.groups.find(g => g.resultMesh === sel);
            if (selGroup) {
                selGroup.children.forEach(child => {
                    this.removeOutline(child);
                });
            }
        });

        this.selectedObjects = [obj];
        this.selectedObject = obj;

        if (this.selectedObject.userData.isGroupResult) {
            const group = this.groups.find(g => g.resultMesh === this.selectedObject);
            if (group) {
                group.children.forEach(child => {
                    this.createOutline(child);
                });
            }
        } else {
            this.createOutline(this.selectedObject);
        }

        this.transformControls.attach(this.selectedObject);
        this.showPropertyPane();
        this.updatePropertyPane();
        this.updateOutliner();
        console.log(`Selected: ${obj.name}`);
    }

    deselectObject() {
        if (this.selectedObject) {
            this.removeOutline(this.selectedObject);
            const selGroup = this.groups.find(g => g.resultMesh === this.selectedObject);
            if (selGroup) {
                selGroup.children.forEach(child => {
                    this.removeOutline(child);
                });
            }
        }
        if (this.selectedObjects.length > 0) {
            this.selectedObjects.forEach(sel => {
                this.removeOutline(sel);
                const selGroup = this.groups.find(g => g.resultMesh === sel);
                if (selGroup) {
                    selGroup.children.forEach(child => {
                        this.removeOutline(child);
                    });
                }
            });
        }
        this.selectedObject = null;
        this.selectedObjects = [];
        this.transformControls.detach();
        this.hidePropertyPane();
        this.updateOutliner();
    }

    toggleObjectSelection(obj) {
        const index = this.selectedObjects.indexOf(obj);
        if (index > -1) {
            this.selectedObjects.splice(index, 1);
            if (!obj.userData.isGroupResult) {
                this.removeOutline(obj);
            }
        } else {
            this.selectedObjects.push(obj);
            if (!obj.userData.isGroupResult) {
                this.createOutline(obj);
            }
        }

        this.selectedObject = this.selectedObjects.length > 0 ? this.selectedObjects[0] : null;

        if (this.selectedObjects.length === 1) {
            this.showPropertyPane();
            this.updatePropertyPane();
            this.transformControls.attach(this.selectedObject);
        } else if (this.selectedObjects.length > 1) {
            this.hidePropertyPane();
            this.transformControls.detach();
        } else {
            this.hidePropertyPane();
            this.transformControls.detach();
        }

        this.updateOutliner();
    }

    // Outline Management
    createOutline(mesh) {
        if (!mesh.geometry) return null;
        
        const outlineGeometry = mesh.geometry.clone();
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: this.OUTLINE_COLOR,
            side: THREE.BackSide,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        });
        
        const outlineObject = new THREE.Mesh(outlineGeometry, outlineMaterial);
        const isText = mesh.userData.textContent !== undefined;
        
        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        const worldScale = new THREE.Vector3();
        
        mesh.getWorldPosition(worldPosition);
        mesh.getWorldQuaternion(worldQuaternion);
        mesh.getWorldScale(worldScale);
        
        if (isText) {
            const offsetAmount = 0.04;
            outlineObject.position.copy(worldPosition);
            outlineObject.position.x += offsetAmount;
            outlineObject.position.y += offsetAmount;
            outlineObject.quaternion.copy(worldQuaternion);
            outlineObject.scale.copy(worldScale);
        } else {
            outlineObject.position.copy(worldPosition);
            outlineObject.quaternion.copy(worldQuaternion);
            outlineObject.scale.copy(worldScale).multiplyScalar(1.05);
        }
        
        this.scene.add(outlineObject);
        this.outlineMap.set(mesh, { outline: outlineObject, mesh: mesh, isText: isText });
        
        return outlineObject;
    }

    removeOutline(mesh) {
        const outlineData = this.outlineMap.get(mesh);
        if (outlineData) {
            this.scene.remove(outlineData.outline);
            outlineData.outline.geometry.dispose();
            outlineData.outline.material.dispose();
            this.outlineMap.delete(mesh);
        }
    }

    syncOutlines() {
        for (let [mesh, outlineData] of this.outlineMap.entries()) {
            if (outlineData && outlineData.outline) {
                const worldPosition = new THREE.Vector3();
                const worldQuaternion = new THREE.Quaternion();
                const worldScale = new THREE.Vector3();
                
                mesh.getWorldPosition(worldPosition);
                mesh.getWorldQuaternion(worldQuaternion);
                mesh.getWorldScale(worldScale);
                
                if (outlineData.isText) {
                    const offsetAmount = 0.04;
                    outlineData.outline.position.copy(worldPosition);
                    outlineData.outline.position.x += offsetAmount;
                    outlineData.outline.position.y += offsetAmount;
                    outlineData.outline.quaternion.copy(worldQuaternion);
                    outlineData.outline.scale.copy(worldScale);
                } else {
                    outlineData.outline.position.copy(worldPosition);
                    outlineData.outline.quaternion.copy(worldQuaternion);
                    outlineData.outline.scale.copy(worldScale).multiplyScalar(1.05);
                }
            }
        }
    }

    // Group Management
    groupSelected() {
        if (this.selectedObjects.length < 1) {
            console.log("No objects selected for grouping");
            return;
        }

        const groupId = `group_${this.groupIdCounter++}`;
        const group = {
            id: groupId,
            name: `Group ${this.groups.length + 1}`,
            children: [...this.selectedObjects],
            resultMesh: null,
            isDirty: true
        };

        this.selectedObjects.forEach(obj => {
            obj.userData.groupId = groupId;
            this.removeOutline(obj);
        });

        this.groups.push(group);
        this.computeGroupResult(group);

        this.deselectObject();
        this.selectObject(group.resultMesh);

        this.updateOutliner();
        this.captureState();
    }

    ungroupSelected() {
        if (!this.selectedObject || !this.selectedObject.userData.isGroupResult) return;

        const groupId = this.selectedObject.userData.groupId;
        const groupIndex = this.groups.findIndex(g => g.id === groupId);

        if (groupIndex === -1) return;

        const group = this.groups[groupIndex];

        group.children.forEach(obj => {
            const worldPosition = new THREE.Vector3();
            const worldRotation = new THREE.Quaternion();
            const worldScale = new THREE.Vector3();
            obj.getWorldPosition(worldPosition);
            obj.getWorldQuaternion(worldRotation);
            obj.getWorldScale(worldScale);

            group.resultMesh.remove(obj);
            this.scene.add(obj);

            obj.position.copy(worldPosition);
            obj.quaternion.copy(worldRotation);
            obj.scale.copy(worldScale);

            obj.userData.groupId = null;
            this.deselectObject();
        });

        this.scene.remove(group.resultMesh);
        this.groups.splice(groupIndex, 1);

        this.updateOutliner();
        this.captureState();
    }

    computeGroupResult(group) {
        if (group.resultMesh) {
            this.scene.remove(group.resultMesh);
        }

        if (group.children.length === 0) return;

        const boundingBox = new THREE.Box3();
        group.children.forEach(child => {
            boundingBox.expandByObject(child);
        });
        
        const center = boundingBox.getCenter(new THREE.Vector3());

        const groupContainer = new THREE.Group();
        groupContainer.userData.isGroupResult = true;
        groupContainer.userData.groupId = group.id;
        groupContainer.name = group.name;
        
        groupContainer.position.copy(center);

        group.children.forEach(child => {
            const worldPos = new THREE.Vector3();
            child.getWorldPosition(worldPos);
            
            groupContainer.add(child);
            
            child.position.copy(worldPos).sub(center);
        });

        this.scene.add(groupContainer);
        group.resultMesh = groupContainer;
        group.isDirty = false;
    }

    // History Management
    captureState() {
        this.history = this.history.slice(0, this.historyIndex + 1);

        const state = {
            objects: this.objects.map(obj => {
                const objState = {
                    name: obj.name,
                    position: obj.position.clone(),
                    rotation: obj.rotation.clone(),
                    scale: obj.scale.clone(),
                    color: obj.userData.color || obj.material.color.getHex(),
                    uuid: obj.uuid,
                    groupId: obj.userData.groupId || null
                };
                
                if (obj.userData.textContent !== undefined) {
                    objState.textContent = obj.userData.textContent;
                    objState.textFont = obj.userData.textFont;
                    objState.textHeight = obj.userData.textHeight;
                    objState.textBevel = obj.userData.textBevel;
                }
                
                return objState;
            }),
            groups: this.groups.map(g => ({
                id: g.id,
                name: g.name,
                children: g.children.map(c => c.uuid)
            })),
            selectedObjectUuids: this.selectedObjects.map(obj => obj.uuid),
            shapeCounters: {
                ...this.shapeCounters
            }
        };

        this.history.push(state);
        if (this.history.length > this.MAX_HISTORY) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }

        this.updateHistoryButtons();
    }

    restoreState(state) {
        if (!state) return;

        for (let [mesh, outlineData] of this.outlineMap.entries()) {
            if (outlineData && outlineData.outline) {
                this.scene.remove(outlineData.outline);
                outlineData.outline.geometry.dispose();
                outlineData.outline.material.dispose();
            }
        }
        this.outlineMap.clear();

        this.objects.forEach(obj => this.scene.remove(obj));
        this.groups.forEach(g => {
            if (g.resultMesh) this.scene.remove(g.resultMesh);
        });
        this.objects = [];
        this.groups = [];

        state.objects.forEach(objState => {
            const type = objState.name.split(' ')[0].toLowerCase();
            let geometry;
            
            if (type === 'text') {
                geometry = this.createTextGeometry(
                    objState.textContent || 'Text',
                    objState.textFont || 'sans',
                    objState.textHeight || 0.2,
                    objState.textBevel || 0.01
                );
                if (!geometry) {
                    console.warn('Text geometry not ready, skipping text object');
                    return;
                }
            } else {
                geometry = this.createShapeGeometry(type);
                if (geometry) {
                    geometry.computeBoundingBox();
                    geometry.computeBoundingSphere();
                    geometry.center();
                }
            }

            const material = new THREE.MeshStandardMaterial({
                color: objState.color,
                roughness: 0.5,
                metalness: 0.3,
                transparent: false,
                opacity: 1.0
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = objState.name;
            mesh.uuid = objState.uuid;
            mesh.userData.color = objState.color;
            mesh.userData.groupId = objState.groupId || null;
            
            if (objState.textContent !== undefined) {
                mesh.userData.textContent = objState.textContent;
                mesh.userData.textFont = objState.textFont;
                mesh.userData.textHeight = objState.textHeight;
                mesh.userData.textBevel = objState.textBevel;
            }
            
            mesh.position.copy(objState.position);
            mesh.rotation.copy(objState.rotation);
            mesh.scale.copy(objState.scale);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.scene.add(mesh);
            this.objects.push(mesh);
        });

        state.groups.forEach(groupState => {
            const group = {
                id: groupState.id,
                name: groupState.name,
                children: groupState.children.map(uuid => this.objects.find(o => o.uuid === uuid)).filter(o => o),
                resultMesh: null,
                isDirty: true
            };
            this.groups.push(group);
            if (group.children.length > 0) {
                this.computeGroupResult(group);
            }
        });

        this.shapeCounters = {
            ...state.shapeCounters
        };

        if (state.selectedObjectUuids && state.selectedObjectUuids.length > 0) {
            this.selectedObjects = [];
            state.selectedObjectUuids.forEach(uuid => {
                const obj = this.objects.find(o => o.uuid === uuid);
                if (obj) {
                    this.selectedObjects.push(obj);
                }
            });
            this.selectedObject = this.selectedObjects.length > 0 ? this.selectedObjects[0] : null;

            if (this.selectedObjects.length === 1) {
                this.showPropertyPane();
                this.updatePropertyPane();
                this.transformControls.attach(this.selectedObject);
                this.createOutline(this.selectedObject);
            } else if (this.selectedObjects.length > 1) {
                this.hidePropertyPane();
                this.transformControls.detach();
            }
        } else {
            this.deselectObject();
        }

        this.updateOutliner();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
            this.updateHistoryButtons();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
            this.updateHistoryButtons();
        }
    }

    // Text Management
    loadFonts() {
        const fontUrls = {
            sans: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_regular.typeface.json',
            mono: 'src/font/DM_Mono_Regular.json',
            serif: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/gentilis_regular.typeface.json'
        };

        for (const [fontName, url] of Object.entries(fontUrls)) {
            this.fontLoader.load(url, (font) => {
                this.fonts[fontName] = font;
                console.log(`Font loaded: ${fontName}`);
            }, undefined, (error) => {
                console.error(`Failed to load font ${fontName}:`, error);
            });
        }
    }

    createTextGeometry(text, fontName = 'sans', height = 0.2, bevel = 0.01) {
        if (!this.fonts[fontName]) {
            console.warn(`Font ${fontName} not loaded yet, using sans-serif`);
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

    updateTextContent() {
        if (!this.selectedObject || !this.selectedObject.userData.textContent) return;
        
        const newContent = document.getElementById('prop-text-content').value || 'Text';
        this.selectedObject.userData.textContent = newContent;
        this.updateTextGeometry();
        this.captureState();
    }

    updateTextFont() {
        if (!this.selectedObject || !this.selectedObject.userData.textContent) return;
        
        const newFont = document.getElementById('prop-text-font').value || 'sans';
        this.selectedObject.userData.textFont = newFont;
        this.updateTextGeometry();
        this.captureState();
    }

    updateTextHeight() {
        if (!this.selectedObject || !this.selectedObject.userData.textContent) return;
        
        const newHeight = parseFloat(document.getElementById('prop-text-height').value) || 0.2;
        this.selectedObject.userData.textHeight = newHeight;
        this.updateTextGeometry();
        this.captureState();
    }

    updateTextBevel() {
        if (!this.selectedObject || !this.selectedObject.userData.textContent) return;
        
        const newBevel = parseFloat(document.getElementById('prop-text-bevel').value) || 0.01;
        this.selectedObject.userData.textBevel = newBevel;
        this.updateTextGeometry();
        this.captureState();
    }

    updateTextGeometry() {
        if (!this.selectedObject || !this.selectedObject.userData.textContent) return;
        
        const newGeometry = this.createTextGeometry(
            this.selectedObject.userData.textContent,
            this.selectedObject.userData.textFont,
            this.selectedObject.userData.textHeight,
            this.selectedObject.userData.textBevel
        );

        if (newGeometry) {
            this.selectedObject.geometry.dispose();
            this.selectedObject.geometry = newGeometry;
            
            const outlineData = this.outlineMap.get(this.selectedObject);
            if (outlineData && outlineData.outline) {
                this.removeOutline(this.selectedObject);
                this.createOutline(this.selectedObject);
            }
        }
    }

    // Property Pane Management
    showPropertyPane() {
        const pane = document.getElementById('property-pane');
        if (pane) {
            pane.classList.remove('hidden');
            pane.classList.add('block');
        }
    }

    hidePropertyPane() {
        const pane = document.getElementById('property-pane');
        if (pane) {
            pane.classList.add('hidden');
            pane.classList.remove('block');
        }
    }

    updatePropertyPane() {
        if (!this.selectedObject) return;

        const isGroup = this.selectedObject.userData.isGroupResult === true;
        const materialSection = document.getElementById('property-material-section');
        const textSection = document.getElementById('property-text-section');
        const isText = this.selectedObject.userData.textContent !== undefined;
        
        if (isGroup) {
            if (materialSection) materialSection.classList.add('hidden');
            if (textSection) textSection.classList.add('hidden');
        } else {
            if (isText) {
                if (materialSection) materialSection.classList.remove('hidden');
                if (textSection) textSection.classList.remove('hidden');
                
                const textContent = document.getElementById('prop-text-content');
                const textFont = document.getElementById('prop-text-font');
                const textHeight = document.getElementById('prop-text-height');
                const textBevel = document.getElementById('prop-text-bevel');
                
                if (textContent) textContent.value = this.selectedObject.userData.textContent || 'Text';
                if (textFont) textFont.value = this.selectedObject.userData.textFont || 'sans';
                if (textHeight) textHeight.value = this.selectedObject.userData.textHeight || 0.2;
                if (textBevel) textBevel.value = this.selectedObject.userData.textBevel || 0.01;
            } else {
                if (materialSection) materialSection.classList.remove('hidden');
                if (textSection) textSection.classList.add('hidden');
                
                let colorValue = '#007370';
                if (this.selectedObject.userData && this.selectedObject.userData.color) {
                    colorValue = this.selectedObject.userData.color;
                } else if (this.selectedObject.material && this.selectedObject.material.color) {
                    colorValue = '#' + this.selectedObject.material.color.getHexString();
                }

                if (typeof colorValue === 'string' && !colorValue.startsWith('#')) {
                    colorValue = '#' + colorValue;
                }
                
                const colorPicker = document.getElementById('colorPicker');
                const hexInput = document.getElementById('hexInput');
                if (colorPicker) colorPicker.value = colorValue;
                if (hexInput) hexInput.value = colorValue.replace('#', '');
            }
        }

        const posX = document.getElementById('prop-pos-x');
        const posY = document.getElementById('prop-pos-y');
        const posZ = document.getElementById('prop-pos-z');
        const rotX = document.getElementById('prop-rot-x');
        const rotY = document.getElementById('prop-rot-y');
        const rotZ = document.getElementById('prop-rot-z');
        const scaleX = document.getElementById('prop-scale-x');
        const scaleY = document.getElementById('prop-scale-y');
        const scaleZ = document.getElementById('prop-scale-z');

        if (posX) posX.value = this.selectedObject.position.x.toFixed(3);
        if (posY) posY.value = this.selectedObject.position.y.toFixed(3);
        if (posZ) posZ.value = this.selectedObject.position.z.toFixed(3);
        if (rotX) rotX.value = THREE.MathUtils.radToDeg(this.selectedObject.rotation.x).toFixed(1);
        if (rotY) rotY.value = THREE.MathUtils.radToDeg(this.selectedObject.rotation.y).toFixed(1);
        if (rotZ) rotZ.value = THREE.MathUtils.radToDeg(this.selectedObject.rotation.z).toFixed(1);
        if (scaleX) scaleX.value = this.selectedObject.scale.x.toFixed(3);
        if (scaleY) scaleY.value = this.selectedObject.scale.y.toFixed(3);
        if (scaleZ) scaleZ.value = this.selectedObject.scale.z.toFixed(3);
    }

    updateObjectFromPane() {
        if (!this.selectedObject) return;
        
        const posX = parseFloat(document.getElementById('prop-pos-x')?.value || 0);
        const posY = parseFloat(document.getElementById('prop-pos-y')?.value || 0);
        const posZ = parseFloat(document.getElementById('prop-pos-z')?.value || 0);
        const rotX = THREE.MathUtils.degToRad(parseFloat(document.getElementById('prop-rot-x')?.value || 0));
        const rotY = THREE.MathUtils.degToRad(parseFloat(document.getElementById('prop-rot-y')?.value || 0));
        const rotZ = THREE.MathUtils.degToRad(parseFloat(document.getElementById('prop-rot-z')?.value || 0));
        const scaleX = parseFloat(document.getElementById('prop-scale-x')?.value || 1);
        const scaleY = parseFloat(document.getElementById('prop-scale-y')?.value || 1);
        const scaleZ = parseFloat(document.getElementById('prop-scale-z')?.value || 1);

        this.selectedObject.position.set(posX, posY, posZ);
        this.selectedObject.rotation.set(rotX, rotY, rotZ);
        this.selectedObject.scale.set(scaleX, scaleY, scaleZ);
        this.captureState();
    }

    updateColor() {
        if (this.selectedObject) {
            const newColor = document.getElementById('colorPicker')?.value;
            if (newColor) {
                this.selectedObject.userData.color = newColor;
                this.selectedObject.material.color.set(newColor);
                const hexInput = document.getElementById('hexInput');
                if (hexInput) hexInput.value = newColor.replace('#', '');
                this.captureState();
            }
        }
    }

    updateColorFromHex() {
        if (this.selectedObject) {
            let hexValue = document.getElementById('hexInput')?.value;
            if (!hexValue) return;
            
            if (!hexValue.startsWith('#')) {
                hexValue = '#' + hexValue;
            }
            
            if (/^#[0-9A-Fa-f]{6}$/.test(hexValue)) {
                this.selectedObject.userData.color = hexValue;
                this.selectedObject.material.color.set(hexValue);
                const colorPicker = document.getElementById('colorPicker');
                if (colorPicker) colorPicker.value = hexValue;
                this.captureState();
            } else {
                const currentColor = document.getElementById('colorPicker')?.value;
                const hexInput = document.getElementById('hexInput');
                if (hexInput && currentColor) {
                    hexInput.value = currentColor.replace('#', '');
                }
            }
        }
    }

    // Object Operations
    duplicateSelected() {
        if (this.selectedObjects.length === 0) return;

        const clones = [];

        this.selectedObjects.forEach(obj => {
            const clone = obj.clone();
            clone.material = obj.material.clone();
            clone.position.x += 1.5;
            let originalType = obj.name.split(' ')[0].toLowerCase();
            this.shapeCounters[originalType]++;
            clone.name = `${originalType.charAt(0).toUpperCase() + originalType.slice(1)} ${this.shapeCounters[originalType]}`;
            this.scene.add(clone);
            this.objects.push(clone);
            clones.push(clone);
        });

        this.deselectObject();
        clones.forEach(clone => {
            this.selectedObjects.push(clone);
            this.createOutline(clone);
        });
        this.selectedObject = clones.length > 0 ? clones[0] : null;

        if (clones.length === 1) {
            this.showPropertyPane();
            this.updatePropertyPane();
            this.transformControls.attach(this.selectedObject);
        } else if (clones.length > 1) {
            this.hidePropertyPane();
        }

        this.updateOutliner();
        this.captureState();
    }

    deleteSelected() {
        if (this.selectedObjects.length === 0) return;

        this.selectedObjects.forEach(objToRemove => {
            const groupIndex = this.groups.findIndex(g => g.resultMesh === objToRemove);
            if (groupIndex !== -1) {
                const group = this.groups[groupIndex];
                this.scene.remove(group.resultMesh);
                group.children.forEach(child => {
                    this.objects = this.objects.filter(obj => obj !== child);
                });
                this.groups.splice(groupIndex, 1);
            } else {
                this.scene.remove(objToRemove);
                this.objects = this.objects.filter(obj => obj !== objToRemove);
            }
        });

        this.deselectObject();
        this.updateOutliner();
        this.captureState();
    }

    // UI Updates
    updateOutliner() {
        const outlinerList = document.getElementById('outliner-list');
        if (!outlinerList) return;
        
        outlinerList.innerHTML = '';

        const objectsInGroups = new Set();
        this.groups.forEach(group => {
            group.children.forEach(child => {
                objectsInGroups.add(child.uuid);
            });
        });

        this.groups.forEach(group => {
            const groupLi = document.createElement('li');
            groupLi.className = 'text-sm rounded-md cursor-pointer transition-all bg-slate-50 text-gray-900 border border-transparent';
            if (this.selectedObjects.includes(group.resultMesh)) {
                groupLi.classList.add('bg-slate-200', 'font-semibold');
            }

            const groupHeader = document.createElement('div');
            groupHeader.className = 'flex items-center gap-2 p-3 hover:bg-slate-100 rounded-md';
            groupHeader.innerHTML = `<i class="fa-regular fa-object-group"></i><span>${group.name}</span> <span class="text-xs text-gray-600 ml-auto">(${group.children.length})</span>`;
            groupHeader.onclick = () => {
                this.selectObject(group.resultMesh);
            };
            groupLi.appendChild(groupHeader);

            const childrenUl = document.createElement('ul');
            childrenUl.className = 'ml-4 border-l-2 border-slate-300 pl-2 space-y-1';

            group.children.forEach(child => {
                if (child.visible) {
                    const childLi = document.createElement('li');
                    childLi.className = 'text-sm p-2 rounded-md cursor-pointer transition-all bg-transparent text-gray-800 flex items-center gap-2 border border-transparent hover:bg-sky-100';
                    if (this.selectedObjects.includes(child)) {
                        childLi.classList.add('bg-blue-100', 'font-semibold');
                    }

                    childLi.innerHTML = `<i class="fa-solid fa-cube"></i><span>${child.name}</span>`;
                    childLi.onclick = (e) => {
                        if (e.ctrlKey || e.metaKey) {
                            this.toggleObjectSelection(child);
                        } else {
                            this.selectObject(child);
                        }
                    };
                    childrenUl.appendChild(childLi);
                }
            });

            groupLi.appendChild(childrenUl);
            outlinerList.appendChild(groupLi);
        });

        this.objects.forEach(obj => {
            if (obj.visible && !objectsInGroups.has(obj.uuid)) {
                const li = document.createElement('li');
                li.className = 'text-sm p-3 rounded-md cursor-pointer transition-all bg-transparent text-gray-900 flex items-center gap-2 border border-transparent hover:bg-sky-100';
                if (this.selectedObjects.includes(obj)) {
                    li.classList.add('bg-blue-200', 'font-semibold');
                }

                li.innerHTML = `<i class="fa-solid fa-cube"></i><span>${obj.name}</span>`;
                li.onclick = (e) => {
                    if (e.ctrlKey || e.metaKey) {
                        this.toggleObjectSelection(obj);
                    } else {
                        this.selectObject(obj);
                    }
                };
                outlinerList.appendChild(li);
            }
        });
    }

    updateHistoryButtons() {
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');

        if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
        if (redoBtn) redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }

    updateSnapSettings() {
        const selectElement = document.getElementById('snap-unit-select');
        if (!selectElement) return;
        
        const newSnapValue = parseFloat(selectElement.value);
        if (newSnapValue === 0) {
            this.transformControls.setTranslationSnap(null);
            this.transformControls.setRotationSnap(null);
            this.transformControls.setScaleSnap(null);
        } else {
            this.transformControls.setTranslationSnap(newSnapValue);
            this.transformControls.setRotationSnap(THREE.MathUtils.degToRad(15));
            this.transformControls.setScaleSnap(newSnapValue);
        }
    }

    setTransformMode(mode) {
        this.transformControls.setMode(mode);
        const buttons = {
            translate: document.getElementById('translate-btn'),
            rotate: document.getElementById('rotate-btn'),
            scale: document.getElementById('scale-btn')
        };
        for (const key in buttons) {
            const button = buttons[key];
            if (button) {
                button.style.backgroundColor = key === mode ? '#1e40af' : '#3b82f6';
            }
        }
    }

    setCameraMode(mode) {
        if (mode === this.currentCameraMode) return;
        const newCam = (mode === 'perspective') ? this.perspectiveCamera : this.orthographicCamera;
        newCam.position.copy(this.camera.position);
        newCam.rotation.copy(this.camera.rotation);
        newCam.zoom = this.camera.zoom;
        this.camera = newCam;
        this.controls.object = this.camera;
        this.transformControls.camera = this.camera;
        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.currentCameraMode = mode;
        const pBtn = document.getElementById('perspective-btn');
        const oBtn = document.getElementById('orthographic-btn');

        if (pBtn) pBtn.style.backgroundColor = mode === 'perspective' ? '#1e40af' : '#3b82f6';
        if (oBtn) oBtn.style.backgroundColor = mode === 'orthographic' ? '#1e40af' : '#3b82f6';
    }

    // Export Functions
    exportGLTF() {
        if (this.objects.length === 0) {
            alert('No objects to export');
            return;
        }

        const exportGroup = new THREE.Group();
        this.objects.forEach(obj => {
            const clonedObj = obj.clone();
            if (clonedObj.material) {
                clonedObj.material = clonedObj.material.clone();
            }
            exportGroup.add(clonedObj);
        });

        const exporter = new THREE.GLTFExporter();
        exporter.parse(exportGroup, (result) => {
            const output = JSON.stringify(result, null, 2);
            const blob = new Blob([output], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `scene_${new Date().getTime()}.gltf`;
            link.click();
            URL.revokeObjectURL(link.href);
            console.log('GLTF exported successfully');
        });
    }

    exportSTL() {
        if (this.objects.length === 0) {
            alert('No objects to export');
            return;
        }

        const exportGroup = new THREE.Group();
        this.objects.forEach(obj => {
            const clonedObj = obj.clone();
            if (clonedObj.material) {
                clonedObj.material = clonedObj.material.clone();
            }
            exportGroup.add(clonedObj);
        });

        const exporter = new THREE.STLExporter();
        const stlString = exporter.parse(exportGroup);
        const blob = new Blob([stlString], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `scene_${new Date().getTime()}.stl`;
        link.click();
        URL.revokeObjectURL(link.href);
        console.log('STL exported successfully');
    }

    // Event Handlers
    performRaycast(event) {
        if (this.transformControls.dragging) return;

        const rect = this.canvasElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const selectableObjects = [];
        this.objects.forEach(obj => {
            if (obj.visible && !obj.userData.isGroupResult) {
                selectableObjects.push(obj);
            }
        });
        this.groups.forEach(group => {
            if (group.resultMesh && group.resultMesh.visible) {
                selectableObjects.push(group.resultMesh);
            }
        });

        const intersects = this.raycaster.intersectObjects(selectableObjects);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            if (event.ctrlKey || event.metaKey) {
                this.toggleObjectSelection(clickedObject);
            } else {
                this.selectObject(clickedObject);
            }
        } else {
            this.deselectObject();
        }
    }

    onKeyDown(event) {
        if (event.target.tagName === 'INPUT') return;
        switch (event.key.toLowerCase()) {
            case 't':
                this.setTransformMode('translate');
                break;
            case 'r':
                this.setTransformMode('rotate');
                break;
            case 's':
                this.setTransformMode('scale');
                break;
            case 'delete':
            case 'backspace':
                this.deleteSelected();
                event.preventDefault();
                break;
            case 'z':
                if (event.ctrlKey || event.metaKey) {
                    this.undo();
                    event.preventDefault();
                }
                break;
            case 'y':
                if (event.ctrlKey || event.metaKey) {
                    this.redo();
                    event.preventDefault();
                }
                break;
        }
    }

    onWindowResize() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Animation Loop
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.syncOutlines();
        this.renderer.render(this.scene, this.camera);
    }
}
