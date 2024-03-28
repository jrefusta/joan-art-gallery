import * as THREE from "three";
import Experience from "./Experience.js";

export default class Renderer {
  constructor(_options = {}) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.stats = this.experience.stats;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.cssScene = this.experience.cssScene;
    this.camera = this.experience.camera;

    this.setInstance();
  }

  setInstance() {
    this.clearColor = "#010101";

    // Renderer
    this.instance = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
    });

    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;

    this.instance.domElement.style.position = "absolute";
    this.instance.domElement.style.top = 0;
    this.instance.domElement.style.left = 0;
    this.instance.domElement.style.width = "100%";
    this.instance.domElement.style.height = "100%";

    // this.instance.setClearColor(0x414141, 1)
    this.instance.setClearColor(this.clearColor, 1);
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);

    this.instance.colorSpace = THREE.SRGBColorSpace;

    this.context = this.instance.getContext();

    // Add stats panel
    if (this.stats) {
      this.stats.setRenderPanel(this.context);
    }
  }

  resize() {
    // Instance
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender();
    }

    this.instance.render(this.scene, this.camera.instance);

    if (this.stats) {
      this.stats.afterRender();
    }
  }
}
