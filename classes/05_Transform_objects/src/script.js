import './style.css'
import * as THREE from 'three'
import { AxesHelper } from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// Group -< Object3D
const group = new THREE.Group()
scene.add(group)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
)
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
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
scene.add(new THREE.AxesHelper(5))

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 1
camera.position.y = 0.6
camera.position.z = 3
scene.add(camera)
camera.lookAt(cube.position)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
