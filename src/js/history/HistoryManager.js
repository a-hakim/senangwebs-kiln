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
     * @param {TransformManager} transformManager - Transform manager (optional)
     */
    constructor(scene, selectionManager, groupManager, shapeFactory, config, transformManager = null) {
        super();
        
        this.scene = scene;
        this.selectionManager = selectionManager;
        this.groupManager = groupManager;
        this.shapeFactory = shapeFactory;
        this.config = config;
        this.transformManager = transformManager;

        // History array (stores all states)
        this.history = [];
        this.historyIndex = -1;
        
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

            // Remove any forward history if we made a new change (do this FIRST)
            this.history = this.history.slice(0, this.historyIndex + 1);

            // Don't capture if state is identical to the last one in current history
            if (this.history.length > 0) {
                const lastState = this.history[this.history.length - 1];
                if (StateCapture.areStatesEqual(state, lastState.state)) {
                    console.log('HistoryManager: State unchanged, skipping capture');
                    return false;
                }
            }

            // Add to history array
            this.history.push({
                state: state,
                description: description,
                timestamp: Date.now()
            });

            // Limit history size
            if (this.history.length > this.maxHistory) {
                this.history.shift(); // Remove oldest, index stays the same (pointing to same logical position)
            } else {
                this.historyIndex++;  // Move index forward only if not over limit
            }
            
            console.log(`HistoryManager: State captured "${description}" - history: ${this.history.length} states, historyIndex: ${this.historyIndex}`);
            console.log('HistoryManager: Current history:', this.history.map((entry, index) => ({
                index,
                description: entry.description,
                isCurrent: index === this.historyIndex,
                timestamp: entry.timestamp,
                objectCount: entry.state.objects.length,
                groupCount: entry.state.groups.length
            })));

            this.emit('stateChanged', {
                canUndo: this.canUndo(),
                canRedo: this.canRedo(),
                historyCount: this.history.length,
                historyIndex: this.historyIndex
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
            console.log(`HistoryManager: Undo - history: ${this.history.length} states, historyIndex: ${this.historyIndex}`);

            // Move index backward in history
            this.historyIndex--;
            
            console.log(`HistoryManager: After undo - historyIndex: ${this.historyIndex}`);

            // Get the state at the new index
            const entry = this.history[this.historyIndex];

            // Set restoring flag to prevent capture during restore
            this.isRestoring = true;

            // Restore that state
            StateCapture.restoreState(
                entry.state,
                this.scene,
                this.selectionManager,
                this.groupManager,
                this.shapeFactory,
                this.transformManager
            );

            this.isRestoring = false;

            this.emit('stateRestored', {
                action: 'undo',
                description: entry.description
            });

            this.emit('stateChanged', {
                canUndo: this.canUndo(),
                canRedo: this.canRedo(),
                historyCount: this.history.length,
                historyIndex: this.historyIndex
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
            console.log(`HistoryManager: Redo - history: ${this.history.length} states, historyIndex: ${this.historyIndex}`);

            // Move index forward in history
            this.historyIndex++;
            
            console.log(`HistoryManager: After redo - historyIndex: ${this.historyIndex}`);

            // Get the state at the new index
            const entry = this.history[this.historyIndex];

            // Set restoring flag to prevent capture during restore
            this.isRestoring = true;

            // Restore that state
            StateCapture.restoreState(
                entry.state,
                this.scene,
                this.selectionManager,
                this.groupManager,
                this.shapeFactory,
                this.transformManager
            );

            this.isRestoring = false;

            this.emit('stateRestored', {
                action: 'redo',
                description: entry.description
            });

            this.emit('stateChanged', {
                canUndo: this.canUndo(),
                canRedo: this.canRedo(),
                historyCount: this.history.length,
                historyIndex: this.historyIndex
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
        return this.historyIndex > 0;
    }

    /**
     * Check if redo is available
     * @returns {boolean} True if can redo
     */
    canRedo() {
        return this.historyIndex < this.history.length - 1;
    }

    /**
     * Get the description of the next undo action
     * @returns {string|null} Description or null
     */
    getUndoDescription() {
        if (!this.canUndo()) return null;
        return this.history[this.historyIndex - 1]?.description || null;
    }

    /**
     * Get the description of the next redo action
     * @returns {string|null} Description or null
     */
    getRedoDescription() {
        if (!this.canRedo()) return null;
        return this.history[this.historyIndex + 1]?.description || null;
    }

    /**
     * Clear all history
     */
    clear() {
        this.history = [];
        this.historyIndex = -1;
        
        // Capture current state as initial
        this.captureState('History cleared');

        this.emit('stateChanged', {
            canUndo: false,
            canRedo: false,
            historyCount: this.history.length,
            historyIndex: this.historyIndex
        });
    }

    /**
     * Get history statistics
     * @returns {Object} History stats
     */
    getStats() {
        return {
            historyCount: this.history.length,
            historyIndex: this.historyIndex,
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
        return JSON.stringify(this.history).length;
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
