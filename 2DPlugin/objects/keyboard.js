import * as THREE from 'three';
import { ringMaterialA, ringMaterialB, ringMaterialC, ringMaterialD, ringMaterialE } from './materials.js';

const ringGroup = new THREE.Group();

// Function to create rings
function createRing(xPosition, yPosition, label) {
    const ringGeometry = new THREE.CircleGeometry(1, 32);
    const ring = new THREE.Mesh(ringGeometry, ringMaterialA);
    ring.position.set(xPosition, yPosition, -1);
    ring.scale.set(1, 1, 1);
    ringGroup.add(ring);
}

// Create 5 see-through rings with labels
const labels = ['Root', 'Maj 3rd', 'Maj 4th', 'Maj 5th', 'Maj 7th'];
const bottomRowY = -1.3;
const topRowY = 1;
const startX = -1;
const textSpacing = 3;

// Bottom row (3 rings)kl
for (let i = 0; i < 3; i++) {
    createRing(startX + i * textSpacing, bottomRowY, labels[i]);
}

// Top row (2 rings)
for (let i = 3; i < 5; i++) {
    createRing(startX + (i - 3) * textSpacing + 1.4, topRowY, labels[i]);
}

const rootRing = ringGroup.children[0];
rootRing.material = ringMaterialA;
const thirdRing = ringGroup.children[3];
thirdRing.material = ringMaterialB;
const fourthRing = ringGroup.children[1];
fourthRing.material = ringMaterialC;
const fifthRing = ringGroup.children[4];
fifthRing.material = ringMaterialD;
const seventhRing = ringGroup.children[2];
seventhRing.material = ringMaterialE;

ringGroup.position.set(-2, -7, 0);

const rings = [rootRing, thirdRing, fourthRing, fifthRing, seventhRing];

export { rings, rootRing, thirdRing, fourthRing, fifthRing, seventhRing, ringGroup };