/**
 * THREE.js Scene management with grid
 */

export default class Scene {
    constructor(config) {
        this.config = config;
        this.scene = null;
        this.gridHelper = null;
        
        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Add grid if enabled
        if (this.config.get('grid.show')) {
            this.createGrid();
        }
    }

    /**
     * Create grid helper
     */
    createGrid() {
        const size = this.config.get('grid.size');
        const divisions = this.config.get('grid.divisions');
        const centerColor = this.hexToNumber(this.config.get('grid.centerColor'));
        const linesColor = this.hexToNumber(this.config.get('grid.linesColor'));
        
        this.gridHelper = new THREE.GridHelper(size, divisions, centerColor, linesColor);
        this.scene.add(this.gridHelper);
    }

    /**
     * Convert hex string to number
     */
    hexToNumber(hex) {
        return parseInt(hex.replace('#', ''), 16);
    }

    /**
     * Get scene instance
     */
    getScene() {
        return this.scene;
    }

    /**
     * Add object to scene
     */
    add(object) {
        this.scene.add(object);
    }

    /**
     * Remove object from scene
     */
    remove(object) {
        this.scene.remove(object);
    }

    /**
     * Show grid
     */
    showGrid() {
        if (!this.gridHelper) {
            this.createGrid();
        } else {
            this.gridHelper.visible = true;
        }
    }

    /**
     * Hide grid
     */
    hideGrid() {
        if (this.gridHelper) {
            this.gridHelper.visible = false;
        }
    }

    /**
     * Toggle grid visibility
     */
    toggleGrid() {
        if (this.gridHelper) {
            this.gridHelper.visible = !this.gridHelper.visible;
        }
    }

    /**
     * Dispose scene
     */
    dispose() {
        if (this.gridHelper) {
            this.scene.remove(this.gridHelper);
            this.gridHelper.geometry.dispose();
            this.gridHelper.material.dispose();
        }
    }
}
