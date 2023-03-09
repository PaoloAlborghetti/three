import {
  AxesHelper,
  DirectionalLight,
  AmbientLight,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { projects } from "./projects.js";

const currentUrl = window.location.href;
const url = new URL(currentUrl);
const currentProjectID = url.searchParams.get("id");
console.log(currentProjectID);
const currentProject = projects.find(
  (project) => project.id === currentProjectID
);

// const iframe = document.getElementById('model-iframe');
// iframe.src = currentProject.url;

//create the Three scene
const scene = new Scene();

//get the domensions of the browser window
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Create the Camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(15, 14, 8);
camera.lookAt(0, 0, 0);

//create the renderer
const canvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({
  canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);

//value = condition ? valueifTrue : valueIfFalse   --> cleaner than a full if/else statement, but longer than the solution below
//let value = window.devicePixelRatio > 2 ? 2: window.devicePixelRatio;

const pixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio);

//Lights

const lightColor = 0xffffff;
const ambientLight = new AmbientLight(lightColor,1);
scene.add(ambientLight);

const dirLight1 = new DirectionalLight(lightColor, 1);
dirLight1.position.set(1, 1, 0.5);
scene.add(dirLight1);

// basic scene items

const grid = new GridHelper(50, 50);
scene.add(grid);

const axes = new AxesHelper(1);
axes.material.depthTest = false;
axes.renderOrder=1;
scene.add(axes);

// Camera control

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//animate

const animate  = () => {
  controls.update();
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
};

animate();

//configure browser sizing
window.addEventListener("resize", () => {
  sizes.width = wind.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

//https://www.youtube.com/live/KM-SqgOMQ_0?feature=share&t=2809