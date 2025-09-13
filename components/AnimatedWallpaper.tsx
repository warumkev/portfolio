'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const AnimatedWallpaper: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.IcosahedronGeometry(1, 15);
        const material = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true, transparent: true, opacity: 0.15 });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        camera.position.z = 2.5;

        const mouse = new THREE.Vector2();
        const onMouseMove = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.0005;
            sphere.rotation.y += 0.001;
            camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02;
            camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        const currentMount = mountRef.current;

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }

        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};

export default AnimatedWallpaper;
