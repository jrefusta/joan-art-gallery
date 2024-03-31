import {
  Vector3,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  LinearSRGBColorSpace,
  SRGBColorSpace,
  DoubleSide,
  ShaderMaterial,
} from "three";

import Experience from "./Experience.js";
import gsap from "gsap";

import fragmentShader from "./shaders/painting/fragment.glsl";
import vertexShader from "./shaders/painting/vertex.glsl";
export default class Paintings {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.trophy = this.experience.world.trophy;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.renderer = this.experience.renderer.instance;
    this.paintings = [
      {
        id: "ghostlyFootsteps",
        texture: this.resources.items.ghostlyFootsteps.clone(),
        position: new Vector3(-6.20168, 0, -6.21881),
        angleY: 0,
      },
      {
        id: "portfolio",
        texture: this.resources.items.portfolio.clone(),
        position: new Vector3(2.16266, 0, -6.21881),
        angleY: 0,
      },
      {
        id: "qomp",
        texture: this.resources.items.qomp.clone(),
        position: new Vector3(5.13627, 0, 3.25635),
        angleY: (Math.PI / 2) * 3,
      },
      {
        id: "breakIn",
        texture: this.resources.items.breakIn.clone(),
        position: new Vector3(5.13627, 0, -3.48019),
        angleY: (Math.PI / 2) * 3,
      },
      {
        id: "starduster",
        texture: this.resources.items.starduster.clone(),
        position: new Vector3(-9.11274, 0, 3.25635),
        angleY: Math.PI / 2,
      },
      {
        id: "cobayaUnchained",
        texture: this.resources.items.cobayaUnchained.clone(),
        position: new Vector3(-9.11274, 0, -3.48019),
        angleY: Math.PI / 2,
      },
    ];
    this.mainPaintingArray = [
      {
        id: "portfolio",
        textureDescription: this.resources.items["portfolioDescription"],
        texturePainting: this.resources.items["portfolio"],
        liveDemo: null,
        sourceCode: null,
        seen: true,
      },
      {
        id: "joanArcadeMachine",
        textureDescription:
          this.resources.items["joanArcadeMachineDescription"],
        texturePainting: this.resources.items["joanArcadeMachine"],
        liveDemo: "https://jrefusta.itch.io/starduster",
        sourceCode: null,
        seen: false,
      },
      {
        id: "joanOS",
        textureDescription: this.resources.items["joanOSDescription"],
        texturePainting: this.resources.items["joanOS"],
        liveDemo: "https://jrefusta.itch.io/starduster",
        sourceCode: null,
        seen: false,
      },

      {
        id: "joanArtGallery",
        textureDescription: this.resources.items["joanArtGalleryDescription"],
        texturePainting: this.resources.items["joanArtGallery"],
        liveDemo: "https://jrefusta.itch.io/starduster",
        sourceCode: null,
        seen: false,
      },
      {
        id: "starduster",
        textureDescription: this.resources.items["stardusterDescription"],
        texturePainting: this.resources.items["starduster"],
        liveDemo: "https://jrefusta.itch.io/starduster",
        sourceCode: null,
        seen: false,
      },
      {
        id: "cobayaunchained",
        textureDescription: this.resources.items["cobayaunchainedDescription"],
        texturePainting: this.resources.items["cobayaUnchained"],
        liveDemo: "https://www.cobayaunchained.com/",
        sourceCode: "https://github.com/jrefusta/CobayaUnchained-3D-Website",
        seen: false,
      },
      {
        id: "ghostly-footsteps",
        textureDescription: this.resources.items["ghostlyFootstepsDescription"],
        texturePainting: this.resources.items["ghostlyFootsteps"],
        liveDemo: "https://jrefusta.itch.io/ghostly-footsteps",
        sourceCode: null,
        seen: false,
      },
      {
        id: "save-the-crew",
        textureDescription: this.resources.items["saveTheCrewDescription"],
        texturePainting: this.resources.items["saveTheCrew"],
        liveDemo: "https://jrefusta.itch.io/save-the-crew",
        sourceCode: null,
        seen: false,
      },
      {
        id: "tfg",
        textureDescription: this.resources.items["tfgDescription"],
        texturePainting: this.resources.items["tfg"],
        liveDemo: null,
        sourceCode:
          "https://github.com/jrefusta/TFG-Amueblado-de-propiedades-en-3D/",
        seen: false,
      },
      {
        id: "qomp",
        textureDescription: this.resources.items["qompDescription"],
        texturePainting: this.resources.items["qomp"],
        liveDemo: null,
        sourceCode: "https://github.com/jrefusta/Unity-Qomp-Videogame",
        seen: false,
      },
      {
        id: "break-in",
        textureDescription: this.resources.items["breakInDescription"],
        texturePainting: this.resources.items["breakIn"],
        liveDemo: null,
        sourceCode: "https://github.com/jrefusta/OpenGL-Break-In-Videogame",
        seen: false,
      },
      {
        id: "apocalypse-now",
        textureDescription: this.resources.items["apocalypseNowDescription"],
        texturePainting: this.resources.items["apocalypseNow"],
        liveDemo: null,
        sourceCode: "https://github.com/jrefusta/EDA-Joc-FIB-ApocalypseNow/",
        seen: false,
      },
    ];
    this.trophyAllSeen = false;
    this.transition = false;
    this.currentIndex = 0;
    this.maxIndex = 9;
    this.maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.initTexturePaintings();
    this.setPaintings();
    this.setMainPainting();
  }

  initTexturePaintings() {
    this.paintings.forEach((painting) => {
      const texture = painting.texture;
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = this.maxAnisotropy;
      texture.needsUpdate = true;
    });
    this.mainPaintingArray.forEach((painting) => {
      const texture = painting.texturePainting;
      texture.colorSpace = LinearSRGBColorSpace;
      texture.anisotropy = this.maxAnisotropy;
      texture.needsUpdate = true;
      const textureDescription = painting.textureDescription;
      textureDescription.colorSpace = SRGBColorSpace;
      textureDescription.anisotropy = this.maxAnisotropy;
      textureDescription.needsUpdate = true;
    });
  }
  initTextureNote(textureNote) {
    textureNote.colorSpace = "srgb";
    textureNote.anisotropy = this.maxAnisotropy;
    textureNote.needsUpdate = true;
  }

  setPaintings() {
    const geometry = new PlaneGeometry(2.67, 1.5);
    this.paintings.forEach((painting) => {
      const material = new MeshBasicMaterial({
        map: painting.texture,
        side: DoubleSide,
      });
      const plane = new Mesh(geometry, material);
      plane.rotateY(painting.angleY);
      plane.position.copy(painting.position);
      this.scene.add(plane);
      const textureNote = this.resources.items[painting.id + "Note"];
      this.initTextureNote(textureNote);
      const materialNote = new MeshBasicMaterial({
        map: textureNote,
        side: DoubleSide,
        transparent: true,
      });
      const geomNote = new PlaneGeometry(0.8, 0.8);
      const note = new Mesh(geomNote, materialNote);
      const notePosX =
        painting.angleY === 0
          ? painting.position.x + 1
          : painting.angleY === Math.PI / 2
          ? painting.position.x - 0.1
          : painting.position.x + 0.1;
      const notePosY = painting.position.y - 1.1;
      const notePosZ =
        painting.angleY === 0
          ? painting.position.z - 0.1
          : painting.angleY === Math.PI / 2
          ? painting.position.z - 1
          : painting.position.z + 1;
      note.position.set(notePosX, notePosY, notePosZ);
      note.rotateY(painting.angleY);

      this.scene.add(note);
    });
  }

  setMaterialFromTexture(texture, opacity) {
    return new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
      transparent: 1,
      opacity: opacity,
    });
  }
  setMainPainting() {
    const geometry = new PlaneGeometry(2.67 * 2, 1.5 * 2);
    const texture = this.resources.items.portfolio;

    const texture2 = this.resources.items.portfolio;
    const material = new ShaderMaterial({
      uniforms: {
        uTexturePrev: { value: texture },
        uTextureNext: { value: texture2 },
        uTransition: { value: 0.0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: DoubleSide,
    });
    material.needsUpdate = true;
    this.mainPainting = new Mesh(geometry, material);
    this.mainPainting.position.set(-5.58684, 0, 6.21397);
    this.mainPainting.rotateY(Math.PI);
    this.scene.add(this.mainPainting);

    this.initTextureNote(this.resources.items.nextButton);
    this.initTextureNote(this.resources.items.prevButton);

    const materialNext = this.setMaterialFromTexture(
      this.resources.items.nextButton,
      0.5
    );
    const materialPrev = this.setMaterialFromTexture(
      this.resources.items.prevButton,
      0.5
    );

    const geomButtons = new PlaneGeometry(0.8, 0.8);
    const prev = new Mesh(geomButtons, materialPrev);
    const next = new Mesh(geomButtons, materialNext);

    next.name = "nextButton";
    prev.name = "prevButton";

    next.position.set(-5.58684 + 3.5, -1.9, 6.21397 + 0.1);
    next.rotateY(Math.PI);

    prev.position.set(-5.58684 + 10, -1.9, 6.21397 + 0.1);
    prev.rotateY(Math.PI);

    this.scene.add(prev);
    this.scene.add(next);

    const geomDescription = new PlaneGeometry(3 * 2, 1 * 2);

    const materialDescription = this.setMaterialFromTexture(
      this.resources.items.portfolioDescription,
      1
    );
    this.description = new Mesh(geomDescription, materialDescription);

    this.description.position.set(-5.58684 + 6.75, 0.35, 6.21397 + 0.1001);
    this.description.scale.set(1.25, 1.25, 1);
    this.description.rotateY(Math.PI);

    this.scene.add(this.description);
    const liveDemoGeom = new PlaneGeometry(3 / 3, 1 / 3);

    this.initTextureNote(this.resources.items.liveDemo);
    const materialLiveDemo = this.setMaterialFromTexture(
      this.resources.items.liveDemo,
      0.5
    );
    this.liveDemo = new Mesh(liveDemoGeom, materialLiveDemo);
    this.liveDemo.name = "liveDemo";
    this.liveDemo.position.set(-5.58684 + 9.9, -1.15, 6.21397 + 0.1001);
    this.liveDemo.scale.set(1.25, 1.25, 1);
    this.liveDemo.rotateY(Math.PI);

    this.scene.add(this.liveDemo);

    this.initTextureNote(this.resources.items.sourceCode);
    const sourceCodeGeom = new PlaneGeometry(4 / 3, 1 / 3);

    const materialSourceCode = this.setMaterialFromTexture(
      this.resources.items.sourceCode,
      1
    );
    this.sourceCode = new Mesh(sourceCodeGeom, materialSourceCode);
    this.sourceCode.name = "sourceCode";
    this.sourceCode.position.set(-5.58684 + 8.4, -1.15, 6.21397 + 0.1001);
    this.sourceCode.scale.set(1.25, 1.25, 1);
    this.sourceCode.rotateY(Math.PI);
    this.sourceCode.visible = true;
    this.scene.add(this.sourceCode);
  }
  increaseIndex() {
    this.currentIndex = (this.currentIndex + 1) % this.mainPaintingArray.length;
    this.updateMainPainting();
  }
  decreaseIndex() {
    this.currentIndex =
      (this.currentIndex - 1 + this.mainPaintingArray.length) %
      this.mainPaintingArray.length;
    this.updateMainPainting();
  }
  sourceCodeClick() {
    const url = this.mainPaintingArray[this.currentIndex].sourceCode;
    if (url) {
      window.open(url);
    }
  }
  liveDemoClick() {
    const url = this.mainPaintingArray[this.currentIndex].liveDemo;
    if (url) {
      window.open(url);
    }
  }
  removeMesh(mesh) {
    if (this.scene.children.includes(mesh)) {
      this.scene.remove(mesh);
    }
  }
  addMesh(mesh) {
    if (!this.scene.children.includes(mesh)) {
      this.scene.add(mesh);
    }
  }

  checkAllSeenPaintings() {
    const allSeen = this.mainPaintingArray.every((painting) => {
      return painting.seen === true;
    });
    if (allSeen) {
      this.trophyAllSeen = true;
      this.trophy.showTrophy("canvas", "gold");
    }
  }

  updateMainPainting() {
    this.transition = true;
    const painting = this.mainPaintingArray[this.currentIndex];
    const paintingTextureDescription = painting.textureDescription;
    const texturePainting = painting.texturePainting;
    this.changeMainPainting(texturePainting);
    if (!painting.seen) {
      painting.seen = true;
    }
    if (!this.trophyAllSeen) {
      this.checkAllSeenPaintings();
    }
    gsap.to(this.liveDemo.material, { opacity: 0, duration: 0.5 });
    gsap.to(this.sourceCode.material, { opacity: 0, duration: 0.5 });
    gsap.to(this.description.material, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        this.description.material.map.dispose();
        this.description.material.dispose();
        this.description.material = this.setMaterialFromTexture(
          paintingTextureDescription,
          0
        );

        gsap.to(this.description.material, { opacity: 1, duration: 0.5 });
        if (painting.liveDemo != null && painting.sourceCode != null) {
          this.addMesh(this.liveDemo);
          this.addMesh(this.sourceCode);
          this.sourceCode.position.set(-5.58684 + 8.4, -1.15, 6.21397 + 0.1001);
        } else if (painting.liveDemo != null) {
          this.sourceCode.position.set(-5.58684 + 8.4, -1.15, 6.21397 + 0.1001);
          this.removeMesh(this.sourceCode);
          this.addMesh(this.liveDemo);
        } else if (painting.sourceCode != null) {
          this.removeMesh(this.liveDemo);
          this.addMesh(this.sourceCode);
          this.sourceCode.position.set(-5.58684 + 9.8, -1.15, 6.21397 + 0.1001);
        } else {
          this.removeMesh(this.liveDemo);
          this.removeMesh(this.sourceCode);
        }
        gsap.to(this.liveDemo.material, { opacity: 1, duration: 0.5 });
        gsap.to(this.sourceCode.material, { opacity: 1, duration: 0.5 });
      },
    });
  }

  changeMainPainting(nextTexture) {
    this.mainPainting.material.uniforms.uTextureNext.value = nextTexture;
    gsap.fromTo(
      this.mainPainting.material.uniforms.uTransition,
      { value: 0 },
      {
        value: 1,
        duration: 1,
        repeatRefresh: true,
        onComplete: () => {
          this.transition = false;
          this.mainPainting.material.uniforms.uTransition.value = 0;
          this.mainPainting.material.uniforms.uTexturePrev.value =
            this.mainPainting.material.uniforms.uTextureNext.value.clone();
        },
      }
    );
  }
}
