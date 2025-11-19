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
     * Escape HTML for use in attributes
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show properties for a single object
     * @param {THREE.Object3D} object - The selected object
     */
    showSingleObjectProperties(object) {
        const isText = object.userData.shapeType === SHAPE_TYPES.TEXT;
        const isPolygon = object.userData.shapeType === SHAPE_TYPES.POLYGON;
        const isTube = object.userData.shapeType === SHAPE_TYPES.TUBE;
        const isGroup = this.swk.isGroupContainer(object);
        
        this.contentElement.innerHTML = `
            <div class="swk-property-section">
                <div class="swk-property-group">
                    <label class="swk-property-label">Name</label>
                    <input type="text" class="swk-property-input" id="prop-name" value="${object.name}">
                </div>
            </div>
            
            <div class="swk-property-section">
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Position</label>
                    <div class="swk-property-vector">
                        <input type="number" class="swk-property-input" id="prop-pos-x" value="${object.position.x.toFixed(3)}" step="0.1">
                        <input type="number" class="swk-property-input" id="prop-pos-y" value="${object.position.y.toFixed(3)}" step="0.1">
                        <input type="number" class="swk-property-input" id="prop-pos-z" value="${object.position.z.toFixed(3)}" step="0.1">
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
                        <input type="number" class="swk-property-input" id="prop-scale-x" value="${object.scale.x.toFixed(3)}" step="0.1" min="0.01">
                        <input type="number" class="swk-property-input" id="prop-scale-y" value="${object.scale.y.toFixed(3)}" step="0.1" min="0.01">
                        <input type="number" class="swk-property-input" id="prop-scale-z" value="${object.scale.z.toFixed(3)}" step="0.1" min="0.01">
                    </div>
                </div>
            </div>
            
            ${!isGroup ? `
            <div class="swk-property-section">
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Color</label>
                    <div class="swk-property-color-inputs">
                        <input type="color" class="swk-property-input swk-property-color" id="prop-color" value="#${object.material.color.getHexString()}">
                        <input type="text" class="swk-property-input" id="prop-color-hex" value="#${object.material.color.getHexString()}">
                    </div>
                </div>
            </div>
            ` : ''}
            
            ${isText ? `
            <div class="swk-property-section">
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Text</label>
                    <input type="text" class="swk-property-input" id="prop-text" value="${this.escapeHtml(object.userData.textContent || '')}">
                </div>
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Font</label>
                    <select class="swk-property-input" id="prop-font">
                        <option value="sans" ${object.userData.textFont === 'sans' ? 'selected' : ''}>Sans</option>
                        <option value="serif" ${object.userData.textFont === 'serif' ? 'selected' : ''}>Serif</option>
                        <option value="mono" ${object.userData.textFont === 'mono' ? 'selected' : ''}>Monospace</option>
                    </select>
                </div>
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Thickness</label>
                    <input type="number" class="swk-property-input" id="prop-font-size" value="${object.userData.textHeight || 0.2}" step="0.1" min="0.1">
                </div>
            </div>
            ` : ''}

            ${isPolygon ? `
            <div class="swk-property-section">
                
                <div class="swk-property-group">
                    <label class="swk-property-label">Sides</label>
                    <div class="swk-property-range-wrapper">
                        <input type="range" class="swk-property-input swk-property-range" id="prop-polygon-sides" value="${object.userData.polygonSides || 5}" step="1" min="3" max="12">
                        <input type="number" class="swk-property-input swk-property-range-value" id="prop-polygon-sides-value" value="${object.userData.polygonSides || 5}" step="1" min="3" max="12" readonly>
                    </div>
                </div>
            </div>
            ` : ''}
            ${isTube ? `
            <div class="swk-property-section">
                <div class="swk-property-group">
                    <label class="swk-property-label">Hole Radius</label>
                    <input type="number" class="swk-property-input" id="prop-tube-hole" value="${object.userData.holeRadius || 0.25}" step="0.01" min="0.01">
                </div>
                <div class="swk-property-group">
                    <label class="swk-property-label">Length</label>
                    <input type="number" class="swk-property-input" id="prop-tube-length" value="${object.userData.length || 1}" step="0.01" min="0.01">
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
                this.updateTextGeometry(object, e.target.value, object.userData.textFont, object.userData.textHeight, object.userData.textBevel);
            });
        }
        
        // Font type
        const fontInput = document.getElementById('prop-font');
        if (fontInput) {
            fontInput.addEventListener('change', (e) => {
                this.updateTextGeometry(object, object.userData.textContent, e.target.value, object.userData.textHeight, object.userData.textBevel);
            });
        }
        
        // Font size
        const fontSizeInput = document.getElementById('prop-font-size');
        if (fontSizeInput) {
            fontSizeInput.addEventListener('change', (e) => {
                const size = Math.max(0.1, parseFloat(e.target.value) || 0.2);
                this.updateTextGeometry(object, object.userData.textContent, object.userData.textFont, size, object.userData.textBevel);
            });
        }

        // Polygon sides (range + numeric display)
        const polygonRange = document.getElementById('prop-polygon-sides');
        const polygonRangeValue = document.getElementById('prop-polygon-sides-value');
        if (polygonRange) {
            // Update displayed numeric value while sliding
            polygonRange.addEventListener('input', (e) => {
                if (polygonRangeValue) polygonRangeValue.value = e.target.value;
            });

            // Update polygon geometry after user finishes sliding (change event)
            polygonRange.addEventListener('change', (e) => {
                const sides = Math.max(3, Math.min(12, parseInt(e.target.value) || 5));
                if (polygonRangeValue) polygonRangeValue.value = sides;
                // Update stored userData immediately
                object.userData.polygonSides = sides;
                this.updatePolygonGeometry(object, sides);
            });
        }

        // Tube properties (hole radius & length)
        const tubeHoleInput = document.getElementById('prop-tube-hole');
        const tubeLengthInput = document.getElementById('prop-tube-length');
        if (tubeHoleInput) {
            tubeHoleInput.addEventListener('change', (e) => {
                const holeRadius = Math.max(0.01, parseFloat(e.target.value) || 0.25);
                object.userData.holeRadius = holeRadius;
                this.updateTubeGeometry(object, holeRadius, object.userData.length || 1);
            });
        }
        if (tubeLengthInput) {
            tubeLengthInput.addEventListener('change', (e) => {
                const length = Math.max(0.01, parseFloat(e.target.value) || 1);
                object.userData.length = length;
                this.updateTubeGeometry(object, object.userData.holeRadius || 0.25, length);
            });
        }
    }

    /**
     * Update transform fields with current object values
     * Called during real-time transformations
     */
    updateTransformFields() {
        if (this.selectedObjects.length !== 1) return;
        
        const object = this.selectedObjects[0];
        
        // Update position fields
        ['x', 'y', 'z'].forEach(axis => {
            const input = document.getElementById(`prop-pos-${axis}`);
            if (input) {
                input.value = object.position[axis].toFixed(3);
            }
        });
        
        // Update rotation fields (convert radians to degrees)
        ['x', 'y', 'z'].forEach(axis => {
            const input = document.getElementById(`prop-rot-${axis}`);
            if (input) {
                input.value = (object.rotation[axis] * 180 / Math.PI).toFixed(1);
            }
        });
        
        // Update scale fields
        ['x', 'y', 'z'].forEach(axis => {
            const input = document.getElementById(`prop-scale-${axis}`);
            if (input) {
                input.value = object.scale[axis].toFixed(3);
            }
        });
    }

    /**
     * Update text geometry
     * @param {THREE.Object3D} object - Text object
     * @param {string} text - New text content
     * @param {string} font - Font type
     * @param {number} height - Font height/size
     * @param {number} bevel - Bevel size
     */
    async updateTextGeometry(object, text, font, height, bevel) {
        try {
            const shapeFactory = this.swk.shapeFactory;
            if (shapeFactory && typeof shapeFactory.updateTextGeometry === 'function') {
                await shapeFactory.updateTextGeometry(object, text, font, height, bevel);
                
                // Refresh the outline to match the new geometry
                if (this.swk.outliner) {
                    this.swk.outliner.removeOutline(object);
                    this.swk.outliner.createOutline(object);
                }
                
                this.swk.captureState('Update text');
                this.emit('propertyChanged', { object, property: 'text' });
            }
        } catch (error) {
            console.error('Failed to update text:', error);
        }
    }

    /**
     * Update polygon geometry
     * @param {THREE.Object3D} object - Polygon object
     * @param {number} sides - Number of sides
     */
    async updatePolygonGeometry(object, sides) {
        try {
            const shapeFactory = this.swk.shapeFactory;
            if (shapeFactory && typeof shapeFactory.updatePolygonGeometry === 'function') {
                // Store the new sides value in userData
                object.userData.polygonSides = sides;
                await shapeFactory.updatePolygonGeometry(object, sides);
                
                // Refresh the outline to match the new geometry
                if (this.swk.outliner) {
                    this.swk.outliner.removeOutline(object);
                    this.swk.outliner.createOutline(object);
                }
                
                this.swk.captureState('Update polygon');
                this.emit('propertyChanged', { object, property: 'polygonSides' });
            }
        } catch (error) {
            console.error('Failed to update polygon:', error);
        }
    }

    /**
     * Update tube geometry
     * @param {THREE.Object3D} object - The tube object
     * @param {number} holeRadius - Hole radius
     * @param {number} length - Tube length
     */
    async updateTubeGeometry(object, holeRadius, length) {
        try {
            const shapeFactory = this.swk.shapeFactory;
            if (shapeFactory && typeof shapeFactory.updateTubeGeometry === 'function') {
                await shapeFactory.updateTubeGeometry(object, holeRadius, length);

                if (this.swk.outliner) {
                    this.swk.outliner.removeOutline(object);
                    this.swk.outliner.createOutline(object);
                }

                this.swk.captureState('Update tube');
                this.emit('propertyChanged', { object, property: 'tube' });
            }
        } catch (error) {
            console.error('Failed to update tube:', error);
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
