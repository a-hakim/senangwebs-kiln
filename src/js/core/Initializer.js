/**
 * Dual initialization system (JavaScript API and HTML attributes)
 */

import { parseDataAttributes } from '../utils/Helpers.js';

export default class Initializer {
    /**
     * Initialize from JavaScript API
     */
    static fromAPI(selector, options = {}) {
        // Get container element
        let container;
        
        if (typeof selector === 'string') {
            container = document.querySelector(selector);
            if (!container) {
                throw new Error(`SWK: Container element not found: ${selector}`);
            }
        } else if (selector instanceof HTMLElement) {
            container = selector;
        } else {
            throw new Error('SWK: Invalid container selector or element');
        }
        
        // Merge options with container
        return {
            container,
            config: options
        };
    }

    /**
     * Auto-initialize from HTML attributes
     * Note: This will be called from SWK class after it's defined
     */
    static autoInit(SWKClass) {
        // Find all elements with data-swk attribute
        const elements = document.querySelectorAll('[data-swk]');
        const instances = [];
        
        elements.forEach(element => {
            try {
                // Parse data attributes
                const config = parseDataAttributes(element);
                
                // Create SWK instance using the element and config
                const instance = new SWKClass(element, config);
                instances.push(instance);
            } catch (error) {
                console.error('SWK: Failed to auto-initialize element:', element, error);
            }
        });
        
        return instances;
    }

    /**
     * Initialize from HTML element with data attributes
     */
    static fromHTML(element, parsedConfig = {}) {
        if (!(element instanceof HTMLElement)) {
            throw new Error('SWK: Invalid HTML element');
        }
        
        return {
            container: element,
            config: parsedConfig
        };
    }

    /**
     * Parse configuration from data attributes
     */
    static parseConfig(element) {
        return parseDataAttributes(element);
    }
}
