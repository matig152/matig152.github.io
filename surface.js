// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 200/200, 0.1, 1000);
const renderer = new THREE.WebGLRenderer( {alpha: true } );
renderer.setSize(400, 400);

document.getElementById('landing-page-graph').appendChild(renderer.domElement);


    // Create geometry
    const geometry = new THREE.PlaneGeometry(200, 200, 10, 10); // Width, height, segments

    // Swap X and Y in the surface generation
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = Math.sin(x) * 10 + Math.cos(y) * 10    
        // const z = Math.cos(0.1* y) * 2 + Math.sin(0.15 * x) * 5; // Swapped the roles of x and y
        position.setX(i, y); // Set Y as X
        position.setY(i, x); // Set X as Y
        position.setZ(i, z);
    }
    geometry.computeVertexNormals(); // For better lighting effects

    // Wireframe mesh
    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xADD8E6 }); // Light blue wireframe
    const mesh = new THREE.LineSegments(wireframe, lineMaterial);
    scene.add(mesh);

    // Add Axes Helper (Flipped axes)
    //const axesHelper = new THREE.AxesHelper(50); // Standard Axes helper (but flipped)
    // scene.add(axesHelper);

    // Set the camera to view the flipped axes
    camera.position.set(0, 0 , 200); // Adjusting for new axes orientation
    camera.lookAt(0, 0, 0); // Camera looks at the origin

    mesh.rotation.x = 90
    mesh.rotation.y = 0
    mesh.rotation.z = 0
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        //mesh.rotation.x += 0.005;
        //mesh.rotation.y += 0.005;
        mesh.rotation.z += 0.001;
        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });