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
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import gsap from 'gsap';

import{GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

//1 scene

const scene = new Scene();
const canvas = document.getElementById("three-canvas");

//helpers

const axes = new AxesHelper(1);
axes.material.depthTest=false;
axes.renderOrder = 2;
scene.add(axes);


const grid = new GridHelper();
grid.renderOrder = 1;
scene.add(grid);

//2 the object

const material = new MeshLambertMaterial({color:'orange'});
const geometry =  new BoxGeometry();
const cubeMesh = new Mesh(geometry,material);
scene.add(cubeMesh);

const cubeMesh2 = new Mesh(geometry,material);
cubeMesh2.position.x += 2;
scene.add(cubeMesh2);

const cubes = [cubeMesh, cubeMesh2];



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
renderer.setClearColor(0xeeeeee,1);



//Lights

const dirLight = new DirectionalLight();
dirLight.position.set(3,2,1).normalize();
scene.add(dirLight);

const ambLight = new AmbientLight( 0xFFFFFF,0.5);
scene.add(ambLight);

//Camera

window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
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
cameraControls.setLookAt(3,2,2,0,1,0);

//8 Picking

const raycaster =  new Raycaster();
const mouse = new Vector2();
const previosSelection = {
  geometry:null,
  material:null
} 

const highlightMat = new MeshBasicMaterial({color:'red'});


window.addEventListener('mousemove', (event)=>{
  mouse.x = event.clientX / canvas.clientWidth * 2 - 1;
	mouse.y =-(event.clientY / canvas.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse,camera);
  const intersections = raycaster.intersectObjects(cubes);

  const hasCollided = intersections.length !== 0;

  if (!hasCollided){
    restorePreviosSelection();
    return;
  }

  const first = intersections[0];

  const isPreviousSelection = previosSelection.mesh === first.object;
  if(isPreviousSelection) return;

  restorePreviosSelection();
  savePreviosSelection(first);

  first.object.material = highlightMat;

})


function savePreviosSelection(item){
  previosSelection.mesh = item.object;
  previosSelection.material = item.object.material;
}

function restorePreviosSelection(){
  if(previosSelection.mesh){
    previosSelection.mesh.material = previosSelection.material;
    previosSelection.mesh = null;
    previosSelection.material = null;
  }
}



//animate

function animate() {
 

  const delta = clock.getDelta();
  cameraControls.update(delta);
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();

