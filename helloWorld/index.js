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
    Clock
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import CameraControls from 'camera-controls';


//1 scene

const scene = new Scene();
const canvas = document.getElementById('three-canvas');

//2 cube

const geometry = new BoxGeometry(1,0.5,0.5);
const material = new MeshBasicMaterial({color: 'orange'});
const materialBlue = new MeshBasicMaterial({color: 'blue'});

const orangeCube = new Mesh(geometry,material);
const bigOrangeCube = new Mesh(geometry, materialBlue);
bigOrangeCube.position.x +=2;
bigOrangeCube.scale.set(2,2,2);


scene.add(orangeCube);
scene.add(bigOrangeCube);

// ------------------------------------------create camera

const sizes = {
    width:800,
    height:600

}

const camera = new PerspectiveCamera(75, canvas.clientWidth/canvas.clientHeight);
camera.position.z = 3;
scene.add(camera);


// --------------------------------------------three renderer
const renderer = new WebGLRenderer({canvas});
const pixelRat = Math.min(window.devicePixelRatio,2);
renderer.setPixelRatio(pixelRat);
renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
//renderer.render(scene,camera);

//set canvas size

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});


//Controls using native threejs OrbitControls

//const controls = new OrbitControls(camera, canvas);
//controls.enableDamping = true;

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
      clamp: MathUtils.clamp
    }
  };

  CameraControls.install( { THREE: subsetOfTHREE } ); 
  const clock = new Clock();
  const cameraControls = new CameraControls(camera,canvas);



//animate

function animate(){
    orangeCube.rotation.x +=0.01;
    orangeCube.rotation.z +=0.01;

    bigOrangeCube.rotation.x +=-0.02;
    bigOrangeCube.rotation.z +=-0.02;

    //controls.update();
    const delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene,camera);

    requestAnimationFrame(animate);
}

animate();