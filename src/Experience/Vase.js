import * as THREE from "three";

import Experience from "./Experience.js";

export default class Vase {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.renderer = this.experience.renderer.instance;
    this.maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.clock = new THREE.Clock();
    this.initVase();
  }

  initVase() {
    this.vaseIdle = this.resources.items.vase.scene;
    this.vaseAnimation = this.resources.items.vaseAnimation.scene;
    this.vaseAnimation.position.y = this.vaseAnimation.position.y - 0.05;
    this.vaseAnimation.visible = false;
    const vaseTexture = this.resources.items.vaseTexture;
    vaseTexture.wrapS = THREE.RepeatWrapping;
    vaseTexture.wrapT = THREE.RepeatWrapping;
    vaseTexture.colorSpace = "srgb";
    vaseTexture.anisotropy = this.maxAnisotropy;
    vaseTexture.repeat.set(4, 4);
    vaseTexture.needsUpdate = true;

    this.vaseIdle.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({
          map: vaseTexture,
        });
        child.material.shininess = 100;
        child.castShadow = true;
      }
    });
    this.vaseAnimation.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({
          map: vaseTexture,
        });
        child.material.shininess = 100;
        child.castShadow = true;
      }
    });
    this.animations = this.resources.items.vaseAnimation.animations;
    this.vaseIdle.name = "vase";
    this.mixer = new THREE.AnimationMixer(this.vaseAnimation);
    this.scene.add(this.vaseIdle);
    this.scene.add(this.vaseAnimation);
    const doNotTouchTexture = this.resources.items.doNotTouch;

    doNotTouchTexture.colorSpace = "srgb";
    doNotTouchTexture.anisotropy =
      this.renderer.capabilities.getMaxAnisotropy();
    doNotTouchTexture.needsUpdate = true;
    const adviseGeometry = new THREE.PlaneGeometry(693 / 1500, 489 / 1500);

    const adviseMaterial = new THREE.MeshBasicMaterial({
      color: "white",
      map: doNotTouchTexture,
    });
    const doNotTouch = new THREE.Mesh(adviseGeometry, adviseMaterial);
    doNotTouch.position.set(-1.59874, -1.25, -5.201);
    this.scene.add(doNotTouch);
  }

  breakVase() {
    window.parent.postMessage("vase", "*");
    this.vaseAnimation.visible = true;
    this.vaseIdle.visible = false;
    this.animations.forEach((animation) => {
      const action = this.mixer.clipAction(animation);
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.play();
    });
  }

  update() {
    const mixerUpdateDelta = this.clock.getDelta();

    this.mixer.update(mixerUpdateDelta);
  }
}
