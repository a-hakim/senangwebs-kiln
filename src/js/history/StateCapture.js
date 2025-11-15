/**
 * StateCapture.js
 * Utility for serializing and deserializing complete scene state
 * Captures: objects, groups, materials, transforms, selection, counters
 */

import { SHAPE_TYPES } from '../utils/Constants.js';

class StateCapture {
    /**
     * Capture the complete current state of the scene
     * @param {THREE.Scene} scene - The Three.js scene
     * @param {SelectionManager} selectionManager - Selection manager instance
     * @param {GroupManager} groupManager - Group manager instance
     * @param {ShapeFactory} shapeFactory - Shape factory instance
     * @returns {Object} Serialized state object
     */
    static captureState(scene, selectionManager, groupManager, shapeFactory) {
        const state = {
            timestamp: Date.now(),
            objects: [],
            groups: [],
            selection: [],
            counters: {}
        };

        // Capture shape counters from ShapeFactory
        if (shapeFactory && shapeFactory.shapeCounters) {
            state.counters = { ...shapeFactory.shapeCounters };
        }

        // Get all user objects and group containers (exclude grid, lights, etc)
        const userObjects = scene.children.filter(obj => 
            obj.userData && (obj.userData.isUserObject || obj.userData.isGroupResult)
        );

        // Capture objects and groups
        userObjects.forEach(obj => {
            if (groupManager && groupManager.isGroupContainer(obj)) {
                // This is a group container
                state.groups.push(this.serializeGroup(obj, groupManager));
            } else if (!groupManager || !groupManager.isGrouped(obj)) {
                // This is a standalone object (not inside a group)
                state.objects.push(this.serializeObject(obj));
            }
        });

        // Capture current selection
        const selectedObjects = selectionManager.getSelectedObjects();
        state.selection = selectedObjects.map(obj => obj.uuid);

        return state;
    }

    /**
     * Serialize a single object
     * @param {THREE.Object3D} obj - The object to serialize
     * @returns {Object} Serialized object data
     */
    static serializeObject(obj) {
        const data = {
            uuid: obj.uuid,
            name: obj.name,
            type: obj.userData.shapeType || 'unknown',
            position: obj.position.toArray(),
            rotation: obj.rotation.toArray(),
            scale: obj.scale.toArray(),
            visible: obj.visible,
            userData: { ...obj.userData }
        };

        // Serialize material
        if (obj.material) {
            data.material = {
                color: obj.material.color.getHex(),
                opacity: obj.material.opacity,
                transparent: obj.material.transparent,
                wireframe: obj.material.wireframe
            };
        }

        // Special handling for text objects
        if (data.type === SHAPE_TYPES.TEXT && obj.userData.textContent) {
            data.textContent = obj.userData.textContent;
            data.textFont = obj.userData.textFont || 'sans';
        }

        return data;
    }

    /**
     * Serialize a group container with its children
     * @param {THREE.Group} group - The group to serialize
     * @param {GroupManager} groupManager - Group manager instance
     * @returns {Object} Serialized group data
     */
    static serializeGroup(group, groupManager) {
        const data = {
            uuid: group.uuid,
            name: group.name,
            position: group.position.toArray(),
            rotation: group.rotation.toArray(),
            scale: group.scale.toArray(),
            visible: group.visible,
            children: []
        };

        // Serialize all children in the group
        const children = groupManager.getGroupChildren(group);
        children.forEach(child => {
            data.children.push(this.serializeObject(child));
        });

        return data;
    }

    /**
     * Restore state to the scene
     * @param {Object} state - The state object to restore
     * @param {THREE.Scene} scene - The Three.js scene
     * @param {SelectionManager} selectionManager - Selection manager instance
     * @param {GroupManager} groupManager - Group manager instance
     * @param {ShapeFactory} shapeFactory - Shape factory instance
     * @param {TransformManager} transformManager - Transform manager instance (optional)
     * @returns {Array} Array of restored objects
     */
    static restoreState(state, scene, selectionManager, groupManager, shapeFactory, transformManager = null) {
        const restoredObjects = [];
        const uuidMap = new Map(); // Map old UUIDs to new objects

        // Detach transform controls before clearing scene to avoid errors
        if (transformManager) {
            transformManager.detach();
        }

        // Clear current scene (remove all user objects and group containers)
        const userObjects = scene.children.filter(obj => 
            obj.userData && (obj.userData.isUserObject || obj.userData.isGroupResult)
        );
        userObjects.forEach(obj => {
            scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(m => m.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });

        // Clear GroupManager's internal groups array
        if (groupManager && groupManager.groups) {
            groupManager.groups = [];
            groupManager.groupIdCounter = 0;
        }

        // Clear selection
        selectionManager.clear();

        // Restore shape counters
        if (state.counters && shapeFactory) {
            shapeFactory.shapeCounters = { ...state.counters };
        }

        // Restore standalone objects
        state.objects.forEach(objData => {
            const obj = this.deserializeObject(objData, shapeFactory);
            if (obj) {
                scene.add(obj);
                restoredObjects.push(obj);
                uuidMap.set(objData.uuid, obj);
            }
        });

        // Restore groups
        state.groups.forEach(groupData => {
            const { group, children } = this.deserializeGroup(groupData, shapeFactory);
            if (group && children.length > 0) {
                // Map old UUIDs to new children objects
                children.forEach(child => {
                    const originalChildData = groupData.children.find(c => c.uuid === child.uuid);
                    if (originalChildData) {
                        uuidMap.set(originalChildData.uuid, child);
                    }
                });

                // Add children to scene temporarily (createGroup will reparent them)
                children.forEach(child => {
                    scene.add(child);
                    restoredObjects.push(child);
                });

                // Create the group (this will remove children from scene and parent to group)
                const groupContainer = groupManager.createGroup(children, groupData.name);
                if (groupContainer) {
                    // Restore group transform
                    groupContainer.position.fromArray(groupData.position);
                    groupContainer.rotation.fromArray(groupData.rotation);
                    groupContainer.scale.fromArray(groupData.scale);
                    groupContainer.visible = groupData.visible;
                    groupContainer.uuid = groupData.uuid; // Preserve UUID for selection

                    restoredObjects.push(groupContainer);
                    uuidMap.set(groupData.uuid, groupContainer);
                }
            }
        });

        // Restore selection
        if (state.selection && state.selection.length > 0) {
            const selectedObjects = [];
            state.selection.forEach(uuid => {
                const obj = uuidMap.get(uuid);
                if (obj) {
                    selectedObjects.push(obj);
                }
            });
            
            // Apply selection
            if (selectedObjects.length > 0) {
                selectionManager.select(selectedObjects[0]);
                for (let i = 1; i < selectedObjects.length; i++) {
                    selectionManager.addToSelection(selectedObjects[i]);
                }
                
                // Re-attach transform controls to first selected (or group container if applicable)
                if (transformManager) {
                    const primarySelection = selectedObjects.find(obj => 
                        groupManager.isGroupContainer(obj)
                    ) || selectedObjects[0];
                    
                    if (selectedObjects.length === 1 || groupManager.isGroupContainer(primarySelection)) {
                        transformManager.attach(primarySelection);
                    }
                }
            }
        }

        return restoredObjects;
    }

    /**
     * Deserialize an object from data
     * @param {Object} data - Serialized object data
     * @param {ShapeFactory} shapeFactory - Shape factory instance
     * @returns {THREE.Object3D|null} Restored object
     */
    static deserializeObject(data, shapeFactory) {
        if (!shapeFactory) return null;

        const options = {
            color: data.material?.color,
            position: data.position,
            rotation: data.rotation.slice(0, 3), // Exclude rotation order
            scale: data.scale
        };

        // Special handling for text
        if (data.type === SHAPE_TYPES.TEXT) {
            options.text = data.textContent || 'Text';
            options.font = data.textFont || 'sans';
        }

        // Create the object
        const obj = shapeFactory.createShape(data.type, options);
        if (!obj) return null;

        // Restore properties
        obj.uuid = data.uuid; // Preserve UUID for proper selection restoration
        obj.name = data.name;
        obj.visible = data.visible;
        obj.userData = { ...data.userData };

        // Restore material properties
        if (data.material && obj.material) {
            obj.material.opacity = data.material.opacity;
            obj.material.transparent = data.material.transparent;
            obj.material.wireframe = data.material.wireframe;
        }

        return obj;
    }

    /**
     * Deserialize a group from data
     * @param {Object} data - Serialized group data
     * @param {ShapeFactory} shapeFactory - Shape factory instance
     * @returns {Object} Object with group container and children array
     */
    static deserializeGroup(data, shapeFactory) {
        const children = [];

        // Deserialize all children
        data.children.forEach(childData => {
            const child = this.deserializeObject(childData, shapeFactory);
            if (child) {
                children.push(child);
            }
        });

        return {
            group: data,
            children: children
        };
    }

    /**
     * Create a deep clone of a state object
     * @param {Object} state - State to clone
     * @returns {Object} Cloned state
     */
    static cloneState(state) {
        return JSON.parse(JSON.stringify(state));
    }

    /**
     * Compare two states for equality (useful for detecting changes)
     * @param {Object} stateA - First state
     * @param {Object} stateB - Second state
     * @returns {boolean} True if states are equal
     */
    static areStatesEqual(stateA, stateB) {
        return JSON.stringify(stateA) === JSON.stringify(stateB);
    }
}

export default StateCapture;
