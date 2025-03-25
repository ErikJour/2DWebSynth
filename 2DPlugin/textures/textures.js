import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const stainedGlassTextureA = textureLoader.load('textures/stainedGlassA.png');
const stainedGlassTextureB = textureLoader.load('textures/OceanWave.jpeg');
const stainedGlassTextureC = textureLoader.load('textures/stainedGlassWaveB.jpg');
const stainedGlassTextureD = textureLoader.load('textures/stainedGlassD.jpg');
const sineTextureA = textureLoader.load('textures/Greydient4A_silk_3.png');

const sineTextureB = textureLoader.load('textures/Greydient4A_texture1_5.jpg');
const triangleTextureA = textureLoader.load('textures/Greydient4B_texture1_6.jpg');
const squareTextureA = textureLoader.load('textures/Greydient4C_texture1_3.jpg');

// Matcaps
const matcapA = textureLoader.load('matcaps/0_export_2.png');
const matcapB = textureLoader.load('matcaps/0_export_6.png');
const matcapC = textureLoader.load('matcaps/0_export_25.png');
const matcapd = textureLoader.load('matcaps/export_92_blur.png');


export { stainedGlassTextureA, 
        stainedGlassTextureB, 
        stainedGlassTextureC, 
        stainedGlassTextureD,
        sineTextureA,
        sineTextureB,
        triangleTextureA,
        squareTextureA,
        matcapA,
        matcapB,
        matcapC,
        matcapd };