import {
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils,
  MOUSE,
  Clock,
  MeshLambertMaterial,
  DirectionalLight,
  SphereGeometry,
  MeshPhongMaterial,
  TextureLoader,
  LoopPingPong,
  LoadingManager,
  HemisphereLight,
  AmbientLight,
  AxesHelper,
  GridHelper,
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CameraControls from "camera-controls";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import gsap from "gsap";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import{CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

//1 scene

const scene = new Scene();
const canvas = document.getElementById("three-canvas");

//helpers

const axes = new AxesHelper(1);
axes.material.depthTest = false;
axes.renderOrder = 2;
scene.add(axes);

const grid = new GridHelper();
grid.renderOrder = 1;
scene.add(grid);

//2 the object



const loader = new GLTFLoader();

const loadingScreen = document.getElementById("loader-container");

const progressText = document.getElementById("progress-text");

let policeStation;

loader.load(
  "./link/police_station.glb",

  (gltf) => {
    policeStation = gltf.scene;
    scene.add(policeStation);
    loadingScreen.classList.add("hidden");
    
  },

  (progress) => {
    console.log(progress);
    const progrssPercent = (progress.loaded / progress.total) * 100;
    const formatted = Math.trunc(progrssPercent);
    progressText.textContent = `Loading: ${formatted}% `;
  },

  (error) => {
    console.log(error);
  }
);

// ------------------------------------------create camera

const sizes = {
  width: 800,
  height: 600,
};

const camera = new PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight
);
camera.position.z = 3;
camera.position.x = 3;
camera.position.y = 2;
scene.add(camera);

// --------------------------------------------three renderer
const renderer = new WebGLRenderer({ canvas });
const pixelRat = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRat);
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.setClearColor(0xffffff, 1);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.pointerEvents = 'none';
labelRenderer.domElement.style.top = '0';
document.body.appendChild(labelRenderer.domElement);


//Lights

const dirLight = new DirectionalLight();
dirLight.position.set(3, 2, 1).normalize();
scene.add(dirLight);

const ambLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambLight);

// const hemisphereLight = new HemisphereLight(0x70c2b4,0xff1453);
// scene.add(hemisphereLight);

//Camera

window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

//Camera controls via camera-control lb

const subsetOfTHREE = {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp,
  },
};

CameraControls.install({ THREE: subsetOfTHREE });
const clock = new Clock();
const cameraControls = new CameraControls(camera, canvas);
cameraControls.dollyToCursor = true;
cameraControls.setLookAt(18, 20, 18, 0, 10, 0);

//Picking

const raycaster = new Raycaster();
const mouse = new Vector2();


window.addEventListener('dblclick', (event) => {
	mouse.x = event.clientX / canvas.clientWidth * 2 - 1;
	mouse.y = - (event.clientY / canvas.clientHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObject(policeStation);

  if(!intersects.length) {
    return;
  };

  const intersetionLocation = intersects[0].point;

  const message = window.prompt('describe the issue:');

  const container = document.createElement('div');
  container.className= 'label-container';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.className = 'delete-button hidden';
  container.appendChild(deleteButton);

  deleteButton.onclick=()=>{
    labelObject.removeFromParent();
    labelObject.element = null;
    container.remove();
  }

  const label = document.createElement('p');
  label.textContent = message;
  label.classList.add('label');
  container.appendChild(label);

  const labelObject = new CSS2DObject(container);
  labelObject.position.copy(intersetionLocation);
  scene.add(labelObject);

  container.onmouseenter =()=> deleteButton.classList.remove('hidden');
  container.onmouseleave =()=> deleteButton.classList.add('hidden');


})




//animate

function animate() {
  const delta = clock.getDelta();
  cameraControls.update(delta);
  renderer.render(scene, camera);
  labelRenderer.render(scene,camera);

  requestAnimationFrame(animate);
}

animate();
