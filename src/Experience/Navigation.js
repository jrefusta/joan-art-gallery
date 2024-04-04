import {
  Clock,
  Vector3,
  Raycaster,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  DoubleSide,
  Color,
  Vector2,
} from "three";
import Experience from "./Experience.js";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { Octree } from "three/examples/jsm/math/Octree.js";
import vertexShader from "./shaders/pauseMenu/vertex.glsl";
import fragmentShader from "./shaders/pauseMenu/fragment.glsl";
import gsap from "gsap";

export default class Navigation {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.trophy = this.experience.world.trophy;
    this.vase = this.experience.world.vase;
    this.time = this.experience.time;
    this.paintings = this.experience.world.paintings;
    this.clock = new Clock();
    this.GRAVITY = 30;
    this.STEPS_PER_FRAME = 5;
    this.headBobTimer = 0;
    this.headBobActive = false;
    this.prevDeltaY = 0;
    this.isHigher = false;
    this.playerVelocity = new Vector3();
    this.playerDirection = new Vector3(0, 0, 0);
    this.footstep = 1;
    this.playerOnFloor = false;
    this.raycaster = new Raycaster();
    this.keyStates = {};
    this.container = document.getElementById("container");
    this.pauseMenu = document.querySelector(".pause-menu");
    this.dot = document.querySelector(".dot");
    this.doorTrophyObtained = false;
    this.vaseTrophyObtained = false;
    this.nextTrophyObtained = false;
    this.prevTrophyObtained = false;
    this.sourceCodeTrophyObtained = false;
    this.liveDemoTrophyObtained = false;
    this.spaceIsPressed = false;
    this.initEvents();
    this.currentObjectRaycasted = null;
    this.playerCollider = new Capsule(
      new Vector3(0, 0.35, 0),
      new Vector3(0, 1, 0),
      0.35
    );
    this.worldOctree = new Octree();
    this.modelToCollide = this.experience.world.baked.collision;
    this.worldOctree.fromGraphNode(this.modelToCollide);

    this.isPaused = true;
    this.setupOverlay();
  }

  setupOverlay = () => {
    const overlayGeometry = new PlaneGeometry(10, 10, 1, 1);
    const overlayMaterial = new ShaderMaterial({
      transparent: true,
      side: DoubleSide,
      uniforms: {
        uColor: { value: new Color(0xe4e4e4) },
        uAlpha: { value: 0.8 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    this.overlay = new Mesh(overlayGeometry, overlayMaterial);
    this.overlay.name = "overlay";
    const cameraPosition = this.camera.instance.position;
    const cameraDirection = this.camera.instance.getWorldDirection(
      new Vector3()
    );

    this.overlay.position.copy(cameraPosition).add(cameraDirection);
    this.scene.add(this.overlay);
  };
  initEvents() {
    // Event listener for keydown
    document.addEventListener("keydown", this.handleKeyDown);

    // Event listener for keyup
    document.addEventListener("keyup", this.handleKeyUp);

    // Event listener for mousedown
    document.addEventListener("mousedown", this.handleMouseDown);

    // Event listener for pointerlockchange
    document.addEventListener(
      "pointerlockchange",
      this.handlePointerLockChange
    );

    // Event listener for mousemove
    document.body.addEventListener("mousemove", this.handleMouseMove);
  }

  // Handler for keydown event
  handleKeyDown = (event) => {
    if (event.code == "Space") {
      if (!this.spaceIsPressed) {
        this.spaceIsPressed = true;
        this.keyStates[event.code] = true;
      }
    } else {
      this.keyStates[event.code] = true;
    }
  };

  // Handler for keyup event
  handleKeyUp = (event) => {
    if (event.code == "Space") {
      if (this.spaceIsPressed) {
        this.spaceIsPressed = false;
        this.keyStates[event.code] = false;
      }
    } else {
      this.keyStates[event.code] = false;
    }
  };

  // Handler for mousedown event
  handleMouseDown = () => {
    if (!document.pointerLockElement) {
      if (!this.isPaused) {
        return;
      }
      document.body.requestPointerLock();
    } else {
      if (this.paintings.transition) {
        return;
      }
      if (this.currentObjectRaycasted) {
        this.handleObjectInteraction();
      }
    }
  };

  // Handler for pointerlockchange event
  handlePointerLockChange = () => {
    if (!document.pointerLockElement) {
      gsap.fromTo(
        this.overlay.material.uniforms.uAlpha,
        { value: 0 },
        {
          value: 0.8,
          duration: 1.3,
          onComplete: () => {
            this.isPaused = true;
            this.pauseMenu.style.opacity = 1;
          },
        }
      );

      this.dot.style.display = "none";
      Object.keys(this.keyStates).forEach(
        (key) => (this.keyStates[key] = false)
      );
    } else {
      this.pauseMenu.style.opacity = 0;
      this.isPaused = false;

      gsap.fromTo(
        this.overlay.material.uniforms.uAlpha,
        { value: 0.8 },
        {
          value: 0,
          duration: 1.3,
          onComplete: () => {},
        }
      );
      this.dot.style.display = "block";
    }
  };

  // Handler for mousemove event
  handleMouseMove = (event) => {
    if (document.pointerLockElement === document.body) {
      this.camera.instance.rotation.x -= event.movementY / 500;
      this.camera.instance.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, this.camera.instance.rotation.x)
      );

      // Rotación horizontal sin límites
      this.camera.instance.rotation.y -= event.movementX / 500;
    }
  };

  // Handler for interacting with objects
  handleObjectInteraction = () => {
    const interactionMap = {
      nextButton: {
        action: () => {
          window.parent.postMessage("start", "*");
          this.paintings.increaseIndex();
          if (!this.nextTrophyObtained) {
            this.nextTrophyObtained = true;
            this.trophy.showTrophy("nextButton", "bronze");
          }
        },
      },
      prevButton: {
        action: () => {
          window.parent.postMessage("start", "*");
          this.paintings.decreaseIndex();
          if (!this.prevTrophyObtained) {
            this.prevTrophyObtained = true;
            this.trophy.showTrophy("prevButton", "bronze");
          }
        },
      },
      sourceCode: {
        action: () => {
          window.parent.postMessage("start", "*");
          this.paintings.sourceCodeClick();
          if (!this.sourceCodeTrophyObtained) {
            this.sourceCodeTrophyObtained = true;
            this.trophy.showTrophy("sourceCode", "bronze");
          }
        },
      },
      liveDemo: {
        action: () => {
          window.parent.postMessage("start", "*");
          this.paintings.liveDemoClick();
          if (!this.liveDemoTrophyObtained) {
            this.liveDemoTrophyObtained = true;
            this.trophy.showTrophy("liveDemo", "bronze");
          }
        },
      },
      door: {
        action: () => {
          this.doorTrophyObtained = true;
          this.currentObjectRaycasted = null;
          if (this.dot.classList.contains("increase-dot")) {
            this.dot.classList.remove("increase-dot");
          }

          window.parent.postMessage("door", "*");
          this.trophy.showTrophy("door", "silver");
        },
      },
      vase: {
        action: () => {
          this.vaseTrophyObtained = true;
          this.currentObjectRaycasted = null;
          if (this.dot.classList.contains("increase-dot")) {
            this.dot.classList.remove("increase-dot");
          }
          this.experience.world.vase.breakVase();
          this.trophy.showTrophy("vase", "silver");
        },
      },
    };

    const interaction = interactionMap[this.currentObjectRaycasted];
    if (interaction) {
      interaction.action();
    }
  };

  getForwardVector() {
    this.camera.instance.getWorldDirection(this.playerDirection);
    this.playerDirection.y = 0;
    this.playerDirection.normalize();

    return this.playerDirection;
  }
  getSideVector() {
    this.camera.instance.getWorldDirection(this.playerDirection);
    this.playerDirection.y = 0;
    this.playerDirection.normalize();
    this.playerDirection.cross(this.camera.instance.up);

    return this.playerDirection;
  }

  playerCollisions() {
    const result = this.worldOctree.capsuleIntersect(this.playerCollider);

    this.playerOnFloor = false;

    if (result) {
      this.playerOnFloor = result.normal.y > 0;

      if (!this.playerOnFloor) {
        this.playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(this.playerVelocity)
        );
      }
      this.playerCollider.translate(result.normal.multiplyScalar(result.depth));
    }
  }

  updatePlayer(deltaTime) {
    let damping = Math.exp(-4 * deltaTime) - 1;

    if (!this.playerOnFloor) {
      this.playerVelocity.y -= this.GRAVITY * deltaTime;

      // small air resistance
      damping *= 0.02;
    }

    this.playerVelocity.addScaledVector(this.playerVelocity, damping);

    const deltaPosition = this.playerVelocity.clone().multiplyScalar(deltaTime);
    this.playerCollider.translate(deltaPosition);

    this.playerCollisions();

    this.camera.instance.position.copy(this.playerCollider.end);
    this.camera.instance.position.y += 0.7;
    const deltaY = Math.sin(this.headBobTimer * 17) * 0.06;

    if (deltaY > this.prevDeltaY && this.isHigher) {
      this.isHigher = false;
      if (this.playerOnFloor) {
        window.parent.postMessage("footstep0" + this.footstep, "*");
      }
      this.footstep = this.footstep == 1 ? 2 : 1;
    } else if (deltaY < this.prevDeltaY && !this.isHigher) {
      this.isHigher = true;
    }

    this.prevDeltaY = deltaY;

    this.camera.instance.position.y += deltaY;
  }
  controls(deltaTime) {
    if (!document.pointerLockElement) {
      return;
    }

    const forwardVelocity = this.keyStates["KeyW"] || this.keyStates["KeyS"];
    const lateralVelocity = this.keyStates["KeyA"] || this.keyStates["KeyD"];

    // Set head bobbing active if there's any movement
    this.headBobActive = forwardVelocity || lateralVelocity;

    // Calculate speed based on whether the player is on the floor
    const speedMultiplier = this.playerOnFloor ? 25 : 8;
    const speedDelta = deltaTime * speedMultiplier;

    // Apply movement based on key states
    if (this.keyStates["KeyW"]) {
      this.playerVelocity.add(
        this.getForwardVector().multiplyScalar(speedDelta)
      );
    }
    if (this.keyStates["KeyS"]) {
      this.playerVelocity.add(
        this.getForwardVector().multiplyScalar(-speedDelta)
      );
    }
    if (this.keyStates["KeyA"]) {
      this.playerVelocity.add(this.getSideVector().multiplyScalar(-speedDelta));
    }
    if (this.keyStates["KeyD"]) {
      this.playerVelocity.add(this.getSideVector().multiplyScalar(speedDelta));
    }

    // Jump if the player is on the floor and Space is pressed
    if (this.playerOnFloor && this.keyStates["Space"] && this.spaceIsPressed) {
      window.parent.postMessage("footstep03", "*");
      this.keyStates["Space"] = false;
      this.playerVelocity.y = 5;
    }
  }

  updateHeadBob(deltaTime) {
    if (this.headBobActive) {
      const wavelength = Math.PI;
      const nextStep =
        1 + Math.floor(((this.headBobTimer + 0.000001) * 10) / wavelength);
      const nextStepTime = (nextStep * wavelength) / 10;
      this.headBobTimer = Math.min(this.headBobTimer + deltaTime, nextStepTime);
      if (this.headBobTimer == nextStepTime) {
        this.headBobActive = false;
      }
    }
  }

  distanceToTarget(targetPosition, threshold) {
    return targetPosition.distanceTo(this.camera.instance.position) < threshold;
  }

  distanceToDoor() {
    const doorPosition = new Vector3(5.36242, -2.17641, 0.005024);
    return this.distanceToTarget(doorPosition, 5);
  }

  distanceToVase() {
    const vasePosition = new Vector3(-1.59874, -0.957509, -5.78152);
    return this.distanceToTarget(vasePosition, 5);
  }

  updateRaycaster() {
    // Check intersection from camera's view
    this.raycaster.setFromCamera(new Vector2(0, 0), this.camera.instance);
    const intersects = this.raycaster
      .intersectObjects(this.scene.children)
      .filter((intersect) => intersect.object.name !== "overlay");

    if (intersects.length) {
      const currentIntersectedObject = intersects[0].object;
      const descriptionNames = [
        "nextButton",
        "prevButton",
        "liveDemo",
        "sourceCode",
      ];

      if (descriptionNames.includes(currentIntersectedObject.name)) {
        this.currentObjectRaycasted = currentIntersectedObject.name;
        this.dot.classList.add("increase-dot");
        const material = currentIntersectedObject.material;
        gsap.to(material, { opacity: 1, duration: 0.1, ease: "power1.inOut" });
      } else if (currentIntersectedObject.parent?.name == "door") {
        if (this.doorTrophyObtained) {
          return;
        }
        if (this.distanceToDoor()) {
          this.dot.classList.add("increase-dot");
          this.currentObjectRaycasted = "door";
        } else {
          this.currentObjectRaycasted = null;

          if (this.dot.classList.contains("increase-dot")) {
            this.dot.classList.remove("increase-dot");
          }
        }
        this.resetButtonOpacity();
      } else if (currentIntersectedObject.parent.name == "vase") {
        if (this.vaseTrophyObtained) {
          return;
        }
        if (this.distanceToVase()) {
          this.dot.classList.add("increase-dot");
          this.currentObjectRaycasted = "vase";
        } else {
          this.currentObjectRaycasted = null;

          if (this.dot.classList.contains("increase-dot")) {
            this.dot.classList.remove("increase-dot");
          }
        }
        this.resetButtonOpacity();
      } else {
        if (this.dot.classList.contains("increase-dot")) {
          this.dot.classList.remove("increase-dot");
        }
        this.resetButtonOpacity();
        this.currentObjectRaycasted = null;
      }
    } else {
      this.resetButtonOpacity();
      this.currentObjectRaycasted = null;
    }
  }

  resetButtonOpacity() {
    this.scene.children.forEach((object) => {
      if (
        ["nextButton", "prevButton", "liveDemo", "sourceCode"].includes(
          object.name
        )
      ) {
        const material = object.material;
        gsap.to(material, {
          opacity: 0.5,
          duration: 0.1,
          ease: "power1.inOut",
        });
      }
    });
  }

  updateOverlayPosition = () => {
    const distanceToCamera = 0.12;
    const cameraPosition = this.camera.instance.position;
    const cameraDirection = this.camera.instance.getWorldDirection(
      new Vector3()
    );
    const offset = cameraDirection.clone().multiplyScalar(distanceToCamera);
    const newPosition = new Vector3().copy(cameraPosition).add(offset);
    this.overlay.position.copy(newPosition);
    this.overlay.lookAt(this.camera.instance.position);
  };

  update() {
    const maxDeltaTime = 0.05;
    const steps = this.STEPS_PER_FRAME;

    const deltaTime = Math.min(maxDeltaTime, this.clock.getDelta()) / steps;

    for (let i = 0; i < steps; i++) {
      this.updateStep(deltaTime);
    }
  }

  updateStep(deltaTime) {
    this.controls(deltaTime);
    this.updatePlayer(deltaTime);
    this.updateHeadBob(deltaTime);
    this.updateRaycaster();
    this.updateOverlayPosition();
  }
}
