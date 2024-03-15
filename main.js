import * as THREE from 'three';
import Lenis from '@studio-freight/lenis'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const lenis = new Lenis()

lenis.on('scroll', (e) => {
  console.log(e)
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({

    antialias: true,
});

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.set(0,1,2)

const mainLight = new THREE.PointLight('white', 10)
mainLight.position.set(5,5,0)

const secondLight = new THREE.PointLight('white', 10)
secondLight.position.set(-5,5,0)

const ambientLight = new THREE.AmbientLight('white', 0.5)

scene.add(mainLight,secondLight,ambientLight)


const loader = new GLTFLoader();

loader.load( '/female-base--mixamo--animation--v1.glb', function ( gltf ) {

	scene.add( gltf.scene );

});

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();