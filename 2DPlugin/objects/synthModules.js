import * as THREE from 'three';
import { commonOrangeMaterial, ringMaterialA, translucentMaterial, subLabelMaterial } from './materials';
import { synth, noise, filter } from '../audio/synth.js';
import { mouse, raycaster, camera } from '../core/scene.js'
//Sine Wave Object

//Oscillator Selector Objects
const sineSmoothness = 16;
const sineSegments = 64;
const pyramidWidth = 1;
const pyramidHeight = 0.866; 
const pyramidDepth = 0.02;
const pyramidRadius = 0.05;
const pyramidSmoothness = 4;

function createSineWaveGeometry(width, height, depth, radius, smoothness, segments) {
    const sineWaveShape = new THREE.Shape();
    const sineEpsilon = 0.00001;
    const segmentWidth = width / segments;
    sineWaveShape.moveTo(-width / 2, 0);
    for (let i = 0; i <= segments; i++) {
        const x = -width / 2 + i * segmentWidth;
        const y = Math.sin((i / segments) * Math.PI * 2) * (height / 2);
        if (i === 0) {
            sineWaveShape.lineTo(x, y);
        } else {
            sineWaveShape.quadraticCurveTo(x - segmentWidth / 2, y, x, y);
        }
    }
    for (let i = segments; i >= 0; i--) {
        const x = -width / 2 + i * segmentWidth;
        const y = Math.sin((i / segments) * Math.PI * 2) * (height / 2);
        sineWaveShape.lineTo(x, y + sineEpsilon);
    }
    const extrudeSettings = {
        steps: 1,
        depth: depth,
        bevelEnabled: true,
        bevelThickness: radius,
        bevelSize: radius,
        bevelSegments: 4
    };
    const sineGeometry = new THREE.ExtrudeGeometry(sineWaveShape, extrudeSettings);
    sineGeometry.center();
    return sineGeometry;
}

const sineWidth = 1.33, sineHeight = 0.65, sineDepth = 0.001, sineRadius = 0.0665;

const sphereGeometry = createSineWaveGeometry(
    sineWidth, sineHeight, sineDepth, sineRadius, 16, 64
);
const sineMesh = new THREE.Mesh(sphereGeometry, ringMaterialA);
sineMesh.visible = true;

//Cube Object
function createRoundedCubeGeometry(width, height, depth, radius, smoothness) {
    const cubeShape = new THREE.Shape();
    const cubeEpsilon = 0.00001;
    const radius0 = radius - cubeEpsilon;
    cubeShape.moveTo(0, radius0);
    cubeShape.lineTo(0, height - radius0);
    cubeShape.quadraticCurveTo(0, height, radius0, height);
    cubeShape.lineTo(width - radius0, height);
    cubeShape.quadraticCurveTo(width, height, width, height - radius0);
    cubeShape.lineTo(width, radius0);
    cubeShape.quadraticCurveTo(width, 0, width - radius0, 0);
    cubeShape.lineTo(radius0, 0);
    cubeShape.quadraticCurveTo(0, 0, 0, radius0);

    const geometry = new THREE.ExtrudeGeometry(cubeShape, {
        depth: depth - radius * 2,
        bevelEnabled: true,
        bevelSegments: smoothness * 2,
        steps: 1,
        bevelSize: radius,
        bevelThickness: radius,
        curveSegments: smoothness
    });
    geometry.center();
    return geometry;
}

const roundedCubeGeometry = createRoundedCubeGeometry(0.8, 0.8, 0.15, 0.05, 16);
const squareMesh = new THREE.Mesh(roundedCubeGeometry, ringMaterialA);
squareMesh.visible = false;

//Triangle Object
function createRoundedTriangleGeometry(width, height, depth, radius, smoothness) {
    const triangleShape = new THREE.Shape();
    const triangleEpsilon = 0.00001;
    const radius0 = radius - triangleEpsilon;
    const halfWidth = width / 2;

    triangleShape.moveTo(-halfWidth + radius0, -height / 2);
    triangleShape.lineTo(halfWidth - radius0, -height / 2);
    triangleShape.quadraticCurveTo(halfWidth, -height / 2, halfWidth, -height / 2 + radius0);
    triangleShape.lineTo(radius0, height / 2 - radius0);
    triangleShape.quadraticCurveTo(0, height / 2, -radius0, height / 2 - radius0);
    triangleShape.lineTo(-halfWidth, -height / 2 + radius0);
    triangleShape.quadraticCurveTo(-halfWidth, -height / 2, -halfWidth + radius0, -height / 2);

    const extrudeSettings = {
        steps: 1,
        depth: depth,
        bevelEnabled: true,
        bevelThickness: radius,
        bevelSize: radius,
        bevelSegments: smoothness
    };
    const geometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);
    geometry.center();
    return geometry;
}

const pyramidGeometry = createRoundedTriangleGeometry(1, 0.866, 0.1, 0.05, 4);
const triangleMesh = new THREE.Mesh(pyramidGeometry, ringMaterialA);
triangleMesh.visible = false;

const sphereSelectorGeometry = createSineWaveGeometry(
    sineWidth / 3, sineHeight / 3, sineDepth / 3, sineRadius / 3, sineSmoothness, sineSegments
);

const sphereSelectorMesh = new THREE.Mesh(sphereSelectorGeometry, translucentMaterial);
sphereSelectorMesh.position.set(0, sineHeight / 2 + 0.65, -60); // Center position

const pyramidSelectorGeometry = createRoundedTriangleGeometry(
    pyramidWidth / 3, pyramidHeight / 3, pyramidDepth / 3, pyramidRadius / 3, pyramidSmoothness
);
const pyramidSelectorMesh = new THREE.Mesh(pyramidSelectorGeometry, translucentMaterial);

const cubeSelectorGeometry = createRoundedCubeGeometry(
    0.8 / 3, 0.8 / 3, 0.8 / 3, 0.05 / 3, 16
);
const cubeSelectorMesh = new THREE.Mesh(cubeSelectorGeometry, translucentMaterial);
const spacing = 0.7; 
pyramidSelectorMesh.position.set(-spacing, sineHeight / 2 + 0.5, -60);
cubeSelectorMesh.position.set(spacing, sineHeight / 2 + 0.5, -60); 
sphereSelectorMesh.visible = true;
pyramidSelectorMesh.visible = true;
cubeSelectorMesh.visible = true;
const selectorGroup = new THREE.Group();
selectorGroup.add(sphereSelectorMesh);
selectorGroup.add(pyramidSelectorMesh);
selectorGroup.add(cubeSelectorMesh);



export { createSineWaveGeometry, sineMesh, sineHeight, sineWidth, sineDepth, sineRadius,
    createRoundedCubeGeometry, squareMesh,
    createRoundedTriangleGeometry, triangleMesh, selectorGroup
 };

 