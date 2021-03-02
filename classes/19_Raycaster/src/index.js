import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Raycaster, Vector3, Vector2 } from 'three'

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
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
)
object1.position.x = -2

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
)

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
)
object3.position.x = 2

scene.add(object1, object2, object3)

// 🔫 Raycaster
const raycaster = new Raycaster()
// const raycasterOrigin = new Vector3(-3, 0, 0)
// const raycasterDirection = new Vector3(10, 0, 0)
// raycasterDirection.normalize() // Same direction, length of 1.
// raycaster.set(raycasterOrigin, raycasterDirection)
// const intersect = raycaster.intersectObject(object2)

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

// 🐭 Mouse
const mouse = new Vector2()
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1 // -1 -> 1
  mouse.y = -((event.clientY / sizes.height) * 2) + 1 // -1 -> 1
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

  // Animate objects
  object1.position.y = (Math.sin(elapsedTime * 0.3)) * 1.5
  object2.position.y = (Math.sin(elapsedTime * 0.9)) * 1.5
  object3.position.y = (Math.sin(elapsedTime * 1.4)) * 1.5

  // Cast a ray from mouse
  raycaster.setFromCamera(mouse, camera)

  // Cast a ray
  // const raycasterOrigin = new Vector3(-3, 0, 0)
  // const raycasterDirection = new Vector3(10, 0, 0)
  // raycasterDirection.normalize()
  // raycaster.set(raycasterOrigin, raycasterDirection)

  const intersects = raycaster.intersectObjects([object1, object2, object3])
  object1.material.color.set('#ff0000')
  object2.material.color.set('#ff0000')
  object3.material.color.set('#ff0000')
  intersects.forEach((intersect) => {
    intersect.object.material.color.set('#0000ff')
  })

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
