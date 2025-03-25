import * as THREE from 'three';
import {  tunnelColor, oscillatorOneColor, neutraColorPalette, taliesenRed } from './colors.js';
import { stainedGlassTextureC, matcapB, matcapd } from '../textures/textures';


const labelMaterial = new THREE.MeshBasicMaterial({ color: neutraColorPalette.neutraBeige });

const subLabelMaterial = new THREE.MeshBasicMaterial({ color: neutraColorPalette.sunlitSand });

    //Avatar Keys
    const ringMaterialA = new THREE.MeshToonMaterial({
        color: tunnelColor,
        emissive: 0x44ff44, 
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
    });
    
    const ringMaterialB = new THREE.MeshToonMaterial({
        color: tunnelColor,
        emissive: 0x44ff44, 
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
    });
    
    const ringMaterialC = new THREE.MeshToonMaterial({
        color: tunnelColor,
        emissive: 0x44ff44, 
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
    });
    
    const ringMaterialD = new THREE.MeshToonMaterial({
        color: tunnelColor,
        emissive: 0x44ff44, 
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
    });
    
    const ringMaterialE = new THREE.MeshToonMaterial({
        color: tunnelColor,
        emissive: 0x44ff44, 
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
    });

    const orbMaterial = new THREE.MeshStandardMaterial({ 
        map: stainedGlassTextureC,
        color: 0xFFAA44,               
        emissive: 0xFF4500,          
        emissiveIntensity: 0.5,      
        transparent: false, 
        opacity: 0.7 
    });
    
    const orbGreyMaterial = new THREE.MeshStandardMaterial({ 
        color: neutraColorPalette.neutraBeige,              
        emissiveIntensity: 0.2,       
        transparent: false, 
        opacity: 1
    });

    const translucentMaterial = new THREE.MeshStandardMaterial({
        color: tunnelColor, 
        opacity: 0.5,   
        transparent: true,
        roughness: 0.5,  
        metalness: 0.1  
    });

    const sliderParticleMaterial = new THREE.MeshStandardMaterial({
        color: tunnelColor,
        transparent: true,
        opacity: 0.3,
        roughness: 0.5,
        metalness: 0.1,
    });


    

    const commonOrangeMaterial = new THREE.MeshStandardMaterial({ color: oscillatorOneColor });
    commonOrangeMaterial.roughness = 0.4;
    commonOrangeMaterial.metalness = 0.1;

    const textMaterial = new THREE.MeshMatcapMaterial({ color: neutraColorPalette.terracotta });

    textMaterial.matcap = matcapB;
    textMaterial.roughness = 0.4;
    textMaterial.metalness = 0.1;

    const matCapMaterialA = new THREE.MeshMatcapMaterial({ color: taliesenRed });
    matCapMaterialA.matcap = matcapd;
    matCapMaterialA.roughness = 0.9;
    matCapMaterialA.metalness = 0.1;

    export { labelMaterial, ringMaterialA, ringMaterialB, ringMaterialC, ringMaterialD, ringMaterialE, orbMaterial, orbGreyMaterial,
            commonOrangeMaterial, textMaterial, matCapMaterialA, translucentMaterial, subLabelMaterial, sliderParticleMaterial as volumeParticleMaterial
     };
