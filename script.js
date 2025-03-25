import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as Tone from "tone";
import { scene, canvas, camera, renderer, mouse, raycaster } from './core/scene.js';
import { synth, noise, filter, lfo } from './audio/synth.js';
import {  oscillatorOneColor, tunnelColor, neutraColorPalette, taliesenRed } from './objects/colors.js';
import { commonOrangeMaterial, labelMaterial, matCapMaterialA, orbMaterial, ringMaterialB, ringMaterialC, subLabelMaterial,  textMaterial, translucentMaterial, volumeParticleMaterial } from './objects/materials.js';
import { ringGroup } from './objects/keyboard.js'
import { createSineWaveGeometry, sineMesh, sineHeight, sineWidth, sineDepth, sineRadius,
    createRoundedCubeGeometry, squareMesh,
    createRoundedTriangleGeometry, triangleMesh } from './objects/synthModules.js';
import Keyboard from './audio/keyboard.js'; 
//=========================================================================================================================

//Camera
scene.add(camera);
//Musical Keyboard
scene.add(ringGroup);
camera.add(ringGroup);
camera.lookAt(0, 0, 0); 
const objectDepth = 0;
const indRings = ringGroup.children;
const ringColor = neutraColorPalette.paleSkyBlue;
const ringDefaultColor = tunnelColor;
const keyboard = new Keyboard(raycaster, camera, indRings, synth, noise, ringColor, ringDefaultColor);
renderer.setClearColor(neutraColorPalette.oliveBrown);

scene.fog = new THREE.Fog(neutraColorPalette.sunlitSand, 10, 75);


const light = new THREE.AmbientLight();
scene.add(light);
light.intensity = 0.5;

//Dividing Lines===================================================================================

//Horizantal
const horizantalPoints = [];
horizantalPoints.push( new THREE.Vector3( -100, 0, 0 ) );
horizantalPoints.push( new THREE.Vector3( 200, 0, 0 ) );
const geometry = new THREE.BufferGeometry().setFromPoints( horizantalPoints );
const bottomLine = new THREE.Line( geometry, labelMaterial );
scene.add(bottomLine);
bottomLine.position.set(0, -4, 0);

const lineTwo = new THREE.Line( geometry, labelMaterial );
scene.add(lineTwo);
lineTwo.position.set(0, 3, objectDepth);


const lineThree = new THREE.Line( geometry, labelMaterial );
scene.add(lineThree);
lineThree.position.set(-65, -26, objectDepth);
const lineFour = new THREE.Line( geometry, labelMaterial );
scene.add(lineFour);
lineFour.position.set(-65, -48, objectDepth);

//Vertical
const verticalPoints = [];
verticalPoints.push( new THREE.Vector3( 0, 1, 0 ) );
verticalPoints.push( new THREE.Vector3( 0, -6, 0 ) );

const verticalGeometry = new THREE.BufferGeometry().setFromPoints( verticalPoints );
const leftLineVert = new THREE.Line( verticalGeometry, labelMaterial );
scene.add(leftLineVert);
leftLineVert.position.set(-7, 9, 0);

const centerLine = new THREE.Line( verticalGeometry, labelMaterial );
scene.add(centerLine);
centerLine.position.set(0, 2, 0);

const rightLineVert = new THREE.Line( verticalGeometry, labelMaterial );
scene.add(rightLineVert);
rightLineVert.position.set(7, 9, objectDepth);
//=======================================================================

//Oscillator Selector Objects
const sineSmoothness = 16;
const sineSegments = 64;
const pyramidWidth = 1;
const pyramidHeight = 0.866; 
const pyramidDepth = 0.02;
const pyramidRadius = 0.05;
const pyramidSmoothness = 4;

let activeShape = 'sine';

//Add Wave Shape Objects
const objectScale = 1;
const objectX = -10.2;
const objectY = 0.75;

scene.add(sineMesh);
sineMesh.scale.set(objectScale, objectScale, objectScale);
sineMesh.position.set (objectX, 5, objectDepth);
scene.add(triangleMesh);
triangleMesh.position.set (objectX, 5, objectDepth);
triangleMesh.scale.set(objectScale, objectScale, objectScale);
scene.add(squareMesh);
squareMesh.position.set (objectX, 5, objectDepth);
squareMesh.scale.set(objectScale, objectScale, objectScale);

//Selector Object

//Sine
const sphereSelectorGeometry = createSineWaveGeometry(
    sineWidth, sineHeight, sineDepth, sineRadius, sineSmoothness, sineSegments
);

const sphereSelectorMesh = new THREE.Mesh(sphereSelectorGeometry, translucentMaterial);
sphereSelectorMesh.position.set(0, sineHeight / 2 + 0.65, 0); 
scene.add(sphereSelectorMesh);
sphereSelectorMesh.scale.set(objectScale / 2, objectScale / 2, objectScale / 2);

//Triangle
const pyramidSelectorGeometry = createRoundedTriangleGeometry(
    pyramidWidth, pyramidHeight, pyramidDepth, pyramidRadius, pyramidSmoothness
);
const pyramidSelectorMesh = new THREE.Mesh(pyramidSelectorGeometry, translucentMaterial);
pyramidSelectorMesh.scale.set(objectScale / 2, objectScale / 2, objectScale / 2);
scene.add(pyramidSelectorMesh);

//Square
const cubeSelectorGeometry = createRoundedCubeGeometry(
    0.8, 0.8, 0.2, 0.05, 16
);
const cubeSelectorMesh = new THREE.Mesh(cubeSelectorGeometry, translucentMaterial);
cubeSelectorMesh.scale.set(objectScale / 2, objectScale / 2, objectScale / 2);
scene.add(cubeSelectorMesh);

const spacing = 1; 
pyramidSelectorMesh.position.set(-spacing, sineHeight / 2 + 0.5, 0);
cubeSelectorMesh.position.set(spacing, sineHeight / 2 + 0.5, 0); 
sphereSelectorMesh.visible = true;
pyramidSelectorMesh.visible = true;
cubeSelectorMesh.visible = true;
const selectorGroup = new THREE.Group();
selectorGroup.add(sphereSelectorMesh);
selectorGroup.add(pyramidSelectorMesh);
selectorGroup.add(cubeSelectorMesh);
scene.add(selectorGroup);

selectorGroup.position.set(objectX, objectY + 5, 0);

const selectors = [
    { mesh: sphereSelectorMesh, shape: 'sine' },
    { mesh: pyramidSelectorMesh, shape: 'pyramid' },
    { mesh: cubeSelectorMesh, shape: 'cube' }
];

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([...selectors.map(s => s.mesh)]);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        const selectedShape = selectors.find(s => s.mesh === clickedObject)?.shape;
        if (selectedShape) switchMainShape(selectedShape);
    }
});

function switchMainShape(shape) {
    if (shape === activeShape) return;

    sineMesh.visible = (shape === 'sine');
    triangleMesh.visible = (shape === 'pyramid');
    squareMesh.visible = (shape === 'cube');

    if (shape === 'sine') {
        sineMesh.visible = true;
        synth.oscillator.type = "sine";
    } 
    else if (shape === 'pyramid') {
        triangleMesh.visible = true;
        synth.oscillator.type = "triangle";
    } 
    else if (shape === 'cube') {
        squareMesh.visible = true;
        synth.oscillator.type = "square";
    }
    activeShape = shape;
    const shapeIndex = shape === 'sine' ? 0 : shape === 'pyramid' ? 1 : 2;
}

//==============================================================================

// Osc Volume Control
const volumeParticlesGroup = new THREE.Group();
const defaultVolumeLevel = 0.15;
synth.volume.value = Tone.gainToDb(defaultVolumeLevel);
const volumeParticleCount = 6;
const volumeParticleSpacing = 0.5;
const volumeParticleSize = 0.1;

for (let i = 0; i < volumeParticleCount; i++) {
    const volumeParticleGeometry = new THREE.SphereGeometry(volumeParticleSize, 16, 16);
    const volumeParticleMesh = new THREE.Mesh(volumeParticleGeometry, volumeParticleMaterial.clone());
    volumeParticleMesh.position.set(2.5, i * volumeParticleSpacing, 0); 
    volumeParticlesGroup.add(volumeParticleMesh);
}

let selectedVolumeParticle = null;

window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(volumeParticlesGroup.children);
    if (intersects.length > 0) {
        selectedVolumeParticle = intersects[0].object;
        selectedVolumeParticle.scale.set(2, 2, 2);
    }
});


window.addEventListener('mousemove', (event) => {
    if (selectedVolumeParticle) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -selectedVolumeParticle.position.z);
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);
        
        const clampedY = THREE.MathUtils.clamp(point.y - 4, 0, volumeParticleCount * volumeParticleSpacing);
        selectedVolumeParticle.position.y = clampedY;
        
        const volumeLevel = clampedY / (volumeParticleCount * volumeParticleSpacing);
        
        updateVolumeParticles(volumeLevel * 100);
        synth.volume.value = Tone.gainToDb(volumeLevel / 2);
     
        selectedVolumeParticle.visible = true;

    }
});

window.addEventListener('mouseup', () => {
    selectedVolumeParticle = null;
  
});

function updateVolumeParticles(volumeLevel) {
    const visibleParticles = Math.round((volumeLevel / 100) * volumeParticleCount);
    
    volumeParticlesGroup.children.forEach((particle, index) => {
        particle.material.opacity = index < visibleParticles ? 1 : 0.3;
    });
}

updateVolumeParticles(15);
scene.add(volumeParticlesGroup);
volumeParticlesGroup.position.set (-21, 4, 0);

//Noise========================

//Noise Volume Slider -- Perfect
const noiseParticlesGroup = new THREE.Group();
scene.add(noiseParticlesGroup);
const noiseParticleCount = 6;
const noiseParticleSpacing = 0.5; 
const noiseParticleSize = .1; 

for (let i = 0; i < noiseParticleCount; i++) {
    const noiseParticleGeometry = new THREE.SphereGeometry(noiseParticleSize, 16, 16);
    const noiseParticleMesh = new THREE.Mesh(noiseParticleGeometry, volumeParticleMaterial.clone()); 
    noiseParticleMesh.position.set(2.5, i * noiseParticleSpacing, -5); 
    noiseParticlesGroup.add(noiseParticleMesh);

}
let noiseParticle = null;
window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(noiseParticlesGroup.children);
    if (intersects.length > 0) {
        noiseParticle = intersects[0].object; 
        noiseParticle.scale.set(2, 2, 2); 
    }
});


window.addEventListener('mousemove', (event) => {
    if (noiseParticle) {
     
        const rect = canvas.getBoundingClientRect();
mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -noiseParticle.position.z); 
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);
        const clampedY = THREE.MathUtils.clamp(point.y - 4, 0, noiseParticleCount * noiseParticleSpacing);
        noiseParticle.position.y = clampedY;
        const noiseLevel = clampedY / (noiseParticleCount * noiseParticleSpacing);
        noise.volume.value = Tone.gainToDb(noiseLevel / 3);
        updateNoiseParticle(noiseLevel * 100); 
    }
});



window.addEventListener('mouseup', () => {
    noiseParticle = null; 
});

function updateNoiseParticle(noiseLevel) {
    const visibleNoiseParticles = Math.round((noiseLevel / 100) * noiseParticleCount);

    noiseParticlesGroup.children.forEach((particle, index) => {
    particle.material.opacity = index < visibleNoiseParticles ? 1 : 0.3;
    });
}

noiseParticlesGroup.position.set(-2.5, 4, 0);

//Filter========================================

//Filter Cutoff Control
const filterParticlesGroup = new THREE.Group();
scene.add(filterParticlesGroup);
const filterParticlesCount = 6;
const filterParticlesSpacing = 0.5; 
const filterParticlesSize = .1; 

for (let i = 0; i < filterParticlesCount; i++) {
    const filterParticlesGeometry = new THREE.SphereGeometry(filterParticlesSize, 16, 16);
    const filterParticleMesh = new THREE.Mesh(filterParticlesGeometry, volumeParticleMaterial.clone()); // Clone material for each particle

    filterParticleMesh.position.set(1.5, i * filterParticlesSpacing, -10); // Adjust `x`, `y`, and `z` as needed
    filterParticlesGroup.add(filterParticleMesh);
}

let selectedFilterParticle = null;
window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(filterParticlesGroup.children);
    if (intersects.length > 0) {
        selectedFilterParticle = intersects[0].object;
        selectedFilterParticle.scale.set(2, 2, 2); 
    }
});


window.addEventListener('mousemove', (event) => {
    if (selectedFilterParticle) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const filterPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -selectedFilterParticle.position.z); // Plane at the particle's Z
        const filterPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(filterPlane, filterPoint);
        const clampedFilterY = THREE.MathUtils.clamp(filterPoint.y - 4, 0, filterParticlesCount * filterParticlesSpacing);
        selectedFilterParticle.position.y = clampedFilterY;
        const filterCutoff = clampedFilterY / (filterParticlesCount * filterParticlesSpacing);
        const minFrequency = 20; 
        const maxFrequency = 20000; 
        const logFrequency = minFrequency * Math.pow(maxFrequency / minFrequency, filterCutoff);


filter.frequency.value = logFrequency;
console.log("Logarithmic Filter Cutoff Frequency:", logFrequency);
        console.log(filterCutoff * 20000);
        updateFilterCutoff(filterCutoff * 100);
    }
});

window.addEventListener('mouseup', () => {
    selectedFilterParticle = null; // Release the particle
});

function updateFilterCutoff(filterCutoff) {
    const visibleFilterParticles = Math.round((filterCutoff / 100) * filterParticlesCount);

    filterParticlesGroup.children.forEach((particle, index) => {
        particle.material.opacity = index < visibleFilterParticles ? 1 : 0.3;
    });
}

filterParticlesGroup.position.set(9, 4, 0);
// updateFilterCutoff(20000);

//Resonance

//Filter Cutoff Control
const resonanceParticleGroup = new THREE.Group();
scene.add(resonanceParticleGroup);
const resonanceParticleCount = 6;
const resonanceParticleSpacing = 0.5; 
const resonanceParticleSize = .1; 

for (let i = 0; i < resonanceParticleCount; i++) {
    const resonanceParticleGeometry = new THREE.SphereGeometry(resonanceParticleSize, 16, 16);
    const resonanceParticleMesh = new THREE.Mesh(resonanceParticleGeometry, volumeParticleMaterial.clone()); // Clone material for each particle

    resonanceParticleMesh.position.set(1.5, i * resonanceParticleSpacing, -10); // Adjust `x`, `y`, and `z` as needed
    resonanceParticleGroup.add(resonanceParticleMesh);
}

let selectedRezParticle = null;

window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(resonanceParticleGroup.children);
    if (intersects.length > 0) {
        selectedRezParticle = intersects[0].object;
        selectedRezParticle.scale.set(2, 2, 2); 
    }
});


window.addEventListener('mousemove', (event) => {
    if (selectedRezParticle) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const rezPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -selectedRezParticle.position.z); // Plane at the particle's Z
        const rezPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(rezPlane, rezPoint);
        const clampedRezY = THREE.MathUtils.clamp(rezPoint.y - 4, 0, resonanceParticleCount * resonanceParticleSpacing);
        selectedRezParticle.position.y = clampedRezY;
        const filterResonance = clampedRezY / (resonanceParticleCount * resonanceParticleSpacing);
        const minFrequency = 20; 
        const maxFrequency = 100; 
        const logFrequency = minFrequency * Math.pow(maxFrequency / minFrequency, filterResonance);


        filter.Q.value = logFrequency / 10;
console.log("Logarithmic Q", logFrequency);
        console.log(filterResonance);
        updateResonance(filterResonance * 100);
    }
});

window.addEventListener('mouseup', () => {
    selectedRezParticle = null; // Release the particle
});

function updateResonance(filterResonance) {
    const visibleResonanceParticle = Math.round((filterResonance / 100) * resonanceParticleCount);

    resonanceParticleGroup.children.forEach((particle, index) => {
        particle.material.opacity = index < visibleResonanceParticle ? 1 : 0.3;
    });
}

resonanceParticleGroup.position.set(15.5, 4, 0);

//Attack Particle Group
const attackParticleGroup = new THREE.Group();
scene.add(attackParticleGroup);
const attackParticleCount = 6;
const attackParticleSpacing = 0.5; 
const attackParticleSize = .1; 


for (let i = 0; i < attackParticleCount; i++) {
    const attackParticleGeometry = new THREE.SphereGeometry(attackParticleSize, 16, 16);
    const attackParticleMesh = new THREE.Mesh(attackParticleGeometry, volumeParticleMaterial.clone()); // Clone material for each particle

    attackParticleMesh.position.set(0, i * attackParticleSpacing, 0); // Adjust `x`, `y`, and `z` as needed
    attackParticleGroup.add(attackParticleMesh);
}

//Slider control

let selectedAttackParticle = null;

window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(attackParticleGroup.children);
    if (intersects.length > 0) {
        selectedAttackParticle = intersects[0].object; // Select the particle
        selectedAttackParticle.scale.set(2, 2, 2); 
    }
});


window.addEventListener('mousemove', (event) => {
    if (selectedAttackParticle) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -selectedAttackParticle.position.z); // Plane at the particle's Z
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);
        const clampedY = THREE.MathUtils.clamp(point.y + 3, 0, attackParticleCount * attackParticleSpacing);
        selectedAttackParticle.position.y = clampedY;
        const attackPercent = clampedY / (attackParticleCount * attackParticleSpacing);
        console.log(`Volume Level: ${attackPercent.toFixed(2)}`);
        synth.envelope.attack = attackPercent;
        noise.envelope.attack = attackPercent;
        updateAttackParticles(attackPercent * 100); // Scale volume to 0-100 for consistency
    }
});

window.addEventListener('mouseup', () => {
    selectedAttackParticle = null; // Release the particle
});

function updateAttackParticles(attackPercent) {
    const visibleParticles = Math.round((attackPercent / 100) * attackParticleCount);

    attackParticleGroup.children.forEach((particle, index) => {
        if (index < visibleParticles) {
            particle.material.opacity = 1; // Fully visible for active particles
        } else {
            particle.material.opacity = 0.3; // Translucent for inactive particles
        }
    });
}

updateAttackParticles(10);
attackParticleGroup.position.set(4.5, -3, 0);


//Decay Particle Group
const decayParticleGroup = new THREE.Group();
scene.add(decayParticleGroup);
const decayParticleCount = 6;
const decayParticleSpacing = 0.5; 
const decayparticleSize = .1; 


for (let i = 0; i < decayParticleCount; i++) {
    const decayParticleGeometry = new THREE.SphereGeometry(decayparticleSize, 16, 16);
    const decayParticleMesh = new THREE.Mesh(decayParticleGeometry, volumeParticleMaterial.clone()); // Clone material for each particle

    decayParticleMesh.position.set(0, i * decayParticleSpacing, 0); // Adjust `x`, `y`, and `z` as needed
    decayParticleGroup.add(decayParticleMesh);
}

//Slider control
let selectedDecayParticle = null;

window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(decayParticleGroup.children);
    if (intersects.length > 0) {
        selectedDecayParticle = intersects[0].object; // Select the particle
        selectedDecayParticle.scale.set(2, 2, 2); 
    }
});


window.addEventListener('mousemove', (event) => {
    if (selectedDecayParticle) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -selectedDecayParticle.position.z); // Plane at the particle's Z
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);
        const clampedY = THREE.MathUtils.clamp(point.y + 3, 0, decayParticleCount * decayParticleSpacing);
        selectedDecayParticle.position.y = clampedY;
        const decayPercent = clampedY / (decayParticleCount * decayParticleSpacing);
        synth.envelope.decay = decayPercent;
        noise.envelope.decay = decayPercent;

        console.log(`Decay Level: ${decayPercent.toFixed(2)}`);

        updateDecayParticles(decayPercent * 100); // Scale volume to 0-100 for consistency
    }
});

window.addEventListener('mouseup', () => {
    selectedDecayParticle = null; // Release the particle
});

function updateDecayParticles(decayPercent) {
    const visibleParticles = Math.round((decayPercent / 100) * decayParticleCount);

    decayParticleGroup.children.forEach((particle, index) => {
        if (index < visibleParticles) {
            particle.material.opacity = 1; // Fully visible for active particles
        } else {
            particle.material.opacity = 0.3; // Translucent for inactive particles
        }
    });
}

updateDecayParticles(10);
decayParticleGroup.position.set(8.25, -3, 0);

//Sustain Particle Group
const sustainParticleGroup = new THREE.Group();
scene.add(sustainParticleGroup);
const sustainParticleCount = 6;
const sustainParticleSpacing = 0.5; 
const sustainParticleSize = .1; 

for (let i = 0; i < sustainParticleCount; i++) {
    const sustainParticleGeometry = new THREE.SphereGeometry(sustainParticleSize, 16, 16);
    const sustsainParticleMesh = new THREE.Mesh(sustainParticleGeometry, volumeParticleMaterial.clone()); // Clone material for each particle

    sustsainParticleMesh.position.set(0, i * sustainParticleSpacing, 0); // Adjust `x`, `y`, and `z` as needed
    sustainParticleGroup.add(sustsainParticleMesh);
}

//Slider control
let selectedSustainParticle = null;

window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(sustainParticleGroup.children);
    if (intersects.length > 0) {
        selectedSustainParticle = intersects[0].object; // Select the particle
        selectedSustainParticle.scale.set(2, 2, 2); 
    }
});


window.addEventListener('mousemove', (event) => {
    if (selectedSustainParticle) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -selectedSustainParticle.position.z); // Plane at the particle's Z
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);
        const clampedY = THREE.MathUtils.clamp(point.y + 3, 0, sustainParticleCount * sustainParticleSpacing);
        selectedSustainParticle.position.y = clampedY;
        const sustainPercent = clampedY / (sustainParticleCount * sustainParticleSpacing);
        synth.envelope.sustain = sustainPercent;
        noise.envelope.sustain = sustainPercent;
        updateSustainParticles(sustainPercent * 100); // Scale volume to 0-100 for consistency
    }
});

window.addEventListener('mouseup', () => {
    selectedSustainParticle = null; // Release the particle
});

function updateSustainParticles(sustainPercent) {
    const visibleParticles = Math.round((sustainPercent / 100) * sustainParticleCount);

    sustainParticleGroup.children.forEach((particle, index) => {
        if (index < visibleParticles) {
            particle.material.opacity = 1; // Fully visible for active particles
        } else {
            particle.material.opacity = 0.3; // Translucent for inactive particles
        }
    });
}

updateSustainParticles(10);
sustainParticleGroup.position.set(12.35, -3, 0);

//Release Particle Group
const releaseParticleGroup = new THREE.Group();
scene.add(releaseParticleGroup);
const releaseParticleCount = 6;
const releaseParticleSpacing = 0.5; 
const releaseParticleSize = .1; 

for (let i = 0; i < releaseParticleCount; i++) {
    const releaseParticleGeometry = new THREE.SphereGeometry(releaseParticleSize, 16, 16);
    const releaseParticleMesh = new THREE.Mesh(releaseParticleGeometry, volumeParticleMaterial.clone()); // Clone material for each particle

    releaseParticleMesh.position.set(0, i * releaseParticleSpacing, 0); // Adjust `x`, `y`, and `z` as needed
    releaseParticleGroup.add(releaseParticleMesh);
}

//Slider control
let selectedReleaseParticle = null;

window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(releaseParticleGroup.children);
    if (intersects.length > 0) {
        selectedReleaseParticle = intersects[0].object; // Select the particle
        selectedReleaseParticle.scale.set(2, 2, 2); 
    }
});


window.addEventListener('mousemove', (event) => {
    if (selectedReleaseParticle) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -selectedReleaseParticle.position.z); // Plane at the particle's Z
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);
        const clampedY = THREE.MathUtils.clamp(point.y + 3, 0, releaseParticleCount * releaseParticleSpacing);
        selectedReleaseParticle.position.y = clampedY;
        const releasePercent = clampedY / (releaseParticleCount * releaseParticleSpacing);
        synth.envelope.release = releasePercent;
        noise.envelope.release = releasePercent;
        updateReleaseParticles(releasePercent * 100); // Scale volume to 0-100 for consistency
    }
});

window.addEventListener('mouseup', () => {
    selectedReleaseParticle = null; // Release the particle
});

function updateReleaseParticles(releasePercent) {
    const visibleParticles = Math.round((releasePercent / 100) * releaseParticleCount);

    releaseParticleGroup.children.forEach((particle, index) => {
        if (index < visibleParticles) {
            particle.material.opacity = 1; // Fully visible for active particles
        } else {
            particle.material.opacity = 0.3; // Translucent for inactive particles
        }
    });
}

updateReleaseParticles(10);
releaseParticleGroup.position.set(16.25, -3, 0);

//LFO
//LFO Rate Control

const lfoRateParticleGroup = new THREE.Group();
scene.add(lfoRateParticleGroup);
const lfoRateParticleCount = 6;
const lfoRateParticleSpacing = 0.5; 
const lfoRateParticleSize = 0.1; 

for (let i = 0; i < lfoRateParticleCount; i++) {
    const lfoRateParticleGeometry = new THREE.SphereGeometry(lfoRateParticleSize, 16, 16);
    const lfoRateParticleMesh = new THREE.Mesh(lfoRateParticleGeometry, volumeParticleMaterial.clone());
    lfoRateParticleGeometry.center();
    lfoRateParticleMesh.position.set(0, i * lfoRateParticleSpacing, 0); 
    lfoRateParticleGroup.add(lfoRateParticleMesh);
}

let selectedLfoRateParticle = null;

window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(lfoRateParticleGroup.children);
    if (intersects.length > 0) {
        selectedLfoRateParticle = intersects[0].object;
        selectedLfoRateParticle.scale.set(2, 2, 2); 
    }
});


window.addEventListener('mousemove', (event) => {
    if (selectedLfoRateParticle) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const lfoRatePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -selectedLfoRateParticle.position.z); 
        const lfoRatePoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(lfoRatePlane, lfoRatePoint);
        const clampedRezY = THREE.MathUtils.clamp(lfoRatePoint.y + 3, 0, lfoRateParticleCount * lfoRateParticleSpacing);
        selectedLfoRateParticle.position.y = clampedRezY;
        const lfoRate = clampedRezY / (lfoRateParticleCount * lfoRateParticleSpacing);
        const minFrequency = 0.01; 
        const maxFrequency = 20; 
        const logFrequency = minFrequency * Math.pow(maxFrequency / minFrequency, lfoRate);
        lfo.frequency.value = logFrequency;
        updateLFORate(logFrequency * 100);
    }
});

window.addEventListener('mouseup', () => {
    selectedLfoRateParticle = null; 
});

function updateLFORate(lfoRate) {
    const visibleLfoRateParticle = Math.round((lfoRate / 100) * lfoRateParticleCount);

    lfoRateParticleGroup.children.forEach((particle, index) => {
        particle.material.opacity = index < visibleLfoRateParticle ? 1 : 0.3;
    });
}
lfoRateParticleGroup.position.set(-13.1, -3, 0);


//LFO Depth Control

const lfoDepthParticleGroup = new THREE.Group();
scene.add(lfoDepthParticleGroup);
const lfoDepthParticleCount = 6;
const lfoDepthParticleSpacing = 0.5; 
const lfoDepthParticleSize = 0.1; 

for (let i = 0; i < lfoDepthParticleCount; i++) {
    const lfodepthParticleGeometry = new THREE.SphereGeometry(lfoDepthParticleSize, 16, 16);
    const lfoDepthParticleMesh = new THREE.Mesh(lfodepthParticleGeometry, volumeParticleMaterial.clone()); 
    lfodepthParticleGeometry.center();
    lfoDepthParticleMesh.position.set(0, i * lfoDepthParticleSpacing, 0); 
    lfoDepthParticleGroup.add(lfoDepthParticleMesh);
}

let selectedLfoDepthParticle = null;

window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(lfoDepthParticleGroup.children);
    if (intersects.length > 0) {
        selectedLfoDepthParticle = intersects[0].object;
        selectedLfoDepthParticle.scale.set(2, 2, 2); 
    }
});


window.addEventListener('mousemove', (event) => {
    if (selectedLfoDepthParticle) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const lfoDepthPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -selectedLfoDepthParticle.position.z); 
        const lfoDepthPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(lfoDepthPlane, lfoDepthPoint);
        const clampedRezY = THREE.MathUtils.clamp(lfoDepthPoint.y + 3, 0, lfoDepthParticleCount * lfoDepthParticleSpacing);
        selectedLfoDepthParticle.position.y = clampedRezY;
        const lfoDepth = clampedRezY / (lfoDepthParticleCount * lfoDepthParticleSpacing);
        lfo.amplitude.value = lfoDepth;
        updateLfoDepth(lfoDepth * 100);
    }
});

window.addEventListener('mouseup', () => {
    selectedLfoDepthParticle = null;
});

function updateLfoDepth(lfoDepth) {
    const visibleLfoDepthParticle = Math.round((lfoDepth / 100) * lfoDepthParticleCount);

    lfoDepthParticleGroup.children.forEach((particle, index) => {
        particle.material.opacity = index < visibleLfoDepthParticle ? 1 : 0.3;
    });
}

lfoDepthParticleGroup.position.set(-5, -3, 0);

//Octaves

//ARROWS

//LP FILTER CONTROL ...OR VOLUME

const arrowWidth = 1;
const arrowHeight = 0.866; 
const arrowDepth = 0.02;
const arrowRadius = 0.05;
const arrowSmoothness = 4;

const arrowMaterial = new THREE.MeshBasicMaterial( {color : neutraColorPalette.sageGreen });
const arrowGeometry = createRoundedTriangleGeometry(arrowWidth, arrowHeight, arrowDepth, arrowRadius, arrowSmoothness);
const arrowMesh = new THREE.Mesh(arrowGeometry, arrowMaterial);

arrowMesh.visible = true;

const filterGroup = new THREE.Group();

function createArrow(color) {
    const arrow = new THREE.Group();

    const headGeometry = createRoundedTriangleGeometry(arrowWidth, arrowHeight, arrowDepth, arrowRadius, arrowSmoothness);
    const head = new THREE.Mesh(headGeometry, arrowMaterial);
    head.position.y = 0; 
    arrow.add(head);

    return arrow;
}

const arrowLeft = createArrow(neutraColorPalette.sageGreen);
arrowLeft.scale.set(.5, .5, .5) 
const arrowRight = createArrow(neutraColorPalette.sageGreen);
arrowRight.scale.set(.5, .5, .5)

const arrowOffsetX = 0.1; 
const arrowOffsetY = -0.035;
arrowLeft.position.set(arrowOffsetX - 1, arrowOffsetY , -.2); 
arrowRight.position.set(arrowOffsetX - 0.1 , arrowOffsetY , -.2);
arrowLeft.rotation.z = Math.PI * .5;
arrowRight.rotation.z = Math.PI * 1.5;
filterGroup.add(arrowLeft);
filterGroup.add(arrowRight);
scene.add(filterGroup);

window.addEventListener('keydown', (event) => {
    event.preventDefault();
    switch (event.key) {
        case 'ArrowRight': 
    
            arrowMaterial.color.set(neutraColorPalette.sunlitSand); 
            updateBackground();
           
            break;
        case 'ArrowLeft': 
          
            arrowMaterial.color.set(neutraColorPalette.oliveBrown); 
            updateBackground();
            break;
    }
});

window.addEventListener('keyup', (event) => {
    event.preventDefault();
    switch (event.key) {
        case 'ArrowRight': 
        case 'ArrowLeft': 
            arrowMaterial.color.set(neutraColorPalette.sageGreen); 
            updateBackground();
            break;
    }
});

filterGroup.position.set(0.425, -4.5, 0);
camera.add(filterGroup);

//==========================================================================================

//Labels
const fontLoader = new FontLoader();
fontLoader.load("fonts/P22 FLLW Exhibition_Regular.json", function(font) {

    function createLetter(letter, font){
    return new TextGeometry(letter, {
        font: font,
        size: 8,
        height: 0.01,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .01,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 1
    });
}
    const aGeometry = createLetter('A', font);
    const dGeometry = createLetter('D', font);
    const sGeometry = createLetter('S', font);
    const rGeometry = createLetter('R', font);
    const adsrMaterial = new THREE.MeshPhysicalMaterial
    const aMesh = new THREE.Mesh(aGeometry, textMaterial);

// //Labels
const labelSize = .1;
const oscWordGeometry = createLetter('OSCILLATOR', font);
const oscillatorMesh = new THREE.Mesh(oscWordGeometry, labelMaterial);
oscillatorMesh.position.set(-17.5, 8.5, 0);
oscillatorMesh.scale.set(labelSize, labelSize, labelSize)
scene.add(oscillatorMesh);

const noiseWordGeometry = createLetter('Noise', font);
const noiseMesh = new THREE.Mesh(noiseWordGeometry, labelMaterial);
noiseMesh.position.set(-1.5, 8.5, 0);
noiseMesh.scale.set(labelSize, labelSize, labelSize)
scene.add(noiseMesh);

const filterWordGeometry = createLetter('Filter', font);
const filterWordMesh = new THREE.Mesh(filterWordGeometry, labelMaterial);
filterWordMesh.position.set(12, 8.5, 0);
filterWordMesh.scale.set(labelSize, labelSize, labelSize)
scene.add(filterWordMesh);

const tremoloWordGeometry = createLetter('LFO', font);
const tremoloWordMesh = new THREE.Mesh(tremoloWordGeometry, labelMaterial);
tremoloWordMesh.position.set(-10, 1.5, 0);
tremoloWordMesh.scale.set(labelSize, labelSize, labelSize)
scene.add(tremoloWordMesh);

const adsrWordGeometry = createLetter('adsr', font);
const adsrWordMesh = new THREE.Mesh(adsrWordGeometry, labelMaterial);
adsrWordMesh.position.set(9, 1.5, objectDepth);
adsrWordMesh.scale.set(labelSize, labelSize, labelSize)
scene.add(adsrWordMesh);

const oscLevelWordGeometry = createLetter('Level', font);
const oscLevelWordMesh = new THREE.Mesh(oscLevelWordGeometry, subLabelMaterial);
oscLevelWordMesh.position.set(-19.25, 7.5, 0);
oscLevelWordMesh.scale.set(labelSize / 1.5, labelSize / 1.5, labelSize / 1.5)
scene.add(oscLevelWordMesh)

const typeWordGeometry = createLetter('Type', font);
const typeWordMesh = new THREE.Mesh(typeWordGeometry, subLabelMaterial);
typeWordMesh.position.set(-11, 7.5, 0);
typeWordMesh.scale.set(labelSize / 1.5, labelSize / 1.5, labelSize / 1.5)
scene.add(typeWordMesh)

const noiseLevelWordGeometry = createLetter('Level', font);
const noiseLevelWordMesh = new THREE.Mesh(noiseLevelWordGeometry, subLabelMaterial);
noiseLevelWordMesh.position.set(-.75, 7.5, 0);
noiseLevelWordMesh.scale.set(labelSize / 1.5, labelSize / 1.5, labelSize / 1.5)
scene.add(noiseLevelWordMesh)

const cutoffWordGeometry = createLetter('Cutoff', font);
const cutoffWordMesh = new THREE.Mesh(cutoffWordGeometry, subLabelMaterial);
cutoffWordMesh.position.set(9, 7.5, 0);
cutoffWordMesh.scale.set(labelSize / 1.5, labelSize / 1.5, labelSize / 1.5)
scene.add(cutoffWordMesh)

const resonanceWordGeometry = createLetter('Resonance', font);
const resonanceWordMesh = new THREE.Mesh(resonanceWordGeometry, subLabelMaterial);
resonanceWordMesh.position.set(15, 7.5, 0);
resonanceWordMesh.scale.set(labelSize / 1.5, labelSize / 1.5, labelSize / 1.5)
scene.add(resonanceWordMesh)

const attackWordGeometry = createLetter('Attack', font);
const attackWordMesh = new THREE.Mesh(attackWordGeometry, subLabelMaterial);
attackWordMesh.position.set(3, 0.5, 0);
attackWordMesh.scale.set(labelSize / 1.5, labelSize / 1.5, labelSize / 1.5)
scene.add(attackWordMesh)

const decayWordGeometry = createLetter('Decay', font);
const decayWordMesh = new THREE.Mesh(decayWordGeometry, subLabelMaterial);
decayWordMesh.position.set(7, 0.5, 0);
decayWordMesh.scale.set(labelSize / 1.5, labelSize / 1.5, labelSize / 1.5)
scene.add(decayWordMesh)

const sustainWordGeometry = createLetter('Sustain', font);
const sustainWordMesh = new THREE.Mesh(sustainWordGeometry, subLabelMaterial);
sustainWordMesh.position.set(11, 0.5, objectDepth);
sustainWordMesh.scale.set(labelSize / 1.5, labelSize / 1.5, labelSize / 1.5)
scene.add(sustainWordMesh)

const releaseWordGeometry = createLetter('Release', font);
const releaseWordMesh = new THREE.Mesh(releaseWordGeometry, subLabelMaterial);
releaseWordMesh.position.set(15, 0.5, objectDepth);
releaseWordMesh.scale.set(labelSize / 1.5, labelSize / 1.5, labelSize / 1.5)
scene.add(releaseWordMesh)

const rateWordGeometry = createLetter('Rate', font);
const rateWordMesh = new THREE.Mesh(rateWordGeometry, subLabelMaterial);
rateWordMesh.position.set(-14, 0.5, objectDepth);
rateWordMesh.scale.set(labelSize / 1.5, labelSize / 1.5, labelSize / 1.5)
scene.add(rateWordMesh)

const depthWordGeometry = createLetter('Depth', font);
const depthWordMesh = new THREE.Mesh(depthWordGeometry, subLabelMaterial);
depthWordMesh.position.set(-6, 0.5, objectDepth);
depthWordMesh.scale.set(labelSize / 1.5, labelSize / 1.5, labelSize / 1.5)
scene.add(depthWordMesh)

});


// ANIMATION LOOP==============================================================================================
  function animate() {

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

