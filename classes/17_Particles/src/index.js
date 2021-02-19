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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleAplhaMap = textureLoader.load('/textures/particles/14.png')
/**
 * Particles
 */
const particlesGeometry = new THREE.SphereBufferGeometry(1, 32, 32)
// Random
const randomGeometry = new THREE.BufferGeometry()
const count = 5000
const positionsArray = new Float32Array(count * 3 * 3)
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 5
}
const positionsAttr = new THREE.BufferAttribute(positionsArray, 3)
randomGeometry.setAttribute('position', positionsAttr)

const colorsArray = new Float32Array(count * 3 * 3)
const green = [0, 1, 0]
const blue = [0, 0, 1]
const red = [1, 0, 0]
const rgb = [red, green, blue]
for (let i = 0; i < count; i++) {
  const i3 = i * 3
  const color = rgb[Math.floor(Math.random() * 3)]
  colorsArray[i3] = color[0]
  colorsArray[i3 + 1] = color[1]
  colorsArray[i3 + 2] = color[2]
}
const colorAttr = new THREE.BufferAttribute(colorsArray, 3)
randomGeometry.setAttribute('color', colorAttr)

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  //   color: 'blue',
  vertexColors: true,
  alphaMap: particleAplhaMap,
  transparent: true,
  //   alphaTest: 0.001,
  //   depthTest: false, // Draws everything besides depth. Bugssss!
  depthWrite: false, // Best solution. Bugs.
  blending: THREE.AdditiveBlending, // Performance
})

// Points
const particles = new THREE.Points(randomGeometry, particlesMaterial)
scene.add(particles)

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
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update particles
  //   particles.rotation.y = elapsedTime * 0.2

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
