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
    LoopPingPong
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import CameraControls from 'camera-controls';


//1 scene

const scene = new Scene();
const canvas = document.getElementById('three-canvas');

//2 cube

const loader= new TextureLoader();


const geometry = new BoxGeometry(1,0.5,0.5);
const sphere = new SphereGeometry(0.5,0.01,0.01);
const material = new MeshPhongMaterial({
    //color: 0xff00ff,
    specular: 0xffffff,
    shininess:100,
    flatshading:true,
    map: loader.load('./logo.png')
});
const material2 = new MeshPhongMaterial({
    color: 0xff00ff,
    specular: 0xffffff,
    shininess:100,
    flatshading:true
});
const materialBlue = new MeshBasicMaterial({color: 'blue'});

const orangeCube = new Mesh(geometry,material);
const bigOrangeCube = new Mesh(geometry, materialBlue);
const sphereMesh = new Mesh(sphere,material);
bigOrangeCube.position.x +=2;
bigOrangeCube.scale.set(2,2,2);
//sphereMesh.scale.set(0.5,0.5,0.5);


scene.add(orangeCube);
scene.add(bigOrangeCube);
scene.add(sphereMesh);

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

//Lights

const light1 = new DirectionalLight();
light1.position.set(3,2,1,).normalize();
scene.add(light1);

const light2 = new DirectionalLight();
light2.position.set(-3,-2,-1,).normalize();
scene.add(light2);

//Camera

window.addEventListener('resize', () => {
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
      clamp: MathUtils.clamp
    }
  };

  CameraControls.install( { THREE: subsetOfTHREE } ); 
  const clock = new Clock();
  const cameraControls = new CameraControls(camera,canvas);



//animate

function animate(){


    //controls.update();
    const delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene,camera);

    requestAnimationFrame(animate);
}

animate();