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
import gsap from 'gsap'

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
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

/**
 * Renderer
 */
const renderer = new WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)

const clock = new Clock()

// Animation
const tick = () => {
  const elapsedTime = clock.getElapsedTime() // Returns seconds
  // cube.rotation.y = elapsedTime
  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  camera.position.y = -cursor.y * Math.PI * 2
  camera.lookAt(cube.position)
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

// Call function to start 'animation'
tick()
