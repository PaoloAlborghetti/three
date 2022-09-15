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
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CameraControls from "camera-controls";

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

//2 cube

//const geometry = new BoxGeometry(1, 0.5, 0.5);
const geometry = new BoxGeometry();

const materialOrange = new MeshLambertMaterial({color: 'orange'});
// const materialBlue = new MeshLambertMaterial({color: 'blue'});
// const materialWhite = new MeshLambertMaterial({color: 'white'});

// const bigBlueCube = new Mesh(geometry, materialBlue);
// bigBlueCube.position.x += 2;
// bigBlueCube.scale.set(2, 2, 2);
// scene.add(bigBlueCube);

const box = new Mesh( geometry, materialOrange );
scene.add(box);
box.position.x +=3;

const axes2 = new AxesHelper(0.3);
axes2.material.depthTest=false;
axes2.renderOrder = 2;
box.add(axes2);

// const earth = new Mesh( geometry, materialBlue );
// earth.scale.set(0.2,0.2,0.2);
// earth.position.x+=2;
// sun.add(earth);

// const moon = new Mesh( geometry, materialWhite );
// moon.position.x += 1;
// moon.scale.set(0.5,0.5,0.5);
// earth.add(moon);



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
renderer.setClearColor(0x555555,1);



//Lights

const dirLight = new DirectionalLight();
dirLight.position.set(3,2,1).normalize();
scene.add(dirLight);

// const ambLight = new AmbientLight( 0xFFFFFF,0.5);
// scene.add(ambLight);

const hemisphereLight = new HemisphereLight(0x70c2b4,0xff1453);
scene.add(hemisphereLight);

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

//not working camera target ??? 
//cameraControls.setTarget(box.x,box.y,box.z,false);

//animate

function animate() {
  //controls.update();
  // sun.rotation.y += 0.01;
  // earth.rotation.y += 0.03;

  box.rotateX(0.003);
  box.rotateY(0.01);

  const delta = clock.getDelta();
  cameraControls.update(delta);
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();
