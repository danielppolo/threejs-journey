import './style.css'
import {
  AmbientLight,
  AxesHelper,
  BoxBufferGeometry,
  BufferAttribute,
  Clock,
  Color,
  CubeTextureLoader,
  DirectionalLight,
  DirectionalLightHelper,
  DoubleSide,
  Font,
  FontLoader,
  HemisphereLight,
  HemisphereLightHelper,
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
  PointLightHelper,
  RectAreaLight,
  Scene,
  SphereBufferGeometry,
  SphereGeometry,
  SpotLight,
  TextBufferGeometry,
  TextureLoader,
  TorusBufferGeometry,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

// 🐛 Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// 🌍 Scene
const scene = new Scene()
const parameters = { background: 0x067d29e }
// scene.background = new Color(parameters.background)
// gui.addColor(parameters, 'background').onChange(() => {
//   const color = new Color(parameters.background)
//   scene.background = new Color(parameters.background)
// })

// 🪓 Axes helper
const axesHelper = new AxesHelper()
// scene.add(axesHelper)

// 🖋 Fonts
// const fontLoader = new FontLoader() // Needs a callback. nay!
// fontLoader.load(
//   '/fonts/helvetiker_regular.typeface.json',
//   (font) => {
//   }, // onSuccess
// )
const helvetica = new Font(typefaceFont)
// 🍎 Textures
const textureLoader = new TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
// The gradientTexture is 3px, so Three stretches it too much.
gradientTexture.minFilter = NearestFilter
gradientTexture.magFilter = NearestFilter
gradientTexture.generateMipmaps = false
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
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
  color: 0x00ffaa,
  gradientMap: gradientTexture, // 5 steps of gradient.
})

const standardMaterial = new MeshStandardMaterial({
  side: DoubleSide,
})
standardMaterial.roughness = 0.4

const envMaterial = new MeshStandardMaterial({
  envMap: environmentMapTexture,
  roughness: 0.2,
  metalness: 0.7,
})

// 🕸 Meshes
const scale = Math.random() * 0.5
const sphere = new Mesh(
  new SphereBufferGeometry(0.5, 32, 32),
  standardMaterial,
)

sphere.position.x = -2

const box = new Mesh(
  new BoxBufferGeometry(1, 1, 1, 1, 1, 1),
  standardMaterial,
)

box.position.x = 0

const torus = new Mesh(
  new TorusBufferGeometry(0.3, 0.2, 20, 48),
  standardMaterial,
)

torus.position.x = 2

const plane = new Mesh(
  new PlaneBufferGeometry(6, 3, 20, 48),
  standardMaterial,
)
plane.position.y = -0.55
plane.rotation.x = -Math.PI * 0.5
scene.add(torus, box, sphere, plane)

// // UV coords for AO texture
// plane.geometry.setAttribute('uv2', new BufferAttribute(plane.geometry.attributes.uv.array, 2))
// sphere.geometry.setAttribute('uv2', new BufferAttribute(sphere.geometry.attributes.uv.array, 2))
// torus.geometry.setAttribute('uv2', new BufferAttribute(torus.geometry.attributes.uv.array, 2))

// 💡 Lights
// LOW COST
const ambientLight = new AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)
gui.add(ambientLight, 'intensity').name('Ambient light').step(0.1)

const hemisphereLight = new HemisphereLight(0xff0000, 0x0000ff, 0.2)
scene.add(hemisphereLight)
gui.add(hemisphereLight, 'intensity').name('Hemisphere Light').step(0.1)
const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

// MODERATE COST
const directionalLight = new DirectionalLight(0x0000ff)
directionalLight.position.set(1, 1, 0.2)
scene.add(directionalLight)
gui.add(directionalLight, 'intensity').name('Directional Light').step(0.1)
const directionalLightHelper = new DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

// HIGH COST
const pointLight = new PointLight(0xff9000, 0.5, 3)
pointLight.position.set(-1, 2, 0.2)
// scene.add(pointLight)
gui.add(pointLight, 'intensity').name('Point Light').step(0.1)
const pointLightHelper = new PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const rectAreaLight = new RectAreaLight(0x4e00ff, 10, 1, 1)
rectAreaLight.position.set(1, 0, -2)
rectAreaLight.lookAt(torus.position)
// scene.add(rectAreaLight)
gui.add(rectAreaLight, 'intensity').name('Rect Light').step(0.1)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

const spotLight = new SpotLight(
  0x78ff00, // color
  0.5, // intensity
  10, // end distance
  Math.PI * 0.1, // angle
  0.25, // penumbra: sharpness in the light projection.
  1, // decay: how fast it goes to the limits
)
spotLight.position.set(1, 0, 2)
scene.add(spotLight)
// lookAt doesnt work like it should for spotlights.
scene.add(spotLight.target) // Target is a 3DObject
spotLight.target = torus
gui.add(spotLight, 'intensity').name('Rect Light').step(0.1)

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
camera.lookAt(box.position)

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
  box.rotation.x = elapsedTime * 0.15
  box.rotation.y = elapsedTime * 0.55
  torus.rotation.x = elapsedTime * -0.25
  torus.rotation.y = elapsedTime * 0.85
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call the frame again.
  window.requestAnimationFrame(callFrame)
}

// Call function to start 'animation'
callFrame()
