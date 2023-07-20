import * as BABYLON from '@babylonjs/core'
import { createRef, onMounted } from 'airx'

import smoke from './image/smoke.png'
import styles from './style.module.less'

// 雾状的云
export function FogClouds() {
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)

  onMounted(() => {
    if (canvasRef.value == null) return

    const engine = new BABYLON.Engine(canvasRef.value, true)
    const scene = new BABYLON.Scene(engine)

    const camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1.3, 20, new BABYLON.Vector3(0, 0, 0), scene)
    camera.attachControl(canvasRef.value, true)
    camera.wheelPrecision = 100

    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    )

    light.intensity = 0.7

    const fountain = BABYLON.MeshBuilder.CreateBox("foutain", { size: 0.01 }, scene)
    fountain.visibility = 0

    const ground = BABYLON.MeshBuilder.CreatePlane("ground", { size: 50.0 }, scene)
    ground.position = new BABYLON.Vector3(0, 0, 0)
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0)

    const material = new BABYLON.StandardMaterial("groundMat", scene)
    material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3)
    material.backFaceCulling = true
    material.alpha = 1
    ground.material = material

    // use noise generation texture
    const fogTexture = new BABYLON.Texture(smoke, scene)

    // GPU
    // const particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity: 50000 }, scene)
    // particleSystem.activeParticleCount = 15000
    // particleSystem.manualEmitCount = particleSystem.activeParticleCount
    // particleSystem.minEmitBox = new BABYLON.Vector3(-50, 2, -50) // Starting all from
    // particleSystem.maxEmitBox = new BABYLON.Vector3(50, 2, 50) // To..

    const particleSystem = new BABYLON.ParticleSystem("particles", 2500, scene)
    particleSystem.manualEmitCount = particleSystem.getCapacity()
    particleSystem.minEmitBox = new BABYLON.Vector3(-25, 2, -25) // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(25, 2, 25) // To...

    particleSystem.particleTexture = fogTexture.clone()
    particleSystem.emitter = fountain

    particleSystem.color1 = new BABYLON.Color4(0.8, 0.8, 0.8, 0.1)
    particleSystem.color2 = new BABYLON.Color4(.95, .95, .95, 0.15)
    particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1)
    particleSystem.minSize = 3.5
    particleSystem.maxSize = 5.0
    particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER
    particleSystem.emitRate = 50000
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0)
    particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0)
    particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0)
    particleSystem.minAngularSpeed = -2
    particleSystem.maxAngularSpeed = 2
    particleSystem.minEmitPower = .5
    particleSystem.maxEmitPower = 1
    particleSystem.updateSpeed = 0.005

    particleSystem.start()

    engine.runRenderLoop(() => scene.render())
  })

  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
    </div>
  )
}
