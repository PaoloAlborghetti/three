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
  Spheremesh,
  MeshPhongMaterial,
  TextureLoader,
  LoopPingPong,
  LoadingManager,
  HemisphereLight,
  AmbientLight,
  AxesHelper,
  GridHelper,
  Color,
  Edgesmesh,
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

const mesh = new BoxGeometry(2,2,2);
const cubeMesh = new Mesh(mesh, material);
scene.add(cubeMesh);


const mesh2 = new BoxGeometry(2,2,2);
const cubeMesh2 = new Mesh(mesh2, material);
cubeMesh2.position.x +=4;
scene.add(cubeMesh2);  

const cubes = [cubeMesh,cubeMesh2];

//const loader = new GLTFLoader();

const loadingScreen = document.getElementById('loader-container');

const progressText = document.getElementById('progress-text');




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
renderer.setClearColor(0xF6F5F4,1);



//Lights

const dirLight = new DirectionalLight();
dirLight.position.set(3,2,1).normalize();
scene.add(dirLight);

const ambLight = new AmbientLight( 0xFFFFFF,0.5);
scene.add(ambLight);

// const hemisphereLight = new HemisphereLight(0x70c2b4,0xff1453);
// scene.add(hemisphereLight);

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
cameraControls.setLookAt(3,4,2,0,0,0);


//Picking

const raycaster = new Raycaster();
const mouse = new Vector2();

const previousSelection={
  mesh: null,
  material: null
}


const highLightMat = new MeshBasicMaterial({color:'red'});

window.addEventListener('mousemove', (event)=>{
  
  getMousePosition(event);

  raycaster.setFromCamera(mouse,camera);
  const intersection = raycaster.intersectObjects(cubes);


  if(hasNoCollision(intersection)){
    restorePreviousSelection()
    return;
  }

  const foundItem = intersection[0];
 

  if(isPreviousSelection(foundItem)) return;  

  restorePreviousSelection();

  savePreviousSelection(foundItem);

  highlightObject(foundItem);
});

function getMousePosition(event){
  mouse.x = ( event.clientX / canvas.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / canvas.clientHeight ) * 2 + 1;
}

function hasNoCollision(inter){
  return inter.length===0;
}

function highlightObject(item){
  item.object.material = highLightMat;
}

function isPreviousSelection(item){
  return previousSelection.mesh === item.object;
}

function savePreviousSelection(item){
  previousSelection.mesh=item.object;
  previousSelection.material=item.object.material;
}

function restorePreviousSelection(){
  if(previousSelection.mesh){
    previousSelection.mesh.material = previousSelection.material; 
    previousSelection.mesh = null;
    previousSelection.material = null;
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

