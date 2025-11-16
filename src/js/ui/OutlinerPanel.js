/**
 * OutlinerPanel.js
 * Scene hierarchy panel showing all objects and groups
 */

import EventEmitter from '../core/EventEmitter.js';

class OutlinerPanel extends EventEmitter {
    /**
     * @param {HTMLElement} container - Panel container element
     * @param {SWK} swkInstance - Main SWK instance
     * @param {Object} config - Configuration object
     */
    constructor(container, swkInstance, config) {
        super();
        
        this.container = container;
        this.swk = swkInstance;
        this.config = config;
        
        this.expandedGroups = new Set();
    }

    /**
     * Render the outliner panel
     */
    render() {
        this.container.innerHTML = `
            <div class="swk-panel-content">
                <button class="swk-panel-button" id="swk-outliner-refresh" title="Refresh" style="display:none">↻</button>
                <div class="swk-outliner-tree" id="swk-outliner-tree"></div>
            </div>
        `;
        
        // Refresh button
        const refreshBtn = document.getElementById('swk-outliner-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }
        
        this.refresh();
    }

    /**
     * Refresh the outliner tree
     */
    refresh() {
        const tree = document.getElementById('swk-outliner-tree');
        if (!tree) return;
        
        // Get all groups
        const groups = this.swk.getAllGroups();
        
        // Get all objects that are NOT in groups
        const allObjects = this.swk.objects || [];
        const groupedObjectIds = new Set();
        
        groups.forEach(group => {
            const children = this.swk.getGroupChildren(group.container);
            children.forEach(child => {
                groupedObjectIds.add(child.uuid);
            });
        });
        
        const ungroupedObjects = allObjects.filter(obj => 
            !groupedObjectIds.has(obj.uuid) && obj.visible
        );
        
        if (groups.length === 0 && ungroupedObjects.length === 0) {
            tree.innerHTML = `
                <div class="swk-outliner-empty">
                    <p>No objects in scene</p>
                    <small>Add shapes to see them here</small>
                </div>
            `;
            return;
        }
        
        tree.innerHTML = '';
        
        // Show groups first
        groups.forEach(group => {
            const item = this.createTreeItem(group.container);
            tree.appendChild(item);
        });
        
        // Then show ungrouped objects
        ungroupedObjects.forEach(obj => {
            const item = this.createTreeItem(obj);
            tree.appendChild(item);
        });
    }

    /**
     * Create a tree item for an object
     * @param {THREE.Object3D} object - The object
     * @param {number} level - Nesting level
     * @returns {HTMLElement} Tree item element
     */
    createTreeItem(object, level = 0) {
        const isGroup = this.swk.isGroupContainer(object);
        const isSelected = this.swk.selectionManager.isSelected(object);
        const isExpanded = this.expandedGroups.has(object.userData.id);
        
        const item = document.createElement('div');
        item.className = 'swk-outliner-item';
        item.setAttribute('data-object-id', object.userData.id);
        if (isSelected) {
            item.classList.add('swk-outliner-item-selected');
        }
        
        // Indentation
        const indent = level * 20;
        
        // Content
        let icon = '<i class="fas fa-cube"></i>';
        if (isGroup) {
            icon = isExpanded ? '<i class="fas fa-chevron-down"></i>' : '<i class="fas fa-chevron-right"></i>';
        } else if (object.userData.shapeType) {
            icon = this.getShapeIcon(object.userData.shapeType);
        }
        
        item.innerHTML = `
            <div class="swk-outliner-item-content" style="padding-left: ${indent}px;">
                ${isGroup ? `<span class="swk-outliner-toggle" data-object-id="${object.userData.id}">${icon}</span>` : `<span class="swk-outliner-icon">${icon}</span>`}
                <span class="swk-outliner-name">${object.name}</span>
                <span class="swk-outliner-type">${isGroup ? 'Group' : object.userData.shapeType || ''}</span>
            </div>
        `;
        
        // Click to select
        const content = item.querySelector('.swk-outliner-item-content');
        content.addEventListener('click', (e) => {
            if (!e.target.classList.contains('swk-outliner-toggle')) {
                this.selectObject(object);
            }
        });
        
        // Toggle group expansion
        if (isGroup) {
            const toggle = item.querySelector('.swk-outliner-toggle');
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleGroup(object);
                });
            }
        }
        
        // Add children if group is expanded
        if (isGroup && isExpanded) {
            const children = this.swk.getGroupChildren(object);
            children.forEach(child => {
                const childItem = this.createTreeItem(child, level + 1);
                item.appendChild(childItem);
            });
        }
        
        return item;
    }

    /**
     * Get icon for shape type
     * @param {string} type - Shape type
     * @returns {string} Icon HTML
     */
    getShapeIcon(type) {
        const icons = {
            'box': '<i class="fas fa-cube"></i>',
            'sphere': '<i class="fas fa-circle"></i>',
            'cylinder': '<i class="fas fa-database"></i>',
            'cone': '<i class="fas fa-play"></i>',
            'torus': '<i class="fas fa-ring"></i>',
            'plane': '<i class="fas fa-square"></i>',
            'pyramid': '<i class="fas fa-caret-up"></i>',
            'torusknot': '<i class="fas fa-circle-notch"></i>',
            'tetrahedron': '<i class="fas fa-gem"></i>',
            'octahedron': '<i class="fas fa-gem"></i>',
            'icosahedron': '<i class="fas fa-gem"></i>',
            'dodecahedron': '<i class="fas fa-gem"></i>',
            'text': '<i class="fas fa-font"></i>'
        };
        return icons[type] || '<i class="fas fa-cube"></i>';
    }

    /**
     * Select an object
     * @param {THREE.Object3D} object - Object to select
     */
    selectObject(object) {
        // If the object is part of a group, select the group instead
        if (this.swk.isGrouped(object)) {
            const group = this.swk.groupManager.findObjectGroup(object);
            if (group && group.container) {
                this.swk.selectObject(group.container);
                return;
            }
        }
        
        this.swk.selectObject(object);
    }

    /**
     * Toggle group expansion
     * @param {THREE.Object3D} group - Group to toggle
     */
    toggleGroup(group) {
        const id = group.userData.id;
        if (this.expandedGroups.has(id)) {
            this.expandedGroups.delete(id);
        } else {
            this.expandedGroups.add(id);
        }
        this.refresh();
    }

    /**
     * Update selection highlighting
     * @param {Array} selectedObjects - Selected objects
     */
    updateSelection(selectedObjects) {
        // Remove all selected classes
        const items = this.container.querySelectorAll('.swk-outliner-item-selected');
        items.forEach(item => item.classList.remove('swk-outliner-item-selected'));
        
        // Add selected class to selected objects
        selectedObjects.forEach(obj => {
            const item = this.container.querySelector(`[data-object-id="${obj.userData.id}"]`);
            if (item) {
                item.classList.add('swk-outliner-item-selected');
            }
        });
    }

    /**
     * Add an object to the outliner
     * @param {THREE.Object3D} object - Object to add
     */
    addObject(object) {
        this.refresh();
    }

    /**
     * Remove an object from the outliner
     * @param {THREE.Object3D} object - Object to remove
     */
    removeObject(object) {
        this.refresh();
    }

    /**
     * Clean up
     */
    destroy() {
        this.expandedGroups.clear();
        this.removeAllListeners();
    }
}

export default OutlinerPanel;
