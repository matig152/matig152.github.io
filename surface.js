// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 200/200, 0.1, 300);
const renderer = new THREE.WebGLRenderer( {alpha: true, antialias: true } );

console.log(window.matchMedia("(max-width: 600px)").matches)

if(window.matchMedia("(max-width: 600px)").matches){
    renderer.setSize(350, 175)
}
else if(window.matchMedia("(max-width: 1400px)").matches){
    renderer.setSize(600, 300)
}
else{
    renderer.setSize(800, 400);
}

document.getElementById('landing-page-graph').appendChild(renderer.domElement);


// Parametric Equation Example (e.g., a sine wave surface)
const parametricSurface = (u, v, target) => {
    const x = 20 * (u - 0.5);
    const y = 14 * (v - 0.5);
    const z = 0.35 * (x*x / 1 - y*y / 1) 
    target.set(x, y, z);
};

// Geometry & Material
const geometry = new THREE.ParametricGeometry(parametricSurface, 25, 25);
const material = new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Custom Axes with Custom Colors
const createAxis = (dir, color) => {
    const material = new THREE.LineBasicMaterial({ color });
    const points = [new THREE.Vector3(0, 0, 0), dir];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.Line(geometry, material);
};


// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

camera.position.z = 40;
camera.position.x = 0;
camera.position.y = 2;
mesh.rotation.x = 15
mesh.rotation.z = 2.4

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.z += 0.005;

    //mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();


counter_parab = 0
function show_msg(){
    if(counter_parab % 2 == 0){
        document.getElementById('msg_graph').style.opacity = 1
    }
    else{
        document.getElementById('msg_graph').style.opacity = 0
    }
    counter_parab += 1
}