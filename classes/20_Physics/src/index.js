import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import CANNON, {
  Body, Box, ContactMaterial, Material, SAPBroadphase, Sphere, Vec3,
} from 'cannon'
import {
  Mesh, MeshStandardMaterial, SphereBufferGeometry, BoxBufferGeometry,
} from 'three'

// ⌚ 30:00 min

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {
  createSphere: () => {
    createSphere(
      Math.random(),
      {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random()) * 5,
        z: (Math.random() - 0.5) * 5,
      },
    )
  },
  createBox: () => {
    createBox(
      Math.random(),
      {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5,
        z: (Math.random() - 0.5) * 5,
      },
    )
  },
  reset: () => {
    objectsToUpdate.forEach((object) => {
      object.body.removeEventListener('collide', playHitSound)
      world.removeBody(object.body)

      scene.remove(object.mesh)
    })
  },
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png',
])

// Audio
const hitSound = new Audio('/sounds/hit.mp3')
const playHitSound = (event) => {
  const { mass } = event.body
  const { radius } = event.body.shapes[0]
  if (event.contact.getImpactVelocityAlongNormal() < 1) return
  hitSound.currentTime = 0
  // hitSound.volume = mass * radius
  hitSound.play()
}

// 🥡 Physics
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new SAPBroadphase(world)
world.allowSleep = true

// Materials (cannon.js)
const concreteMaterial = new Material('concrete') // Name is just a reference
const plasticMaterial = new Material('plastic')
// Material dynamics
const concretePlasticContactMaterial = new ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0,
    restitution: 0.7,
  },
)
world.addContactMaterial(concretePlasticContactMaterial)
// world.defaultContactMaterial = concretePlasticContactMaterial

// 👂 Bodies
const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  shape: sphereShape,
  material: plasticMaterial,
})
sphereBody.applyLocalForce(
  new Vec3(150, 0, 0),
  new Vec3(0, 0, 0), // Force in X of 150 at the center of the sphere
)
// world.addBody(sphereBody)

const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({
  mass: 0,
  shape: planeShape,
  material: concreteMaterial,
})
planeBody.quaternion.setFromAxisAngle(
  new Vec3(-1, 0, 0),
  Math.PI * 0.5, // 90 deg.
)
// A plane is infinite, so the direction of the plane is important to show/hide objects
world.addBody(planeBody)

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
  }),
)
sphere.castShadow = true
sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
  }),
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Utils
const objectsToUpdate = []

const sphereGeometry = new SphereBufferGeometry(1, 20, 20)
const sphereMaterial = new MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
})
const createSphere = (radius, position) => {
  // Three.js
  const mesh = new Mesh(sphereGeometry, sphereMaterial)
  mesh.scale.set(radius, radius, radius)
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  // Cannon.js
  const shape = new Sphere(radius)
  const body = new Body({
    mass: 1,
    position: new Vec3(0, 3, 0),
    shape,
    material: plasticMaterial,
  })
  body.position.copy(position)
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  // Save them in the array to update
  objectsToUpdate.push({
    mesh,
    body,
  })
}

const boxGeometry = new BoxBufferGeometry(1, 1, 1, 2, 2, 2)
const boxMaterial = new MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
})
const createBox = (side, position) => {
  // Three.js
  const mesh = new Mesh(boxGeometry, boxMaterial)
  mesh.scale.set(side, side, side)
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  // Cannon.js
  const shape = new Box(new Vec3(side / 2, side / 2, side / 2))
  const body = new Body({
    mass: 1,
    position: new Vec3(0, 3, 0),
    shape,
    material: plasticMaterial,
  })
  body.position.copy(position)
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  // Save them in the array to update
  objectsToUpdate.push({
    mesh,
    body,
  })
}

createSphere(0.5, { x: 0, y: 3, z: 0 })

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update Physics
  // sphereBody.applyForce(new Vec3(-0.5, 0, 0), new Vec3(0, 0, 0))
  world.step(1 / 60, deltaTime, 3)

  objectsToUpdate.forEach((object) => {
    object.mesh.position.copy(object.body.position)
    object.mesh.quaternion.copy(object.body.quaternion) // Rotation
  })

  // Update Meshes
  sphere.position.copy(sphereBody.position)
  // sphere.position.set(
  //   sphereBody.position.x,
  //   sphereBody.position.y,
  //   sphereBody.position.z,
  // )

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
