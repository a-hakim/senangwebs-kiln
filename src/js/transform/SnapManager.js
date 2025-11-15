/**
 * Snap settings manager for transform controls
 */

import { SNAP_VALUES } from '../utils/Constants.js';
import { degToRad } from '../utils/Helpers.js';

export default class SnapManager {
    constructor(transformControls, config, eventEmitter) {
        this.transformControls = transformControls;
        this.config = config;
        this.eventEmitter = eventEmitter;
        
        this.snapUnit = config.get('transform.snapUnit');
        this.rotationSnapDegrees = 15; // Default rotation snap in degrees
        
        this.applySnap();
    }

    /**
     * Apply snap settings to transform controls
     */
    applySnap() {
        if (!this.transformControls) return;

        // Translation snap
        this.transformControls.setTranslationSnap(this.snapUnit);
        
        // Rotation snap (in radians)
        const rotationSnapRadians = this.snapUnit > 0 ? degToRad(this.rotationSnapDegrees) : null;
        this.transformControls.setRotationSnap(rotationSnapRadians);
        
        // Scale snap
        this.transformControls.setScaleSnap(this.snapUnit);
    }

    /**
     * Set snap unit
     */
    setSnapUnit(value) {
        if (typeof value !== 'number' || value < 0) {
            console.warn(`SWK: Invalid snap unit: ${value}`);
            return;
        }

        this.snapUnit = value;
        this.config.set('transform.snapUnit', value);
        this.applySnap();
        this.eventEmitter.emit('snapUnitChanged', value);
    }

    /**
     * Get snap unit
     */
    getSnapUnit() {
        return this.snapUnit;
    }

    /**
     * Set rotation snap (in degrees)
     */
    setRotationSnap(degrees) {
        if (typeof degrees !== 'number' || degrees < 0) {
            console.warn(`SWK: Invalid rotation snap: ${degrees}`);
            return;
        }

        this.rotationSnapDegrees = degrees;
        this.applySnap();
        this.eventEmitter.emit('rotationSnapChanged', degrees);
    }

    /**
     * Get rotation snap (in degrees)
     */
    getRotationSnap() {
        return this.rotationSnapDegrees;
    }

    /**
     * Toggle snap on/off
     */
    toggleSnap() {
        if (this.snapUnit > 0) {
            // Disable snap
            this.setSnapUnit(0);
        } else {
            // Enable snap with default value
            this.setSnapUnit(0.1);
        }
    }

    /**
     * Check if snap is enabled
     */
    isSnapEnabled() {
        return this.snapUnit > 0;
    }

    /**
     * Cycle through predefined snap values
     */
    cycleSnapValue() {
        const currentIndex = SNAP_VALUES.indexOf(this.snapUnit);
        const nextIndex = (currentIndex + 1) % SNAP_VALUES.length;
        this.setSnapUnit(SNAP_VALUES[nextIndex]);
    }

    /**
     * Get available snap values
     */
    getAvailableSnapValues() {
        return [...SNAP_VALUES];
    }
}
