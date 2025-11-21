/**
 * ControlsPanel.js
 * Bottom toolbar with transform modes, camera controls, history, and export
 */

import EventEmitter from '../core/EventEmitter.js';
import { TRANSFORM_MODES, CAMERA_MODES, VIEW_ORIENTATIONS } from '../utils/Constants.js';

class ControlsPanel extends EventEmitter {
    /**
     * @param {HTMLElement} container - Panel container element
     * @param {SWK} swkInstance - Main SWK instance
     * @param {Object} config - Configuration object
     */
    constructor(container, swkInstance, config) {
        super();
        
        this.container = container;
        this.swk = swkInstance;
        this.config = config;
    }

    /**
     * Render the controls panel
     */
    render() {
        this.container.innerHTML = `
            <div class="swk-controls-toolbar">
                <!-- Transform Modes -->
                <div class="swk-control-group">
                    <div class="swk-button-group">
                        <button class="swk-control-button active" data-mode="translate" title="Translate (T)">
                            <span><i class="fas fa-arrows-alt"></i></span>
                        </button>
                        <button class="swk-control-button" data-mode="rotate" title="Rotate (R)">
                            <span><i class="fas fa-redo"></i></span>
                        </button>
                        <button class="swk-control-button" data-mode="scale" title="Scale (S)">
                            <span><i class="fas fa-expand-arrows-alt"></i></span>
                        </button>
                    </div>
                </div>
                
                <!-- Camera Modes -->
                <div class="swk-control-group" style="flex-direction: row;">
                    <div class="swk-button-group">
                        <button class="swk-control-button active" data-camera="perspective" title="Perspective">
                            <span><i class="fas fa-video"></i></span>
                        </button>
                        <button class="swk-control-button" data-camera="orthographic" title="Orthographic">
                            <span><i class="fas fa-th"></i></span>
                        </button>
                    </div>
                    <select class="swk-control-select" id="swk-view-select" style="width: auto;">
                        <option value="" disabled selected>View</option>
                        ${Object.entries(VIEW_ORIENTATIONS).map(([key, value]) => `<option value="${key}">${value.name}</option>`).join('')}
                    </select>
                </div>
                
                <!-- Snap Settings -->
                <div class="swk-control-group">
                    <select class="swk-control-select" id="swk-snap-select">
                        <option value="0">Off</option>
                        <option value="0.01">0.01</option>
                        <option value="0.025">0.025</option>
                        <option value="0.05">0.05</option>
                        <option value="0.1" selected>0.1</option>
                        <option value="0.2">0.2</option>
                        <option value="0.5">0.5</option>
                    </select>
                </div>
                
                <!-- History -->
                <div class="swk-control-group">
                    <div class="swk-button-group">
                        <button class="swk-control-button" id="swk-undo-btn" title="Undo (Ctrl+Z)" disabled>
                            <span><i class="fas fa-undo"></i></span>
                        </button>
                        <button class="swk-control-button" id="swk-redo-btn" title="Redo (Ctrl+Y)" disabled>
                            <span><i class="fas fa-redo"></i></span>
                        </button>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="swk-control-group">
                    <div class="swk-button-group">
                        <button class="swk-control-button" id="swk-group-btn" title="Group Selected">
                            <span><i class="fas fa-object-group"></i></span>
                        </button>
                        <button class="swk-control-button" id="swk-ungroup-btn" title="Ungroup">
                            <span><i class="fas fa-object-ungroup"></i></span>
                        </button>
                        <button class="swk-control-button" id="swk-duplicate-btn" title="Duplicate">
                            <span><i class="fas fa-copy"></i></span>
                        </button>
                        <button class="swk-control-button swk-control-button-danger" id="swk-delete-btn" title="Delete">
                            <span><i class="fas fa-trash"></i></span>
                        </button>
                    </div>
                </div>
                
                <!-- Export -->
                <div class="swk-control-group">
                    <div class="swk-button-group">
                        <button class="swk-control-button" id="swk-export-gltf-btn" title="Export GLTF">
                            <span>GLTF</span>
                        </button>
                        <button class="swk-control-button" id="swk-export-stl-btn" title="Export STL">
                            <span>STL</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.attachEventListeners();
    }

    /**
     * Attach event listeners to controls
     */
    attachEventListeners() {
        // Transform mode buttons
        const transformButtons = this.container.querySelectorAll('[data-mode]');
        transformButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-mode');
                this.swk.setTransformMode(mode);
            });
        });
        
        // Camera mode buttons
        const cameraButtons = this.container.querySelectorAll('[data-camera]');
        cameraButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-camera');
                this.swk.setCameraMode(mode);
            });
        });
        
        // View select
        const viewSelect = document.getElementById('swk-view-select');
        if (viewSelect) {
            viewSelect.addEventListener('change', (e) => {
                const view = e.target.value;
                this.swk.setCameraView(view);
                // Reset selection to title
                e.target.value = "";
            });
        }

        // Snap select
        const snapSelect = document.getElementById('swk-snap-select');
        if (snapSelect) {
            snapSelect.addEventListener('change', (e) => {
                const value = parseFloat(e.target.value);
                this.swk.setSnapUnit(value);
            });
        }
        
        // History buttons
        const undoBtn = document.getElementById('swk-undo-btn');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => this.swk.undo());
        }
        
        const redoBtn = document.getElementById('swk-redo-btn');
        if (redoBtn) {
            redoBtn.addEventListener('click', () => this.swk.redo());
        }
        
        // Action buttons
        const groupBtn = document.getElementById('swk-group-btn');
        if (groupBtn) {
            groupBtn.addEventListener('click', () => this.swk.groupSelected());
        }
        
        const ungroupBtn = document.getElementById('swk-ungroup-btn');
        if (ungroupBtn) {
            ungroupBtn.addEventListener('click', () => this.swk.ungroupSelected());
        }
        
        const duplicateBtn = document.getElementById('swk-duplicate-btn');
        if (duplicateBtn) {
            duplicateBtn.addEventListener('click', () => this.swk.duplicateObject());
        }
        
        const deleteBtn = document.getElementById('swk-delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.swk.deleteObject());
        }
        
        // Export buttons
        const exportGltfBtn = document.getElementById('swk-export-gltf-btn');
        if (exportGltfBtn) {
            exportGltfBtn.addEventListener('click', () => this.swk.exportGLTF());
        }
        
        const exportStlBtn = document.getElementById('swk-export-stl-btn');
        if (exportStlBtn) {
            exportStlBtn.addEventListener('click', () => this.swk.exportSTL());
        }
    }

    /**
     * Update transform mode buttons
     * @param {string} mode - Current transform mode
     */
    updateTransformMode(mode) {
        const buttons = this.container.querySelectorAll('[data-mode]');
        buttons.forEach(btn => {
            if (btn.getAttribute('data-mode') === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Update camera mode buttons
     * @param {string} mode - Current camera mode
     */
    updateCameraMode(mode) {
        const buttons = this.container.querySelectorAll('[data-camera]');
        buttons.forEach(btn => {
            if (btn.getAttribute('data-camera') === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Update history button states
     * @param {Object} data - History state data
     */
    updateHistoryState(data) {
        const undoBtn = document.getElementById('swk-undo-btn');
        const redoBtn = document.getElementById('swk-redo-btn');
        
        if (undoBtn) {
            undoBtn.disabled = !data.canUndo;
        }
        
        if (redoBtn) {
            redoBtn.disabled = !data.canRedo;
        }
    }

    /**
     * Update action button states based on selection
     * @param {Array} selectedObjects - Currently selected objects
     */
    updateActionButtonStates(selectedObjects) {
        const groupBtn = document.getElementById('swk-group-btn');
        const ungroupBtn = document.getElementById('swk-ungroup-btn');
        const duplicateBtn = document.getElementById('swk-duplicate-btn');
        const deleteBtn = document.getElementById('swk-delete-btn');
        
        const selectionCount = selectedObjects.length;
        
        // Check if objects are groups or regular shapes
        const groups = selectedObjects.filter(obj => this.swk.groupManager.isGroupContainer(obj));
        const hasGroups = groups.length > 0;
        
        // Group button rules:
        // - Enabled if 2+ objects selected
        // - Disabled if any groups are in the selection (prevents nesting)
        if (groupBtn) {
            groupBtn.disabled = selectionCount < 2 || hasGroups;
        }
        
        // Ungroup button rules:
        // - Enabled only if exactly 1 group is selected
        if (ungroupBtn) {
            ungroupBtn.disabled = !(selectionCount === 1 && hasGroups);
        }
        
        // Duplicate and delete buttons
        // - Enabled if at least 1 object is selected
        if (duplicateBtn) {
            duplicateBtn.disabled = selectionCount === 0;
        }
        
        if (deleteBtn) {
            deleteBtn.disabled = selectionCount === 0;
        }
    }

    /**
     * Export scene as GLTF
     */
    async exportGLTF() {
        try {
            const success = await this.swk.exportGLTF();
            if (success) {
                console.log('✅ GLTF export completed');
            } else {
                console.warn('⚠️ GLTF export failed or cancelled');
            }
        } catch (error) {
            console.error('❌ Failed to export GLTF:', error);
        }
    }

    /**
     * Export scene as STL
     */
    async exportSTL() {
        try {
            const success = await this.swk.exportSTL();
            if (success) {
                console.log('✅ STL export completed');
            } else {
                console.warn('⚠️ STL export failed or cancelled');
            }
        } catch (error) {
            console.error('❌ Failed to export STL:', error);
        }
    }

    /**
     * Refresh the panel
     */
    refresh() {
        // Update button states based on current state
        this.updateTransformMode(this.swk.transformManager.getMode());
        this.updateCameraMode(this.swk.cameraManager.getMode());
        
        if (this.swk.historyManager) {
            this.updateHistoryState({
                canUndo: this.swk.canUndo(),
                canRedo: this.swk.canRedo()
            });
        }
        
        // Update action button states based on selection
        const selectedObjects = this.swk.getSelectedObjects();
        this.updateActionButtonStates(selectedObjects);
    }

    /**
     * Update selection state (called from UIManager)
     * @param {Array} selectedObjects - Currently selected objects
     */
    updateSelection(selectedObjects) {
        this.updateActionButtonStates(selectedObjects);
    }

    /**
     * Clean up
     */
    destroy() {
        this.removeAllListeners();
    }
}

export default ControlsPanel;
