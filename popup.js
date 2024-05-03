import resources, {
  fetchImagesFromAPI,
  fetchTextFromAPI,
} from "./resources.js";

// Maintenant, vous pouvez utiliser les URLs comme ceci :
let musiqueUrls = resources.musiqueUrls;
let videoUrls = resources.videoUrls;
let articleUrls = resources.articlesUrls;
let jeuxUrls = resources.jeuxUrls;
let anecdoteUrls = resources.anecdoteUrls;
let imageUrls = resources.imageUrls;

let newPopupWindowId;
let currentWindow;
let displayedResources = {
  musique: new Set(),
  video: new Set(),
  article: new Set(),
  jeux: new Set(),
  anecdote: new Set(),
  image: new Set(),
};

let isFirstResourceLiked = false;
let messageType;
let likedUrls = new Set();
let likedResourcesDropdown;

document.addEventListener("DOMContentLoaded", function () {
  loadResourcesFromLocalStorage();
  likedResourcesDropdown = document.getElementById("likedResourcesDropdown");
  document
    .getElementById("videoOption")
    .addEventListener("click", () => changeMessageType("une video"));
  document
    .getElementById("musiqueOption")
    .addEventListener("click", () => changeMessageType("une musique"));
  document
    .getElementById("articleOption")
    .addEventListener("click", () => changeMessageType("un article"));
  document
    .getElementById("jeuxOption")
    .addEventListener("click", () => changeMessageType("un jeux"));
  document
    .getElementById("anecdoteOption")
    .addEventListener("click", () => fetchTextFromAPI());
  document
    .getElementById("anecdoteOption")
    .addEventListener("click", () => changeMessageType("une anecdote"));
  document
    .getElementById("imageOption")
    .addEventListener("click", () => fetchImagesFromAPI());
  document
    .getElementById("imageOption")
    .addEventListener("click", () => changeMessageType("une image"));

  // Bouttons Like et Dislike

  document
    .getElementById("likeBtn")
    .addEventListener("click", () => likeResource());
  document
    .getElementById("dislikeBtn")
    .addEventListener("click", () => dislikeResource());

  // écoute l'evenement de changement du menu dropdown
  likedResourcesDropdown.addEventListener("change", function () {
    // Ouvrez une nouvelle fenêtre avec l'URL sélectionnée
    openWindow(likedResourcesDropdown.value, 700, 900);
  });
});

function likeResource() {
  getCurrentResourceUrl(function (currentUrl) {
    likedUrls.add(currentUrl);

    if (!isFirstResourceLiked) {
      likedResourcesDropdown.style.display = "block";
      isFirstResourceLiked = true;
    }

    // Ajoute dynamiquement l'URL likée au menu déroulant
    saveLikedUrlsToStorage();
    addLikedResourceToDropdown(currentUrl);
    console.log(currentUrl);
  });
}

function dislikeResource() {
  // Récupère le dernier élément de la liste des favoris
  const dropdown = document.getElementById("likedResourcesDropdown");
  const options = dropdown.getElementsByTagName("option");
  const lastOption = options[options.length - 1];

  // Vérifie s'il y a un élément à supprimer
  if (lastOption && lastOption.value !== "default") {
    // Supprime le dernier élément de la liste des favoris
    dropdown.removeChild(lastOption);
    // Supprime le lien de la liste des favoris dans le stockage
    likedUrls.delete(lastOption.value);
    saveLikedUrlsToStorage();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  //load liked URLs from localStorage
  loadLikedUrlsFromStorage();

  likedResourcesDropdown = document.getElementById("likedResourcesDropdown");
});

function saveLikedUrlsToStorage() {
  const likedUrlsArray = Array.from(likedUrls);
  chrome.storage.sync.set({ likedUrls: likedUrlsArray }, function () {
    console.log("Liked URLs saved to storage.");
  });
}

function loadLikedUrlsFromStorage() {
  chrome.storage.sync.get(["likedUrls"], function (result) {
    const storedLikedUrls = result.likedUrls;
    if (storedLikedUrls) {
      likedUrls = new Set(storedLikedUrls);
      // Populate the dropdown with stored liked URLs
      storedLikedUrls.forEach((url) => addLikedResourceToDropdown(url));
      console.log("Liked URLs loaded from storage.");
    }
  });
}

function addLikedResourceToDropdown(url) {
  // Crée un nouvel élément d'option
  const option = document.createElement("option");
  option.value = url;
  option.text = url;
  option.style.color = "black";

  // Ajoute l'option au menu déroulant
  likedResourcesDropdown.appendChild(option);
}

function changeMessageType(type) {
  messageType = type;
  changeMessage();
}

function changeMessage() {
  const messages = [`Tu as choisi de perdre ton temps avec ${messageType}  `];

  document.getElementById("message").innerText = messages;
  var img = document.createElement("img");
  img.src = "images/devil.png";
  var src = document.getElementById("message");
  img.style.height = "30px";
  img.style.marginBottom = "-9px";
  src.appendChild(img);

  // Supprime la ressource précédente
  if (currentWindow) {
    chrome.windows.remove(currentWindow.id);
  }

  // Affiche la nouvelle ressource
  displayRandomAvailableResources();
}

// Fonction pour ajuster la logique de sélection en fonction des préférences
function displayRandomAvailableResources() {
  let availableResources = getAvailableResources();

  // Choisir une ressource aléatoire parmi les disponibles
  const randomUrl =
    availableResources[Math.floor(Math.random() * availableResources.length)];

  // Marquer la ressource comme affichée
  markResourceAsDisplayed(randomUrl);
  let height, width;

  if (messageType === "une musique") {
    (height = 600), (width = 900);
    openWindow(randomUrl, height, width);
  } else if (messageType === "une video") {
    (height = 800), (width = 1200);
    openWindow(randomUrl, height, width);
  } else if (messageType === "un article") {
    (height = 800), (width = 900);
    openWindow(randomUrl, height, width);
  } else if (messageType === "un jeux") {
    (height = 700), (width = 1100);
    openWindow(randomUrl, height, width);
  } else if (messageType === "une anecdote") {
    (height = 500), (width = 700);
    openWindowWithText(randomUrl, height, width);
  } else if (messageType === "une image") {
    (height = 700), (width = 900);
    openWindow(randomUrl, height, width);
  }
  return randomUrl;
}

// Fonction pour réinitialiser les ressources affichées
function resetDisplayedResources() {
  displayedResources = {
    musique: new Set(),
    video: new Set(),
    article: new Set(),
    jeux: new Set(),
    anecdote: new Set(),
    image: new Set(),
  };
}

// Fonction pour marquer la ressource comme affichée
function markResourceAsDisplayed(url) {
  // Sélection du set en fonction du type
  let currentSet;
  if (messageType === "une musique") {
    currentSet = displayedResources.musique;
  } else if (messageType === "une video") {
    currentSet = displayedResources.video;
  } else if (messageType === "un article") {
    currentSet = displayedResources.article;
  } else if (messageType === "un jeux") {
    currentSet = displayedResources.jeux;
  } else if (messageType === "une anecdote") {
    currentSet = displayedResources.anecdote;
  } else if (messageType === "une image") {
    currentSet = displayedResources.image;
  }

  // Marquer la ressource comme affichée
  currentSet.add(url);
}

// Fonction pour récupérer les ressources disponibles en fonction du type actuel
function getAvailableResources() {
  let availableResources;

  // Sélectionne les ressources disponibles en fonction du type
  if (messageType === "une musique") {
    availableResources = musiqueUrls.filter(
      (url) => !displayedResources.musique.has(url)
    );
  } else if (messageType === "une video") {
    availableResources = videoUrls.filter(
      (url) => !displayedResources.video.has(url)
    );
  } else if (messageType === "un article") {
    availableResources = articleUrls.filter(
      (url) => !displayedResources.article.has(url)
    );
  } else if (messageType === "un jeux") {
    availableResources = jeuxUrls.filter(
      (url) => !displayedResources.jeux.has(url)
    );
  } else if (messageType === "une anecdote") {
    availableResources = anecdoteUrls.filter(
      (url) => !displayedResources.anecdote.has(url)
    );
  } else if (messageType === "une image") {
    availableResources = imageUrls.filter(
      (url) => !displayedResources.image.has(url)
    );
  }

  // Si toutes les ressources ont été affichées au moins une fois, réinitialiser le set
  if (availableResources && availableResources.length === 0) {
    resetDisplayedResources();
    // Récupère à nouveau les ressources disponibles après la réinitialisation
    availableResources = getAvailableResources();
  }

  return availableResources;
}

// Écouteur d'événement pour détecter la création de nouvelles fenêtres
chrome.windows.onCreated.addListener(function (window) {
  // Vérifiez si la nouvelle fenêtre est une fenêtre popup (type 'popup')
  if (window.type === "popup") {
    // Stockez l'ID de la nouvelle fenêtre popup
    newPopupWindowId = window.id;
  }
});

// Fonction pour obtenir l'URL de la ressource actuellement affichée
function getCurrentResourceUrl(callback) {
  // Utilise les API de l'extension Chrome pour obtenir l'URL actuel
  chrome.tabs.query(
    { active: true, windowId: newPopupWindowId },
    function (tabs) {
      const currentUrl = tabs[0].url;
      console.log("Current URL:", currentUrl);
      callback(currentUrl);
    }
  );
}

// Fonction pour ouvrir une fenêtre avec une URL spécifiée
function openWindow(url, height, width) {
  const left = Math.floor(Math.random() * (screen.width - width));
  const top = Math.floor(Math.random() * (screen.height - height));

  // Si le top est dans la partie haute de l'écran, ajustez-le
  const adjustedTop = top < screen.height / 4 ? screen.height / 4 : top;

  chrome.windows.create(
    {
      url,
      type: "popup",
      width,
      height,
      left,
      top: adjustedTop,
    },
    function (window) {
      currentWindow = window;
    }
  );
  console.log(url);
}

function openWindowWithText(string, height, width) {
  const left = Math.floor(Math.random() * (screen.width - width));
  const top = Math.floor(Math.random() * (screen.height - height));
  let page = `<html><style>body{background-color: #000000;color: white} body {color: white;animation: wheelHueColor 100s infinite;background-color: hsl(242, 93%, 11%) ;}
                @supports (background-blend-mode: overlay) {body {background-image: linear-gradient(45deg, white 10%, black 90%);background-blend-mode: overlay;}}</style><body><p> ${string}</p></body></html>`;
  page += `<style>body{display:flex; justify-content:center; align-items:center;}</style>`;
  page += `<style>p{font-family:Arial, Helvetica, sans-serif; font-weight:bold; font-size:25px;}</style>`;
  page += `<style>p{text-align:center; padding:25px;}</style>`;
  // Si le top est dans la partie haute de l'écran, ajustez-le
  const adjustedTop = top < screen.height / 4 ? screen.height / 4 : top;

  chrome.windows.create(
    {
      url: "data:text/html;charset=utf-8," + encodeURIComponent(page),
      type: "popup",
      width,
      height,
      left,
      top: adjustedTop,
    },
    function (window) {
      currentWindow = window;
    }
  );
}

document.getElementById("Soumettre").addEventListener("click", function () {
  const linkType = prompt(
    "Choisissez le type de lien : video, article, musique, jeu, image"
  );

  if (
    linkType === "video" ||
    linkType === "article" ||
    linkType === "musique" ||
    linkType === "jeu" ||
    linkType === "image"
  ) {
    const link = prompt(`Entrez le lien de votre ${linkType} :`);
    if (link) {
      // Charge les ressources depuis le stockage avant d'accéder à l'objet resources
      loadResourcesFromStorage();
      switch (linkType.toLowerCase()) {
        case "video":
          resources.videoUrls.push(link);
          saveResourcesToStorage();
          break;
        case "article":
          resources.articleUrls.push(link);
          saveResourcesToStorage();
          break;
        case "musique":
          resources.musiqueUrls.push(link);
          saveResourcesToStorage();
          break;
        case "jeu":
          resources.jeuxUrls.push(link);
          saveResourcesToStorage();
          break;
        case "image":
          resources.imageUrls.push(link);
          saveResourcesToStorage();
          break;
        default:
          alert("Type de lien non valide.");
          return;
      }
      alert(`Lien ${linkType} ajouté avec succès !`);
    }
  } else {
    alert(`Le type de lien n'est pas valide.`);
  }
});

// Fonction pour sauvegarder les ressources dans le stockage local
function saveResourcesToStorage() {
  // Sauvegarde toutes les ressources dans le stockage local
  chrome.storage.local.set({ resources }, function () {
      console.log("Ressources sauvegardées dans le stockage local.", resources);
  });
}

// Fonction pour charger les ressources depuis le stockage local
function loadResourcesFromLocalStorage() {
  chrome.storage.local.get(["resources"], function (result) {
      const storedResources = result.resources;
      if (storedResources) {
          // Met à jour les ressources locales avec les ressources stockées
          resources = storedResources;
          console.log("Ressources chargées depuis le stockage local:", resources);
      }
  });
}