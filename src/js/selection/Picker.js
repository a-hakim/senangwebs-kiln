/**
 * Object picking using raycasting
 */

export default class Picker {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    /**
     * Update mouse position from event
     */
    updateMousePosition(event, canvas) {
        const rect = canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    /**
     * Pick objects at current mouse position
     * @param {Array} objects - Array of THREE.Mesh objects to test
     * @param {boolean} recursive - Whether to check children recursively
     * @returns {THREE.Intersection|null} - First intersection or null
     */
    pick(objects, recursive = false) {
        if (!objects || objects.length === 0) {
            return null;
        }

        // Update raycaster with camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Perform raycast
        const intersects = this.raycaster.intersectObjects(objects, recursive);

        if (intersects.length > 0) {
            return intersects[0];
        }

        return null;
    }

    /**
     * Pick all objects at current mouse position
     * @param {Array} objects - Array of THREE.Mesh objects to test
     * @param {boolean} recursive - Whether to check children recursively
     * @returns {Array} - Array of intersections
     */
    pickAll(objects, recursive = false) {
        if (!objects || objects.length === 0) {
            return [];
        }

        // Update raycaster with camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Perform raycast
        return this.raycaster.intersectObjects(objects, recursive);
    }

    /**
     * Pick object from click event
     * @param {Event} event - Mouse click event
     * @param {HTMLElement} canvas - Canvas element
     * @param {Array} objects - Array of objects to test
     * @param {boolean} recursive - Whether to check children recursively
     * @returns {THREE.Intersection|null}
     */
    pickFromEvent(event, canvas, objects, recursive = false) {
        this.updateMousePosition(event, canvas);
        return this.pick(objects, recursive);
    }

    /**
     * Get mouse position
     */
    getMousePosition() {
        return this.mouse.clone();
    }

    /**
     * Update camera reference
     */
    setCamera(camera) {
        this.camera = camera;
    }
}
