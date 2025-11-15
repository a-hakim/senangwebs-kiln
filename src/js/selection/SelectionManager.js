/**
 * Selection state management with multi-select support
 */

export default class SelectionManager {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.selectedObjects = [];
        this.selectedObject = null;
    }

    /**
     * Select single object (replaces current selection)
     */
    select(object) {
        if (!object) return;

        // Store previous selection for event
        const previousSelection = [...this.selectedObjects];

        // Clear current selection
        this.selectedObjects = [object];
        this.selectedObject = object;

        // Emit event
        this.eventEmitter.emit('selectionChanged', this.selectedObjects, previousSelection);

        return this.selectedObjects;
    }

    /**
     * Add object to selection (multi-select)
     */
    addToSelection(object) {
        if (!object) return;

        // Check if already selected
        if (this.selectedObjects.includes(object)) {
            return this.selectedObjects;
        }

        // Store previous selection
        const previousSelection = [...this.selectedObjects];

        // Add to selection
        this.selectedObjects.push(object);
        this.selectedObject = this.selectedObjects[0];

        // Emit event
        this.eventEmitter.emit('selectionChanged', this.selectedObjects, previousSelection);

        return this.selectedObjects;
    }

    /**
     * Remove object from selection
     */
    removeFromSelection(object) {
        if (!object) return;

        const index = this.selectedObjects.indexOf(object);
        if (index === -1) return;

        // Store previous selection
        const previousSelection = [...this.selectedObjects];

        // Remove from selection
        this.selectedObjects.splice(index, 1);
        this.selectedObject = this.selectedObjects.length > 0 ? this.selectedObjects[0] : null;

        // Emit event
        this.eventEmitter.emit('selectionChanged', this.selectedObjects, previousSelection);

        return this.selectedObjects;
    }

    /**
     * Toggle object selection
     */
    toggle(object) {
        if (!object) return;

        if (this.selectedObjects.includes(object)) {
            this.removeFromSelection(object);
        } else {
            this.addToSelection(object);
        }

        return this.selectedObjects;
    }

    /**
     * Clear all selection
     */
    clear() {
        if (this.selectedObjects.length === 0) return;

        // Store previous selection
        const previousSelection = [...this.selectedObjects];

        // Clear selection
        this.selectedObjects = [];
        this.selectedObject = null;

        // Emit event
        this.eventEmitter.emit('selectionChanged', [], previousSelection);
    }

    /**
     * Check if object is selected
     */
    isSelected(object) {
        return this.selectedObjects.includes(object);
    }

    /**
     * Get all selected objects
     */
    getSelectedObjects() {
        return [...this.selectedObjects];
    }

    /**
     * Get first selected object
     */
    getSelectedObject() {
        return this.selectedObject;
    }

    /**
     * Get selection count
     */
    getSelectionCount() {
        return this.selectedObjects.length;
    }

    /**
     * Check if has selection
     */
    hasSelection() {
        return this.selectedObjects.length > 0;
    }

    /**
     * Check if has multiple selections
     */
    hasMultipleSelections() {
        return this.selectedObjects.length > 1;
    }
}
