/**
 * ShapesPanel.js
 * Shape creation panel with buttons for all shape types
 */

import EventEmitter from '../core/EventEmitter.js';
import { SHAPE_TYPES } from '../utils/Constants.js';

class ShapesPanel extends EventEmitter {
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
        
        this.shapes = [
            { type: SHAPE_TYPES.BOX, label: 'Box', icon: '▢' },
            { type: SHAPE_TYPES.SPHERE, label: 'Sphere', icon: '●' },
            { type: SHAPE_TYPES.CYLINDER, label: 'Cylinder', icon: '⬬' },
            { type: SHAPE_TYPES.CONE, label: 'Cone', icon: '▲' },
            { type: SHAPE_TYPES.TORUS, label: 'Torus', icon: '◯' },
            { type: SHAPE_TYPES.PLANE, label: 'Plane', icon: '▭' },
            { type: SHAPE_TYPES.PYRAMID, label: 'Pyramid', icon: '△' },
            { type: SHAPE_TYPES.TORUS_KNOT, label: 'Torus Knot', icon: '⚭' },
            { type: SHAPE_TYPES.TETRAHEDRON, label: 'Tetrahedron', icon: '◊' },
            { type: SHAPE_TYPES.OCTAHEDRON, label: 'Octahedron', icon: '◈' },
            { type: SHAPE_TYPES.ICOSAHEDRON, label: 'Icosahedron', icon: '⬟' },
            { type: SHAPE_TYPES.DODECAHEDRON, label: 'Dodecahedron', icon: '⬢' },
            { type: SHAPE_TYPES.TEXT, label: 'Text', icon: 'T' }
        ];
    }

    /**
     * Render the shapes panel
     */
    render() {
        this.container.innerHTML = `
            <div class="swk-panel-header">
                <h3>Shapes</h3>
            </div>
            <div class="swk-panel-content">
                <div class="swk-shapes-grid" id="swk-shapes-grid"></div>
            </div>
        `;
        
        const grid = document.getElementById('swk-shapes-grid');
        
        // Create shape buttons
        this.shapes.forEach(shape => {
            const button = document.createElement('button');
            button.className = 'swk-shape-button';
            button.setAttribute('data-shape-type', shape.type);
            button.title = shape.label;
            button.innerHTML = `
                <span class="swk-shape-icon">${shape.icon}</span>
                <span class="swk-shape-label">${shape.label}</span>
            `;
            
            button.addEventListener('click', () => this.createShape(shape.type));
            
            grid.appendChild(button);
        });
    }

    /**
     * Create a shape
     * @param {string} type - Shape type
     */
    async createShape(type) {
        try {
            let options = {};
            
            // Special handling for text
            if (type === SHAPE_TYPES.TEXT) {
                options = { text: 'Hello! Text' };
            }
            
            const shape = await this.swk.addShape(type, options);
            
            if (shape) {
                // Select the newly created shape
                this.swk.selectObject(shape);
                
                this.emit('shapeCreated', { type, shape });
            }
        } catch (error) {
            console.error('Failed to create shape:', error);
        }
    }

    /**
     * Refresh the panel
     */
    refresh() {
        // Nothing to refresh for static buttons
    }

    /**
     * Clean up
     */
    destroy() {
        this.removeAllListeners();
    }
}

export default ShapesPanel;
