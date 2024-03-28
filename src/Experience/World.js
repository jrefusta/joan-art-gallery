import * as THREE from "three";
import Experience from "./Experience.js";
import Baked from "./Baked.js";
import Trophy from "./Trophy.js";
import Paintings from "./Paintings.js";
import Navigation from "./Navigation.js";
import Vase from "./Vase.js";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setTrophy();
        this.setBaked();
        this.setPaintings();
        this.setNavigation();
        this.setVase();
      }
    });
  }

  setBaked() {
    this.baked = new Baked();
  }

  setPaintings() {
    this.paintings = new Paintings();
  }
  setTrophy() {
    this.trophy = new Trophy();
  }
  setNavigation() {
    this.navigation = new Navigation();
  }
  setVase() {
    this.vase = new Vase();
  }

  resize() {}

  update() {
    if (this.navigation) this.navigation.update();
    if (this.vase) this.vase.update();
  }

  destroy() {}
}
