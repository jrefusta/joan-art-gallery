import { DoubleSide, MeshLambertMaterial, Object3D } from "three";
import Experience from "./Experience.js";

export default class Baked {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer.instance;
    this.setModel();
  }

  setModel() {
    // Obtain items from resources
    const { items } = this.experience.resources;
    this.model = items.collision.scene;
    this.door = items.door.scene;
    this.texture = items.baked;

    // Textures config
    this.texture.flipY = false;
    this.texture.colorSpace = "srgb";
    this.texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.texture.needsUpdate = true;

    // Material config
    const configureMaterial = (child) => {
      if (child.isMesh) {
        const material = new MeshLambertMaterial({
          map: this.texture,
          side: DoubleSide,
        });
        child.material = material;
        child.material.needsUpdate = true;
        child.receiveShadow = true;
      }
    };

    this.model.traverse(configureMaterial);
    this.door.traverse(configureMaterial);
    this.door.name = "door";

    // Group to collision
    this.collision = new Object3D();
    this.collision.add(this.model, this.door);
    this.scene.add(this.collision);
  }
}
