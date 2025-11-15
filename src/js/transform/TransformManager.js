/**
 * Transform controls manager with mode switching
 */

import { TRANSFORM_MODES } from '../utils/Constants.js';

export default class TransformManager {
    constructor(camera, canvas, scene, config, eventEmitter) {
        this.camera = camera;
        this.canvas = canvas;
        this.scene = scene;
        this.config = config;
        this.eventEmitter = eventEmitter;
        
        this.transformControls = null;
        this.currentMode = config.get('transform.mode');
        this.currentSpace = config.get('transform.space');
        
        this.init();
    }

    /**
     * Initialize transform controls
     */
    init() {
        this.transformControls = new THREE.TransformControls(this.camera, this.canvas);
        
        // Set initial mode and space
        this.transformControls.setMode(this.currentMode);
        this.transformControls.setSpace(this.currentSpace);
        
        // Add to scene
        this.scene.add(this.transformControls);
        
        // Listen to transform events
        this.transformControls.addEventListener('change', this.onChange.bind(this));
        this.transformControls.addEventListener('dragging-changed', this.onDraggingChanged.bind(this));
        this.transformControls.addEventListener('objectChange', this.onObjectChange.bind(this));
    }

    /**
     * Handle transform change
     */
    onChange() {
        // Emit transform event
        this.eventEmitter.emit('transform');
    }

    /**
     * Handle dragging state change
     */
    onDraggingChanged(event) {
        // Emit dragging event
        this.eventEmitter.emit('transformDragging', event.value);
        
        // Disable/enable orbit controls
        this.eventEmitter.emit('orbitControlsEnabled', !event.value);
    }

    /**
     * Handle object change
     */
    onObjectChange() {
        const object = this.transformControls.object;
        if (object) {
            this.eventEmitter.emit('objectTransformed', object);
            
            // Execute callback
            const callback = this.config.get('callbacks.onTransformChange');
            if (callback && typeof callback === 'function') {
                callback(object);
            }
        }
    }

    /**
     * Set transform mode
     */
    setMode(mode) {
        if (!Object.values(TRANSFORM_MODES).includes(mode)) {
            console.warn(`SWK: Invalid transform mode: ${mode}`);
            return;
        }

        this.currentMode = mode;
        this.transformControls.setMode(mode);
        this.config.set('transform.mode', mode);
        this.eventEmitter.emit('transformModeChanged', mode);
    }

    /**
     * Get current mode
     */
    getMode() {
        return this.currentMode;
    }

    /**
     * Set transform space
     */
    setSpace(space) {
        if (space !== 'local' && space !== 'world') {
            console.warn(`SWK: Invalid transform space: ${space}`);
            return;
        }

        this.currentSpace = space;
        this.transformControls.setSpace(space);
        this.config.set('transform.space', space);
        this.eventEmitter.emit('transformSpaceChanged', space);
    }

    /**
     * Get current space
     */
    getSpace() {
        return this.currentSpace;
    }

    /**
     * Attach to object
     */
    attach(object) {
        if (object) {
            this.transformControls.attach(object);
        }
    }

    /**
     * Detach from object
     */
    detach() {
        this.transformControls.detach();
    }

    /**
     * Get attached object
     */
    getAttachedObject() {
        return this.transformControls.object || null;
    }

    /**
     * Check if dragging
     */
    isDragging() {
        return this.transformControls.dragging || false;
    }

    /**
     * Enable transform controls
     */
    enable() {
        this.transformControls.enabled = true;
    }

    /**
     * Disable transform controls
     */
    disable() {
        this.transformControls.enabled = false;
    }

    /**
     * Update camera reference
     */
    setCamera(camera) {
        this.camera = camera;
        this.transformControls.camera = camera;
    }

    /**
     * Get transform controls instance
     */
    getControls() {
        return this.transformControls;
    }

    /**
     * Dispose transform controls
     */
    dispose() {
        if (this.transformControls) {
            this.transformControls.removeEventListener('change', this.onChange.bind(this));
            this.transformControls.removeEventListener('dragging-changed', this.onDraggingChanged.bind(this));
            this.transformControls.removeEventListener('objectChange', this.onObjectChange.bind(this));
            this.transformControls.detach();
            this.scene.remove(this.transformControls);
            this.transformControls.dispose();
        }
    }
}
