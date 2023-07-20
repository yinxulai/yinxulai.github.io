import * as BABYLON from '@babylonjs/core'
import { createRef, onMounted } from 'airx'

import earthHeightImage from './image/earth-height.png'
import earthImage from './image/earth.png'

import styles from './style.module.less'

export function Earth() {
  const canvasRef = createRef<HTMLCanvasElement | undefined>(undefined)

  onMounted(() => {
    if (canvasRef.value == null) return

    var createScene = function (canvas, engine) {
      var scene = new BABYLON.Scene(engine)
      var skyColor = new BABYLON.Color3(.45, .65, 1.0)
      scene.clearColor = BABYLON.Color3.Blue()
      var camera = new BABYLON.TargetCamera("cam", BABYLON.Vector3.Zero(), scene); camera.attachControl(canvas, true)
      var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1.5, 1.0, 0.0), scene)
      light.intensity = 0.75
      light.specular = BABYLON.Color3.Black()
      light.groundColor = BABYLON.Color3.White()

      // Let's embbed the camera in an abstract mesh to rotate it
      var node = new BABYLON.AbstractMesh('n', scene)
      camera.parent = node


      // Earth and flight parameters
      var circumference = 40000              // Earth circumfere in km
      var everest = 8.848                    // Earth max height
      var mapFactor = 0.25                   // The factor to apply to earth measures to get the map
      var elevationFactor = 5.0              // Elevation mulitplier
      var nbPoints = 2000                    // Number of points on each map dimension
      var initialCamPosition = new BABYLON.Vector3(100, 20, 10000) // initial camera position on the earth
      var downLimit = 5.0                    // camera initial down limit
      var upLimit = 50.0                     // camera up limit
      var speed = 2.0                        // Flight speed
      var altitudeRange = upLimit - downLimit
      var halfAltitude = altitudeRange * 0.5

      // Fog
      scene.fogMode = BABYLON.Scene.FOGMODE_EXP2
      scene.fogColor = skyColor
      var fogDensity = 0.0020
      var fogAmplitude = fogDensity * 0.2
      var fogCycle = 10.0
      scene.fogDensity = fogDensity

      // Texture and material
      var terrainTexture = new BABYLON.Texture(earthImage, scene)

      var terrainMaterial = new BABYLON.StandardMaterial("tm", scene)
      terrainMaterial.diffuseTexture = terrainTexture
      //terrainMaterial.wireframe = true;


      // callback function : terrain creation
      var terrain
      var terrainReady = false
      var createTerrain = function (mapData, mapSubX, mapSubZ) {

        var params = {
          mapData: mapData,               // data map declaration : what data to use ?
          mapSubX: mapSubX,               // how are these data stored by rows and columns
          mapSubZ: mapSubZ,
          terrainSub: 250                 // how many terrain subdivisions wanted
        }
        terrain = new BABYLON.DynamicTerrain("t", params, scene)
        terrain.LODLimits = [4, 3, 2, 2, 1, 1, 1, 1]
        terrain.mesh.material = terrainMaterial
        terrain.isAlwaysVisible = true
        terrainReady = true
        terrain.createUVMap() // compute the UVs to stretch the image on the whole map

        terrain.updateCameraLOD = function (terrainCamera) {
          // LOD value increases with camera altitude
          var camLOD = Math.abs((terrainCamera.globalPosition.y / 30.0) | 0)
          return camLOD
        }
      }

      // Data Map
      var mapWidth = circumference * mapFactor
      var mapHeight = circumference * mapFactor
      var hmOptions = {
        width: mapWidth, height: mapHeight,          // map size in the World 
        subX: nbPoints, subZ: nbPoints,              // number of points on map width and height
        maxHeight: everest * elevationFactor,              // highest elevation
        onReady: createTerrain                       // callback function declaration
      }

      var mapData = new Float32Array(nbPoints * nbPoints * 3) // the array that will store the generated data  
      BABYLON.DynamicTerrain.CreateMapFromHeightMapToRef(earthHeightImage, hmOptions, mapData, scene)

      // Sky map 
      var skyMapSub = 300
      var skyMap = new Float32Array(skyMapSub * skyMapSub * 3)
      var skyMapColor = new Float32Array(skyMapSub * skyMapSub * 3)
      var l = 0
      var w = 0
      for (l = 0; l < skyMapSub; l++) {
        for (w = 0; w < skyMapSub; w++) {
          var rnd = Math.sin(l * w * 0.001) * 0.5 * Math.random()
          skyMap[(w + l * skyMapSub) * 3] = (w - skyMapSub * 0.5) * circumference * mapFactor / skyMapSub
          skyMap[(w + l * skyMapSub) * 3 + 1] = rnd * 10.0
          skyMap[(w + l * skyMapSub) * 3 + 2] = (l - skyMapSub * 0.5) * circumference * mapFactor / skyMapSub

          skyMapColor[(w + l * skyMapSub) * 3] = skyColor.r + rnd
          skyMapColor[(w + l * skyMapSub) * 3 + 1] = skyColor.g + rnd
          skyMapColor[(w + l * skyMapSub) * 3 + 2] = skyColor.b
        }
      }

      // Sky creation
      var skyMaterial = new BABYLON.StandardMaterial("sm", scene)
      skyMaterial.diffuseColor = BABYLON.Color3.White()
      skyMaterial.specularColor = BABYLON.Color3.Black()
      var sky = new BABYLON.DynamicTerrain("sky", { mapData: skyMap, mapSubX: skyMapSub, mapSubZ: skyMapSub, terrainSub: 70, mapColors: skyMapColor, invertSide: true }, scene)
      sky.isAlwaysVisible = true
      sky.mesh.material = skyMaterial
      skyMaterial.backFaceCulling = false
      // Sky parameters
      var skyAltitude = upLimit * 0.85
      var skyAltitudeAmplitude = skyAltitude * 0.60
      var skyAltitudeCycle = 1.2
      var skyAlpha = 0.4
      var skyAlphaAmplitude = 0.3
      var skyAlphaCycle = 2.0
      var skyColorAmplitude = 0.1
      var skyColorCycle = 1.0
      var skyColorDelta = 0.0

      // GUI
      var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")
      gui.idealWidth = 960
      gui.renderAtIdealSize = true
      var canvasX = gui._canvas.width * 0.5
      var canvasY = gui._canvas.height * 0.5
      var sightColor = "GreenYellow"
      var sight = new BABYLON.GUI.Ellipse()
      sight.width = "200px"
      sight.height = sight.width
      sight.color = sightColor
      gui.addControl(sight)
      var line = new BABYLON.GUI.Line()
      var lineWidth = 200.0
      line.x1 = canvasX - lineWidth
      line.y1 = canvasY
      line.x2 = canvasX + lineWidth
      line.y2 = canvasY
      line.dash = [6, 2]
      line.color = sightColor
      sight.addControl(line)
      var tail = new BABYLON.GUI.Line()
      var tailSize = 20.0
      tail.x1 = canvasX
      tail.y1 = canvasY - tailSize * 0.66
      tail.x2 = canvasX
      tail.y2 = canvasY + tailSize * 0.33
      tail.color = sightColor
      sight.addControl(tail)


      // Flight parameters
      var angZ = 0.0
      var angY = 0.0
      var angX = 0.0
      var deltaAngY = speed * 0.08
      var pointerDistanceX = 0.0
      var pointerDistanceY = 0.0
      var tmpVect = BABYLON.Vector3.Zero()
      camera.getDirectionToRef(BABYLON.Axis.Z, tmpVect)  //  the flight direction is the camera view direction
      node.position = initialCamPosition.scale(mapFactor)


      var k = 0.0
      var y = downLimit  // camera current altitude
      var lineY = 0.0    // sight altitude line Y position
      scene.registerBeforeRender(function () {
        // move the cam to the direction it looks at
        camera.getDirectionToRef(BABYLON.Axis.Z, tmpVect)
        tmpVect.scaleInPlace(speed)
        node.position.addInPlace(tmpVect)
        if (terrainReady) {
          // altitude limits
          y = terrain.getHeightFromMap(node.position.x, node.position.z) + downLimit
        }
        node.position.y = BABYLON.Scalar.Clamp(node.position.y, y, upLimit)
        // rotate the cam
        if (scene.pointerX) {
          pointerDistanceX = (-2.0 * scene.pointerX / canvas.width + 1.0)
          angZ = Math.atan(pointerDistanceX)
          angY -= angZ * deltaAngY
        }
        if (scene.pointerY) {
          pointerDistanceY = (scene.pointerY / canvas.height - 0.5)
          angX = Math.atan(pointerDistanceY)
        }
        // camera rotation
        node.rotation.z = angZ * 1.5
        node.rotation.y = angY
        node.rotation.x = angX

        // Environment variations
        sky.mesh.position.y = skyAltitude + Math.sin(k * skyAltitudeCycle) * skyAltitudeAmplitude
        skyMaterial.alpha = skyAlpha - Math.sin(k * skyAlphaCycle) * skyAlphaAmplitude
        scene.fogDensity = fogDensity + Math.sin(k * fogCycle) * fogAmplitude
        skyColorDelta = skyColorAmplitude * Math.sin(k * skyColorCycle)
        scene.clearColor.r = skyColor.r - skyColorDelta
        scene.clearColor.g = skyColor.g - skyColorDelta
        //scene.clearColor.b = skyColor.b - skyColorDelta;
        k += 0.001

        // GUI
        canvasX = gui._canvas.width * 0.5
        canvasY = gui._canvas.height * 0.5
        lineY = canvasY + (node.position.y - halfAltitude) / altitudeRange * 175.0
        line.x1 = canvasX - lineWidth
        line.y1 = lineY
        line.x2 = canvasX + lineWidth
        line.y2 = lineY
        tail.x1 = canvasX
        tail.y1 = lineY - tailSize * 0.66;;
        tail.x2 = canvasX
        tail.y2 = lineY + tailSize * 0.33
        line.rotation = node.rotation.z
        tail.rotation = node.rotation.z
      })

      return scene
    }

    var engine = new BABYLON.Engine(canvasRef.value, true)
    var scene = createScene(canvasRef.value, engine)
    window.addEventListener("resize", function () {
      engine.resize()
    })


    var limit = 60
    var count = 0
    var fps = 0
    var fpsElem = document.querySelector("#fps")
    engine.runRenderLoop(function () {
      count++
      scene.render()
      if (count == limit) {
        fps = Math.round(engine.getFps())
        fpsElem.innerHTML = fps.toString() + " fps"
        count = 0
      }
    })
  })

  return () => (
    <div class={styles.root}>
      <canvas ref={canvasRef} class={styles.canvas} />
    </div>
  )
}
