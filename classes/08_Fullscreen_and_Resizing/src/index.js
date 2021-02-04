import './style.css'
import {
  AxesHelper,
  BoxGeometry,
  Clock,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Cursor
const cursor = {
  x: 0,
  y: 0,
}

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new Scene()

/**
 * Objects
 */

// Group -< Object3D
const group = new Group()
scene.add(group)
const cube = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshBasicMaterial({ color: 0x0000ff }),
)
group.add(cube)

// group.rotation.y = -0.5
// Position <Object3D>
// cube.position.x = 1
// cube.position.y = 1
// cube.position.z = 1
// mesh.position.set(1, 1, 1)

// Scale <Object3D>
// cube.scale.x = 0.5
// cube.scale.y = 0.5
// cube.scale.z = 0.5
// mesh.scale.set(0.5, 0.5, 0.5)

// Rotation <Object3D>
cube.rotation.reorder('YXZ') // Needs to be called before the rotation is applied.
// cube.rotation.x = Math.PI * 0.25
// cube.rotation.y = Math.PI * 0.25
// mesh.rotation.z = 0.5
// mesh.scale.set(0.5, 0.5, 0.5)

// Axes helper
scene.add(new AxesHelper(5))

// cube.position.normalize()

/**
 * Camera
 */
// const aspectRatio = sizes.width / sizes.height
// const camera = new OrthographicCamera(-2 * aspectRatio, 2 * aspectRatio, 2, -2)
const camera = new PerspectiveCamera(75, sizes.width / sizes.height)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
scene.add(camera)
camera.lookAt(cube.position)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.enabled = false
controls.enableDamping = true
// controls.target.y = 1
// controls.update()

/**
 * Renderer
 */
const renderer = new WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
// Set pixel ratio according to the device. Limit 2.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Resize listener
window.addEventListener('resize', (event) => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', (event) => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})

const clock = new Clock()

// Animation
const tick = () => {
  const elapsedTime = clock.getElapsedTime() // Returns seconds
  // cube.rotation.y = elapsedTim
  // INFO: Change camera position based on cursor.
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  // camera.position.y = -cursor.y * Math.PI * 2
  // camera.lookAt(cube.position)
  // INFO: To allow damping after mouseUp
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

// Call function to start 'animation'
tick()
