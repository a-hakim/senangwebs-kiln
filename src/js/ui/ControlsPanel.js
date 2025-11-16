/**
 * ControlsPanel.js
 * Bottom toolbar with transform modes, camera controls, history, and export
 */

import EventEmitter from '../core/EventEmitter.js';
import { TRANSFORM_MODES, CAMERA_MODES } from '../utils/Constants.js';

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
                            <span>⇄</span>
                        </button>
                        <button class="swk-control-button" data-mode="rotate" title="Rotate (R)">
                            <span>↻</span>
                        </button>
                        <button class="swk-control-button" data-mode="scale" title="Scale (S)">
                            <span>⇲</span>
                        </button>
                    </div>
                </div>
                
                <!-- Camera Modes -->
                <div class="swk-control-group">
                    <div class="swk-button-group">
                        <button class="swk-control-button active" data-camera="perspective" title="Perspective">
                            <span>🎥</span>
                        </button>
                        <button class="swk-control-button" data-camera="orthographic" title="Orthographic">
                            <span>▦</span>
                        </button>
                    </div>
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
                            <span>↶</span>
                        </button>
                        <button class="swk-control-button" id="swk-redo-btn" title="Redo (Ctrl+Y)" disabled>
                            <span>↷</span>
                        </button>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="swk-control-group">
                    <div class="swk-button-group">
                        <button class="swk-control-button" id="swk-group-btn" title="Group Selected">
                            <span>⊞</span>
                        </button>
                        <button class="swk-control-button" id="swk-ungroup-btn" title="Ungroup">
                            <span>⊟</span>
                        </button>
                        <button class="swk-control-button" id="swk-duplicate-btn" title="Duplicate">
                            <span>⧉</span>
                        </button>
                        <button class="swk-control-button swk-control-button-danger" id="swk-delete-btn" title="Delete">
                            <span>🗑</span>
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
            exportGltfBtn.addEventListener('click', () => this.exportGLTF());
        }
        
        const exportStlBtn = document.getElementById('swk-export-stl-btn');
        if (exportStlBtn) {
            exportStlBtn.addEventListener('click', () => this.exportSTL());
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
    }

    /**
     * Clean up
     */
    destroy() {
        this.removeAllListeners();
    }
}

export default ControlsPanel;
