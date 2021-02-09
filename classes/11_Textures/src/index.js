import './style.css'
import {
  AxesHelper,
  BoxBufferGeometry,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Group,
  LoadingManager,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import { GUI } from 'dat.gui'

// Textures: JS way
// const image = new Image()
// image.src = '/textures/door/color.jpg'
// const texture = new Texture(image)
// image.addEventListener('load', () => {
//   texture.needsUpdate = true
// })

// Textures: Three
const manager = new LoadingManager()
const textureLoader = new TextureLoader(manager)
const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const ambientOclussionTexture = textureLoader.load('/textures/door/ambientOclussion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

colorTexture.repeat.x = 3
colorTexture.repeat.y = 3
colorTexture.wrapS = RepeatWrapping
colorTexture.wrapT = RepeatWrapping
colorTexture.offset.x = 0.5
// Debug
const gui = new GUI()
const parameters = {
  color: 0xff00000,
  spin: () => {
    console.log('spin')
  },
}

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

const geometry = new BufferGeometry()
// nd array (1d)
// const positionsArray = new Float32Array([
//   0, 0, 0, // Vertex 1
//   0, 1, 0, // Vertex 2
//   1, 0, 0, // Vertex 3
// ])
// const positionsAttr = new BufferAttribute(positionsArray, 3)
// geometry.setAttribute('position', positionsAttr)

const count = 50
const positionsArray = new Float32Array(count * 3 * 3)

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = Math.random() - 0.5
}

const positionsAttr = new BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttr)

const material = new MeshBasicMaterial({
  map: colorTexture,
  // color: parameters.color,
  // wireframe: true,
})
const cube = new Mesh(
  new BoxBufferGeometry(1, 1, 1, 2, 2, 2),
  material,
)
group.add(cube)

parameters.spin = () => {
  gsap.to(cube.rotation, { duration: 1, y: 10 })
}

gui.add(cube.position, 'y')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Elevation')

gui.add(cube, 'visible')
  .name('Visibility')

const folder = gui.addFolder('Groups')
folder.add(material, 'wireframe')
  .name('Wireframe')

folder.addColor(parameters, 'color')
  .onChange((e) => {
    material.color.set(parameters.color)
  })

folder.add(parameters, 'spin')
  .name('Spin')

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
