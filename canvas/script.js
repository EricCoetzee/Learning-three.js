let scene, camera, renderer, controls;
const planets = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const planetData = [
    { name: "Sun", file: "sun.glb", distance: 0, scale: 5 },
    { name: "Mercury", file: "mercury.glb", distance: 10, scale: 0.383 },
    { name: "Venus", file: "venus.glb", distance: 15, scale: 0.949 },
    { name: "Earth", file: "earth.glb", distance: 20, scale: 1 },
    { name: "Mars", file: "mars.glb", distance: 25, scale: 0.532 },
    { name: "Jupiter", file: "jupiter.glb", distance: 104, scale: 7 },
    { name: "Saturn", file: "saturn.glb", distance: 150, scale: 9.45 },
    { name: "Uranus", file: "uranus.glb", distance: 300, scale: 4.01 },
    { name: "Neptune", file: "neptune.glb", distance: 450, scale: 3.88 },
    { name: "Pluto", file: "pluto.glb", distance: 590, scale: 0.186 }
];
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 600;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;  // Enable shadows for added realism
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0;
    controls.maxDistance = 400;

    const starsTexture = new THREE.TextureLoader().load('./images/stars.jpg');
    const starsMaterial = new THREE.MeshBasicMaterial({
        map: starsTexture,
        side: THREE.BackSide
    });
    const starSphere = new THREE.Mesh(new THREE.SphereGeometry(1000, 64, 64), starsMaterial);
    scene.add(starSphere);

    // Sun's light positioned at the center
    const sunLight = new THREE.PointLight(0xffffff, 3, );  // Increased intensity
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;  // Let the sun cast shadows
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);  // Reduced ambient light
    scene.add(ambientLight);

    const loader = new THREE.GLTFLoader();
    planetData.forEach(data => {
        loader.load(data.file, function (gltf) {
            let planet = gltf.scene;
            planet.scale.set(data.scale, data.scale, data.scale);
            planet.position.x = data.distance;
            planet.castShadow = true;
            planet.receiveShadow = true;
            if (data.name === "Sun") {
                const sunGlow = createSunGlow();  // Adding glow effect to the Sun
                planet.add(sunGlow);
            }
            scene.add(planet);
            planets.push({ mesh: planet, distance: data.distance, speed: 0.001 * data.distance });
        });
    });

    window.addEventListener('resize', onWindowResize, false);
}

function createSunGlow() {
    const spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load('./images/glow.png'),
        color: 0xffee88,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(50, 50, 1);
    return sprite;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Update planet positions
    planets.forEach(planetInfo => {
        planetInfo.mesh.rotation.y += 0.01;
        const angle = Date.now() * 0.0001 * planetInfo.speed;
        planetInfo.mesh.position.x = planetInfo.distance * Math.cos(angle);
        planetInfo.mesh.position.z = planetInfo.distance * Math.sin(angle);
    });

    renderer.render(scene, camera);
}

init();
animate();
