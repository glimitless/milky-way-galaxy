import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// let frameCount = 0;
// const throttleInterval = 0; // Adjust the interval as needed

// initiates the three.js scene
const { camera, renderer, scene, loader, initialCameraPosition } = initScene();
// Positions the camera
camera.position.z = 5;
// Initiates the sunlight
const sunLight = initSunlight();
// Gets the camera position
const cameraPosition = camera.position;
var returnToCenter = false;


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
var isMouseDown = false;


document.addEventListener('click', function(event) {
    // Mouse button is pressed down
    isMouseDown = true;

    // Resets isMouseDown to false
    setTimeout(function() {
      isMouseDown = false;
    }, 10);
});
document.addEventListener( 'pointermove', onPointerMove );


let mercuryMesh;
let venusMesh;
let earthMesh, earthLightsMesh, earthCloudsMesh;
let marsMesh;
let jupiterMesh;
let saturnMesh;
let uranusMesh;
let neptuneMesh;

var planetSize = 4;
var planetDescriptions = {
  mercury: "Mercury is the smallest planet in the Solar System and the closest to the Sun.",
  venus: "Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty.",
}

let clickedPlanet = null;


// Sets Mercury's orbit 
const mercuryOrbitIncline = 7.0;
const mercuryOrbitRadius = 50;
const mercuryOrbitSpeed = 0.00479;
const mercuryRotationSpeed = 0.001083;
var mercuryStart = Math.random() * 360;
var mercuryX = Math.cos(mercuryStart) * mercuryOrbitRadius;
var mercuryZ = Math.sin(mercuryStart) * mercuryOrbitRadius;


// Sets Venus' orbit 
const venusOrbitIncline = 3.395;
const venusOrbitRadius = 75;
const venusOrbitSpeed = 0.0035;
const venusRotationSpeed = 0.00652;
var venusStart = Math.random() * 360;
var venusX = Math.cos(venusStart) * venusOrbitRadius;
var venusZ = Math.sin(venusStart) * venusOrbitRadius;

// Sets Earth's orbit
const earthOrbitIncline = 0;
const earthOrbitRadius = 100;
const earthOrbitSpeed = 0.00298;
const earthRotationSpeed = 0.001574;
const earthCloudRotationSpeed = 0.0019;
var earthStart = Math.random() * 360;
var earthX = Math.cos(venusStart) * earthOrbitRadius;
var earthZ = Math.sin(venusStart) * earthOrbitRadius;

// Sets Mars' orbit
const marsOrbitIncline = 1.848;
const marsOrbitRadius = 125;
const marsOrbitSpeed = 0.0024;
const marsRotationSpeed = 0.00866;
var marsStart = Math.random() * 360;
var marsX = Math.cos(marsStart) * marsOrbitRadius;
var marsZ = Math.sin(marsStart) * marsOrbitRadius;

// Sets Jupter's orbit
const jupiterOrbitIncline = 1.31;
const jupiterOrbitRadius = 150;
const jupiterOrbitSpeed = 0.00131;
const jupiterRotationSpeed = 0.0045583;
var jupiterStart = Math.random() * 360;
var jupiterX = Math.cos(jupiterStart) * jupiterOrbitRadius;
var jupiterZ = Math.sin(jupiterStart) * jupiterOrbitRadius;

// Sets Saturn's orbit
const saturnOrbitIncline = 2.486;
const saturnOrbitRadius = 175;
const saturnOrbitSpeed = 0.000969;
const saturnRotationSpeed = 0.0036840;
var saturnStart = Math.random() * 360;
var saturnX = Math.cos(saturnStart) * jupiterOrbitRadius;
var saturnZ = Math.sin(saturnStart) * jupiterOrbitRadius;

// Sets Uranus' orbit
const uranusOrbitIncline = 0.770;
const uranusOrbitRadius = 200;
const uranusOrbitSpeed = 0.000681;
const uranusRotationSpeed = 0.0014794;
var uranusStart = Math.random() * 360;
var uranusX = Math.cos(uranusStart) * uranusOrbitRadius;
var uranusZ = Math.sin(uranusStart) * uranusOrbitRadius;

// Sets Neptune's orbit
const neptuneOrbitIncline = 1.770;
const neptuneOrbitRadius = 225;
const neptuneOrbitSpeed = 0.000543;
const neptuneRotationSpeed = 0.009719;
var neptuneStart = Math.random() * 360;
var neptuneX = Math.cos(neptuneStart) * neptuneOrbitRadius;
var neptuneZ = Math.sin(neptuneStart) * neptuneOrbitRadius; 








// Initiates the orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Initiates all planets
initPlanets();

console.log(scene.children);


// Call the render function to start rendering
render();


// Create a render function
function render() {
    // frameCount++;
    
    
    
  
    // if (frameCount % throttleInterval === 0) {
    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera( pointer, camera );
    
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( scene.children );
    
    // Change color of intersected objects to red and reset others to white
    for (var i=0; i < scene.children.length; i++) {
      for(const object of scene.children[i].children){
        if (object.material) {
          const isIntersected = intersects.find(intersect => intersect.object === object);

          if (isIntersected) {
            
            object.material.color.set(0xff0000); // Set color to red for intersected objects
            clickPlanet(object);
          } else {
            object.material.color.set(0xffffff); // Set color to white for non-intersected objects
          }
        }
      }
    }
    

    // frameCount = 0;
    // }
    // Update sunlight position to match camera position
    sunLight.position.copy(camera.position);

    // Calculate the forward direction of the camera
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    // Calculate a target position based on the camera's forward direction
    const targetPosition = new THREE.Vector3().addVectors(camera.position, cameraDirection);

    // Update the sunlight to face the target position
    sunLight.target.position.copy(targetPosition);
    sunLight.target.updateMatrixWorld();

    followPlanet();
    // updateOverlayForPlanet(clickedPlanet);
    updateData();
    // Render the scene
    renderer.render(scene, camera);


    // Amimates the render
    requestAnimationFrame(render);
    
}
function clickPlanet(planet){
    if(isMouseDown){
        // Toggle the clickedPlanet state
        if(clickedPlanet === planet){
            // If the same planet is clicked again, release the lock
            clickedPlanet = null;
            controls.enabled = true;
            returnToCenter = true;
        } else {
            // Lock the camera to the new planet
            clickedPlanet = planet;
            controls.enabled = false;
            console.log(clickedPlanet);
        }

    }
}
function followPlanet(){
    if(clickedPlanet){
      // Example: move the camera to the right by the horizontal offset
      camera.position.set(clickedPlanet.position.x, clickedPlanet.position.y, clickedPlanet.position.z + 10);
      camera.lookAt(clickedPlanet.position.x, clickedPlanet.position.y, clickedPlanet.position.z + 10);
        // // Adjust the camera position to follow the clicked planet
        // camera.position.set(clickedPlanet.position.x, clickedPlanet.position.y, clickedPlanet.position.z + 10);
        // camera.lookAt(clickedPlanet.position); // Focus the camera on the clicked planet
        
    }else {
        // Reset the camera to the center of the scene
        resetPosition();
    
    }
}
function adjustCameraToFocusPlanet(planetPosition, horizontalOffset) {
  // Example: move the camera to the right by the horizontal offset
  const offset = new THREE.Vector3(horizontalOffset, 0, 0);
  camera.position.copy(planetPosition.clone().add(offset));
  camera.lookAt(planetPosition);
}
function updateOverlayForPlanet() {
  if(clickedPlanet){
      // We're zoomed in, show the overlay
      const overlay = document.getElementById('planet-info-overlay');
      overlay.style.display = 'block';

      // Project the planet's position to screen space
      const screenPosition = clickedPlanet.position.clone().project(camera);
      const x = (screenPosition.x * .5 + .5) * window.innerWidth;
      const y = (screenPosition.y * -.5 + .5) * window.innerHeight;

      // Position the overlay - example to place it on the left side, centered vertically
      overlay.style.left = `${x - overlay.offsetWidth + window.innerHeight}px`; // Adjust as needed
      overlay.style.top = `${y - overlay.offsetHeight}px`;
  }else{
      // We're not zoomed in, hide the overlay
      document.getElementById('planet-info-overlay').style.display = 'none';
  }
}

function displayPlanetInfo(){
    if(clickedPlanet){
        
    }
}
function resetPosition(){
    if(returnToCenter){
        camera.position.set(0, 0, 5);
        returnToCenter = false;
    }
}
function updateData(){
    // Rotates Mercury
    mercuryMesh.rotation.y += mercuryRotationSpeed;
    // Moves Mercury
    mercuryX = Math.cos(mercuryStart) * mercuryOrbitRadius;
    mercuryZ = Math.sin(mercuryStart) * mercuryOrbitRadius;
    mercuryMesh.position.set(mercuryX, 0, mercuryZ);
    mercuryStart += mercuryOrbitSpeed;


    // Rotates Venus
    venusMesh.rotation.y += venusRotationSpeed;
    // Moves Venus
    venusX = Math.cos(venusStart) * venusOrbitRadius;
    venusZ = Math.sin(venusStart) * venusOrbitRadius;
    venusMesh.position.set(venusX, 0, venusZ);
    venusStart += venusOrbitSpeed;


    // Rotates Earth
    earthMesh.rotation.y += earthRotationSpeed;
    earthLightsMesh.rotation.y += earthRotationSpeed;
    earthCloudsMesh.rotation.y += earthCloudRotationSpeed;
    // Moves Earth
    earthX = Math.cos(earthStart) * earthOrbitRadius;
    earthZ = Math.sin(earthStart) * earthOrbitRadius;
    earthMesh.position.set(earthX, 0, earthZ);
    earthLightsMesh.position.set(earthX, 0, earthZ);
    earthCloudsMesh.position.set(earthX, 0, earthZ);
    earthStart += earthOrbitSpeed;


    // Rotates Mars
    marsMesh.rotation.y += marsRotationSpeed;
    // Moves Mars
    marsX = Math.cos(marsStart) * marsOrbitRadius;
    marsZ = Math.sin(marsStart) * marsOrbitRadius;
    marsMesh.position.set(marsX, 0, marsZ);
    marsStart += marsOrbitSpeed;

    // Rotates Jupiter
    jupiterMesh.rotation.y += jupiterRotationSpeed;
    // Moves Jupiter
    jupiterX = Math.cos(jupiterStart) * jupiterOrbitRadius;
    jupiterZ = Math.sin(jupiterStart) * jupiterOrbitRadius;
    jupiterMesh.position.set(jupiterX, 0, jupiterZ);
    jupiterStart += jupiterOrbitSpeed;

    // Rotates Saturn
    saturnMesh.rotation.y += saturnRotationSpeed;
    // Moves Saturn
    saturnX = Math.cos(saturnStart) * saturnOrbitRadius;
    saturnZ = Math.sin(saturnStart) * saturnOrbitRadius;
    saturnMesh.position.set(saturnX, 0, saturnZ);
    saturnStart += saturnOrbitSpeed;

    // Rotates Uranus
    uranusMesh.rotation.y += uranusRotationSpeed;
    // Moves Uranus
    uranusX = Math.cos(uranusStart) * uranusOrbitRadius;
    uranusZ = Math.sin(uranusStart) * uranusOrbitRadius;
    uranusMesh.position.set(uranusX, 0, uranusZ);
    uranusStart += uranusOrbitSpeed;

    // Rotates Neptune
    neptuneMesh.rotation.y += neptuneRotationSpeed;
    // Moves Neptune
    neptuneX = Math.cos(neptuneStart) * neptuneOrbitRadius;
    neptuneZ = Math.sin(neptuneStart) * neptuneOrbitRadius;
    neptuneMesh.position.set(neptuneX, 0, neptuneZ);
    neptuneStart += neptuneOrbitSpeed;


    

    



   
    sunLight.position.copy(camera.position);
    

}
function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  
}
function initPlanets(){
  initMercury();
  initVenus();
  initEarth();
  initMars();
  initJupiter();
  initSaturn();
  initUranus();
  initNeptune();
  function initMercury(){
    
    // Create a sphere geometry
    const mercuryGeometry = new THREE.IcosahedronGeometry(planetSize, 12);
  
    // Creates materials for Earth Mesh
    
    const mercuryMat = new THREE.MeshPhongMaterial({
      map: loader.load("images/mercury/mercurymap.jpg"), 
      bumpMap: loader.load("images/mercury/mercurybump.jpg"),
      bumpScale: 0.04,
      });
      
      // Creates mesh with geometry and material
      mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMat);
      
      const mercuryGroup = new THREE.Group();
      mercuryGroup.name = "mercury";
      mercuryGroup.rotation.z = mercuryOrbitIncline * Math.PI/180;
      mercuryGroup.add(mercuryMesh);
      
      
    
      // Add the cube to the scene
      scene.add(mercuryGroup);
      // earthGroup.rotation.z = -23.4 * Math.PI / 180;

  
      
    
    
  }
  function initVenus(){
      
    // Create a sphere geometry
    const venusGeometry = new THREE.IcosahedronGeometry(planetSize, 12);
  
    
  
    // Creates materials for Earth Mesh
    
    const venusMat = new THREE.MeshPhongMaterial({
      map: loader.load("images/venus/2234_venusmap2k.jpg"), 
      bumpMap: loader.load("images/venus/2234_venusbump2k.jpg"),
      bumpScale: 0.04,
    });
    
    // Creates mesh with geometry and material
    venusMesh = new THREE.Mesh(venusGeometry, venusMat);
    
    const venusGroup = new THREE.Group();
    venusGroup.name = "venus";
    venusGroup.rotation.z = venusOrbitIncline * Math.PI/180;
    venusGroup.add(venusMesh);
    
    
  
    // Add the cube to the scene
    scene.add(venusGroup);
    // earthGroup.rotation.z = -23.4 * Math.PI / 180;
    
    
  }
  function initEarth(){
      
      // Create a sphere geometry
      const geometry = new THREE.IcosahedronGeometry(planetSize, 12);
  
      // Creates materials for Earth Mesh
      
      const earthMat = new THREE.MeshPhongMaterial({
        map: loader.load("images/earth/8081_earthmap4k.jpg"),
        specularMap: loader.load("images/earth/8081_earthspec4k.jpg"), 
        bumpMap: loader.load("images/earth/8081_earthbump4k.jpg"),
        bumpScale: 0.04,
      });
      const earthLightsMat = new THREE.MeshBasicMaterial({
        map: loader.load('images/earth/8081_earthlights4k.jpg'),
        blending: THREE.AdditiveBlending,
        // transparent: true,
        opacity: 0.8,
      })
      const earthCloudsMat = new THREE.MeshStandardMaterial({
        map: loader.load('images/earth/8081_earthclouds4k.jpg'),
        blending: THREE.AdditiveBlending,
        opacity: 0.6,
      });
  
      // Creates mesh with geometry and material
      earthMesh = new THREE.Mesh(geometry, earthMat);
      earthLightsMesh = new THREE.Mesh(geometry, earthLightsMat);
      earthCloudsMesh = new THREE.Mesh(geometry, earthCloudsMat);
      earthCloudsMesh.scale.setScalar(1.003);
      
      const earthGroup= new THREE.Group();
      earthGroup.name = "earth";
      earthGroup.rotation.z = earthOrbitIncline * Math.PI/180;
      earthGroup.add(earthMesh);
      earthGroup.add(earthLightsMesh);
      earthGroup.add(earthCloudsMesh);
      
  
      // Add the cube to the scene
      scene.add(earthGroup);
      // earthGroup.rotation.z = -23.4 * Math.PI / 180;
  
      const stars = getStarfield();
      scene.add(stars);
  
      
  
      // const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 1 );
      // scene.add(hemiLight);
  
      
  }
  function initMars(){
      
    // Create a sphere geometry
    const marsGeometry = new THREE.IcosahedronGeometry(planetSize, 12);
  
    
  
    // Creates materials for Mars Mesh
    
    const marsMat = new THREE.MeshPhongMaterial({
      map: loader.load("images/mars/5672_mars_4k_color.jpg"), 
      bumpMap: loader.load("images/mars/5672_marsbump4k.jpg"),
      bumpScale: 0.04,
    });
    
    // Creates mesh with geometry and material
    marsMesh = new THREE.Mesh(marsGeometry, marsMat);
    
    // Creates group of all meshes
    const marsGroup = new THREE.Group();
    marsGroup.name = "mars";
    marsGroup.rotation.z = marsOrbitIncline * Math.PI/180;
    marsGroup.add(marsMesh);
    
    
  
    // Adds Mars to the scene
    scene.add(marsGroup);
   
    
    
  }
  function initJupiter(){
      
    // Create a sphere geometry
    const jupiterGeometry = new THREE.IcosahedronGeometry(planetSize, 12);
  
    
  
    // Creates materials for Jupiter Mesh
    
    const jupiterMat = new THREE.MeshPhongMaterial({
      map: loader.load("images/jupiter/jupitermap.jpg"), 
    });
    
    // Creates mesh with geometry and material
    jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMat);
    
    // Creates group of all meshes
    const jupiterGroup = new THREE.Group();
    jupiterGroup.name = "jupiter";
    jupiterGroup.rotation.z = jupiterOrbitIncline * Math.PI/180;
    jupiterGroup.add(jupiterMesh);
    
    
  
    // Adds Jupiter to the scene
    scene.add(jupiterGroup);
   
    
    
  }
  function initSaturn(){
      
    // Create a sphere geometry
    const saturnGeometry = new THREE.IcosahedronGeometry(planetSize, 12);
  
    
  
    // Creates materials for Saturn Mesh
    
    const saturnMat = new THREE.MeshPhongMaterial({
      map: loader.load("images/saturn/saturnmap.jpg"), 
    });
    
    // Creates mesh with geometry and material
    saturnMesh = new THREE.Mesh(saturnGeometry, saturnMat);
    
    // Creates group of all meshes
    const saturnGroup = new THREE.Group();
    saturnGroup.name = "saturn";
    saturnGroup.rotation.z = saturnOrbitIncline * Math.PI/180;
    saturnGroup.add(saturnMesh);
    
    
  
    // Adds Saturn to the scene
    scene.add(saturnGroup);
   
    
    
  }
  function initUranus(){
      
    // Create a sphere geometry
    const uranusGeometry = new THREE.IcosahedronGeometry(planetSize, 12);
  
    
  
    // Creates materials for Uranus Mesh
    
    const uranusMat = new THREE.MeshPhongMaterial({
      map: loader.load("images/uranus/uranusmap.jpg"), 
    });
    
    // Creates mesh with geometry and material
    uranusMesh = new THREE.Mesh(uranusGeometry, uranusMat);
    
    // Creates group of all meshes
    const uranusGroup = new THREE.Group();
    uranusGroup.rotation.z = uranusOrbitIncline * Math.PI/180;
    uranusGroup.name = "uranus";
    uranusGroup.add(uranusMesh);
    
    
  
    // Adds Uranus to the scene
    scene.add(uranusGroup);
   
    
    
  }
  function initNeptune(){
      
    // Create a sphere geometry
    const neptuneGeometry = new THREE.IcosahedronGeometry(planetSize, 12);
  
    
  
    // Creates materials for Neptune Mesh
    
    const neptuneMat = new THREE.MeshPhongMaterial({
      map: loader.load("images/neptune/neptunemap.jpg"), 
    });
    
    // Creates mesh with geometry and material
    neptuneMesh = new THREE.Mesh(neptuneGeometry, neptuneMat);
    
    // Creates group of all meshes
    const neptuneGroup = new THREE.Group();
    neptuneGroup.name = "neptune";
    neptuneGroup.rotation.z = neptuneOrbitIncline * Math.PI/180;
    neptuneGroup.add(neptuneMesh);
    
    
  
    // Adds Neptune to the scene
    scene.add(neptuneGroup);
   
    
    
  }
}
function initSunlight(){
  const sunLight = new THREE.DirectionalLight(0xffffff);
  sunLight.position.set(0, 0, 5);
  sunLight.target = new THREE.Object3D(); // Add this line
  scene.add(sunLight);
  scene.add(sunLight.target); // And this line
  return sunLight;
}
function initScene(){
  // Initiates a scene
  const scene = new THREE.Scene();

  // Initiates a camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const initialCameraPosition = camera.position.clone();

  // Initiates the renderer
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Initiates texture loader
  const loader = new THREE.TextureLoader();

  // Renders into the html document
  document.body.appendChild(renderer.domElement);

  return {camera, renderer, scene, loader, initialCameraPosition};
}
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function getStarfield({ numStars = 500 } = {}) {
    // code sourced from https://github.com/bobbyroe/threejs-earth
    function randomSpherePoint() {
      const radius = Math.random() * 25 + 25;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      let x = radius * Math.sin(phi) * Math.cos(theta);
      let y = radius * Math.sin(phi) * Math.sin(theta);
      let z = radius * Math.cos(phi);
  
      return {
        pos: new THREE.Vector3(x, y, z),
        hue: 0.6,
        minDist: radius,
      };
    }
    const verts = [];
    const colors = [];
    const positions = [];
    let col;
    for (let i = 0; i < numStars; i += 1) {
      let p = randomSpherePoint();
      const { pos, hue } = p;
      positions.push(p);
      col = new THREE.Color().setHSL(hue, 0.2, Math.random());
      verts.push(pos.x, pos.y, pos.z);
      colors.push(col.r, col.g, col.b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      map: new THREE.TextureLoader().load("images/circle.png"),
    });
    const points = new THREE.Points(geo, mat);
    return points;
}










