import Experience from "./Experience.js";

export default class Trophy {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.trophy = document.getElementById("trophy");
    this.trophyLogo = document.getElementById("trophy_logo");
    this.trophyText = document.getElementById("trophyText");
    this.icon = document.querySelector(".icono");
    this.numTimer = null;
    this.trophyQueue = [];
    this.totalTrophies = 0;
  }

  showTrophy(trophyID, type) {
    if (this.numTimer) {
      this.trophyQueue.push({ trophyID, type });
      return;
    }
    switch (trophyID) {
      case "nextButton":
        this.trophyText.innerText = "First step forward";
        this.trophyLogo.src = this.resources.items.nextTrophy.image.src;
        break;
      case "prevButton":
        this.trophyText.innerText = "First step backward";
        this.trophyLogo.src = this.resources.items.prevTrophy.image.src;
        break;
      case "vase":
        this.trophyText.innerText = "Rule breaker";
        this.trophyLogo.src = this.resources.items.doNotTouchTrophy.image.src;
        break;
      case "door":
        this.trophyText.innerText = "There is no escape";
        this.trophyLogo.src = this.resources.items.doorTrophy.image.src;
        break;
      case "sourceCode":
        this.trophyText.innerText = "Code investigator";
        this.trophyLogo.src = this.resources.items.sourceCodeTrophy.image.src;
        break;
      case "liveDemo":
        this.trophyText.innerText = "Beta tester";
        this.trophyLogo.src = this.resources.items.liveDemoTrophy.image.src;
        break;
      case "canvas":
        this.trophyText.innerText = "Canvas explorer";
        this.trophyLogo.src = this.resources.items.canvasTrophy.image.src;
        break;
      case "Platinum":
        this.trophyText.innerText = "Collector";
        this.trophyLogo.src = this.resources.items.platinumTrophy.image.src;
        break;
    }

    switch (type) {
      case "gold":
        this.icon.src = this.resources.items.trophyGold.image.src;
        break;
      case "silver":
        this.icon.src = this.resources.items.trophySilver.image.src;
        break;
      case "bronze":
        this.icon.src = this.resources.items.trophyBronze.image.src;
        break;
      case "platinum":
        this.icon.src = this.resources.items.trophyPlatinum.image.src;
    }

    type == "platinum"
      ? window.parent.postMessage("trophy_platinum", "*")
      : window.parent.postMessage("trophy", "*");
    this.numTimer = setTimeout(() => {
      this.hideTrophy();
    }, 3000);
    this.trophy.style.display = "block";
    this.trophy.style.animation = "slideIn 0.5s forwards";
    this.totalTrophies++;
    if (this.totalTrophies == 7) {
      this.showTrophy("Platinum", "platinum");
    }
  }

  hideTrophy() {
    this.trophy.style.animation = "slideOut 0.5s forwards";
    setTimeout(() => {
      this.trophy.style.display = "none";
      clearTimeout(this.numTimer);
      this.numTimer = null;
      if (this.trophyQueue.length) {
        const nextTrophy = this.trophyQueue.shift();
        this.showTrophy(nextTrophy.trophyID, nextTrophy.type);
      }
    }, 500);
  }
}
