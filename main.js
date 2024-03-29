import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const womanUrl = new URL('/woman.glb', import.meta.url);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    antialias: true,
}); 

const container = document.getElementById( 'mesh' );
document.body.appendChild( container );

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

camera.position.set(0,1,2)

// Lights
const mainLight = new THREE.PointLight('white', 10)
mainLight.position.set(5,5,0)

const secondLight = new THREE.PointLight('#fde58b', 5)
secondLight.position.set(-5,5,0)

const ambientLight = new THREE.AmbientLight('white', 0.5)

scene.add(mainLight,secondLight,ambientLight)

// Model

const assetLoader = new GLTFLoader();
let mixer;

assetLoader.load(womanUrl.href, function ( gltf ) {
  const model = gltf.scene;	
	scene.add(model);
  mixer = new THREE.AnimationMixer(model);
  console.log(mixer);
  const clips = gltf.animations;
  const clip = THREE.AnimationClip.findByName(clips, 'Action');
  console.log(clip);
  const action = mixer.clipAction(clip);
  action.play();
});

function animate() {
  if ( mixer ) mixer.update( 1/240);
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();