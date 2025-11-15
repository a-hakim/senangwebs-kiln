/**
 * Configuration management with defaults and validation
 */

import { 
    DEFAULT_COLORS, 
    GRID_SETTINGS, 
    CAMERA_SETTINGS, 
    LIGHTING,
    HISTORY_MAX_SIZE,
    CAMERA_MODES,
    TRANSFORM_MODES,
    OUTLINE_THICKNESS
} from '../utils/Constants.js';
import { deepMerge } from '../utils/Helpers.js';

/**
 * Default configuration
 */
export const DEFAULT_CONFIG = {
    // Container & Sizing
    container: null,
    width: '100%',
    height: '100%',
    
    // Viewport Appearance
    viewportBackground: `#${DEFAULT_COLORS.VIEWPORT_BG.toString(16).padStart(6, '0')}`,
    outlineColor: `#${DEFAULT_COLORS.OUTLINE.toString(16).padStart(6, '0')}`,
    outlineThickness: OUTLINE_THICKNESS,
    
    // Grid
    grid: {
        show: true,
        size: GRID_SETTINGS.SIZE,
        divisions: GRID_SETTINGS.DIVISIONS,
        centerColor: `#${DEFAULT_COLORS.GRID_CENTER.toString(16).padStart(6, '0')}`,
        linesColor: `#${DEFAULT_COLORS.GRID_LINES.toString(16).padStart(6, '0')}`
    },
    
    // Camera
    camera: {
        mode: CAMERA_MODES.PERSPECTIVE,
        fov: CAMERA_SETTINGS.FOV,
        near: CAMERA_SETTINGS.NEAR,
        far: CAMERA_SETTINGS.FAR,
        position: [...CAMERA_SETTINGS.POSITION]
    },
    
    // Transform
    transform: {
        mode: TRANSFORM_MODES.TRANSLATE,
        space: 'local',
        snapUnit: 0.1
    },
    
    // Lighting
    lighting: {
        ambient: {
            intensity: LIGHTING.AMBIENT_INTENSITY,
            color: `#${LIGHTING.AMBIENT_COLOR.toString(16).padStart(6, '0')}`
        },
        directional: {
            intensity: LIGHTING.DIRECTIONAL_INTENSITY,
            color: `#${LIGHTING.DIRECTIONAL_COLOR.toString(16).padStart(6, '0')}`,
            position: [...LIGHTING.DIRECTIONAL_POSITION]
        },
        castShadow: true
    },
    
    // UI Elements
    ui: {
        enabled: false, // UI disabled by default (use JS API)
        panels: {
            shapes: true,
            properties: true,
            outliner: true,
            controls: true
        }
    },
    
    // Features
    features: {
        grouping: true,
        undo: true,
        export: true
    },
    
    // History
    history: {
        enabled: true,
        maxSize: HISTORY_MAX_SIZE
    },
    
    // Callbacks
    callbacks: {
        onObjectAdded: null,
        onObjectRemoved: null,
        onSelectionChanged: null,
        onTransformChange: null,
        onGroupCreated: null,
        onGroupRemoved: null
    }
};

/**
 * Configuration manager
 */
export default class Config {
    constructor(userConfig = {}) {
        this.config = this.mergeConfig(userConfig);
        this.validate();
    }

    /**
     * Merge user config with defaults
     */
    mergeConfig(userConfig) {
        return deepMerge(DEFAULT_CONFIG, userConfig);
    }

    /**
     * Validate configuration
     */
    validate() {
        // Validate container
        if (!this.config.container) {
            throw new Error('SWK: Container selector or element is required');
        }

        // Validate camera mode
        if (!Object.values(CAMERA_MODES).includes(this.config.camera.mode)) {
            console.warn(`SWK: Invalid camera mode "${this.config.camera.mode}", using default`);
            this.config.camera.mode = CAMERA_MODES.PERSPECTIVE;
        }

        // Validate transform mode
        if (!Object.values(TRANSFORM_MODES).includes(this.config.transform.mode)) {
            console.warn(`SWK: Invalid transform mode "${this.config.transform.mode}", using default`);
            this.config.transform.mode = TRANSFORM_MODES.TRANSLATE;
        }

        // Validate snap unit
        if (this.config.transform.snapUnit < 0) {
            console.warn('SWK: Snap unit must be non-negative, using 0');
            this.config.transform.snapUnit = 0;
        }

        return true;
    }

    /**
     * Get configuration value
     */
    get(path) {
        const keys = path.split('.');
        let value = this.config;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }

    /**
     * Set configuration value
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this.config;
        
        for (const key of keys) {
            if (!(key in target)) {
                target[key] = {};
            }
            target = target[key];
        }
        
        target[lastKey] = value;
    }

    /**
     * Get all configuration
     */
    getAll() {
        return { ...this.config };
    }
}
