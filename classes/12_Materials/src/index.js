import './style.css'
import {
  AmbientLight,
  BufferAttribute,
  Clock,
  Color,
  CubeTextureLoader,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  NearestFilter,
  PerspectiveCamera,
  PlaneBufferGeometry,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereBufferGeometry,
  SphereGeometry,
  TextureLoader,
  TorusBufferGeometry,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'

// 🐛 Debug
const gui = new GUI()

// 🍎 Textures
const textureLoader = new TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
// The gradientTexture is 3px, so Three stretches it too much.
gradientTexture.minFilter = NearestFilter
gradientTexture.magFilter = NearestFilter
gradientTexture.generateMipmaps = false
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// ☁ Environment Texture
const cubeTextureLoader = new CubeTextureLoader()
// Order is important!
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/1/px.jpg', // Positive X
  '/textures/environmentMaps/1/nx.jpg', // Negative X
  '/textures/environmentMaps/1/py.jpg', // Positive Y
  '/textures/environmentMaps/1/ny.jpg', // Negative Y
  '/textures/environmentMaps/1/pz.jpg', // Positive Z
  '/textures/environmentMaps/1/nz.jpg', // Negative Z
])
environmentMapTexture.minFilter = NearestFilter

// Canvas
const canvas = document.querySelector('canvas.webgl')

// 🌍 Scene
const scene = new Scene()

// 📦 Objects
const basicMaterial = new MeshBasicMaterial({
  color: 0xff0000,
  // map: matcapTexture,
  // wireframe: true,
  transparent: true,
  alphaMap: doorAlphaTexture,
  side: DoubleSide, // Performance heavy
})
// material.map = matcapTexture
// material.color = new Color(0xff0000)
// material.color.set(0x00ff00)
// material.wireframe = true
// material.transparent = true

const normalMaterial = new MeshNormalMaterial({
  flatShading: true,
})

const matcapMaterial = new MeshMatcapMaterial({
  matcap: matcapTexture,
})

const meshDeptMaterial = new MeshDepthMaterial()

const lambertMaterial = new MeshLambertMaterial() // Performant material

const phongMaterial = new MeshPhongMaterial({
  shininess: 100,
  specular: 0xff00ff,
}) // Less performant :(

const toonMaterial = new MeshToonMaterial({
  color: 0x00ffff,
  gradientMap: gradientTexture, // 5 steps of gradient.
})

const standardMaterial = new MeshStandardMaterial({
  map: doorColorTexture,

  aoMap: doorAmbientOcclusionTexture,
  // aoMapIntensity: 10,

  displacementMap: doorHeightTexture,
  displacementScale: 0.02,

  metalnessMap: doorMetalnessTexture,
  // metalness: 0.15,

  roughnessMap: doorRoughnessTexture,
  // roughness: 0.65,

  normalMap: doorNormalTexture,
  normalScale: new Vector2(0.5, 0.5),

  alphaMap: doorAlphaTexture,
  transparent: true,
})

const envMaterial = new MeshStandardMaterial({
  envMap: environmentMapTexture,
  roughness: 0.2,
  metalness: 0.7,
})

gui.add(envMaterial, 'metalness').min(0).max(1).step(0.00001)
gui.add(envMaterial, 'roughness').min(0).max(1).step(0.00001)

const sphere = new Mesh(
  new SphereBufferGeometry(0.5, 64, 64),
  envMaterial,
)

const plane = new Mesh(
  new PlaneBufferGeometry(1, 1, 64, 64),
  envMaterial,
)

const torus = new Mesh(
  new TorusBufferGeometry(0.3, 0.2, 64, 128),
  envMaterial,
)

sphere.position.x = -1.5
torus.position.x = 1.5

// UV coords for AO texture
plane.geometry.setAttribute('uv2', new BufferAttribute(plane.geometry.attributes.uv.array, 2))
sphere.geometry.setAttribute('uv2', new BufferAttribute(sphere.geometry.attributes.uv.array, 2))
torus.geometry.setAttribute('uv2', new BufferAttribute(torus.geometry.attributes.uv.array, 2))

scene.add(sphere, plane, torus)

// 💡 Lights
const ambientLight = new AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// 👖 Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// 👆 Cursor
const cursor = {
  x: 0,
  y: 0,
}

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

// 🎥 Camera
// const aspectRatio = sizes.width / sizes.height
// const camera = new OrthographicCamera(-2 * aspectRatio, 2 * aspectRatio, 2, -2)
const camera = new PerspectiveCamera(75, sizes.width / sizes.height)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
scene.add(camera)
camera.lookAt(sphere.position)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.enabled = false
controls.enableDamping = true
// controls.target.y = 1
// controls.update()

// 🍰 Renderer
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

// 🏃‍♂️ Animation

const clock = new Clock()
const callFrame = () => {
  // Update objects
  const elapsedTime = clock.getElapsedTime()
  sphere.rotation.y = 0.1 * elapsedTime
  plane.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  plane.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call the frame again.
  window.requestAnimationFrame(callFrame)
}

// Call function to start 'animation'
callFrame()
