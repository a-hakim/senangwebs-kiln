/**
 * Simple event emitter for internal communication
 */

export default class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * Register event listener
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return this;
    }

    /**
     * Register one-time event listener
     */
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        return this.on(event, wrapper);
    }

    /**
     * Remove event listener
     */
    off(event, callback) {
        if (!this.events[event]) return this;
        
        if (!callback) {
            delete this.events[event];
        } else {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
        return this;
    }

    /**
     * Emit event
     */
    emit(event, ...args) {
        if (!this.events[event]) return this;
        
        this.events[event].forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`Error in event handler for "${event}":`, error);
            }
        });
        return this;
    }

    /**
     * Remove all listeners
     */
    removeAllListeners() {
        this.events = {};
        return this;
    }
}
