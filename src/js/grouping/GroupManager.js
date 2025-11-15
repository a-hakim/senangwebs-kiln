/**
 * Group management for organizing objects
 */

import { generateId } from '../utils/Helpers.js';

export default class GroupManager {
    constructor(scene, eventEmitter, config) {
        this.scene = scene;
        this.eventEmitter = eventEmitter;
        this.config = config;
        
        this.groups = [];
        this.groupIdCounter = 0;
    }

    /**
     * Create group from selected objects
     */
    createGroup(objects, name = null) {
        if (!objects || objects.length === 0) {
            console.warn('SWK: No objects provided for grouping');
            return null;
        }

        // Generate group ID and name
        const groupId = `group_${this.groupIdCounter++}`;
        const groupName = name || `Group ${this.groups.length + 1}`;

        // Create group data
        const group = {
            id: groupId,
            name: groupName,
            children: [...objects],
            container: null,
            isDirty: true
        };

        // Mark objects as part of group
        objects.forEach(obj => {
            obj.userData.groupId = groupId;
        });

        // Store group
        this.groups.push(group);

        // Compute group container
        this.computeGroupContainer(group);

        // Emit event
        this.eventEmitter.emit('groupCreated', group.container);

        // Execute callback
        const callback = this.config.get('callbacks.onGroupCreated');
        if (callback && typeof callback === 'function') {
            callback(group.container);
        }

        console.log(`SWK: Created ${groupName} with ${objects.length} objects`);
        return group.container;
    }

    /**
     * Compute group container (THREE.Group)
     */
    computeGroupContainer(group) {
        // Remove existing container if present
        if (group.container) {
            this.scene.remove(group.container);
        }

        if (group.children.length === 0) return;

        // Calculate bounding box of all children to find center
        const boundingBox = new THREE.Box3();
        group.children.forEach(child => {
            boundingBox.expandByObject(child);
        });

        // Get the center of the bounding box
        const center = boundingBox.getCenter(new THREE.Vector3());

        // Create THREE.Group container
        const groupContainer = new THREE.Group();
        groupContainer.userData.isGroupResult = true;
        groupContainer.userData.groupId = group.id;
        groupContainer.name = group.name;

        // Position the group container at the center
        groupContainer.position.copy(center);

        // Add all children to container, preserving world positions
        group.children.forEach(child => {
            // Store world transform before parenting
            const worldPos = new THREE.Vector3();
            const worldQuat = new THREE.Quaternion();
            const worldScale = new THREE.Vector3();
            
            child.getWorldPosition(worldPos);
            child.getWorldQuaternion(worldQuat);
            child.getWorldScale(worldScale);

            // Remove from scene
            if (child.parent) {
                child.parent.remove(child);
            }

            // Parent to group
            groupContainer.add(child);

            // Adjust local position relative to group center
            child.position.copy(worldPos).sub(center);
            child.quaternion.copy(worldQuat);
            child.scale.copy(worldScale);
        });

        // Add container to scene
        this.scene.add(groupContainer);

        // Store reference
        group.container = groupContainer;
        group.isDirty = false;
    }

    /**
     * Ungroup - restore objects to scene
     */
    ungroup(groupContainer) {
        if (!groupContainer || !groupContainer.userData.isGroupResult) {
            console.warn('SWK: Invalid group container');
            return null;
        }

        const groupId = groupContainer.userData.groupId;
        const groupIndex = this.groups.findIndex(g => g.id === groupId);

        if (groupIndex === -1) {
            console.warn('SWK: Group not found');
            return null;
        }

        const group = this.groups[groupIndex];
        const ungroupedObjects = [];

        // Unparent objects and restore to scene
        [...group.children].forEach(obj => {
            // Preserve world transform
            const worldPosition = new THREE.Vector3();
            const worldRotation = new THREE.Quaternion();
            const worldScale = new THREE.Vector3();

            obj.getWorldPosition(worldPosition);
            obj.getWorldQuaternion(worldRotation);
            obj.getWorldScale(worldScale);

            // Remove from group
            group.container.remove(obj);

            // Add back to scene
            this.scene.add(obj);

            // Restore world transform
            obj.position.copy(worldPosition);
            obj.quaternion.copy(worldRotation);
            obj.scale.copy(worldScale);

            // Clear group ID
            obj.userData.groupId = null;

            ungroupedObjects.push(obj);
        });

        // Remove group container from scene
        this.scene.remove(group.container);

        // Remove group from array
        this.groups.splice(groupIndex, 1);

        // Emit event
        this.eventEmitter.emit('groupRemoved', group.container);

        // Execute callback
        const callback = this.config.get('callbacks.onGroupRemoved');
        if (callback && typeof callback === 'function') {
            callback(group.container);
        }

        console.log(`SWK: Ungrouped ${group.name}`);
        return ungroupedObjects;
    }

    /**
     * Get group by ID
     */
    getGroupById(groupId) {
        return this.groups.find(g => g.id === groupId);
    }

    /**
     * Get group by container
     */
    getGroupByContainer(container) {
        if (!container || !container.userData.groupId) return null;
        return this.getGroupById(container.userData.groupId);
    }

    /**
     * Check if object is grouped
     */
    isGrouped(object) {
        return object && object.userData && object.userData.groupId !== undefined && object.userData.groupId !== null;
    }

    /**
     * Check if object is a group container
     */
    isGroupContainer(object) {
        return object && object.userData && object.userData.isGroupResult === true;
    }

    /**
     * Get all groups
     */
    getAllGroups() {
        return [...this.groups];
    }

    /**
     * Get group children
     */
    getGroupChildren(groupContainer) {
        const group = this.getGroupByContainer(groupContainer);
        return group ? [...group.children] : [];
    }

    /**
     * Find object's group
     */
    findObjectGroup(object) {
        if (!this.isGrouped(object)) return null;
        return this.getGroupById(object.userData.groupId);
    }

    /**
     * Rename group
     */
    renameGroup(groupContainer, newName) {
        const group = this.getGroupByContainer(groupContainer);
        if (group) {
            group.name = newName;
            group.container.name = newName;
            return true;
        }
        return false;
    }

    /**
     * Remove object from its group
     */
    removeFromGroup(object) {
        const group = this.findObjectGroup(object);
        if (!group) return false;

        // Preserve world transform
        const worldPosition = new THREE.Vector3();
        const worldRotation = new THREE.Quaternion();
        const worldScale = new THREE.Vector3();

        object.getWorldPosition(worldPosition);
        object.getWorldQuaternion(worldRotation);
        object.getWorldScale(worldScale);

        // Remove from group children
        const index = group.children.indexOf(object);
        if (index > -1) {
            group.children.splice(index, 1);
        }

        // Remove from container
        group.container.remove(object);

        // Add back to scene
        this.scene.add(object);

        // Restore world transform
        object.position.copy(worldPosition);
        object.quaternion.copy(worldRotation);
        object.scale.copy(worldScale);

        // Clear group ID
        object.userData.groupId = null;

        // If group is now empty, remove it
        if (group.children.length === 0) {
            this.scene.remove(group.container);
            const groupIndex = this.groups.indexOf(group);
            if (groupIndex > -1) {
                this.groups.splice(groupIndex, 1);
            }
        }

        return true;
    }

    /**
     * Add object to existing group
     */
    addToGroup(object, groupContainer) {
        const group = this.getGroupByContainer(groupContainer);
        if (!group) return false;

        // Remove from current group if already grouped
        if (this.isGrouped(object)) {
            this.removeFromGroup(object);
        }

        // Store world transform
        const worldPos = new THREE.Vector3();
        const worldQuat = new THREE.Quaternion();
        const worldScale = new THREE.Vector3();

        object.getWorldPosition(worldPos);
        object.getWorldQuaternion(worldQuat);
        object.getWorldScale(worldScale);

        // Remove from scene
        if (object.parent) {
            object.parent.remove(object);
        }

        // Add to group
        group.container.add(object);
        group.children.push(object);

        // Adjust local position relative to group center
        const groupCenter = group.container.position;
        object.position.copy(worldPos).sub(groupCenter);
        object.quaternion.copy(worldQuat);
        object.scale.copy(worldScale);

        // Mark as grouped
        object.userData.groupId = group.id;

        return true;
    }

    /**
     * Clear all groups
     */
    clearAllGroups() {
        [...this.groups].forEach(group => {
            if (group.container) {
                this.ungroup(group.container);
            }
        });
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            totalGroups: this.groups.length,
            groups: this.groups.map(g => ({
                id: g.id,
                name: g.name,
                childCount: g.children.length
            }))
        };
    }
}
