import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class AnimationManager {
    constructor(containerId, config = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.config = {
            wireframeDetail: config.wireframeDetail || 1,
            sphereSegments: config.sphereSegments || { width: 12, height: 8 },
            ...config
        };

        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = null;
        
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.setupGeometry();
        this.setupEventListeners();
        
        // Initialize animation
        this.lastTime = performance.now();
        this.animate();
    }

    setupGeometry() {
        if (this.config.type === 'landing') {
            this.setupLandingGeometry();
        } else {
            this.setupHeaderGeometry();
        }
    }

    setupLandingGeometry() {
        // Create optimized wireframe geometry
        const geometry = new THREE.IcosahedronGeometry(2, this.config.wireframeDetail);
        const material = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: this.getCSSColor('--animation-wireframe'),
            wireframeLinewidth: 2
        });
        this.wireframe = new THREE.Mesh(geometry, material);
        this.scene.add(this.wireframe);

        // Add optimized outer sphere
        const sphereGeometry = new THREE.SphereGeometry(
            3, 
            this.config.sphereSegments.width, 
            this.config.sphereSegments.height
        );
        const sphereMaterial = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: this.getCSSColor('--animation-sphere'),
            transparent: true,
            opacity: parseFloat(this.getCSSColor('--animation-opacity'))
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.sphere);

        this.camera.position.z = 6;
    }

    setupHeaderGeometry() {
        const planes = [];
        const planeGeometry = new THREE.PlaneGeometry(2, 2);
        const spacing = 0.2;
        
        for (let i = 0; i < 5; i++) {
            const material = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: this.getCSSColor('--animation-wireframe'),
                transparent: true,
                opacity: 1 - (i * 0.2)
            });
            const plane = new THREE.Mesh(planeGeometry, material);
            plane.position.z = -i * spacing;
            plane.rotation.x = Math.PI * 0.1;
            plane.rotation.y = Math.PI * 0.1;
            planes.push(plane);
            this.scene.add(plane);
        }
        this.planes = planes;
        this.camera.position.z = 4;
    }

    getCSSColor(variable) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(variable).trim();
    }

    updateColors() {
        if (this.config.type === 'landing') {
            this.updateLandingColors();
        } else {
            this.updateHeaderColors();
        }
    }

    updateLandingColors() {
        if (!this.wireframe || !this.sphere) return;
        
        const pulseIntensity = (Math.sin(performance.now() * 0.001 * 2) + 1) * 0.5;
        const intensity = pulseIntensity * parseFloat(this.getCSSColor('--animation-pulse-intensity'));
        
        const wireframeColor = new THREE.Color(this.getCSSColor('--animation-wireframe'));
        const wireframePulse = new THREE.Color(this.getCSSColor('--animation-wireframe-pulse'));
        this.wireframe.material.color.copy(wireframeColor).lerp(wireframePulse, intensity);
        
        const sphereColor = new THREE.Color(this.getCSSColor('--animation-sphere'));
        const spherePulse = new THREE.Color(this.getCSSColor('--animation-sphere-pulse'));
        this.sphere.material.color.copy(sphereColor).lerp(spherePulse, intensity);
    }

    updateHeaderColors() {
        if (!this.planes) return;
        this.planes.forEach((plane, i) => {
            const opacity = 1 - (i * 0.2);
            const primaryColor = new THREE.Color(this.getCSSColor('--animation-wireframe'));
            const primaryPulse = new THREE.Color(this.getCSSColor('--animation-wireframe-pulse'));
            const pulseIntensity = (Math.sin(performance.now() * 0.001) + 1) * 0.5;
            plane.material.color.copy(primaryColor).lerp(primaryPulse, pulseIntensity * 0.4);
            plane.material.opacity = opacity;
        });
    }

    animate() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) * 0.001; // Convert to seconds
        this.lastTime = currentTime;

        if (this.config.type === 'landing') {
            this.animateLanding(deltaTime);
        } else {
            this.animateHeader(deltaTime);
        }

        this.updateColors();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }

    animateLanding(deltaTime) {
        const angle = (performance.now() * 0.001) % (Math.PI * 2);
        
        if (this.wireframe) {
            this.wireframe.rotation.x = Math.sin(angle) * Math.PI;
            this.wireframe.rotation.y = Math.cos(angle) * Math.PI;
            this.wireframe.rotation.z = Math.sin(angle) * Math.PI * 0.5;

            const scale = 1 + Math.sin(angle) * 0.2;
            this.wireframe.scale.set(scale, scale, scale);
        }

        if (this.sphere) {
            this.sphere.rotation.x = -Math.sin(angle) * Math.PI;
            this.sphere.rotation.y = -Math.cos(angle) * Math.PI;
        }
    }

    animateHeader(deltaTime) {
        if (!this.planes) return;
        this.planes.forEach((plane, i) => {
            const speed = 0.5 - (i * 0.05);
            plane.rotation.z += 0.01 * speed * deltaTime * 60; // Normalize to 60fps
            plane.rotation.x = Math.sin(performance.now() * 0.001 * speed) * 0.1;
            plane.rotation.y = Math.cos(performance.now() * 0.001 * speed) * 0.1;
        });
    }

    setupEventListeners() {
        const resizeObserver = new ResizeObserver(() => this.handleResize());
        resizeObserver.observe(this.container);
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        if (!this.camera || !this.renderer || !this.container) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    dispose() {
        // Clean up resources
        this.scene.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }
} 