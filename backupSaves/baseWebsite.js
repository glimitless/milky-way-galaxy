

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

document.getElementById('close-overlay').addEventListener('click', hideOverlay);

// Example planet objects setup
let planetOrbitInclines = {
  mercury: { name: "mercury", defaultOrbitIncline: 7.0 },
  venus: { name: "venus", defaultOrbitIncline: 3.395 },
  earth: { name: "earth", defaultOrbitIncline: 0 },
  mars: { name: "mars", defaultOrbitIncline: 1.848 },
  jupiter: { name: "jupiter", defaultOrbitIncline: 1.31},
  saturn: { name: "saturn", defaultOrbitIncline: 2.486},
  uranus: { name:"uranus", defaultOrbineIncline: 0.770},
  neptune: { name:"neptune", defaultOrbitIncline: 1.770}

};

let mercuryMesh;
let venusMesh;
let earthMesh, earthLightsMesh, earthCloudsMesh;
let marsMesh;
let jupiterMesh;
let saturnMesh;
let uranusMesh;
let neptuneMesh;

const planets = {
  mercury: {orbitIncline: 7.0, orbitRadius: 50, orbitSpeed: 0.00479, rotationSpeed: 0.001083, start: Math.random() * 360,},
  venus: {orbitIncline: 3.395, orbitRadius: 75, orbitSpeed: 0.0035, rotationSpeed: 0.00652, start: Math.random() * 360,},
  earth: {orbitIncline: 0, orbitRadius: 100, orbitSpeed: 0.00298, rotationSpeed: 0.001574, start: Math.random() * 360,},
  mars: {orbitIncline: 1.848, orbitRadius: 125, orbitSpeed: 0.0024, rotationSpeed: 0.00652, start: Math.random() * 360,},
  jupiter: {orbitIncline: 1.31, orbitRadius: 150, orbitSpeed: 0.00131, rotationSpeed: 0.0045583, start: Math.random() * 360,},
  saturn: {orbitIncline: 2.486, orbitRadius: 175, orbitSpeed: 0.000969, rotationSpeed: 0.0036840, start: Math.random() * 360,},
  uranus: {orbitIncline: 0.770, orbitRadius: 200, orbitSpeed: 0.000681, rotationSpeed: 0.0014794, start: Math.random() * 360},
  neptune: {orbitIncline: 1.770, orbitRadius: 225, orbitSpeed: 0.000543, rotationSpeed: 0.009719, start: Math.random() * 360},
}
const planetPositions = {
    mercury: {x: Math.cos(planets.mercury.start) * planets.mercury.orbitRadius, z: Math.sin(planets.mercury.start) * planets.mercury.orbitRadius,},
    venus: {x: Math.cos(planets.venus.start) * planets.venus.orbitRadius, z: Math.sin(planets.venus.start) * planets.venus.orbitRadius},
    earth: {x: Math.cos(planets.earth.start) * planets.earth.orbitRadius, z: Math.sin(planets.earth.start) * planets.earth.orbitRadius},
    mars: {x: Math.cos(planets.mars.start) * planets.mars.orbitRadius, z: Math.sin(planets.mars.start) * planets.mars.orbitRadius},
    jupiter: {x: Math.cos(planets.jupiter.start) * planets.jupiter.orbitRadius, z: Math.sin(planets.jupiter.start) * planets.jupiter.orbitRadius},
    saturn: {x: Math.cos(planets.saturn.start) * planets.saturn.orbitRadius, z: Math.sin(planets.saturn.start) * planets.saturn.orbitRadius},
    uranus: {x: Math.cos(planets.uranus.start) * planets.uranus.orbitRadius, z: Math.sin(planets.uranus.start) * planets.uranus.orbitRadius},
    neptune: {x: Math.cos(planets.neptune.start) * planets.neptune.orbitRadius, z: Math.sin(planets.neptune.start) * planets.neptune.orbitRadius},


}
const planetSize = 4;
const planetDescriptions = {
  mercury: "Mercury is the smallest and innermost planet in the Solar System. It is named after the Roman deity Mercury, the messenger of the gods.",
  venus: "Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. Venus is the second-brightest natural object in the night sky after the Moon.",
  earth: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29.2% of Earth's surface is land, and the remaining 70.8% is covered with water.",
  mars: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, after Mercury. Mars is often called the 'Red Planet' due to its reddish appearance.",
  jupiter: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined.",
  saturn: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius about nine times that of Earth.",
  uranus: "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. Uranus is similar in composition to Neptune, and both have bulk chemical compositions which differ from that of the larger gas giants Jupiter and Saturn.",
  neptune: "Neptune is the eighth and farthest known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet.",
};
const planetLinks = {
  mercury: [
    {name: "moons", url:"https://phys.org/news/2016-01-moons-mercury.html"},
    {name: "formation", url: "https://www.space.com/18641-mercury-formation.html"},
    {name: "composition", url: "https://www.space.com/18643-mercury-composition.html"},
    {name: "discovery", url: "https://www.universetoday.com/38170/who-discovered-mercury/"},
    {name: "exploration", url: "https://science.nasa.gov/mercury/exploration/"},
    {name: "astrology", url: "https://www.zodiacsign.com/astrology/planets/mercury/"},
  ],
  venus: [
    {name: "moons", url: "https://phys.org/news/2014-04-moons-venus.html"},
    {name: "formation", url: "https://www.space.com/18524-how-was-venus-formed.html"},
    {name: "composition", url: "https://www.space.com/18525-venus-composition.html"},
    {name: "discovery", url: "https://www.universetoday.com/22560/discovery-of-venus/"},
    {name: "exploration", url: "https://science.nasa.gov/venus/exploration/"},
    {name: "astrology", url: "https://www.zodiacsign.com/astrology/planets/venus/"},
  ],
  earth: [
    {name: "moons", url: "https://science.nasa.gov/moon/facts/"},
    {name: "formation", url: "https://www.space.com/19175-how-was-earth-formed.html"},
    {name: "composition", url: "https://education.nationalgeographic.org/resource/resource-library-earth-structure/"},
    {name: "discovery", url: "https://www.universetoday.com/26853/who-discovered-the-earth/"},
    {name: "exploration", url: "https://science.nasa.gov/earth/exploration/"},
    {name: "astrology", url: "https://www.wikihow.com/What-Does-Planet-Earth-Represent-in-Astrology"},
  ],
  mars: [
    {name: "moons", url: "https://science.nasa.gov/mars/moons/"},
    {name: "formation", url: "https://www.space.com/16912-how-was-mars-made.html"},
    {name: "composition", url: "https://phys.org/news/2015-02-mars.html"},
    {name: "discovery", url: "https://www.lpi.usra.edu/education/explore/mars/background/"},
    {name: "exploration", url: "https://science.nasa.gov/mars/exploration/"},
    {name: "astrology", url: "https://www.zodiacsign.com/astrology/planets/mars/"},
  ],
  jupiter: [
    {name: "moons", url: "https://science.nasa.gov/jupiter/moons/"},
    {name: "formation", url: "https://www.space.com/18389-how-was-jupiter-formed.html"},
    {name: "composition", url: "https://www.space.com/18388-what-is-jupiter-made-of.html"},
    {name: "discovery", url: "https://www.universetoday.com/15142/discovery-of-jupiter/"},
    {name: "exploration", url: "https://science.nasa.gov/jupiter/exploration/"},
    {name: "astrology", url: "https://www.zodiacsign.com/astrology/planets/jupiter/"},
  ],
  saturn: [
    {name: "moons", url: "https://science.nasa.gov/saturn/moons/"},
    {name: "formation", url: "https://www.space.com/18471-how-was-saturn-formed.html"},
    {name: "composition", url: "https://www.space.com/18472-what-is-saturn-made-of.html"},
    {name: "discovery", url: "https://www.universetoday.com/46237/who-discovered-saturn/"},
    {name: "exploration", url: "https://science.nasa.gov/saturn/exploration/"},
    {name: "astrology", url: "https://www.zodiacsign.com/astrology/planets/saturn/"},
  ],
  uranus: [
    {name: "moons", url: "https://science.nasa.gov/uranus/moons/"},
    {name: "formation", url: "https://www.space.com/18705-how-was-uranus-formed.html"},
    {name: "composition", url: "https://www.space.com/18706-uranus-composition.html"},
    {name: "discovery", url: "https://www.nasa.gov/history/240-years-ago-astronomer-william-herschel-identifies-uranus-as-the-seventh-planet/"},
    {name: "exploration", url: "https://maxpolyakov.com/exploring-uranus/"},
    {name: "astrology", url: "https://www.zodiacsign.com/astrology/planets/uranus/"},
  ],
  neptune: [
    {name: "moons", url: "https://science.nasa.gov/neptune/moons/"},
    {name: "formation", url: "https://www.space.com/18919-neptune-formation.html"},
    {name: "composition", url: "https://www.universetoday.com/21596/what-is-neptune-made-of-1/"},
    {name: "discovery", url: "https://www.nasa.gov/history/175-years-ago-astronomers-discover-neptune-the-eighth-planet/"},
    {name: "exploration", url: "https://science.nasa.gov/uranus/exploration/"},
    {name: "astrology", url: "https://www.zodiacsign.com/astrology/planets/neptune/"},
  ],


};

let clickedPlanet = null;



// // Sets Mercury's orbit 
// const mercuryOrbitIncline = 7.0;
// const mercuryOrbitRadius = 50;
// const mercuryOrbitSpeed = 0.00479;
// const mercuryRotationSpeed = 0.001083;
// var mercuryStart = Math.random() * 360;
// var mercuryX = Math.cos(mercuryStart) * mercuryOrbitRadius;
// var mercuryZ = Math.sin(mercuryStart) * mercuryOrbitRadius;


// Sets Venus' orbit 
// const venusOrbitIncline = 3.395;
// const venusOrbitRadius = 75;
// const venusOrbitSpeed = 0.0035;
// const venusRotationSpeed = 0.00652;
// var venusStart = Math.random() * 360;
// var venusX = Math.cos(venusStart) * venusOrbitRadius;
// var venusZ = Math.sin(venusStart) * venusOrbitRadius;

// // Sets Earth's orbit
// const earthOrbitIncline = 0;
// const earthOrbitRadius = 100;
// const earthOrbitSpeed = 0.00298;
// const earthRotationSpeed = 0.001574;
// const earthCloudRotationSpeed = 0.0019;
// var earthStart = Math.random() * 360;
// var earthX = Math.cos(earthStart) * earthOrbitRadius;
// var earthZ = Math.sin(earthStart) * earthOrbitRadius;

// // Sets Mars' orbit
// const marsOrbitIncline = 1.848;
// const marsOrbitRadius = 125;
// const marsOrbitSpeed = 0.0024;
// const marsRotationSpeed = 0.00866;
// var marsStart = Math.random() * 360;
// var marsX = Math.cos(marsStart) * marsOrbitRadius;
// var marsZ = Math.sin(marsStart) * marsOrbitRadius;

// // Sets Jupter's orbit
// const jupiterOrbitIncline = 1.31;
// const jupiterOrbitRadius = 150;
// const jupiterOrbitSpeed = 0.00131;
// const jupiterRotationSpeed = 0.0045583;
// var jupiterStart = Math.random() * 360;
// var jupiterX = Math.cos(jupiterStart) * jupiterOrbitRadius;
// var jupiterZ = Math.sin(jupiterStart) * jupiterOrbitRadius;

// // Sets Saturn's orbit
// const saturnOrbitIncline = 2.486;
// const saturnOrbitRadius = 175;
// const saturnOrbitSpeed = 0.000969;
// const saturnRotationSpeed = 0.0036840;
// var saturnStart = Math.random() * 360;
// var saturnX = Math.cos(saturnStart) * saturnOrbitRadius;
// var saturnZ = Math.sin(saturnStart) * saturnOrbitRadius;

// Sets Uranus' orbit
// const uranusOrbitIncline = 0.770;
// const uranusOrbitRadius = 200;
// const uranusOrbitSpeed = 0.000681;
// const uranusRotationSpeed = 0.0014794;
// var uranusStart = Math.random() * 360;
// var uranusX = Math.cos(uranusStart) * uranusOrbitRadius;
// var uranusZ = Math.sin(uranusStart) * uranusOrbitRadius;

// Sets Neptune's orbit
// const neptuneOrbitIncline = 1.770;
// const neptuneOrbitRadius = 225;
// const neptuneOrbitSpeed = 0.000543;
// const neptuneRotationSpeed = 0.009719;
// var neptuneStart = Math.random() * 360;
// var neptuneX = Math.cos(neptuneStart) * neptuneOrbitRadius;
// var neptuneZ = Math.sin(neptuneStart) * neptuneOrbitRadius; 


// Initiates the stars
const stars = getStarfield();
scene.add(stars);





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

          
          clickedPlanet = null;
          returnToCenter = true;
          hideOverlay();

          // Show the intro text again
          document.getElementById('introText').style.display = 'block';
          
      } else {
          clickedPlanet = planet;
    
          showOverlayForPlanet(planet);
          
          // Hide the intro text
          document.getElementById('introText').style.display = 'none';
      }
  }
}

function showOverlayForPlanet(planet) {
    const overlay = document.getElementById('planet-info-overlay');
    const planetName = document.getElementById('planet-name');
    const planetDescription = document.getElementById('planet-description');

    // Set the name and description based on the clicked planet
    planetName.textContent = planet.name; // Assuming the planet object has a 'name' property
    planetDescription.textContent = planetDescriptions[planet.name.toLowerCase()]; // Using the planetDescriptions object

    updatePlanetLinks(planet.name.toLowerCase());
    

    overlay.style.display = 'block'; // Show the overlay
}
function updatePlanetLinks(planetName) {
  const linksContainer = document.getElementById('planet-links');
  linksContainer.innerHTML = ''; // Clear existing links

  const links = planetLinks[planetName];
  if (links) {
      links.forEach(link => {
          const a = document.createElement('a');
          a.href = link.url;
          a.target = "_blank";
          a.textContent = link.name;
          a.className = 'planet-info-links'; // Use the class for styling
          linksContainer.appendChild(a);
          
          
          // Create and append the line break
          const br = document.createElement('br');
          linksContainer.appendChild(br);
      });
  }
}
function hideOverlay() {
    const overlay = document.getElementById('planet-info-overlay');
    overlay.style.display = 'none'; // Hide the overlay
}


function followPlanet(){
    if(clickedPlanet){
       // Define a fixed distance from the planet to the camera
       const distance = 10;

       // Calculate the direction vector from the camera to the planet
       const direction = new THREE.Vector3().subVectors(clickedPlanet.position, camera.position).normalize();

       // Calculate the new camera position with the specified distance
       const newPosition = new THREE.Vector3().addVectors(clickedPlanet.position, direction.multiplyScalar(-distance));

       // Set the camera to the new position
       camera.position.set(newPosition.x, newPosition.y, (newPosition.z));

       // Make the camera look at the planet
       camera.lookAt(clickedPlanet.position);
    }else {
        // Reset the camera to the center of the scene
        resetPosition();
    
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
    mercuryMesh.rotation.y += planets.mercury.rotationSpeed;
    // Moves Mercury
    planetPositions.mercury.x = Math.cos(planets.mercury.start) * planets.mercury.orbitRadius;
    planetPositions.mercury.z = Math.sin(planets.mercury.start) * planets.mercury.orbitRadius;
    mercuryMesh.position.set(planetPositions.mercury.x, 0, planetPositions.mercury.z);
    planets.mercury.start += planets.mercury.orbitSpeed;


    // Rotates Venus
    venusMesh.rotation.y += planets.venus.rotationSpeed;
    // Moves Venus
    planetPositions.venus.x = Math.cos(planets.venus.start) * planets.venus.orbitRadius;
    planetPositions.venus.z = Math.sin(planets.venus.start) * planets.venus.orbitRadius;
    venusMesh.position.set(planetPositions.venus.x, 0, planetPositions.venus.z);
    planets.venus.start += planets.venus.orbitSpeed;


    // Rotates Earth
    earthMesh.rotation.y += planets.earth.rotationSpeed;
    // earthLightsMesh.rotation.y += planets.earth.rotationSpeed;
    // earthCloudsMesh.rotation.y += planets.earth.rotationSpeed;
    // Moves Earth
    planetPositions.earth.x = Math.cos(planets.earth.start) * planets.earth.orbitRadius;
    planetPositions.earth.z = Math.sin(planets.earth.start) * planets.earth.orbitRadius;
    earthMesh.position.set(planetPositions.earth.x, 0, planetPositions.earth.z);
    // earthLightsMesh.position.set(earthX, 0, earthZ);
    // earthCloudsMesh.position.set(earthX, 0, earthZ);
    planets.earth.start += planets.earth.orbitSpeed;


    // Rotates Mars
    marsMesh.rotation.y += planets.mars.rotationSpeed;
    // Moves Mars
    planetPositions.mars.x = Math.cos(planets.mars.start) * planets.mars.orbitRadius;
    planetPositions.mars.z = Math.sin(planets.mars.start) * planets.mars.orbitRadius;
    marsMesh.position.set(planetPositions.mars.x, 0, planetPositions.mars.z);
    planets.mars.start += planets.mars.orbitSpeed;

    // Rotates Jupiter
    jupiterMesh.rotation.y += planets.jupiter.rotationSpeed;
    // Moves Jupiter
    planetPositions.jupiter.x = Math.cos(planets.jupiter.start) * planets.jupiter.orbitRadius;
    planetPositions.jupiter.z = Math.sin(planets.jupiter.start) * planets.jupiter.orbitRadius;
    jupiterMesh.position.set(planetPositions.jupiter.x, 0, planetPositions.jupiter.z);
    planets.jupiter.start += planets.jupiter.orbitSpeed;

    // Rotates Saturn
    saturnMesh.rotation.y += planets.saturn.rotationSpeed;
    // Moves Saturn
    planetPositions.saturn.x = Math.cos(planets.saturn.start) * planets.saturn.orbitRadius;
    planetPositions.saturn.z = Math.sin(planets.saturn.start) * planets.saturn.orbitRadius;
    saturnMesh.position.set(planetPositions.saturn.x, 0, planetPositions.saturn.z);
    planets.saturn.start += planets.saturn.orbitSpeed;

    // Rotates Uranus
    uranusMesh.rotation.y += planets.uranus.rotationSpeed;
    // Moves Uranus
    planetPositions.uranus.x = Math.cos(planets.uranus.start) * planets.uranus.orbitRadius;
    planetPositions.uranus.z = Math.sin(planets.uranus.start) * planets.uranus.orbitRadius;
    uranusMesh.position.set(planetPositions.uranus.x, 0, planetPositions.uranus.z);
    planets.uranus.start += planets.uranus.orbitSpeed;

    // Rotates Neptune
    neptuneMesh.rotation.y += planets.neptune.rotationSpeed;
    // Moves Neptune
    planetPositions.neptune.x = Math.cos(planets.neptune.start) * planets.neptune.orbitRadius;
    planetPositions.neptune.z = Math.sin(planets.neptune.start) * planets.neptune.orbitRadius;
    neptuneMesh.position.set(planetPositions.neptune.x, 0, planetPositions.neptune.z);
    planets.neptune.start += planets.neptune.orbitSpeed;


    

    



   
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
      mercuryMesh.name = "mercury";
      
      const mercuryGroup = new THREE.Group();
      
      mercuryGroup.rotation.z = planets.mercury.orbitIncline * Math.PI/180;
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
    venusMesh.name = "venus";
    
    const venusGroup = new THREE.Group();
    venusGroup.rotation.z = planets.venus.orbitIncline * Math.PI/180;
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

      
      // const earthLightsMat = new THREE.MeshBasicMaterial({
      //   map: loader.load('images/earth/8081_earthlights4k.jpg'),
      //   blending: THREE.AdditiveBlending,
      //   // transparent: true,
      //   opacity: 0.8,
      // })
      // const earthCloudsMat = new THREE.MeshStandardMaterial({
      //   map: loader.load('images/earth/8081_earthclouds4k.jpg'),
      //   blending: THREE.AdditiveBlending,
      //   opacity: 0.6,
      // });
  
      // Creates mesh with geometry and material
      earthMesh = new THREE.Mesh(geometry, earthMat);
      earthMesh.name = "earth";
      
      // earthLightsMesh = new THREE.Mesh(geometry, earthLightsMat);
      // earthCloudsMesh = new THREE.Mesh(geometry, earthCloudsMat);
      // earthCloudsMesh.scale.setScalar(1.003);
      
      const earthGroup= new THREE.Group();
      
      earthGroup.rotation.z = planets.earth.orbitIncline * Math.PI/180;
      earthGroup.add(earthMesh);
      // earthGroup.add(earthLightsMesh);
      // earthGroup.add(earthCloudsMesh);
      
  
      // Add the cube to the scene
      scene.add(earthGroup);
      // earthGroup.rotation.z = -23.4 * Math.PI / 180;
  
      
      
  
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
    marsMesh.name = "mars";

    // Creates group of all meshes
    const marsGroup = new THREE.Group();
    
    marsGroup.rotation.z = planets.mars.orbitIncline * Math.PI/180;
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
    jupiterMesh.name = "jupiter";
    
    // Creates group of all meshes
    const jupiterGroup = new THREE.Group();
    jupiterGroup.rotation.z = planets.jupiter.orbitIncline * Math.PI/180;
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
    saturnMesh.name = "saturn";
    
    // Creates group of all meshes
    const saturnGroup = new THREE.Group();
    saturnGroup.rotation.z = planets.saturn.orbitIncline * Math.PI/180;
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
    uranusMesh.name = "uranus";
    
    // Creates group of all meshes
    const uranusGroup = new THREE.Group();
    uranusGroup.rotation.z = planets.uranus.orbitIncline * Math.PI/180;
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
    neptuneMesh.name = "neptune";
    
    // Creates group of all meshes
    const neptuneGroup = new THREE.Group();
    neptuneGroup.name = "neptune";
    neptuneGroup.rotation.z = planets.neptune.orbitIncline * Math.PI/180;
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
function getStarfield({ numStars = 500} = {}) {
  // Adjust the neptuneOrbitRadius to match the scale of your scene

  function randomSpherePoint() {
    // Generate a radius that is outside of Neptune's orbit
    const radius = Math.random() * 500 + (planets.neptune.orbitRadius+100);
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  const verts = [];
  const colors = [];
  for (let i = 0; i < numStars; i += 1) {
    let pos = randomSpherePoint();
    let hue = 0.6; // Assuming a constant hue for all stars
    let col = new THREE.Color().setHSL(hue, 0.2, Math.random()); // Declare col here
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 5, // Adjust size as needed
    vertexColors: true,
    map: new THREE.TextureLoader().load("images/circle.png"),
    transparent: true, // Set to true if your texture has transparency
  });

  const points = new THREE.Points(geo, mat);
  return points;
}











