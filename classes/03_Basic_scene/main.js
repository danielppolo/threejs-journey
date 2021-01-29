// redirect to the newest stable release.
import * as THREE from 'https://unpkg.com/three/build/three.module.js';


// 1. Create scene
const scene = new THREE.Scene()


// 2. Create mesh
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  color: 0xFF0000
})
const mesh = new THREE.Mesh(geometry, material)

// 3. Add mesh to the scene
scene.add(mesh)


const sizes = {
  width: 800,
  height: 600
}

// 4. Create camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
scene.add(camera)

camera.position.z = 3
camera.position.x = 1
// 5. Create renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)
