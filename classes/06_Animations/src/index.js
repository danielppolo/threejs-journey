import './style.css'
import {
  AxesHelper,
  BoxGeometry,
  Clock,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import gsap from 'gsap'

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
const cube2 = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshBasicMaterial({ color: 0x00ff00 }),
)
group.add(cube)
group.add(cube2)

group.rotation.y = -0.5
// Position <Object3D>
cube.position.x = 1
cube.position.y = 1
cube.position.z = 1
// mesh.position.set(1, 1, 1)

// Scale <Object3D>
cube.scale.x = 0.5
cube.scale.y = 0.5
cube.scale.z = 0.5
// mesh.scale.set(0.5, 0.5, 0.5)

// Rotation <Object3D>
cube.rotation.reorder('YXZ') // Needs to be called before the rotation is applied.
cube.rotation.x = Math.PI * 0.25
cube.rotation.y = Math.PI * 0.25
// mesh.rotation.z = 0.5
// mesh.scale.set(0.5, 0.5, 0.5)

// Axes helper
scene.add(new AxesHelper(5))

// cube.position.normalize()

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
}

/**
 * Camera
 */
const camera = new PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 1
camera.position.y = 0.6
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

// INFO: JS time
// const time = Date.now()
// INFO: Three.js time
// const clock = new Clock()

gsap.to(cube.position, { x: 2, duration: 1, delay: 1 })

// Animation
const tick = () => {
  // INFO: Time to handle animation speed vs framerates. JS way
  // const currentTime = Date.now()
  // const deltaTime = currentTime - time
  // time = currentTime
  // Update
  // cube.rotation.x += 0.005 * elapsedTime
  // cube2.rotation.y += 0.002 * elapsedTime

  // INFO: Using Three.js clock
  // const elapsedTime = clock.getElapsedTime() // Returns seconds
  // Update
  // cube.rotation.x = elapsedTime
  // cube2.rotation.y = elapsedTime

  // INFO: Render per frame
  renderer.render(scene, camera)

  // INFO: Calls the function in the next frame.
  window.requestAnimationFrame(tick)
}

// Call function to start 'animation'
tick()
