/**
 * Lighting setup (Ambient and Directional)
 */

export default class Lighting {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.ambientLight = null;
        this.directionalLight = null;
        
        this.init();
    }

    init() {
        // Create ambient light
        const ambientIntensity = this.config.get('lighting.ambient.intensity');
        const ambientColor = this.hexToNumber(this.config.get('lighting.ambient.color'));
        
        this.ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
        this.scene.add(this.ambientLight);
        
        // Create directional light
        const directionalIntensity = this.config.get('lighting.directional.intensity');
        const directionalColor = this.hexToNumber(this.config.get('lighting.directional.color'));
        const position = this.config.get('lighting.directional.position');
        
        this.directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity);
        this.directionalLight.position.set(...position);
        
        // Enable shadows if configured
        if (this.config.get('lighting.castShadow')) {
            this.directionalLight.castShadow = true;
            this.directionalLight.shadow.mapSize.width = 2048;
            this.directionalLight.shadow.mapSize.height = 2048;
            this.directionalLight.shadow.camera.near = 0.5;
            this.directionalLight.shadow.camera.far = 50;
            this.directionalLight.shadow.camera.left = -10;
            this.directionalLight.shadow.camera.right = 10;
            this.directionalLight.shadow.camera.top = 10;
            this.directionalLight.shadow.camera.bottom = -10;
        }
        
        this.scene.add(this.directionalLight);
    }

    /**
     * Convert hex string to number
     */
    hexToNumber(hex) {
        return parseInt(hex.replace('#', ''), 16);
    }

    /**
     * Set ambient light intensity
     */
    setAmbientIntensity(intensity) {
        if (this.ambientLight) {
            this.ambientLight.intensity = intensity;
        }
    }

    /**
     * Set directional light intensity
     */
    setDirectionalIntensity(intensity) {
        if (this.directionalLight) {
            this.directionalLight.intensity = intensity;
        }
    }

    /**
     * Set ambient light color
     */
    setAmbientColor(color) {
        if (this.ambientLight) {
            this.ambientLight.color.set(this.hexToNumber(color));
        }
    }

    /**
     * Set directional light color
     */
    setDirectionalColor(color) {
        if (this.directionalLight) {
            this.directionalLight.color.set(this.hexToNumber(color));
        }
    }

    /**
     * Get ambient light
     */
    getAmbientLight() {
        return this.ambientLight;
    }

    /**
     * Get directional light
     */
    getDirectionalLight() {
        return this.directionalLight;
    }

    /**
     * Dispose lighting
     */
    dispose() {
        if (this.ambientLight) {
            this.scene.remove(this.ambientLight);
        }
        if (this.directionalLight) {
            this.scene.remove(this.directionalLight);
        }
    }
}
