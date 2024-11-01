import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const womanUrl = new URL('/woman.glb', import.meta.url);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
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
let model;

assetLoader.load(womanUrl.href, function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.rotation.y = 0; // Start with no rotation
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, 'Action');
    animationAction = mixer.clipAction(clip);
    animationAction.play();
});

// Scroll event listener
window.addEventListener('scroll', () => {
  if (mixer && animationAction && model) {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const animationEndPoint = 1 / 3;

      // Set new light color at a specific scroll percentage
      const startColor = new THREE.Color('white');
      const endColor = new THREE.Color('#ffe059');

      if (scrollPercent <= animationEndPoint) {
          const adjustedScrollPercent = scrollPercent / animationEndPoint;
          const duration = animationAction.getClip().duration;

          // Animate model and light color
          mixer.setTime(adjustedScrollPercent * duration);
          model.rotation.y = adjustedScrollPercent * -Math.PI / 3; // Rotate model -π/3 radians (60 degrees)

          // Interpolate color
          mainLight.color.lerpColors(startColor, endColor, adjustedScrollPercent);
          
      } else {
          // Ensure the animation and rotation remain at their end state
          if (!animationAction.isRunning()) {
              const duration = animationAction.getClip().duration;
              mixer.setTime(duration); // Animation stays at its end
              model.rotation.y = -Math.PI / 3; // Rotation stays at -π/3 radians

              // Set light color to the final value
              mainLight.color.copy(endColor);
          }
      }
  }
});


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

/*
 * Toggle on hover
 */

const hoverToToggleElements = document.getElementsByClassName("js-hover-to-toggle");
const whatInfoPopup = document.getElementById("home__what__anchor__info-pop-up");

const hoverToToggle = (e) => {
  e.addEventListener("mouseover", () => {
    e.classList.add("is-hovered");
    checkHoverClass();
  });

  e.addEventListener("mouseleave", () => {
    e.classList.remove("is-hovered");
    checkHoverClass();
  });
};

for (var i = 0; i < hoverToToggleElements.length; i++) {
  hoverToToggle(hoverToToggleElements[i]);
}

const checkHoverClass = () => {
  let isHovered = false;
  for (var i = 0; i < hoverToToggleElements.length; i++) {
    if (hoverToToggleElements[i].classList.contains("is-hovered")) {
      isHovered = true;
      if (hoverToToggleElements[i].nextElementSibling) {
        var copyAnchorInfo = hoverToToggleElements[i].nextElementSibling.innerHTML;
        whatInfoPopup.innerHTML = copyAnchorInfo;
      }
      break;
    }
  }

  if (isHovered) {
    whatInfoPopup.classList.add("js-is-displayed");
  } else {
    whatInfoPopup.classList.remove("js-is-displayed");
  }
};



window.addEventListener('scroll', function() {
  const mesh = document.getElementById('mesh');
  const scrollTop = window.scrollY;
  const viewportHeight = window.innerHeight;

  // Calculate scroll position in terms of percentage of 1 viewport height (i.e., 100vh)
  const scrollFraction = scrollTop / viewportHeight;

  // Move mesh by 2/3 of the viewport width when scrolled 1 viewport height (100%)
  if (scrollFraction <= 1) {
    mesh.style.transform = `translateX(${scrollFraction * (1 / 4) * 100}vw)`;
  }
});

document.getElementById('menu-toggle')
  .addEventListener('click', function(){
    document.body.classList.toggle('nav-open');
});