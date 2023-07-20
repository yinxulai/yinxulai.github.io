import { createRef, onMounted } from 'airx'
import * as BABYLON from '@babylonjs/core'

import { Perlin } from '../../../common/math/noise'

import styles from './style.module.less'

// 多层渲染模拟的伪体积云
export function VolumeClouds() {
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)

  onMounted(() => {
    if (canvasRef.value == null) return

    // 使用 noise 生成体积云效果

    // 创建Babylon.js引擎实例
    const engine = new BABYLON.Engine(canvasRef.value, true)


    const scene = new BABYLON.Scene(engine)

    // 添加光源
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)

    // 添加体积云模型
    const cloud = BABYLON.MeshBuilder.CreateSphere("cloud", { diameter: 2 }, scene)
    const cloudMaterial = new BABYLON.StandardMaterial("cloudMaterial", scene)
    cloudMaterial.disableLighting = true
    cloud.material = cloudMaterial
    cloud.material.alpha = 0

    // 在每帧更新体积云位置
    scene.registerBeforeRender(() => {
      cloud.position.x = Math.sin(scene.getAnimationRatio()) * 0.5
      cloud.position.y = Math.cos(scene.getAnimationRatio()) * 0.25
    })

    // 创建相机
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene)
    camera.setTarget(BABYLON.Vector3.Zero())
    camera.attachControl(canvasRef.value, true)

    // 创建自定义渲染器
    function createCustomRenderer (scene: BABYLON.Scene) {
      // 创建渲染目标
      const renderTarget = new BABYLON.RenderTargetTexture(
        "renderTarget",
        { width: engine.getRenderWidth(), height: engine.getRenderHeight() },
        scene
      )
      renderTarget.refreshRate = 1

      // 创建平面
      const plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 2 }, scene)
      const planeMaterial = new BABYLON.StandardMaterial("planeMaterial", scene)
      planeMaterial.diffuseTexture = renderTarget
      plane.material = planeMaterial
      plane.position.z = -1

      // 设置自定义渲染器
      scene.customRenderTargets.push(renderTarget)
      scene.customRenderFunction = (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes) => {
        renderTarget.renderToTarget(true, () => {
          scene.activeCamera = camera
          scene.render()
        })
      }

      return { renderTarget, plane }
    }

    // 创建Ray Marching渲染器
    function createRayMarchingRenderer(scene: BABYLON.Scene, renderTarget: BABYLON.RenderTargetTexture) {
      // 创建着色器程序
      const shader = new BABYLON.PostProcessRenderEffect(
        engine,
        "rayMarching",
        () => new BABYLON.RayMarchingPostProcess("rayMarching", 1.0, scene.camera, null, 1.0),
        true
      )

      // 设置渲染通道
      shader.singleInstance = true
      shader.enableSceneDepthPass = false
      shader.enablePixelPerfectMode = false

      // 将渲染目标设置为着色器输入
      shader.quad.material.setTexture("renderTargetSampler", renderTarget)

      // 添加着色器程序到场景
      scene.postProcessRenderPipeline.addEffect(shader)

      return shader
    }


    const customRenderer = createCustomRenderer(scene)
    const rayMarchingRenderer = createRayMarchingRenderer(scene, customRenderer.renderTarget)


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
