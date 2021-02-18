import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()
const bakedShadowTexture = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadowTexture = textureLoader.load('/textures/simpleShadow.jpg')

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.position.set(2, 2, -1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize = new THREE.Vector2(512, 512)
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
directionalLight.shadow.camera.left = -1
directionalLight.shadow.camera.top = 1
directionalLight.shadow.camera.bottom = -1
directionalLight.shadow.camera.right = 1
directionalLight.shadow.radius = 10

gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

// Spotlight
const spotLight = new THREE.SpotLight(0xffffff, 0.2, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.position.set(0, 2, 2)
spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
spotLight.shadow.camera.far = 4
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.fov = 30
scene.add(spotLight)
scene.add(spotLight.target)

const spotlightLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotlightLightCameraHelper.visible = false
scene.add(spotlightLightCameraHelper)

// Pointlight
const pointLight = new THREE.PointLight(0xffffff, 0.4)
pointLight.castShadow = true
pointLight.position.set(-1, 1, 0)
pointLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
pointLight.shadow.camera.far = 4
pointLight.shadow.camera.near = 0.1
// pointLight.shadow.camera.fov = 30
scene.add(pointLight)
scene.add(pointLight.target)

const pointlightLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointlightLightCameraHelper)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial({
  roughness: 0.7,

})
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material,
)
gui.add(sphere.position, 'z').min(0).max(1).step(0.001)

sphere.castShadow = true

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material,
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5
plane.receiveShadow = true

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x111,
    transparent: true,
    alphaMap: simpleShadowTexture,
  }),
)
sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphere, plane, sphereShadow)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap

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
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //  Update sphere
  sphere.position.x = Math.cos(elapsedTime)
  sphere.position.z = Math.sin(elapsedTime)
  sphere.position.y = Math.abs(Math.sin(elapsedTime))

  // Update simple shadow
  sphereShadow.position.x = sphere.position.x
  sphereShadow.position.z = sphere.position.z
  sphereShadow.material.opacity = 1 - sphere.position.y

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
