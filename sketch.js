/*
IIA studio - Media + Architecture Program
-----------------------------------------
P5js + BabylonJS + Scene Template -- by chifu 
- v1 2023.06.06 basic 
*****************************************
ref. from= https://doc.babylonjs.com/features/starterSceneCode
ended Notion pages = https://www.notion.so/Babylon-Basic-548bca17f43942568b7295d550e26f36
*/

// ***************************************** 宣告 *****************************************
// 設置 babylon engine 畫布
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);


// canvas.style.position = 'absolute';
// canvas.style.width=window.innerWidth*2;
// canvas.style.height=window.innerHeight*2;
// console.log(window.innerWidth)
// ***************************************** 建置 GUI *****************************************
// ********* 宣告 *********
var object; // 可重繪目標物件，每次更改參數時重繪物件
var scene, cam;

var shadowGenerator;

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 匯入外部 GLB/GLTF 物件
var ms=[]
function loadAssets(scene,sg){
  
    var mainMaterial = new BABYLON.StandardMaterial("main", scene);
    // 匯入場景
    BABYLON.SceneLoader.ImportMesh(
      null,
      'https://rawcdn.githack.com/mediaplusarchi/GLTFassets/25d3600743403a25a18063aed7b485809cc11cb6/',
      'spheron.glb',
       scene, 
       (meshes, particleSystems, skeletons) =>{
        // 對匯入的東西 加掛能力
         meshes.forEach((m,i) => {
            // 陰影
           // if (i==2){
             
              sg.getShadowMap().renderList.push(m);
              m.receiveShadows = true; // 會接收陰影
              mainMaterial.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);	
              mainMaterial.reflectionFresnelParameters = new BABYLON.FresnelParameters();
              mainMaterial.reflectionFresnelParameters.bias = 0.02;

              ms.push(m)
             console.log(m.name)
           // }
            
           // console.log(m)

          });           
    });
}

// ***************************************** 建置場景 *****************************************
// 將場景指派給 sceneToRender
const createScene = ()=> {

    // 場景背景
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Black;
  
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 攝影機
    const alpha =  Math.PI/4;
    const beta = Math.PI/3;
    const radius = 20;
    // const target = new BABYLON.Vector3(-5, 0, 0);

    // cam = new BABYLON.ArcRotateCamera("Camera", alpha, beta, radius, target, scene);
    // cam = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0.5, 0), scene);
    cam = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0,-2.3), scene);
    cam.rotationQuaternion = new BABYLON.Quaternion();
    cam.fov=1.135;
    cam.target = new BABYLON.Vector3(-0.8, 0, 0);
    cam.attachControl(canvas, true); 
  
        var environment = scene.createDefaultEnvironment({
            createGround: false,
            createSkybox: true,
            enableGroundMirror: false
        });
        
     // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 光
    var light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), scene);   
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!! 環境
    var box = BABYLON.MeshBuilder.CreateSphere("plane",{diameter:10}, scene);
    box.position.y = 0;

	var gradientMaterial = new BABYLON.GradientMaterial("grad", scene);
    gradientMaterial.topColor = new BABYLON.Color3(0.11, 0.53, 0.9);
    gradientMaterial.bottomColor = new BABYLON.Color3(0.3, 0.59, 0.61);
    gradientMaterial.offset = 0.5;
    gradientMaterial.smoothness = 1;
    gradientMaterial.scale = 0.1
    gradientMaterial.backFaceCulling=false
    box.material = gradientMaterial;

    var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-1, -3, 1), scene);
    light.position = new BABYLON.Vector3(3, 15, 3);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    
  
  // 陰影 Shadows
	shadowGenerator = new BABYLON.ShadowGenerator(1024, light); // 設定陰影渲染器
    shadowGenerator.useBlurCloseExponentialShadowMap = true;
    shadowGenerator.forceBackFacesOnly = true;
    shadowGenerator.blurKernel = 32;
    shadowGenerator.useKernelBlur = true;
    shadowGenerator.usePercentageCloserFiltering = true;

    light.shadowMinZ = 1;
    light.shadowMaxZ = 100;
	shadowGenerator.setDarkness(0.9); // 設定陰影為半透明 0 最黑 1 陰影會消失
	shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH; // 陰影品質  
	// shadowGenerator.useBlurExponentialShadowMap = false; // 陰影邊緣羽化
	shadowGenerator.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
	light.autoUpdateExtends = false;
  
    // 匯入外部資料
    loadAssets(scene, shadowGenerator) 

  
  
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   色階背景  
    // Directly configure the color curves on the scene    
    var curve = new BABYLON.ColorCurves();
    curve.globalHue = 200;
    curve.globalDensity = 80;
    curve.globalSaturation = 80;

    curve.highlightsHue = 20;
    curve.highlightsDensity = 80;
    curve.highlightsSaturation = -80;

    curve.shadowsHue = 2;
    curve.shadowsDensity = 80;
    curve.shadowsSaturation = 40;
    scene.imageProcessingConfiguration.colorCurvesEnabled = true;
    scene.imageProcessingConfiguration.colorCurves = curve;
  
    return scene;
};
const sceneToRender = createScene(); // 每次重繪執行 sceneToRender
// ***************************************** 更新 *****************************************
// 設置 babylon 更新與渲染
engine.runRenderLoop(()=>{
    sceneToRender.render();   
});

// Resize
window.addEventListener("resize", ()=> {
    engine.resize();
});
