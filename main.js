import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let mixer;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({

    antialias: true,
});

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.set(0,1,2)

// Lights
const mainLight = new THREE.PointLight('white', 10)
mainLight.position.set(5,5,0)

const secondLight = new THREE.PointLight('white', 10)
secondLight.position.set(-5,5,0)

const ambientLight = new THREE.AmbientLight('white', 0.5)

scene.add(mainLight,secondLight,ambientLight)

// Model

const assetLoader = new GLTFLoader();

assetLoader.load( '/female-base--mixamo--animation--v1.glb', function ( gltf ) {
  const model = gltf.scene;	
	scene.add(model);
  mixer = new THREE.AnimationMixer(model);
  console.log(mixer);
  const clips = gltf.animations;
  const clip = THREE.AnimationClip.findByName(clips, 'Action');
  const action = mixer.clipAction(clip);
  action.play();
});

const clock = new THREE.Clock();

function animate() {
  // mixer.update(clock.getDelta());
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();