import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const womanUrl = new URL('/woman.glb', import.meta.url);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});

const container = document.getElementById('mesh');
document.body.appendChild(container);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

camera.position.set(0, 1, 2);

// Lights
const mainLight = new THREE.PointLight('white', 10);
mainLight.position.set(5, 5, 0);

const secondLight = new THREE.PointLight('#fde58b', 5);
secondLight.position.set(-5, 5, 0);

const ambientLight = new THREE.AmbientLight('white', 0.5);

scene.add(mainLight, secondLight, ambientLight);

// Model
const assetLoader = new GLTFLoader();
let mixer;
let animationAction;

assetLoader.load(womanUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.rotation.y = - Math.PI / 3;
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, 'Action');
    animationAction = mixer.clipAction(clip);
    animationAction.play();
});

// Scroll event listener
window.addEventListener('scroll', () => {
    if (mixer && animationAction) {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const duration = animationAction.getClip().duration;
        mixer.setTime(scrollPercent * duration);
    }
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();


/*
   * toggle
   */

var toggle = function (elem) {
  elem.classList.toggle('is-displayed');
};

document.addEventListener('click', function (event) {
  var clickedElement = event.target;

  if (!clickedElement.classList.contains('js-toggle')) return;

  clickedElement.classList.toggle('is-active');

  // if (clickedElement.classList.contains('is-active')) {
  //   clickedElement.innerHTML = "Hide synopsis";
  // } else {
  //   clickedElement.innerHTML = "View synopsis";
  // }

  event.preventDefault();

  var content = document.querySelector(clickedElement.hash);
  if (!content) return;

  toggle(content);

}, false);
