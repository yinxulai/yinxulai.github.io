import { createRef, onMounted } from 'airx'
import * as BABYLON from '@babylonjs/core'

import styles from './style.module.less'
import noiseImage from './images/noise.png'
import cloudsVertex from './shaders/clouds.vertex.fx?raw'
import cloudsFragment from './shaders/clouds.fragment.fx?raw'

BABYLON.Effect.ShadersStore['cloudVertexShader'] = cloudsVertex
BABYLON.Effect.ShadersStore['cloudFragmentShader'] = cloudsFragment

// 多层渲染模拟的伪体积云
export function VolumeClouds() {
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)

  onMounted(() => {
    if (canvasRef.value == null) return

    // 使用 noise 生成体积云效果

    // 创建Babylon.js引擎实例
    const engine = new BABYLON.Engine(canvasRef.value, true)

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine)

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("camera1", Math.PI, Math.PI / 2.0, 20, new BABYLON.Vector3(0, 0, 0), scene)

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero())

    // This attaches the camera to the canvas
    camera.attachControl(canvasRef.value, true)

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene)

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.1


    // Compile
    var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
      vertex: "cloud",
      fragment: "cloud",
    },
      {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
      }
    )

    const mainTexture = new BABYLON.Texture(noiseImage, scene, false, false)
    mainTexture.anisotropicFilteringLevel = 1

    //https://www.shadertoy.com/view/ltlSWB
    shaderMaterial.setTexture("iChannel0", mainTexture)
    shaderMaterial.setFloat("time", 1)
    shaderMaterial.setFloat("offset", 5)
    shaderMaterial.setFloat("sunx", 2.0)
    shaderMaterial.setFloat("suny", 0.9)
    shaderMaterial.backFaceCulling = false


    var Dome = BABYLON.Mesh.CreateSphere('Dome', 500, 500, scene)

    Dome.material = shaderMaterial

    var time = 0
    scene.registerBeforeRender(function () {
      var shaderMaterial = scene.getMaterialByName("shader")!
      // @ts-ignore
      shaderMaterial.setFloat("time", time)
      // Animate Move Sun 
      // @ts-ignore
      shaderMaterial.setFloat("suny", Math.sin(time * 0.2))
      // @ts-ignore
      shaderMaterial.setFloat("sunx", Math.sin(time * 0.2))
      time += 0.01
    })

    // 渲染循环
    engine.runRenderLoop(() => {
      scene.render()
    })

    // 处理窗口调整事件
    window.addEventListener("resize", () => {
      engine.resize()
    })
  })

  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
    </div>
  )
}
