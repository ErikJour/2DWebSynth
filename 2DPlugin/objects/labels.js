import * as THREE from 'three';
import { labelMaterial } from './materials';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

//ADSR
let oscillatorMesh;

const fontLoader = new FontLoader();
fontLoader.load("fonts/P22 FLLW Exhibition_Regular.json", function(font) {

    function createLetter(letter, font){
    return new TextGeometry(letter, {
        font: font,
        size: 11,
        height: 2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .1,
        bevelSize: 0.5,
        bevelOffset: 0,
        bevelSegments: 5
    });
}
    const aGeometry = createLetter('A', font);
    const dGeometry = createLetter('D', font);
    const sGeometry = createLetter('S', font);
    const rGeometry = createLetter('R', font);
    const adsrMaterial = new THREE.MeshPhysicalMaterial
    const aMesh = new THREE.Mesh(aGeometry, textMaterial);

// //Labels
const labelSize = 0.08;
const oscWordGeometry = createLetter('OSC', font);
const oscillatorMesh = new THREE.Mesh(oscWordGeometry, labelMaterial);
oscillatorMesh.position.set(-2.7, 8, 18.4);
oscillatorMesh.scale.set(labelSize, labelSize, labelSize)
oscillatorMesh.rotation.x = Math.PI / 2; 
oscillatorMesh.castShadow = true;
oscillatorMesh.receiveShadow = true;
oscillatorMesh.transparent = true;

textSpotlight.target = oscOneLamp;

const noiseWordGeometry = createLetter('Noise', font);
const noiseMesh = new THREE.Mesh(noiseWordGeometry, labelMaterial);
noiseMesh.position.set(-3.2, 8, -1.6);
noiseMesh.scale.set(labelSize, labelSize, labelSize)
noiseMesh.rotation.x = Math.PI / 2; 
noiseMesh.castShadow = true;
noiseMesh.transparent = true;

noiseTextSpotlight.target = noiseMesh;

const filterWordGeometry = createLetter('Filter', font);
const filterWordMesh = new THREE.Mesh(filterWordGeometry, labelMaterial);
filterWordMesh.position.set(-2.9, 8, -21.6);
filterWordMesh.scale.set(labelSize, labelSize, labelSize)
filterWordMesh.rotation.x = Math.PI / 2;
filterWordMesh.castShadow = true;
filterWordMesh.transparent = true;

filterTextSpotlight.target = filterLamp;


const tremoloWordGeometry = createLetter('LFO', font);
const tremoloWordMesh = new THREE.Mesh(tremoloWordGeometry, labelMaterial);
tremoloWordMesh.position.set(-2.8, 7.5, -44.3);
tremoloWordMesh.scale.set(labelSize, labelSize, labelSize)
tremoloWordMesh.rotation.x = Math.PI / 2; // 90° forward tilt
tremoloWordMesh.castShadow = true;
tremoloWordMesh.transparent = true;

tremoloTextSpotlight.target = lfoLamp;

const adsrWordGeometry = createLetter('adsr', font);
const adsrWordMesh = new THREE.Mesh(adsrWordGeometry, labelMaterial);
adsrWordMesh.position.set(-3.5, 7.7, -63.7);
adsrWordMesh.scale.set(labelSize, labelSize, labelSize)
adsrWordMesh.rotation.x = Math.PI / 2; // 90° forward tilt
adsrWordMesh.castShadow = true;
adsrWordMesh.transparent = true;

adsrTextSpotlight.target = envOrb;

});


export { oscillatorMesh };