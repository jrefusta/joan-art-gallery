import { PerspectiveCamera } from "three";
import Experience from "./Experience.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.targetElement = this.experience.targetElement;
    this.scene = this.experience.scene;
    this.setInstance();
  }

  setInstance() {
    // Set up the camera instance
    this.instance = new PerspectiveCamera(
      60,
      this.config.width / this.config.height,
      0.1,
      150
    );
    this.instance.rotation.reorder("YXZ");
    this.instance.lookAt(-1, 0, 0);
    this.instance.position.set(1, 0, 0);
    this.instance.updateMatrix();
    this.scene.add(this.instance);
  }

  resize() {
    // Adjust camera aspect ratio on window resize
    this.instance.aspect = this.config.width / this.config.height;
    this.instance.updateProjectionMatrix();
  }
}
