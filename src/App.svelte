<script>
  import Greet from './lib/Greet.svelte'
  import MainLoop, { FrameUpdate } from "bg2e/app/MainLoop";
  import Canvas from "bg2e/app/Canvas";
  import SceneAppController from "bg2e/render/SceneAppController";
  import VitscnjLoaderPlugin from "bg2e/db/VitscnjLoaderPlugin";
  import Loader, { registerLoaderPlugin } from "bg2e/db/Loader";
  import { registerComponents } from "bg2e/scene/index";
  import WebGLRenderer from "bg2e/render/webgl/Renderer";
  import { onMount } from 'svelte';
  import Camera, { OpticalProjectionStrategy } from 'bg2e/scene/Camera';
  import Vec from 'bg2e/math/Vec';
  import SmoothOrbitCameraController from 'bg2e/scene/SmoothOrbitCameraController';

  import { open } from "@tauri-apps/api/dialog";
  import { readTextFile } from "@tauri-apps/api/fs";

  class MyAppController extends SceneAppController {
    async loadScene() {
      registerLoaderPlugin(new VitscnjLoaderPlugin({ bg2ioPath: "/node_modules/bg2e/node_modules/bg2io/" }));
      registerComponents();

      const loader = new Loader();
      const scene = await loader.loadNode("/furniture/furniture.vitscnj");

      const mainCamera = Camera.GetMain(scene);
      mainCamera.projectionStrategy = new OpticalProjectionStrategy();
      const cameraController = mainCamera.node.component("OrbitCameraController");
      if (cameraController) {
        cameraController.center = new Vec(0, 0.3, 0);
      }
      const smoothCameraController = new SmoothOrbitCameraController();
      smoothCameraController.assign(cameraController);
      mainCamera.node.addComponent(smoothCameraController);
      mainCamera.node.removeComponent(cameraController);


      return scene;
    }
  }


  onMount(async () => {
    const canvas = new Canvas(document.getElementById("mainCanvas"), new WebGLRenderer());
    const appController = new MyAppController();
    const mainLoop = new MainLoop(canvas, appController);

    mainLoop.updateMode = FrameUpdate.AUTO;
    await mainLoop.run();
  })

  let fileContent = "";
  const openFile = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
        directory: false,
        defaultPath: "/",
        title: "Open file"
      });

      console.log(selectedPath);
      fileContent = await readTextFile(selectedPath);
      console.log(fileContent);

    }
    catch (e) {
      console.error(e);
    }
  }
</script>

<main class="container">

  <div class="row">
    <Greet />

    <button on:click={openFile}>Open</button>

    <textarea bind:value={fileContent}></textarea>
  </div>

  <canvas id="mainCanvas" width="400" height="400"></canvas>
</main>

<style>
  div.row {
    position: fixed;
    top: 0px;
    z-index: 1;
  }

  canvas {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    width: 100vw;
    height: 100vh;
  }
</style>
