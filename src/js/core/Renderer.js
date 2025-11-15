/**
 * THREE.js Renderer management
 */

export default class Renderer {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.renderer = null;
        
        this.init();
    }

    init() {
        // Create WebGL renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        
        // Set size
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Set background color
        const bgColor = this.config.get('viewportBackground');
        this.renderer.setClearColor(this.hexToNumber(bgColor));
        
        // Enable shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Append to container
        this.container.appendChild(this.renderer.domElement);
        
        // Add resize listener
        window.addEventListener('resize', this.onResize.bind(this));
    }

    /**
     * Handle window resize
     */
    onResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.renderer.setSize(width, height);
    }

    /**
     * Convert hex string to number
     */
    hexToNumber(hex) {
        return parseInt(hex.replace('#', ''), 16);
    }

    /**
     * Render scene with camera
     */
    render(scene, camera) {
        this.renderer.render(scene, camera);
    }

    /**
     * Get renderer instance
     */
    getRenderer() {
        return this.renderer;
    }

    /**
     * Set background color
     */
    setBackgroundColor(color) {
        this.renderer.setClearColor(this.hexToNumber(color));
    }

    /**
     * Get canvas element
     */
    getCanvas() {
        return this.renderer.domElement;
    }

    /**
     * Dispose renderer
     */
    dispose() {
        window.removeEventListener('resize', this.onResize.bind(this));
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
    }
}
