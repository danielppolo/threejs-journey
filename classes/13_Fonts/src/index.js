import './style.css'
import {
  AmbientLight,
  AxesHelper,
  BoxBufferGeometry,
  BufferAttribute,
  Clock,
  Color,
  CubeTextureLoader,
  DoubleSide,
  Font,
  FontLoader,
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

// 🐛 Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// 🌍 Scene
const scene = new Scene()
const parameters = { background: 0x067d29e }
scene.background = new Color(parameters.background)
gui.addColor(parameters, 'background').onChange(() => {
  const color = new Color(parameters.background)
  scene.background = new Color(parameters.background)
})

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

// 🕸 Meshes

const textGeometry = new TextBufferGeometry(
  'daniel polo',
  {
    font: helvetica,
    size: 0.5,
    height: 0.1,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 2,
  },
)
// Calculates boundingBox and enables the prop.
textGeometry.computeBoundingBox()
const textMesh = new Mesh(
  textGeometry,
  toonMaterial,
)
// We move the origin of the Text, not the Mesh.
// textGeometry.translate(
//   -(textGeometry.boundingBox.max.x / 2),
//   -(textGeometry.boundingBox.max.y / 2),
//   -(textGeometry.boundingBox.max.z / 2),
// )
textGeometry.center()

scene.add(textMesh)

for (let i = 0; i < 60; i += 1) {
  const scale = Math.random() * 0.5
  const sphere = new Mesh(
    new SphereBufferGeometry(1, 32, 32),
    toonMaterial,
  )

  sphere.position.x = (Math.random() - 0.5) * 15
  sphere.position.y = (Math.random() - 0.5) * 15
  sphere.position.z = (Math.random() - 0.5) * 15
  sphere.rotation.x = (Math.random() - 0.5) * 15
  sphere.rotation.y = (Math.random() - 0.5) * 15
  sphere.rotation.z = (Math.random() - 0.5) * 15
  sphere.scale.set(scale, scale, scale)

  const box = new Mesh(
    new BoxBufferGeometry(2, 2, 2, 1, 1, 1),
    toonMaterial,
  )

  box.position.x = (Math.random() - 0.5) * 15
  box.position.y = (Math.random() - 0.5) * 15
  box.position.z = (Math.random() - 0.5) * 15
  box.rotation.x = (Math.random() - 0.5) * 15
  box.rotation.y = (Math.random() - 0.5) * 15
  box.rotation.z = (Math.random() - 0.5) * 15
  box.scale.set(scale, scale, scale)

  const torus = new Mesh(
    new TorusBufferGeometry(0.3, 0.2, 20, 48),
    toonMaterial,
  )

  torus.position.x = (Math.random() - 0.5) * 15
  torus.position.y = (Math.random() - 0.5) * 15
  torus.position.z = (Math.random() - 0.5) * 15
  torus.rotation.x = (Math.random() - 0.5) * 15
  torus.rotation.y = (Math.random() - 0.5) * 15
  torus.rotation.z = (Math.random() - 0.5) * 15
  torus.scale.set(scale, scale, scale)

  scene.add(torus, box, sphere)
}

// // UV coords for AO texture
// plane.geometry.setAttribute('uv2', new BufferAttribute(plane.geometry.attributes.uv.array, 2))
// sphere.geometry.setAttribute('uv2', new BufferAttribute(sphere.geometry.attributes.uv.array, 2))
// torus.geometry.setAttribute('uv2', new BufferAttribute(torus.geometry.attributes.uv.array, 2))

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
camera.lookAt(textMesh.position)

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

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call the frame again.
  window.requestAnimationFrame(callFrame)
}

// Call function to start 'animation'
callFrame()
