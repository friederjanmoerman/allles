import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

const womanUrl = new URL('/woman.glb', import.meta.url);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

const container = document.getElementById('mesh');

if (container) {
  document.body.appendChild(container);
  container.appendChild(renderer.domElement);
}

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(0, 1, 2);

// Lights
const mainLight = new THREE.PointLight('white', 1);
mainLight.position.set(10, 5, 0);

const secondLight = new THREE.PointLight('#fde58b', 0.2);
secondLight.position.set(-5, 5, 0);

const ambientLight = new THREE.AmbientLight('white', 0.1);

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

// Throttled resize event listener
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, 200);
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





document.getElementById('menu-toggle')
  .addEventListener('click', function(){
    document.body.classList.toggle('nav-open');
});

const aboutLink = document.getElementById("about-link");

if (aboutLink) {
  aboutLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior

    document.body.classList.toggle('nav-open');

    // Get the Y position of the "about" section
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const yOffset = aboutSection.getBoundingClientRect().top + window.pageYOffset;

      // Smoothly scroll to the Y position
      window.scrollTo({
        top: yOffset,
        behavior: "smooth"
      });

      // Update the URL without page reload
      history.pushState(null, null, "/about");
    }
  });
}

// Function to add fade-in effect with dynamic delay
function addFadeInEffect() {
  const visibleSquares = document.querySelectorAll(".square:not(.hidden)");

  // Remove the fade-in class to reset animation
  visibleSquares.forEach(square => {
    square.classList.remove("fade-in");
    square.style.animationDelay = ""; // Clear previous delays
  });

  // Use a slight timeout to ensure the class removal takes effect
  setTimeout(() => {
    visibleSquares.forEach((square, index) => {
      square.classList.add("fade-in");
      square.style.animationDelay = `${index * 0.1}s`; // 0.1s delay per square
    });
  }, 10); // Small delay to reset the animation
}

// Function to apply filter and fade-in effect on button click
function applyFilter(filter, clickedElement) {
  const allSquares = document.querySelectorAll(".square");
  const allButtons = document.querySelectorAll(".filter-button");

  // Remove the active class from all buttons
  allButtons.forEach(button => button.classList.remove("active"));

  // Add the active class to the clicked button
  clickedElement.classList.add("active");

  // Show all squares by default and remove fade-in classes
  allSquares.forEach(square => {
    square.classList.remove("hidden", "fade-in");
    square.style.animationDelay = ""; // Clear previous delays
  });

  // Apply the filter logic
  if (filter === "filterA") {
    document.querySelectorAll(".categoryB, .categoryC, .categoryD").forEach(square => {
      square.classList.add("hidden");
    });
  } else if (filter === "filterB") {
    document.querySelectorAll(".categoryA, .categoryC, .categoryD").forEach(square => {
      square.classList.add("hidden");
    });
  } else if (filter === "filterC") {
    document.querySelectorAll(".categoryA, .categoryB, .categoryD").forEach(square => {
      square.classList.add("hidden");
    });
  } else if (filter === "filterD") {
    document.querySelectorAll(".categoryA, .categoryB, .categoryC").forEach(square => {
      square.classList.add("hidden");
    });
  }

  // Apply the fade-in effect with delay to the filtered squares
  addFadeInEffect();
}

// Query all buttons and add a click event listener to each
document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", function() {
    const filter = this.getAttribute("data-filter"); // Assumes a data-filter attribute on the buttons
    applyFilter(filter, this);
  });
});

// Check URL for "events" and apply filter C on page load if found
window.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("/services/events")) {
    applyFilter("filterC"); // Apply category C filter
  }
});

window.onload = function() {
  window.scrollTo(0, 0); // Scrolls to the top of the page
  addFadeInEffect();     // Adds fade-in effect
  animate();
};