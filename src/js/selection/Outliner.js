/**
 * Outline rendering and synchronization
 */

import { OUTLINE_THICKNESS } from '../utils/Constants.js';

export default class Outliner {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.outlineMap = new Map();
        this.outlineColor = this.hexToNumber(config.get('outlineColor'));
        this.outlineThickness = config.get('outlineThickness') || OUTLINE_THICKNESS;
    }

    /**
     * Create outline for mesh
     */
    createOutline(mesh) {
        if (!mesh || !mesh.geometry) {
            return null;
        }

        // Remove existing outline if present
        this.removeOutline(mesh);

        // Clone geometry for outline
        const outlineGeometry = mesh.geometry.clone();

        // Create outline material - rendered on backside
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: this.outlineColor,
            side: THREE.BackSide,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        });

        // Create outline mesh
        const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);

        // Check if this is a text object
        const isText = mesh.userData.textContent !== undefined;

        // Apply world transform
        this.updateOutlineTransform(mesh, outlineMesh, isText);

        // Add to scene
        this.scene.add(outlineMesh);

        // Store in map
        this.outlineMap.set(mesh, {
            outline: outlineMesh,
            mesh: mesh,
            isText: isText
        });

        return outlineMesh;
    }

    /**
     * Update outline transform to match mesh
     */
    updateOutlineTransform(mesh, outlineMesh, isText) {
        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        const worldScale = new THREE.Vector3();

        mesh.getWorldPosition(worldPosition);
        mesh.getWorldQuaternion(worldQuaternion);
        mesh.getWorldScale(worldScale);

        if (isText) {
            // For text geometry, use offset instead of scaling
            const offsetAmount = this.outlineThickness;
            outlineMesh.position.copy(worldPosition);
            outlineMesh.position.x += offsetAmount;
            outlineMesh.position.y += offsetAmount;
            outlineMesh.quaternion.copy(worldQuaternion);
            outlineMesh.scale.copy(worldScale);
        } else {
            // For other geometries, scale slightly larger
            outlineMesh.position.copy(worldPosition);
            outlineMesh.quaternion.copy(worldQuaternion);
            outlineMesh.scale.copy(worldScale).multiplyScalar(1 + this.outlineThickness);
        }
    }

    /**
     * Remove outline from mesh
     */
    removeOutline(mesh) {
        const outlineData = this.outlineMap.get(mesh);
        
        if (!outlineData) return;

        // Remove from scene
        this.scene.remove(outlineData.outline);

        // Dispose resources
        if (outlineData.outline.geometry) {
            outlineData.outline.geometry.dispose();
        }
        if (outlineData.outline.material) {
            outlineData.outline.material.dispose();
        }

        // Remove from map
        this.outlineMap.delete(mesh);
    }

    /**
     * Sync all outlines with their meshes
     * Should be called every frame in animation loop
     */
    syncOutlines() {
        for (const [mesh, outlineData] of this.outlineMap.entries()) {
            if (outlineData && outlineData.outline) {
                this.updateOutlineTransform(mesh, outlineData.outline, outlineData.isText);
            }
        }
    }

    /**
     * Create outlines for multiple meshes
     */
    createOutlines(meshes) {
        if (!meshes || !Array.isArray(meshes)) return;

        meshes.forEach(mesh => this.createOutline(mesh));
    }

    /**
     * Remove outlines from multiple meshes
     */
    removeOutlines(meshes) {
        if (!meshes || !Array.isArray(meshes)) return;

        meshes.forEach(mesh => this.removeOutline(mesh));
    }

    /**
     * Clear all outlines
     */
    clearAllOutlines() {
        for (const [mesh, outlineData] of this.outlineMap.entries()) {
            this.scene.remove(outlineData.outline);
            if (outlineData.outline.geometry) {
                outlineData.outline.geometry.dispose();
            }
            if (outlineData.outline.material) {
                outlineData.outline.material.dispose();
            }
        }
        this.outlineMap.clear();
    }

    /**
     * Update outline color
     */
    setOutlineColor(color) {
        this.outlineColor = this.hexToNumber(color);
        
        // Update all existing outlines
        for (const [mesh, outlineData] of this.outlineMap.entries()) {
            if (outlineData.outline.material) {
                outlineData.outline.material.color.set(this.outlineColor);
            }
        }
    }

    /**
     * Convert hex string to number
     */
    hexToNumber(hex) {
        return parseInt(hex.replace('#', ''), 16);
    }

    /**
     * Get outline for mesh
     */
    getOutline(mesh) {
        const outlineData = this.outlineMap.get(mesh);
        return outlineData ? outlineData.outline : null;
    }

    /**
     * Check if mesh has outline
     */
    hasOutline(mesh) {
        return this.outlineMap.has(mesh);
    }

    /**
     * Dispose all resources
     */
    dispose() {
        this.clearAllOutlines();
    }
}
