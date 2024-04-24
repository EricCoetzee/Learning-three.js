// Scene, camera, and renderer setup
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 100;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls for interactive camera control
let controls = new THREE.OrbitControls(camera, renderer.domElement);

// Ambient light
let ambientLight = new THREE.AmbientLight(0x404040, 3);
scene.add(ambientLight);

// Sunlight
let sunlight = new THREE.PointLight(0xffffff, 1.5, 0);
sunlight.position.set(0, 0, 0);
scene.add(sunlight);

// Planet data
const planetData = [
    { name: "Sun", file: "sun.glb", distance: 0, scale: 14 },
    { name: "Mercury", file: "mercury.glb", distance: 10, scale: 0.383 },
    { name: "Venus", file: "venus.glb", distance: 20, scale: 0.949 },
    { name: "Earth", file: "earth.glb", distance: 30, scale: 1 },
    { name: "Mars", file: "mars.glb", distance: 40, scale: 0.532 },
    { name: "Jupiter", file: "jupiter.glb", distance: 60, scale: 6 },
    { name: "Saturn", file: "saturn.glb", distance: 80, scale: 9.45 },
    { name: "Uranus", file: "uranus.glb", distance: 100, scale: 4.01 },
    { name: "Neptune", file: "neptune.glb", distance: 120, scale: 3.88 },
    { name: "Pluto", file: "pluto.glb", distance: 140, scale: 0.186 }
];

// GLTFLoader to load models
const loader = new THREE.GLTFLoader();
planetData.forEach((planet, index) => {
    loader.load(planet.file, function(gltf) {
        let obj = gltf.scene;
        obj.scale.set(planet.scale, planet.scale, planet.scale);
        obj.position.x = planet.distance;  // Line up planets on the x-axis
        scene.add(obj);
    });
});

// Resize handling
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

animate();
