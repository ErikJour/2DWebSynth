import * as THREE from 'three';

const scene = new THREE.Scene();
const canvas = document.querySelector('canvas.webgl')
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

//SIZES==========================================================================================================
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

//Camera
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10;

const camera = new THREE.OrthographicCamera(
  -frustumSize * aspect,  // left
   frustumSize * aspect,   // right
   frustumSize,            // top
  -frustumSize,            // bottom
   0.1,                    // near
   1000                    // far
);
camera.position.set(0, 0, 45);

const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    antialias: true });
    
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    const newAspect = sizes.width / sizes.height;
    
    camera.left = -frustumSize * newAspect;
    camera.right = frustumSize * newAspect;
    camera.top = frustumSize;
    camera.bottom = -frustumSize;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

export { scene, canvas, camera, renderer, mouse, raycaster };