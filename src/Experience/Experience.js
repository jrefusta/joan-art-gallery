import { Scene, AmbientLight, DirectionalLight } from "three";
import Time from "./Utils/Time.js";
import Sizes from "./Utils/Sizes.js";
import Resources from "./Resources.js";
import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import World from "./World.js";
import assets from "./assets.js";

export default class Experience {
  static instance;

  constructor(_options = {}) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    // Options
    this.targetElement = _options.targetElement;

    if (!this.targetElement) {
      console.warn("Missing 'targetElement' property");
      return;
    }

    this.time = new Time();
    this.sizes = new Sizes();
    this.setConfig();
    this.setScene();
    this.setCamera();
    this.setLights();
    this.setRenderer();
    this.setResources();
    this.setWorld();

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.update();
  }

  setConfig() {
    this.config = {};

    // Pixel ratio
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    // Width and height
    const boundings = this.targetElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height || window.innerHeight;
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);

    // Debug
    this.config.debug = this.config.width > 420;
  }

  setScene() {
    this.scene = new Scene();
    this.cssScene = new Scene();
  }

  setCamera() {
    this.camera = new Camera();
  }

  setLights() {
    // Lights and shadows settings
    const ambientLight = new AmbientLight(0xffffff, 3);
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 256;
    directionalLight.shadow.mapSize.height = 256;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 25;
    directionalLight.shadow.radius = 1;
    directionalLight.shadow.blurSamples = 14;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    this.scene.add(ambientLight, directionalLight);
  }

  setRenderer() {
    this.renderer = new Renderer({ rendererInstance: this.rendererInstance });
    this.targetElement.appendChild(this.renderer.instance.domElement);
  }

  setResources() {
    this.resources = new Resources(assets);
  }

  setWorld() {
    this.world = new World();
  }

  update() {
    if (this.renderer) this.renderer.update();

    if (this.world) this.world.update();

    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  resize() {
    // Config
    const boundings = this.targetElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height;
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);

    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    if (this.camera) this.camera.resize();

    if (this.renderer) this.renderer.resize();

    if (this.world) this.world.resize();
  }
}
