import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    Camera,
    PerspectiveCamera,
    WebGLRenderer
    
} from 'three';

//1 scene

const scene = new Scene();

//2 cube

const geometry = new BoxGeometry(1,0.5,0.5);
const material = new MeshBasicMaterial({color: 'orange'});

const orangeCube = new Mesh(geometry,material);
const bigOrangeCube = new Mesh(geometry, material);
bigOrangeCube.position.x +=2;
bigOrangeCube.scale.set(2,2,2);


scene.add(orangeCube);
scene.add(bigOrangeCube);

// create camera

const sizes = {
    width:800,
    height:600

}

const camera = new PerspectiveCamera(75, sizes.width/sizes.height);
camera.position.z = 3;
scene.add(camera);

// thre renderer
const canvas = document.getElementById('three-canvas');
const renderer = new WebGLRenderer({canvas});
renderer.setSize(sizes.width,sizes.height);
//renderer.render(scene,camera);

function animate(){
    orangeCube.rotation.x +=0.01;
    orangeCube.rotation.z +=0.01;

    bigOrangeCube.rotation.x +=-0.05;
    bigOrangeCube.rotation.z +=-0.05;

    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}

animate();