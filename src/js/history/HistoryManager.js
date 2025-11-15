/**
 * HistoryManager.js
 * Manages undo/redo history with state snapshots
 * Implements a circular buffer with maximum history depth
 */

import StateCapture from './StateCapture.js';
import EventEmitter from '../core/EventEmitter.js';

class HistoryManager extends EventEmitter {
    /**
     * @param {THREE.Scene} scene - The Three.js scene
     * @param {SelectionManager} selectionManager - Selection manager
     * @param {GroupManager} groupManager - Group manager
     * @param {ShapeFactory} shapeFactory - Shape factory
     * @param {Object} config - Configuration object
     */
    constructor(scene, selectionManager, groupManager, shapeFactory, config) {
        super();
        
        this.scene = scene;
        this.selectionManager = selectionManager;
        this.groupManager = groupManager;
        this.shapeFactory = shapeFactory;
        this.config = config;

        // History stacks
        this.undoStack = [];
        this.redoStack = [];
        
        // Configuration
        this.maxHistory = config.get('maxHistory') || 50;
        this.isRestoring = false; // Flag to prevent recording during restore
        
        // Capture initial state
        this.captureState('Initial state');
    }

    /**
     * Capture current state and add to undo stack
     * @param {string} description - Description of the action (for debugging)
     * @returns {boolean} Success
     */
    captureState(description = 'State change') {
        // Don't capture if we're currently restoring a state
        if (this.isRestoring) {
            return false;
        }

        try {
            const state = StateCapture.captureState(
                this.scene,
                this.selectionManager,
                this.groupManager,
                this.shapeFactory
            );

            // Don't capture if state is identical to the last one
            if (this.undoStack.length > 0) {
                const lastState = this.undoStack[this.undoStack.length - 1];
                if (StateCapture.areStatesEqual(state, lastState.state)) {
                    return false;
                }
            }

            // Add to undo stack
            this.undoStack.push({
                state: state,
                description: description,
                timestamp: Date.now()
            });

            // Limit history size
            if (this.undoStack.length > this.maxHistory) {
                this.undoStack.shift(); // Remove oldest
            }

            // Clear redo stack when new action is performed
            this.redoStack = [];

            this.emit('stateChanged', {
                canUndo: this.canUndo(),
                canRedo: this.canRedo(),
                undoCount: this.undoStack.length,
                redoCount: this.redoStack.length
            });

            return true;
        } catch (error) {
            console.error('Failed to capture state:', error);
            return false;
        }
    }

    /**
     * Undo the last action
     * @returns {boolean} Success
     */
    undo() {
        if (!this.canUndo()) {
            return false;
        }

        try {
            this.isRestoring = true;

            // Move current state to redo stack
            const currentState = StateCapture.captureState(
                this.scene,
                this.selectionManager,
                this.groupManager,
                this.shapeFactory
            );
            
            this.redoStack.push({
                state: currentState,
                description: 'Current state',
                timestamp: Date.now()
            });

            // Get previous state from undo stack
            this.undoStack.pop(); // Remove current
            const previousEntry = this.undoStack[this.undoStack.length - 1];

            // Restore previous state
            StateCapture.restoreState(
                previousEntry.state,
                this.scene,
                this.selectionManager,
                this.groupManager,
                this.shapeFactory
            );

            this.isRestoring = false;

            this.emit('stateRestored', {
                action: 'undo',
                description: previousEntry.description
            });

            this.emit('stateChanged', {
                canUndo: this.canUndo(),
                canRedo: this.canRedo(),
                undoCount: this.undoStack.length,
                redoCount: this.redoStack.length
            });

            return true;
        } catch (error) {
            console.error('Failed to undo:', error);
            this.isRestoring = false;
            return false;
        }
    }

    /**
     * Redo the last undone action
     * @returns {boolean} Success
     */
    redo() {
        if (!this.canRedo()) {
            return false;
        }

        try {
            this.isRestoring = true;

            // Get state from redo stack
            const redoEntry = this.redoStack.pop();

            // Capture current state for undo stack
            const currentState = StateCapture.captureState(
                this.scene,
                this.selectionManager,
                this.groupManager,
                this.shapeFactory
            );

            this.undoStack.push({
                state: currentState,
                description: 'Redo action',
                timestamp: Date.now()
            });

            // Restore redo state
            StateCapture.restoreState(
                redoEntry.state,
                this.scene,
                this.selectionManager,
                this.groupManager,
                this.shapeFactory
            );

            this.isRestoring = false;

            this.emit('stateRestored', {
                action: 'redo',
                description: redoEntry.description
            });

            this.emit('stateChanged', {
                canUndo: this.canUndo(),
                canRedo: this.canRedo(),
                undoCount: this.undoStack.length,
                redoCount: this.redoStack.length
            });

            return true;
        } catch (error) {
            console.error('Failed to redo:', error);
            this.isRestoring = false;
            return false;
        }
    }

    /**
     * Check if undo is available
     * @returns {boolean} True if can undo
     */
    canUndo() {
        return this.undoStack.length > 1; // Need at least 2 (current + previous)
    }

    /**
     * Check if redo is available
     * @returns {boolean} True if can redo
     */
    canRedo() {
        return this.redoStack.length > 0;
    }

    /**
     * Get the description of the next undo action
     * @returns {string|null} Description or null
     */
    getUndoDescription() {
        if (!this.canUndo()) return null;
        return this.undoStack[this.undoStack.length - 2]?.description || null;
    }

    /**
     * Get the description of the next redo action
     * @returns {string|null} Description or null
     */
    getRedoDescription() {
        if (!this.canRedo()) return null;
        return this.redoStack[this.redoStack.length - 1]?.description || null;
    }

    /**
     * Clear all history
     */
    clear() {
        this.undoStack = [];
        this.redoStack = [];
        
        // Capture current state as initial
        this.captureState('History cleared');

        this.emit('stateChanged', {
            canUndo: false,
            canRedo: false,
            undoCount: this.undoStack.length,
            redoCount: this.redoStack.length
        });
    }

    /**
     * Get history statistics
     * @returns {Object} History stats
     */
    getStats() {
        return {
            undoCount: this.undoStack.length,
            redoCount: this.redoStack.length,
            maxHistory: this.maxHistory,
            canUndo: this.canUndo(),
            canRedo: this.canRedo(),
            memoryUsage: this.estimateMemoryUsage()
        };
    }

    /**
     * Estimate memory usage of history (approximate)
     * @returns {number} Estimated size in bytes
     */
    estimateMemoryUsage() {
        const undoSize = JSON.stringify(this.undoStack).length;
        const redoSize = JSON.stringify(this.redoStack).length;
        return undoSize + redoSize;
    }

    /**
     * Clean up resources
     */
    dispose() {
        this.clear();
        this.removeAllListeners();
        this.scene = null;
        this.selectionManager = null;
        this.groupManager = null;
        this.shapeFactory = null;
    }
}

export default HistoryManager;
