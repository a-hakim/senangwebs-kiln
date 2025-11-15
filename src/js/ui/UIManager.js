/**
 * UIManager.js
 * Central coordinator for all UI panels and components
 * Manages initialization, event coordination, and panel lifecycle
 */

import EventEmitter from '../core/EventEmitter.js';
import PropertyPanel from './PropertyPanel.js';
import ShapesPanel from './ShapesPanel.js';
import OutlinerPanel from './OutlinerPanel.js';
import ControlsPanel from './ControlsPanel.js';

class UIManager extends EventEmitter {
    /**
     * @param {HTMLElement} container - Main container element
     * @param {SWK} swkInstance - Main SWK instance
     * @param {Object} config - Configuration object
     */
    constructor(container, swkInstance, config) {
        super();
        
        this.container = container;
        this.swk = swkInstance;
        this.config = config;
        
        // UI Panels
        this.propertyPanel = null;
        this.shapesPanel = null;
        this.outlinerPanel = null;
        this.controlsPanel = null;
        
        // UI State
        this.isInitialized = false;
        this.uiElements = {};
        
        // Check if UI should be enabled
        this.uiEnabled = config.get('ui.enabled') !== false;
        
        if (this.uiEnabled) {
            this.initialize();
        }
    }

    /**
     * Initialize all UI panels
     */
    initialize() {
        if (this.isInitialized) return;
        
        try {
            // Create main UI structure
            this.createUIStructure();
            
            // Initialize panels
            this.initializePanels();
            
            // Set up event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            this.emit('uiInitialized');
            
        } catch (error) {
            console.error('Failed to initialize UI:', error);
        }
    }

    /**
     * Create the main UI structure
     */
    createUIStructure() {
        // Add UI wrapper class to container
        this.container.classList.add('swk-ui-container');
        
        // Create UI wrapper
        const uiWrapper = document.createElement('div');
        uiWrapper.className = 'swk-ui-wrapper';
        
        // Create left sidebar
        const leftSidebar = document.createElement('div');
        leftSidebar.className = 'swk-sidebar swk-sidebar-left';
        leftSidebar.innerHTML = `
            <div id="swk-shapes-panel" class="swk-panel"></div>
            <div id="swk-property-panel" class="swk-panel"></div>
        `;
        
        // Create right sidebar
        const rightSidebar = document.createElement('div');
        rightSidebar.className = 'swk-sidebar swk-sidebar-right';
        rightSidebar.innerHTML = `
            <div id="swk-outliner-panel" class="swk-panel"></div>
        `;
        
        // Create bottom toolbar
        const bottomToolbar = document.createElement('div');
        bottomToolbar.className = 'swk-toolbar swk-toolbar-bottom';
        bottomToolbar.innerHTML = `
            <div id="swk-controls-panel" class="swk-panel"></div>
        `;
        
        // Append to wrapper
        uiWrapper.appendChild(leftSidebar);
        uiWrapper.appendChild(rightSidebar);
        uiWrapper.appendChild(bottomToolbar);
        
        // Append to container
        this.container.appendChild(uiWrapper);
        
        // Store references
        this.uiElements = {
            wrapper: uiWrapper,
            leftSidebar,
            rightSidebar,
            bottomToolbar,
            shapesPanel: document.getElementById('swk-shapes-panel'),
            propertyPanel: document.getElementById('swk-property-panel'),
            outlinerPanel: document.getElementById('swk-outliner-panel'),
            controlsPanel: document.getElementById('swk-controls-panel')
        };
    }

    /**
     * Initialize all UI panels
     */
    initializePanels() {
        // Initialize Shapes Panel
        if (this.config.get('ui.panels.shapes') !== false) {
            this.shapesPanel = new ShapesPanel(
                this.uiElements.shapesPanel,
                this.swk,
                this.config
            );
            this.shapesPanel.render();
        }
        
        // Initialize Property Panel
        if (this.config.get('ui.panels.properties') !== false) {
            this.propertyPanel = new PropertyPanel(
                this.uiElements.propertyPanel,
                this.swk,
                this.config
            );
            this.propertyPanel.render();
        }
        
        // Initialize Outliner Panel
        if (this.config.get('ui.panels.outliner') !== false) {
            this.outlinerPanel = new OutlinerPanel(
                this.uiElements.outlinerPanel,
                this.swk,
                this.config
            );
            this.outlinerPanel.render();
        }
        
        // Initialize Controls Panel
        if (this.config.get('ui.panels.controls') !== false) {
            this.controlsPanel = new ControlsPanel(
                this.uiElements.controlsPanel,
                this.swk,
                this.config
            );
            this.controlsPanel.render();
        }
    }

    /**
     * Set up event listeners for coordination between panels
     */
    setupEventListeners() {
        // Selection changes
        this.swk.on('selectionChanged', (selected) => {
            if (this.propertyPanel) {
                this.propertyPanel.updateSelection(selected);
            }
            if (this.outlinerPanel) {
                this.outlinerPanel.updateSelection(selected);
            }
        });
        
        // Object added
        this.swk.on('objectAdded', (object) => {
            if (this.outlinerPanel) {
                this.outlinerPanel.addObject(object);
            }
        });
        
        // Object removed
        this.swk.on('objectRemoved', (object) => {
            if (this.outlinerPanel) {
                this.outlinerPanel.removeObject(object);
            }
            if (this.propertyPanel) {
                this.propertyPanel.updateSelection([]);
            }
        });
        
        // Transform mode changed
        this.swk.on('transformModeChanged', (mode) => {
            if (this.controlsPanel) {
                this.controlsPanel.updateTransformMode(mode);
            }
        });
        
        // Camera mode changed
        this.swk.on('cameraModeChanged', (mode) => {
            if (this.controlsPanel) {
                this.controlsPanel.updateCameraMode(mode);
            }
        });
        
        // History changed
        this.swk.on('historyChanged', (data) => {
            if (this.controlsPanel) {
                this.controlsPanel.updateHistoryState(data);
            }
            if (this.outlinerPanel) {
                this.outlinerPanel.refresh();
            }
        });
        
        // Group created/removed
        this.swk.on('groupCreated', () => {
            if (this.outlinerPanel) {
                this.outlinerPanel.refresh();
            }
        });
        
        this.swk.on('groupRemoved', () => {
            if (this.outlinerPanel) {
                this.outlinerPanel.refresh();
            }
        });
    }

    /**
     * Show the UI
     */
    show() {
        if (this.uiElements.wrapper) {
            this.uiElements.wrapper.style.display = '';
        }
    }

    /**
     * Hide the UI
     */
    hide() {
        if (this.uiElements.wrapper) {
            this.uiElements.wrapper.style.display = 'none';
        }
    }

    /**
     * Toggle UI visibility
     */
    toggle() {
        if (this.uiElements.wrapper) {
            const isHidden = this.uiElements.wrapper.style.display === 'none';
            if (isHidden) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    /**
     * Update a specific panel
     * @param {string} panelName - Name of the panel to update
     */
    updatePanel(panelName) {
        const panel = this[`${panelName}Panel`];
        if (panel && typeof panel.refresh === 'function') {
            panel.refresh();
        }
    }

    /**
     * Clean up UI and remove event listeners
     */
    destroy() {
        // Destroy all panels
        if (this.shapesPanel) this.shapesPanel.destroy();
        if (this.propertyPanel) this.propertyPanel.destroy();
        if (this.outlinerPanel) this.outlinerPanel.destroy();
        if (this.controlsPanel) this.controlsPanel.destroy();
        
        // Remove UI elements
        if (this.uiElements.wrapper && this.uiElements.wrapper.parentNode) {
            this.uiElements.wrapper.parentNode.removeChild(this.uiElements.wrapper);
        }
        
        // Clear references
        this.uiElements = {};
        this.propertyPanel = null;
        this.shapesPanel = null;
        this.outlinerPanel = null;
        this.controlsPanel = null;
        
        // Remove all listeners
        this.removeAllListeners();
        
        this.isInitialized = false;
    }
}

export default UIManager;
