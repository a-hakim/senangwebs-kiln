/**
 * SenangWebs Kiln (SWK) - Main Entry Point
 * A lightweight 3D modeling editor library
 */

import Config from './core/Config.js';
import EventEmitter from './core/EventEmitter.js';
import Initializer from './core/Initializer.js';
import Scene from './core/Scene.js';
import Renderer from './core/Renderer.js';
import Camera from './core/Camera.js';
import Lighting from './core/Lighting.js';
import ShapeFactory from './shapes/ShapeFactory.js';
import Picker from './selection/Picker.js';
import SelectionManager from './selection/SelectionManager.js';
import Outliner from './selection/Outliner.js';
import TransformManager from './transform/TransformManager.js';
import SnapManager from './transform/SnapManager.js';
import GroupManager from './grouping/GroupManager.js';
import HistoryManager from './history/HistoryManager.js';
import UIManager from './ui/UIManager.js';
import ExportManager from './export/ExportManager.js';

/**
 * Main SWK Class
 */
class SWK extends EventEmitter {
    constructor(selector, options = {}) {
        super();
        
        // Initialize from selector
        const { container, config } = Initializer.fromAPI(selector, options);
        
        // Set up configuration
        this.config = new Config({ container, ...config });
        this.container = container;
        
        // Core modules
        this.renderer = null;
        this.sceneManager = null;
        this.cameraManager = null;
        this.lighting = null;
        this.shapeFactory = null;
        
        // Selection modules
        this.picker = null;
        this.selectionManager = null;
        this.outliner = null;
        
        // Transform modules
        this.transformManager = null;
        this.snapManager = null;
        
        // Grouping module
        this.groupManager = null;
        
        // History module
        this.historyManager = null;
        
        // UI module
        this.uiManager = null;
        
        // Export module
        this.exportManager = null;
        
        // Object management
        this.objects = [];
        this.selectedObject = null;
        this.selectedObjects = [];
        this.groups = [];
        
        // State
        this.initialized = false;
        this.animationId = null;
        
        // Initialize
        this.init();
    }

    /**
     * Initialize the editor
     */
    init() {
        if (this.initialized) {
            console.warn('SWK: Already initialized');
            return;
        }

        try {
            // Ensure container has proper styling
            this.setupContainer();
            
            // Initialize core modules
            this.renderer = new Renderer(this.container, this.config);
            this.sceneManager = new Scene(this.config);
            this.cameraManager = new Camera(this.container, this.config);
            this.lighting = new Lighting(this.sceneManager.getScene(), this.config);
            this.shapeFactory = new ShapeFactory(this.config);
            
            // Initialize selection modules
            this.picker = new Picker(this.cameraManager.getCamera(), this.renderer.getRenderer());
            this.selectionManager = new SelectionManager(this);
            this.outliner = new Outliner(this.sceneManager.getScene(), this.config);
            
            // Initialize transform modules
            this.transformManager = new TransformManager(
                this.cameraManager.getCamera(),
                this.renderer.getCanvas(),
                this.sceneManager.getScene(),
                this.config,
                this
            );
            this.snapManager = new SnapManager(
                this.transformManager.getControls(),
                this.config,
                this
            );
            
            // Initialize grouping module
            this.groupManager = new GroupManager(
                this.sceneManager.getScene(),
                this,
                this.config
            );
            
            // Initialize history module
            if (this.config.get('history.enabled')) {
                this.historyManager = new HistoryManager(
                    this.sceneManager.getScene(),
                    this.selectionManager,
                    this.groupManager,
                    this.shapeFactory,
                    {
                        get: (key) => {
                            if (key === 'maxHistory') {
                                return this.config.get('history.maxSize');
                            }
                            return this.config.get(key);
                        }
                    }
                );
                
                // Listen to history events
                this.historyManager.on('stateChanged', (data) => {
                    this.emit('historyChanged', data);
                });
                
                this.historyManager.on('stateRestored', (data) => {
                    this.emit('historyRestored', data);
                    // Update outliner after restore
                    this.updateSelectionOutlines();
                });
            }
            
            // Store transform controls reference for compatibility
            this.transformControls = this.transformManager.getControls();
            
            // Initialize UI module
            if (this.config.get('ui.enabled')) {
                this.uiManager = new UIManager(this.container, this, this.config);
            }
            
            // Initialize export module
            if (this.config.get('features.export')) {
                this.exportManager = new ExportManager(
                    this.sceneManager.getScene(),
                    this,
                    this.config
                );
                
                // Listen to export events
                this.exportManager.on('exportStart', (data) => {
                    this.emit('exportStart', data);
                });
                
                this.exportManager.on('exportComplete', (data) => {
                    this.emit('exportComplete', data);
                });
                
                this.exportManager.on('exportError', (data) => {
                    this.emit('exportError', data);
                });
            }
            
            // Load fonts for text shapes
            this.shapeFactory.loadFonts(() => {
                console.log('SWK: All fonts loaded');
            });
            
            // Set up orbit controls
            this.setupControls();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Link orbit controls with transform dragging
            this.on('orbitControlsEnabled', (enabled) => {
                if (this.controls) {
                    this.controls.enabled = enabled;
                }
            });
            
            // Start animation loop
            this.animate();
            
            this.initialized = true;
            this.emit('initialized');
            
            console.log('SWK: Editor initialized successfully');
        } catch (error) {
            console.error('SWK: Initialization failed:', error);
            throw error;
        }
    }

    /**
     * Setup container styling
     */
    setupContainer() {
        this.container.style.position = 'relative';
        this.container.style.width = this.config.get('width');
        this.container.style.height = this.config.get('height');
        this.container.style.overflow = 'hidden';
    }

    /**
     * Setup orbit controls
     */
    setupControls() {
        const camera = this.cameraManager.getCamera();
        const canvas = this.renderer.getCanvas();
        
        this.controls = new THREE.OrbitControls(camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 100;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // Link controls to camera manager
        this.cameraManager.setControls(this.controls);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Canvas click for object selection
        const canvas = this.renderer.getCanvas();
        canvas.addEventListener('click', this.onCanvasClick.bind(this));
        
        // Keyboard shortcuts
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        
        // Transform events for history
        let isTransforming = false;
        this.on('transformDragging', (dragging) => {
            if (!dragging && isTransforming) {
                // Transform ended, capture state
                this.captureState('Transform object');
                isTransforming = false;
            } else if (dragging) {
                isTransforming = true;
            }
        });
    }

    /**
     * Handle canvas click
     */
    onCanvasClick(event) {
        // Check if clicking on transform controls
        if (this.transformControls && this.transformControls.dragging) {
            return;
        }

        // Pick object at mouse position
        const canvas = this.renderer.getCanvas();
        const intersection = this.picker.pickFromEvent(event, canvas, this.objects, false);

        if (intersection) {
            // Object clicked
            const clickedObject = intersection.object;
            
            // Check for multi-select (Ctrl key)
            if (event.ctrlKey || event.metaKey) {
                // Multi-select mode
                this.selectionManager.toggle(clickedObject);
            } else {
                // Single select mode
                this.selectionManager.select(clickedObject);
            }

            // Update transform controls
            if (this.selectionManager.getSelectionCount() === 1) {
                this.transformControls.attach(clickedObject);
            } else {
                this.transformControls.detach();
            }

            // Update outlines
            this.updateSelectionOutlines();
        } else {
            // Empty space clicked - deselect
            this.deselectAll();
        }
        
        // Emit click event
        this.emit('canvasClick', { 
            mouse: this.picker.getMousePosition(), 
            event,
            intersection 
        });
    }

    /**
     * Handle keyboard shortcuts
     */
    onKeyDown(event) {
        // Undo/Redo shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
        if (event.ctrlKey || event.metaKey) {
            if (event.key.toLowerCase() === 'z') {
                if (event.shiftKey) {
                    // Ctrl+Shift+Z = Redo
                    this.redo();
                } else {
                    // Ctrl+Z = Undo
                    this.undo();
                }
                event.preventDefault();
                return;
            } else if (event.key.toLowerCase() === 'y') {
                // Ctrl+Y = Redo
                this.redo();
                event.preventDefault();
                return;
            }
        }
        
        // Transform mode shortcuts (T, R, S)
        if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            switch (event.key.toLowerCase()) {
                case 't':
                    this.setTransformMode('translate');
                    event.preventDefault();
                    break;
                case 'r':
                    this.setTransformMode('rotate');
                    event.preventDefault();
                    break;
                case 's':
                    this.setTransformMode('scale');
                    event.preventDefault();
                    break;
                case 'delete':
                case 'backspace':
                    // Delete selected objects
                    const selected = this.selectionManager.getSelectedObjects();
                    selected.forEach(obj => this.deleteObject(obj));
                    event.preventDefault();
                    break;
            }
        }
        
        // Emit keydown event
        this.emit('keydown', event);
    }

    /**
     * Animation loop
     */
    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Sync outlines with mesh transforms
        if (this.outliner) {
            this.outliner.syncOutlines();
        }
        
        // Render scene
        const scene = this.sceneManager.getScene();
        const camera = this.cameraManager.getCamera();
        this.renderer.render(scene, camera);
        
        // Emit render event
        this.emit('render');
    }

    /**
     * Get scene
     */
    getScene() {
        return this.sceneManager ? this.sceneManager.getScene() : null;
    }

    /**
     * Get renderer
     */
    getRenderer() {
        return this.renderer ? this.renderer.getRenderer() : null;
    }

    /**
     * Get camera
     */
    getCamera() {
        return this.cameraManager ? this.cameraManager.getCamera() : null;
    }

    /**
     * Set camera mode
     */
    setCameraMode(mode) {
        if (this.cameraManager) {
            this.cameraManager.setMode(mode);
            if (this.transformManager) {
                this.transformManager.setCamera(this.cameraManager.getCamera());
            }
            if (this.picker) {
                this.picker.setCamera(this.cameraManager.getCamera());
            }
            this.emit('cameraModeChanged', mode);
        }
    }

    /**
     * Get camera mode
     */
    getCameraMode() {
        return this.cameraManager ? this.cameraManager.getMode() : null;
    }

    /**
     * Set background color
     */
    setBackground(color) {
        if (this.renderer) {
            this.renderer.setBackgroundColor(color);
            this.emit('backgroundChanged', color);
        }
    }

    /**
     * Reset camera
     */
    resetCamera() {
        if (this.cameraManager) {
            this.cameraManager.reset();
            this.emit('cameraReset');
        }
    }

    /**
     * Add shape to scene
     */
    addShape(type, options = {}) {
        const mesh = this.shapeFactory.createShape(type, options);
        
        if (!mesh) {
            console.warn(`SWK: Failed to create shape: ${type}`);
            return null;
        }

        // Add to scene
        this.sceneManager.add(mesh);
        this.objects.push(mesh);

        // Emit event
        this.emit('objectAdded', mesh);

        // Execute callback
        const callback = this.config.get('callbacks.onObjectAdded');
        if (callback && typeof callback === 'function') {
            callback(mesh);
        }

        // Capture state for undo
        this.captureState(`Add ${mesh.name}`);

        console.log(`SWK: Added ${mesh.name}`);
        return mesh;
    }

    /**
     * Delete object from scene
     */
    deleteObject(mesh) {
        if (!mesh) return false;

        // Remove from scene
        this.sceneManager.remove(mesh);

        // Remove from objects array
        const index = this.objects.indexOf(mesh);
        if (index > -1) {
            this.objects.splice(index, 1);
        }

        // Deselect if selected
        if (this.selectedObject === mesh) {
            this.deselectAll();
        }
        
        // Remove from multi-selection
        const multiIndex = this.selectedObjects.indexOf(mesh);
        if (multiIndex > -1) {
            this.selectedObjects.splice(multiIndex, 1);
        }

        // Dispose geometry and material
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach(m => m.dispose());
            } else {
                mesh.material.dispose();
            }
        }

        // Emit event
        this.emit('objectRemoved', mesh);

        // Execute callback
        const callback = this.config.get('callbacks.onObjectRemoved');
        if (callback && typeof callback === 'function') {
            callback(mesh);
        }

        // Capture state for undo
        this.captureState(`Delete ${mesh.name}`);

        return true;
    }

    /**
     * Duplicate object
     */
    duplicateObject(mesh) {
        if (!mesh) return null;

        const shapeType = mesh.userData.shapeType;
        const options = {
            color: mesh.userData.color
        };

        // Copy text options if it's a text shape
        if (shapeType === 'text') {
            options.text = mesh.userData.textContent;
            options.font = mesh.userData.textFont;
            options.height = mesh.userData.textHeight;
            options.bevel = mesh.userData.textBevel;
        }

        const duplicate = this.shapeFactory.createShape(shapeType, options);
        
        if (!duplicate) return null;

        // Copy transform
        duplicate.position.copy(mesh.position);
        duplicate.position.x += 0.5; // Offset slightly
        duplicate.rotation.copy(mesh.rotation);
        duplicate.scale.copy(mesh.scale);

        // Add to scene
        this.sceneManager.add(duplicate);
        this.objects.push(duplicate);

        // Emit event
        this.emit('objectAdded', duplicate);

        // Capture state for undo
        this.captureState(`Duplicate ${mesh.name}`);

        return duplicate;
    }

    /**
     * Get all objects
     */
    getAllObjects() {
        return [...this.objects];
    }

    /**
     * Select object
     */
    selectObject(mesh) {
        if (!mesh) return;

        this.selectionManager.select(mesh);
        this.updateSelectionOutlines();

        // Attach transform controls
        if (this.transformControls) {
            this.transformControls.attach(mesh);
        }
    }

    /**
     * Deselect all
     */
    deselectAll() {
        this.selectionManager.clear();
        this.updateSelectionOutlines();

        // Detach transform controls
        if (this.transformControls) {
            this.transformControls.detach();
        }
    }

    /**
     * Update outlines based on selection
     */
    updateSelectionOutlines() {
        // Clear all outlines
        this.outliner.clearAllOutlines();

        // Create outlines for selected objects
        const selected = this.selectionManager.getSelectedObjects();
        if (selected.length > 0) {
            this.outliner.createOutlines(selected);
        }

        // Update internal references for compatibility
        this.selectedObjects = selected;
        this.selectedObject = this.selectionManager.getSelectedObject();

        // Execute callback
        const callback = this.config.get('callbacks.onSelectionChanged');
        if (callback && typeof callback === 'function') {
            callback(selected, []);
        }
    }

    /**
     * Get selected objects
     */
    getSelectedObjects() {
        return [...this.selectedObjects];
    }

    /**
     * Get first selected object
     */
    getSelectedObject() {
        return this.selectedObject;
    }

    /**
     * Set transform mode
     */
    setTransformMode(mode) {
        if (this.transformManager) {
            this.transformManager.setMode(mode);
        }
    }

    /**
     * Get transform mode
     */
    getTransformMode() {
        return this.transformManager ? this.transformManager.getMode() : null;
    }

    /**
     * Set transform space
     */
    setTransformSpace(space) {
        if (this.transformManager) {
            this.transformManager.setSpace(space);
        }
    }

    /**
     * Get transform space
     */
    getTransformSpace() {
        return this.transformManager ? this.transformManager.getSpace() : null;
    }

    /**
     * Set snap unit
     */
    setSnapUnit(value) {
        if (this.snapManager) {
            this.snapManager.setSnapUnit(value);
        }
    }

    /**
     * Get snap unit
     */
    getSnapUnit() {
        return this.snapManager ? this.snapManager.getSnapUnit() : 0;
    }

    /**
     * Toggle snap
     */
    toggleSnap() {
        if (this.snapManager) {
            this.snapManager.toggleSnap();
        }
    }

    /**
     * Group selected objects
     */
    groupSelected() {
        if (!this.groupManager) return null;

        const selected = this.selectionManager.getSelectedObjects();
        
        if (selected.length < 1) {
            console.warn('SWK: No objects selected for grouping');
            return null;
        }

        // Remove outlines from objects being grouped
        this.outliner.removeOutlines(selected);

        // Create group
        const groupContainer = this.groupManager.createGroup(selected);

        if (groupContainer) {
            // Deselect all and select the group
            this.deselectAll();
            this.selectObject(groupContainer);

            // Update internal groups reference
            this.groups = this.groupManager.getAllGroups();
            
            // Capture state for undo
            this.captureState(`Create group ${groupContainer.name}`);
        }

        return groupContainer;
    }

    /**
     * Ungroup selected group
     */
    ungroupSelected() {
        if (!this.groupManager) return null;

        const selected = this.selectionManager.getSelectedObject();

        if (!selected || !this.groupManager.isGroupContainer(selected)) {
            console.warn('SWK: Selected object is not a group');
            return null;
        }

        // Ungroup
        const ungroupedObjects = this.groupManager.ungroup(selected);

        if (ungroupedObjects && ungroupedObjects.length > 0) {
            // Deselect all
            this.deselectAll();

            // Update internal groups reference
            this.groups = this.groupManager.getAllGroups();
            
            // Capture state for undo
            this.captureState(`Ungroup ${selected.name}`);
        }

        return ungroupedObjects;
    }

    /**
     * Check if object is grouped
     */
    isGrouped(object) {
        return this.groupManager ? this.groupManager.isGrouped(object) : false;
    }

    /**
     * Check if object is a group container
     */
    isGroupContainer(object) {
        return this.groupManager ? this.groupManager.isGroupContainer(object) : false;
    }

    /**
     * Get all groups
     */
    getAllGroups() {
        return this.groupManager ? this.groupManager.getAllGroups() : [];
    }

    /**
     * Get group children
     */
    getGroupChildren(groupContainer) {
        return this.groupManager ? this.groupManager.getGroupChildren(groupContainer) : [];
    }

    // ==================== History Methods ====================

    /**
     * Capture current state to history
     * @param {string} description - Description of the action
     */
    captureState(description = 'Action') {
        if (this.historyManager) {
            return this.historyManager.captureState(description);
        }
        return false;
    }

    /**
     * Undo the last action
     * @returns {boolean} Success
     */
    undo() {
        if (this.historyManager) {
            const success = this.historyManager.undo();
            if (success) {
                // Refresh objects list
                this.objects = this.getAllObjects();
                this.groups = this.getAllGroups();
            }
            return success;
        }
        return false;
    }

    /**
     * Redo the last undone action
     * @returns {boolean} Success
     */
    redo() {
        if (this.historyManager) {
            const success = this.historyManager.redo();
            if (success) {
                // Refresh objects list
                this.objects = this.getAllObjects();
                this.groups = this.getAllGroups();
            }
            return success;
        }
        return false;
    }

    /**
     * Check if undo is available
     * @returns {boolean}
     */
    canUndo() {
        return this.historyManager ? this.historyManager.canUndo() : false;
    }

    /**
     * Check if redo is available
     * @returns {boolean}
     */
    canRedo() {
        return this.historyManager ? this.historyManager.canRedo() : false;
    }

    /**
     * Get history statistics
     * @returns {Object}
     */
    getHistoryStats() {
        return this.historyManager ? this.historyManager.getStats() : null;
    }

    /**
     * Clear history
     */
    clearHistory() {
        if (this.historyManager) {
            this.historyManager.clear();
        }
    }

    // ==================== Export Methods ====================

    /**
     * Export scene as GLTF
     * @param {Object} options - Export options
     * @returns {Promise<boolean>}
     */
    async exportGLTF(options = {}) {
        if (!this.exportManager) {
            console.warn('Export manager not initialized');
            return false;
        }
        return await this.exportManager.exportGLTF({ ...options, binary: false });
    }

    /**
     * Export scene as GLB (binary GLTF)
     * @param {Object} options - Export options
     * @returns {Promise<boolean>}
     */
    async exportGLB(options = {}) {
        if (!this.exportManager) {
            console.warn('Export manager not initialized');
            return false;
        }
        return await this.exportManager.exportGLTF({ ...options, binary: true });
    }

    /**
     * Export scene as STL
     * @param {Object} options - Export options
     * @returns {Promise<boolean>}
     */
    async exportSTL(options = {}) {
        if (!this.exportManager) {
            console.warn('Export manager not initialized');
            return false;
        }
        return await this.exportManager.exportSTL(options);
    }

    /**
     * Export selected objects only
     * @param {string} format - Export format ('gltf', 'glb', or 'stl')
     * @param {Object} options - Export options
     * @returns {Promise<boolean>}
     */
    async exportSelected(format = 'gltf', options = {}) {
        if (!this.exportManager) {
            console.warn('Export manager not initialized');
            return false;
        }
        return await this.exportManager.exportSelected(format, options);
    }

    /**
     * Get available export formats
     * @returns {Array<Object>}
     */
    getAvailableExportFormats() {
        if (!this.exportManager) {
            return [];
        }
        return this.exportManager.getAvailableFormats();
    }

    // ==================== Lifecycle Methods ====================

    /**
     * Destroy instance and cleanup
     */
    destroy() {
        // Stop animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Remove event listeners
        const canvas = this.renderer ? this.renderer.getCanvas() : null;
        if (canvas) {
            canvas.removeEventListener('click', this.onCanvasClick.bind(this));
        }
        window.removeEventListener('keydown', this.onKeyDown.bind(this));
        
        // Dispose modules
        if (this.uiManager) this.uiManager.destroy();
        if (this.exportManager) this.exportManager.dispose();
        if (this.groupManager) this.groupManager.clearAllGroups();
        if (this.historyManager) this.historyManager.dispose();
        if (this.transformManager) this.transformManager.dispose();
        if (this.outliner) this.outliner.dispose();
        if (this.lighting) this.lighting.dispose();
        if (this.cameraManager) this.cameraManager.dispose();
        if (this.sceneManager) this.sceneManager.dispose();
        if (this.renderer) this.renderer.dispose();
        
        // Clear references
        this.renderer = null;
        this.sceneManager = null;
        this.cameraManager = null;
        this.lighting = null;
        this.shapeFactory = null;
        this.picker = null;
        this.selectionManager = null;
        this.outliner = null;
        this.transformManager = null;
        this.snapManager = null;
        this.groupManager = null;
        this.historyManager = null;
        this.uiManager = null;
        this.exportManager = null;
        this.controls = null;
        this.transformControls = null;
        this.objects = [];
        this.selectedObjects = [];
        this.selectedObject = null;
        this.groups = [];
        
        // Remove all event listeners
        this.removeAllListeners();
        
        this.initialized = false;
        console.log('SWK: Editor destroyed');
    }
}

/**
 * Auto-initialize on DOM ready
 */
if (typeof window !== 'undefined') {
    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            SWK.autoInit = () => Initializer.autoInit(SWK);
            // Don't auto-init automatically, let user call SWK.autoInit() if needed
        });
    } else {
        SWK.autoInit = () => Initializer.autoInit(SWK);
    }
}

// Export for ES6 modules and UMD
export default SWK;

// For UMD/browser global
if (typeof window !== 'undefined') {
    window.SWK = SWK;
}
