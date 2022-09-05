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

// create camera

const sizes = {
    width:800,
    height:600

}

const camera = new PerspectiveCamera(75, canvas.clientWidth/canvas.clientHeight);
camera.position.z = 3;
scene.add(camera);

// thre renderer
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



//animate

function animate(){
    orangeCube.rotation.x +=0.01;
    orangeCube.rotation.z +=0.01;

    bigOrangeCube.rotation.x +=-0.02;
    bigOrangeCube.rotation.z +=-0.02;

    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}

animate();