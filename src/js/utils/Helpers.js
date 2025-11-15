/**
 * Utility helper functions
 */

/**
 * Convert degrees to radians
 */
export function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Generate unique ID
 */
export function generateId() {
    return `swk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep merge objects
 */
export function deepMerge(target, source) {
    const output = { ...target };
    
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    
    return output;
}

/**
 * Check if value is an object
 */
export function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Download file
 */
export function downloadFile(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

/**
 * Get timestamp for file naming
 */
export function getTimestamp() {
    return Date.now();
}

/**
 * Parse HTML data attributes to config object
 */
export function parseDataAttributes(element) {
    const config = {};
    const dataset = element.dataset;
    
    for (const key in dataset) {
        if (key.startsWith('swk')) {
            // Remove 'swk' prefix and convert to config path
            // e.g., 'swkUiEnabled' -> 'ui.enabled', 'swkGridShow' -> 'grid.show'
            let configPath = key.replace('swk', '').replace(/^./, str => str.toLowerCase());
            
            // Convert camelCase to dot notation for nested properties
            // uiEnabled -> ui.enabled, gridShow -> grid.show
            configPath = configPath.replace(/([A-Z])/g, (match, letter, offset) => {
                // Special handling for known nested properties
                const nestedProps = ['ui', 'grid', 'camera', 'history', 'viewport', 'transform', 'lighting'];
                const beforeLetter = configPath.substring(0, offset);
                
                // Check if this is a start of a nested property
                for (const prop of nestedProps) {
                    if (beforeLetter.toLowerCase() === prop) {
                        return '.' + letter.toLowerCase();
                    }
                }
                return letter.toLowerCase();
            });
            
            const value = dataset[key];
            
            // Parse value
            let parsedValue;
            if (value === 'true') {
                parsedValue = true;
            } else if (value === 'false') {
                parsedValue = false;
            } else if (value.includes(',')) {
                // Handle arrays (e.g., "5,5,5" -> [5,5,5])
                parsedValue = value.split(',').map(v => {
                    const trimmed = v.trim();
                    return !isNaN(trimmed) ? parseFloat(trimmed) : trimmed;
                });
            } else if (!isNaN(value) && value !== '') {
                parsedValue = parseFloat(value);
            } else {
                parsedValue = value;
            }
            
            // Set nested property
            setNestedProperty(config, configPath, parsedValue);
        }
    }
    
    return config;
}

/**
 * Set nested property in object using dot notation
 */
function setNestedProperty(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = obj;
    
    for (const key of keys) {
        if (!(key in target)) {
            target[key] = {};
        }
        target = target[key];
    }
    
    target[lastKey] = value;
}

/**
 * Create DOM element with classes
 */
export function createElement(tag, classes = [], attributes = {}) {
    const element = document.createElement(tag);
    
    if (classes.length > 0) {
        element.className = classes.join(' ');
    }
    
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    
    return element;
}

/**
 * Dispose Three.js object properly
 */
export function disposeObject(object) {
    if (!object) return;
    
    if (object.geometry) {
        object.geometry.dispose();
    }
    
    if (object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
        } else {
            object.material.dispose();
        }
    }
    
    if (object.texture) {
        object.texture.dispose();
    }
}
