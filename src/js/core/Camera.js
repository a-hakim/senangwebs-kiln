/**
 * Camera management (Perspective and Orthographic)
 */

import { CAMERA_MODES } from '../utils/Constants.js';

export default class Camera {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.perspectiveCamera = null;
        this.orthographicCamera = null;
        this.currentCamera = null;
        this.currentMode = config.get('camera.mode');
        this.controls = null;
        
        this.init();
    }

    init() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;
        
        // Create perspective camera
        const fov = this.config.get('camera.fov');
        const near = this.config.get('camera.near');
        const far = this.config.get('camera.far');
        
        this.perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        
        // Create orthographic camera
        const frustumSize = 10;
        this.orthographicCamera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            near,
            far
        );
        
        // Set initial positions
        const position = this.config.get('camera.position');
        this.perspectiveCamera.position.set(...position);
        this.orthographicCamera.position.set(...position);
        
        // Set current camera
        this.currentCamera = this.currentMode === CAMERA_MODES.PERSPECTIVE 
            ? this.perspectiveCamera 
            : this.orthographicCamera;
        
        // Add resize listener
        window.addEventListener('resize', this.onResize.bind(this));
    }

    /**
     * Handle window resize
     */
    onResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;
        
        // Update perspective camera
        this.perspectiveCamera.aspect = aspect;
        this.perspectiveCamera.updateProjectionMatrix();
        
        // Update orthographic camera
        const frustumSize = 10;
        this.orthographicCamera.left = frustumSize * aspect / -2;
        this.orthographicCamera.right = frustumSize * aspect / 2;
        this.orthographicCamera.top = frustumSize / 2;
        this.orthographicCamera.bottom = frustumSize / -2;
        this.orthographicCamera.updateProjectionMatrix();
    }

    /**
     * Get current camera
     */
    getCamera() {
        return this.currentCamera;
    }

    /**
     * Get perspective camera
     */
    getPerspectiveCamera() {
        return this.perspectiveCamera;
    }

    /**
     * Get orthographic camera
     */
    getOrthographicCamera() {
        return this.orthographicCamera;
    }

    /**
     * Set camera mode
     */
    setMode(mode) {
        if (!Object.values(CAMERA_MODES).includes(mode)) {
            console.warn(`Invalid camera mode: ${mode}`);
            return;
        }

        // Save current camera state
        const currentPosition = this.currentCamera.position.clone();
        const currentTarget = this.controls ? this.controls.target.clone() : new THREE.Vector3();
        
        // Switch camera
        this.currentMode = mode;
        this.currentCamera = mode === CAMERA_MODES.PERSPECTIVE 
            ? this.perspectiveCamera 
            : this.orthographicCamera;
        
        // Restore camera state
        this.currentCamera.position.copy(currentPosition);
        
        // Update controls if they exist
        if (this.controls) {
            this.controls.object = this.currentCamera;
            this.controls.target.copy(currentTarget);
            this.controls.update();
        }
    }

    /**
     * Get current mode
     */
    getMode() {
        return this.currentMode;
    }

    /**
     * Set orbit controls
     */
    setControls(controls) {
        this.controls = controls;
    }

    /**
     * Reset camera position
     */
    reset() {
        const position = this.config.get('camera.position');
        this.currentCamera.position.set(...position);
        if (this.controls) {
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        }
    }

    /**
     * Set camera view position
     * @param {Array} position - [x, y, z] coordinates
     */
    setView(position) {
        this.currentCamera.position.set(...position);
        if (this.controls) {
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        }
    }

    /**
     * Dispose camera
     */
    dispose() {
        window.removeEventListener('resize', this.onResize.bind(this));
    }
}
