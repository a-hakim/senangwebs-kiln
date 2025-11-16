/**
 * PropertyPanel.js
 * Property editor panel for selected objects
 * Shows and allows editing of position, rotation, scale, color, and text properties
 */

import EventEmitter from '../core/EventEmitter.js';
import { SHAPE_TYPES } from '../utils/Constants.js';

class PropertyPanel extends EventEmitter {
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
        
        this.selectedObjects = [];
        this.isUpdating = false; // Prevent feedback loops
    }

    /**
     * Render the property panel
     */
    render() {
        this.container.innerHTML = `
            <div class="swk-panel-header">
                <h3>Properties</h3>
            </div>
            <div class="swk-panel-content" id="swk-property-content">
                <div class="swk-property-empty">
                    <p>No object selected</p>
                    <small>Select an object to edit its properties</small>
                </div>
            </div>
        `;
        
        this.contentElement = document.getElementById('swk-property-content');
    }

    /**
     * Update the panel when selection changes
     * @param {Array} selectedObjects - Array of selected objects
     */
    updateSelection(selectedObjects) {
        this.selectedObjects = selectedObjects;
        this.refresh();
    }

    /**
     * Refresh the property panel content
     */
    refresh() {
        if (!this.contentElement) return;
        
        if (this.selectedObjects.length === 0) {
            this.showEmptyState();
        } else if (this.selectedObjects.length === 1) {
            this.showSingleObjectProperties(this.selectedObjects[0]);
        } else {
            this.showMultipleObjectsProperties(this.selectedObjects);
        }
    }

    /**
     * Show empty state
     */
    showEmptyState() {
        this.contentElement.innerHTML = `
            <div class="swk-property-empty">
                <p>No object selected</p>
                <small>Select an object to edit its properties</small>
            </div>
        `;
    }

    /**
     * Show properties for a single object
     * @param {THREE.Object3D} object - The selected object
     */
    showSingleObjectProperties(object) {
        const isText = object.userData.shapeType === SHAPE_TYPES.TEXT;
        const isGroup = this.swk.isGroupContainer(object);
        
        this.contentElement.innerHTML = `
            <div class="swk-property-section">
                <div class="swk-property-group">
                    <label class="swk-property-label">Name</label>
                    <input type="text" class="swk-property-input" id="prop-name" value="${object.name}">
                </div>
            </div>
            
            <div class="swk-property-section">
                <h4 class="swk-property-section-title">Transform</h4>
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Position</label>
                    <div class="swk-property-vector">
                        <input type="number" class="swk-property-input" id="prop-pos-x" value="${object.position.x.toFixed(2)}" step="0.1">
                        <input type="number" class="swk-property-input" id="prop-pos-y" value="${object.position.y.toFixed(2)}" step="0.1">
                        <input type="number" class="swk-property-input" id="prop-pos-z" value="${object.position.z.toFixed(2)}" step="0.1">
                    </div>
                </div>
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Rotation (°)</label>
                    <div class="swk-property-vector">
                        <input type="number" class="swk-property-input" id="prop-rot-x" value="${(object.rotation.x * 180 / Math.PI).toFixed(1)}" step="1">
                        <input type="number" class="swk-property-input" id="prop-rot-y" value="${(object.rotation.y * 180 / Math.PI).toFixed(1)}" step="1">
                        <input type="number" class="swk-property-input" id="prop-rot-z" value="${(object.rotation.z * 180 / Math.PI).toFixed(1)}" step="1">
                    </div>
                </div>
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Scale</label>
                    <div class="swk-property-vector">
                        <input type="number" class="swk-property-input" id="prop-scale-x" value="${object.scale.x.toFixed(2)}" step="0.1" min="0.01">
                        <input type="number" class="swk-property-input" id="prop-scale-y" value="${object.scale.y.toFixed(2)}" step="0.1" min="0.01">
                        <input type="number" class="swk-property-input" id="prop-scale-z" value="${object.scale.z.toFixed(2)}" step="0.1" min="0.01">
                    </div>
                </div>
            </div>
            
            ${!isGroup ? `
            <div class="swk-property-section">
                <h4 class="swk-property-section-title">Material</h4>
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Color</label>
                    <input type="color" class="swk-property-input swk-property-color" id="prop-color" value="#${object.material.color.getHexString()}">
                </div>
            </div>
            ` : ''}
            
            ${isText ? `
            <div class="swk-property-section">
                <h4 class="swk-property-section-title">Text</h4>
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Content</label>
                    <input type="text" class="swk-property-input" id="prop-text" value="${object.userData.text || ''}">
                </div>
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Font</label>
                    <select class="swk-property-input" id="prop-font">
                        <option value="sans" ${object.userData.fontType === 'sans' ? 'selected' : ''}>Sans Serif</option>
                        <option value="serif" ${object.userData.fontType === 'serif' ? 'selected' : ''}>Serif</option>
                        <option value="mono" ${object.userData.fontType === 'mono' ? 'selected' : ''}>Monospace</option>
                    </select>
                </div>
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Size</label>
                    <input type="number" class="swk-property-input" id="prop-font-size" value="${object.userData.fontSize || 1}" step="0.1" min="0.1">
                </div>
            </div>
            ` : ''}
        `;
        
        this.attachEventListeners(object);
    }

    /**
     * Show properties for multiple objects
     * @param {Array} objects - Array of selected objects
     */
    showMultipleObjectsProperties(objects) {
        this.contentElement.innerHTML = `
            <div class="swk-property-section">
                <div class="swk-property-group">
                    <label class="swk-property-label">Selection</label>
                    <input type="text" class="swk-property-input" readonly value="${objects.length} objects selected">
                </div>
            </div>
            
            <div class="swk-property-section">
                <p class="swk-property-note">Multiple objects selected. Transform operations will affect all selected objects.</p>
            </div>
        `;
    }

    /**
     * Attach event listeners to property inputs
     * @param {THREE.Object3D} object - The object being edited
     */
    attachEventListeners(object) {
        // Name
        const nameInput = document.getElementById('prop-name');
        if (nameInput) {
            nameInput.addEventListener('change', (e) => {
                object.name = e.target.value;
                this.swk.captureState('Change name');
                this.emit('propertyChanged', { object, property: 'name', value: e.target.value });
            });
        }
        
        // Position
        ['x', 'y', 'z'].forEach(axis => {
            const input = document.getElementById(`prop-pos-${axis}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    object.position[axis] = parseFloat(e.target.value) || 0;
                    this.swk.captureState('Change position');
                    this.emit('propertyChanged', { object, property: 'position', axis, value: object.position[axis] });
                });
            }
        });
        
        // Rotation (convert degrees to radians)
        ['x', 'y', 'z'].forEach(axis => {
            const input = document.getElementById(`prop-rot-${axis}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    const degrees = parseFloat(e.target.value) || 0;
                    object.rotation[axis] = degrees * Math.PI / 180;
                    this.swk.captureState('Change rotation');
                    this.emit('propertyChanged', { object, property: 'rotation', axis, value: object.rotation[axis] });
                });
            }
        });
        
        // Scale
        ['x', 'y', 'z'].forEach(axis => {
            const input = document.getElementById(`prop-scale-${axis}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    const value = parseFloat(e.target.value) || 0.01;
                    object.scale[axis] = Math.max(0.01, value);
                    this.swk.captureState('Change scale');
                    this.emit('propertyChanged', { object, property: 'scale', axis, value: object.scale[axis] });
                });
            }
        });
        
        // Color
        const colorInput = document.getElementById('prop-color');
        if (colorInput && object.material) {
            colorInput.addEventListener('change', (e) => {
                object.material.color.set(e.target.value);
                this.swk.captureState('Change color');
                this.emit('propertyChanged', { object, property: 'color', value: e.target.value });
            });
        }
        
        // Text content
        const textInput = document.getElementById('prop-text');
        if (textInput) {
            textInput.addEventListener('change', (e) => {
                this.updateTextGeometry(object, e.target.value, object.userData.fontSize, object.userData.fontType);
            });
        }
        
        // Font type
        const fontInput = document.getElementById('prop-font');
        if (fontInput) {
            fontInput.addEventListener('change', (e) => {
                this.updateTextGeometry(object, object.userData.text, object.userData.fontSize, e.target.value);
            });
        }
        
        // Font size
        const fontSizeInput = document.getElementById('prop-font-size');
        if (fontSizeInput) {
            fontSizeInput.addEventListener('change', (e) => {
                const size = Math.max(0.1, parseFloat(e.target.value) || 1);
                this.updateTextGeometry(object, object.userData.text, size, object.userData.fontType);
            });
        }
    }

    /**
     * Update text geometry
     * @param {THREE.Object3D} object - Text object
     * @param {string} text - New text content
     * @param {number} fontSize - Font size
     * @param {string} fontType - Font type
     */
    async updateTextGeometry(object, text, fontSize, fontType) {
        try {
            const shapeFactory = this.swk.shapeFactory;
            if (shapeFactory && typeof shapeFactory.updateTextGeometry === 'function') {
                await shapeFactory.updateTextGeometry(object, text, fontSize, fontType);
                this.swk.captureState('Update text');
                this.emit('propertyChanged', { object, property: 'text' });
            }
        } catch (error) {
            console.error('Failed to update text:', error);
        }
    }

    /**
     * Clean up
     */
    destroy() {
        this.selectedObjects = [];
        this.removeAllListeners();
    }
}

export default PropertyPanel;
