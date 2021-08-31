
import * as THREE from 'three'
import { Ref, ref, computed } from 'vue'
import { makeNoise3D } from 'fast-simplex-noise'

export function useCurvedPlane(canvas: Ref<HTMLCanvasElement | undefined>) {
  let zOffset = ref(0.01)
  const noise = makeNoise3D()
  const scene = new THREE.Scene()

  const renderer = computed(() => {
    if (canvas.value == null) return null
    const { width, height } = canvas.value
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value })
    renderer.setSize(width, height)
    return renderer
  })

  const camera = computed(() => {
    if (canvas.value == null) return null
    const { width, height } = canvas.value
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
    camera.position.z = 5
    return camera
  })

  const plane = computed(() => {
    if (canvas.value == null) return null
    const { width, height } = canvas.value
    const geometry = new THREE.PlaneGeometry(width, height, Math.fround(width), Math.fround(height))
    const material = new THREE.MeshNormalMaterial({flatShading: true})
    return new THREE.Mesh(geometry, material)
  })

  const box = computed(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial()
    return new THREE.Mesh(geometry, material)
  })

  const render = () => {
    if (renderer.value == null) return
    if (camera.value == null) return
    if (plane.value == null) return
    zOffset.value += 0.005

    if (scene.getObjectById(plane.value.id) == null) {
      console.log('add plane')
      scene.add(plane.value)
    }

    if (scene.getObjectById(box.value.id) == null) {
      console.log('add box')
      // scene.add(box.value)
    }

    const position = plane.value.geometry.getAttribute('position');

    for (let i = 0; i < position.count; i++) {
      const z = noise(position.getX(i) * 0.001, position.getY(i) * 0.001, zOffset.value)
      position.setZ(i, Math.fround(Math.abs(z) * 50))
    }

    position.needsUpdate = true
    box.value.rotation.x += 0.01;
    box.value.position.z += 0.01;

    plane.value.rotation.x = 5;
    plane.value.position.z = -500;
    // console.log(plane.value.rotation.x)
    renderer.value.render(scene, camera.value)
  }

  return { render }
}

// export function useCurvedPlane(canvas: Ref<HTMLCanvasElement | undefined>) {
//   var scene = new THREE.Scene();
//   var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//   var renderer = new THREE.WebGLRenderer({canvas: canvas.value});
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   // document.body.appendChild(renderer.domElement);

//   var geometry = new THREE.BoxGeometry(1, 1, 1);
//   var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//   var cube = new THREE.Mesh(geometry, material);
//   scene.add(cube);

//   camera.position.z = 5;

//   const render = () => {
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;

//     renderer.render(scene, camera);
//   }

//   return { render }
// }
