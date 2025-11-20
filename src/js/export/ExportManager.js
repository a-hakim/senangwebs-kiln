/**
 * ExportManager.js
 * Handles exporting the scene to various 3D file formats
 * Supports GLTF and STL formats with proper scene preparation
 */

import EventEmitter from '../core/EventEmitter.js';
import { getTimestamp, downloadFile } from '../utils/Helpers.js';

class ExportManager extends EventEmitter {
    /**
     * @param {THREE.Scene} scene - The Three.js scene
     * @param {SWK} swkInstance - Main SWK instance
     * @param {Object} config - Configuration object
     */
    constructor(scene, swkInstance, config) {
        super();
        
        this.scene = scene;
        this.swk = swkInstance;
        this.config = config;
        
        // Check if exporters are available
        this.hasGLTFExporter = typeof THREE !== 'undefined' && THREE.GLTFExporter;
        this.hasSTLExporter = typeof THREE !== 'undefined' && THREE.STLExporter;
        
        if (!this.hasGLTFExporter) {
            console.warn('ExportManager: GLTFExporter not found. GLTF export will not be available.');
        }
        
        if (!this.hasSTLExporter) {
            console.warn('ExportManager: STLExporter not found. STL export will not be available.');
        }
    }

    /**
     * Prepare scene for export (filter out non-exportable objects)
     * @returns {Array} Array of exportable objects
     */
    prepareSceneForExport() {
        const exportableObjects = [];
        
        this.scene.children.forEach(child => {
            // Only export user-created objects
            if (child.userData && child.userData.isUserObject) {
                exportableObjects.push(child);
            }
        });
        
        return exportableObjects;
    }

    /**
     * Create a temporary scene with only exportable objects
     * @returns {THREE.Scene} Temporary scene for export
     */
    createExportScene() {
        const exportScene = new THREE.Scene();
        const objects = this.prepareSceneForExport();
        
        // Clone objects to temporary scene
        objects.forEach(obj => {
            const clone = obj.clone();
            exportScene.add(clone);
        });
        
        return exportScene;
    }

    /**
     * Export scene as GLTF/GLB format
     * @param {Object} options - Export options
     * @param {boolean} options.binary - Export as GLB (binary) instead of GLTF
     * @param {string} options.filename - Custom filename (without extension)
     * @returns {Promise<boolean>} Success status
     */
    async exportGLTF(options = {}) {
        if (!this.hasGLTFExporter) {
            console.error('GLTFExporter is not available');
            this.emit('exportError', { format: 'gltf', error: 'GLTFExporter not found' });
            return false;
        }

        const binary = options.binary !== undefined ? options.binary : false;
        const filename = options.filename || `scene-${getTimestamp()}`;
        const extension = binary ? 'glb' : 'gltf';
        
        try {
            this.emit('exportStart', { format: extension });
            
            // Create export scene
            const exportScene = this.createExportScene();
            
            if (exportScene.children.length === 0) {
                console.warn('No objects to export');
                this.emit('exportError', { format: extension, error: 'No objects to export' });
                return false;
            }
            
            // Create exporter
            const exporter = new THREE.GLTFExporter();
            
            // Export options
            const exportOptions = {
                binary: binary,
                embedImages: true,
                truncateDrawRange: false,
                onlyVisible: true,
                maxTextureSize: 4096
            };
            
            // Export
            return new Promise((resolve) => {
                exporter.parse(
                    exportScene,
                    (result) => {
                        try {
                            if (binary) {
                                // GLB - binary format
                                const blob = new Blob([result], { type: 'application/octet-stream' });
                                downloadFile(blob, `${filename}.${extension}`);
                            } else {
                                // GLTF - JSON format
                                const output = JSON.stringify(result, null, 2);
                                const blob = new Blob([output], { type: 'application/json' });
                                downloadFile(blob, `${filename}.${extension}`);
                            }
                            
                            console.log(`Exported ${exportScene.children.length} objects as ${extension.toUpperCase()}`);
                            this.emit('exportComplete', { 
                                format: extension, 
                                filename: `${filename}.${extension}`,
                                objectCount: exportScene.children.length
                            });
                            resolve(true);
                        } catch (error) {
                            console.error('Failed to download exported file:', error);
                            this.emit('exportError', { format: extension, error: error.message });
                            resolve(false);
                        }
                    },
                    (error) => {
                        console.error('GLTF export failed:', error);
                        this.emit('exportError', { format: extension, error: error.message });
                        resolve(false);
                    },
                    exportOptions
                );
            });
            
        } catch (error) {
            console.error('GLTF export error:', error);
            this.emit('exportError', { format: extension, error: error.message });
            return false;
        }
    }

    /**
     * Export scene as STL format
     * @param {Object} options - Export options
     * @param {boolean} options.binary - Export as binary STL instead of ASCII
     * @param {string} options.filename - Custom filename (without extension)
     * @returns {Promise<boolean>} Success status
     */
    async exportSTL(options = {}) {
        if (!this.hasSTLExporter) {
            console.error('STLExporter is not available');
            this.emit('exportError', { format: 'stl', error: 'STLExporter not found' });
            return false;
        }

        const binary = options.binary !== undefined ? options.binary : true;
        const filename = options.filename || `scene-${getTimestamp()}`;
        
        try {
            this.emit('exportStart', { format: 'stl' });
            
            // Get exportable objects
            const objects = this.prepareSceneForExport();
            
            if (objects.length === 0) {
                console.warn('No objects to export');
                this.emit('exportError', { format: 'stl', error: 'No objects to export' });
                return false;
            }
            
            // Create exporter
            const exporter = new THREE.STLExporter();
            
            // STL can only export one mesh at a time or merged geometry
            // We'll create a group and export it
            const exportGroup = new THREE.Group();
            objects.forEach(obj => {
                exportGroup.add(obj.clone());
            });
            
            // Export
            const result = exporter.parse(exportGroup, { binary: binary });
            
            // Download
            if (binary) {
                // Binary STL
                const blob = new Blob([result], { type: 'application/octet-stream' });
                downloadFile(blob, `${filename}.stl`);
            } else {
                // ASCII STL
                const blob = new Blob([result], { type: 'text/plain' });
                downloadFile(blob, `${filename}.stl`);
            }
            
            console.log(`Exported ${objects.length} objects as STL (${binary ? 'binary' : 'ASCII'})`);
            this.emit('exportComplete', { 
                format: 'stl', 
                filename: `${filename}.stl`,
                objectCount: objects.length,
                binary: binary
            });
            
            return true;
            
        } catch (error) {
            console.error('STL export error:', error);
            this.emit('exportError', { format: 'stl', error: error.message });
            return false;
        }
    }

    /**
     * Export selected objects only
     * @param {string} format - Export format ('gltf', 'glb', or 'stl')
     * @param {Object} options - Export options
     * @returns {Promise<boolean>} Success status
     */
    async exportSelected(format = 'gltf', options = {}) {
        const selected = this.swk.getSelectedObjects();
        
        if (selected.length === 0) {
            console.warn('No objects selected for export');
            this.emit('exportError', { format, error: 'No objects selected' });
            return false;
        }
        
        // Create temporary scene with selected objects
        const tempScene = new THREE.Scene();
        selected.forEach(obj => {
            tempScene.add(obj.clone());
        });
        
        // Temporarily swap scenes
        const originalScene = this.scene;
        this.scene = tempScene;
        
        let result;
        if (format === 'glb') {
            result = await this.exportGLTF({ ...options, binary: true });
        } else if (format === 'gltf') {
            result = await this.exportGLTF({ ...options, binary: false });
        } else if (format === 'stl') {
            result = await this.exportSTL(options);
        } else {
            console.error('Unknown export format:', format);
            result = false;
        }
        
        // Restore original scene
        this.scene = originalScene;
        
        return result;
    }

    /**
     * Get available export formats
     * @returns {Array<Object>} Array of available export formats
     */
    getAvailableFormats() {
        const formats = [];
        
        if (this.hasGLTFExporter) {
            formats.push(
                { format: 'gltf', name: 'GLTF (JSON)', extension: 'gltf', binary: false },
                { format: 'glb', name: 'GLB (Binary)', extension: 'glb', binary: true }
            );
        }
        
        if (this.hasSTLExporter) {
            formats.push(
                { format: 'stl', name: 'STL', extension: 'stl', binary: true }
            );
        }
        
        return formats;
    }

    /**
     * Check if a format is available
     * @param {string} format - Format to check
     * @returns {boolean} True if available
     */
    isFormatAvailable(format) {
        const formats = this.getAvailableFormats();
        return formats.some(f => f.format === format);
    }

    /**
     * Export scene as JSON format
     * @param {Object} options - Export options
     * @param {string} options.filename - Custom filename (without extension)
     * @returns {Promise<boolean>} Success status
     */
    async exportJSON(options = {}) {
        const filename = options.filename || `scene-${getTimestamp()}`;
        
        try {
            this.emit('exportStart', { format: 'json' });
            
            const data = {
                metadata: {
                    version: '1.0',
                    timestamp: Date.now(),
                    generator: 'SenangWebs Kiln'
                },
                groups: [],
                objects: []
            };
            
            // Export groups
            this.swk.groupManager.getAllGroups().forEach(group => {
                data.groups.push({
                    id: group.id,
                    name: group.name,
                    transform: {
                        position: group.container.position.toArray(),
                        rotation: group.container.quaternion.toArray(),
                        scale: group.container.scale.toArray()
                    }
                });
            });
            
            // Export objects
            this.swk.objects.forEach(obj => {
                // Skip if not user object
                if (!obj.userData.isUserObject) return;
                
                const objData = {
                    type: obj.userData.shapeType,
                    name: obj.name,
                    userData: { ...obj.userData },
                    transform: {
                        position: obj.position.toArray(),
                        rotation: obj.quaternion.toArray(),
                        scale: obj.scale.toArray()
                    },
                    groupId: obj.userData.groupId || null
                };
                
                data.objects.push(objData);
            });
            
            // Download
            const output = JSON.stringify(data, null, 2);
            const blob = new Blob([output], { type: 'application/json' });
            downloadFile(blob, `${filename}.json`);
            
            console.log(`Exported ${data.objects.length} objects as JSON`);
            this.emit('exportComplete', { 
                format: 'json', 
                filename: `${filename}.json`,
                objectCount: data.objects.length
            });
            
            return true;
            
        } catch (error) {
            console.error('JSON export error:', error);
            this.emit('exportError', { format: 'json', error: error.message });
            return false;
        }
    }

    /**
     * Import scene from JSON
     * @param {string|Object} jsonContent - JSON string or object
     * @returns {Promise<boolean>} Success status
     */
    async importJSON(jsonContent) {
        try {
            const data = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
            
            // Validate
            if (!data.metadata || !data.objects) {
                throw new Error('Invalid JSON format');
            }
            
            // Clear scene
            this.swk.clearScene(true);
            
            // Restore groups
            if (data.groups) {
                data.groups.forEach(groupData => {
                    this.swk.groupManager.restoreGroup(groupData);
                });
            }
            
            // Restore objects
            data.objects.forEach(objData => {
                // Reconstruct options from userData
                const options = {
                    color: objData.userData.color,
                    skipStateCapture: true
                };
                
                // Map specific properties based on type
                if (objData.type === 'text') {
                    options.text = objData.userData.textContent;
                    options.font = objData.userData.textFont;
                    options.height = objData.userData.textHeight;
                    options.bevel = objData.userData.textBevel;
                } else if (objData.type === 'polygon') {
                    options.sides = objData.userData.polygonSides;
                } else if (objData.type === 'tube') {
                    options.radius = objData.userData.outerRadius;
                    options.holeRadius = objData.userData.holeRadius;
                    options.length = objData.userData.length;
                }
                
                // Create shape (adds to scene and swk.objects)
                // We pass skipStateCapture=true to avoid spamming history (if supported)
                // But swk.addShape doesn't support it yet. We might need to add it.
                const mesh = this.swk.addShape(objData.type, options);
                
                if (mesh) {
                    // Restore transform
                    mesh.position.fromArray(objData.transform.position);
                    mesh.quaternion.fromArray(objData.transform.rotation);
                    mesh.scale.fromArray(objData.transform.scale);
                    
                    // Restore name
                    mesh.name = objData.name;
                    
                    // Restore all userData
                    Object.assign(mesh.userData, objData.userData);
                    
                    // Handle grouping
                    if (objData.groupId) {
                        this.swk.groupManager.restoreObjectToGroup(mesh, objData.groupId);
                    }
                }
            });
            
            // Capture state for the import action
            this.swk.captureState('Import JSON');
            
            console.log(`Imported ${data.objects.length} objects from JSON`);
            return true;
            
        } catch (error) {
            console.error('JSON import error:', error);
            return false;
        }
    }

    /**
     * Clean up
     */
    dispose() {
        this.removeAllListeners();
    }
}

export default ExportManager;
