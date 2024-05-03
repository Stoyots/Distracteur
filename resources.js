// resources.js

let resources = { 
  musiqueUrls: [
    "https://youtu.be/4vJy61dkm60",
    "https://youtu.be/hC8CH0Z3L54",
    "https://youtu.be/Dv4Co7qpTnw",
    "https://youtu.be/APWhx97QvxE",
    "https://youtu.be/gdsUKphmB3Y",
    "https://youtu.be/t6omUxqhG78",
    "https://youtu.be/dWRCooFKk3c",
    "https://youtu.be/Nuanwn3v-2I",
    "https://youtu.be/fYEXdCCpfVQ",
    "https://youtu.be/ovvn5h8VpBo",
    "https://youtu.be/rhTl_OyehF8",
    "https://youtu.be/fC06V0ZLGwg",
    'https://youtu.be/NF-kLy44Hls',
    'https://youtu.be/2fDzCWNS3ig'
  ],
  videoUrls: [
    "https://youtu.be/BGYIXarTNbA",
    "https://youtu.be/sJs_64OUpEs",
    "https://youtu.be/MWHN6ojlVXI",
    "https://youtu.be/ThwuT3_AG6w",
    "https://youtu.be/NIH1iGtDvJY",
    "https://youtu.be/h42QVfrUVFw",
    "https://youtu.be/VbeM8Lf7s5A",
    "https://youtu.be/oXAsvg_ZZzk",
    "https://youtu.be/TyUA1OmXMXA",
    "https://youtu.be/cqGjhVJWtEg"
  ],
  articlesUrls: [
    "https://www.legorafi.fr/2024/01/08/la-societe-generale-va-ajouter-une-musique-de-suspense-lorsque-vous-consultez-vos-comptes-le-lundi-matin/",
    "https://www.legorafi.fr/2024/01/09/son-appli-de-meditation-lui-envoie-75-notifications-par-jour-pour-lui-rappeler-detre-dans-linstant-present/",
    "https://www.legorafi.fr/2024/01/09/brigitte-macron-assurera-la-regence-le-temps-que-gabriel-attal-soit-en-age-de-gouverner/",
    "https://www.legorafi.fr/2024/01/11/gabriel-attal-surprend-tout-le-monde-en-arrivant-a-matignon-en-abaya/",
    "https://www.legorafi.fr/2024/01/10/jo-2024-pour-donner-une-bonne-image-de-paris-anne-hidalgo-va-organiser-un-grand-toilettage-des-rats-de-la-capitale/",
    "https://www.legorafi.fr/2023/12/21/noel-faut-il-mentir-a-ses-enfants-ou-leur-reveler-que-le-pere-noel-est-un-male-blanc-de-plus-de-50-ans/",
    "https://www.liberties.eu/fr/stories/halden-the-world-s-most-humane-prison/11089"
  ],
  jeuxUrls: [
    "https://www.crazygames.fr/jeu/desktop-tower-defense",
    "https://www.crazygames.fr/jeu/smash-karts",
    "https://www.crazygames.fr/jeu/goober-dash",
    "https://www.crazygames.fr/jeu/goober-dash",
    "https://www.crazygames.fr/jeu/helix-jump",
    "https://www.crazygames.fr/jeu/ragdoll-archers",
    "https://www.crazygames.fr/jeu/mr-racer---car-racing",
    "https://www.crazygames.fr/jeu/bonkio",
    "https://www.jesuisundev.com/across-multiverse/",
    "https://www.16personalities.com/fr/test-de-personnalite",
    "https://www.queeringthemap.com/"
  ],
  imageUrls: [],
  anecdoteUrls: []
};

// Fonction pour récupérer les images depuis l'API
let choice = true
function fetchImagesFromAPI() {
  if (choice === true) {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Erreur de récupération de l'image depuis l'API");
          return null;
        }
      })
      .then(data => {
        if (data) {
          // Ajouter l'image à la liste des ressources
          let dataImage;
          dataImage = data.message
          resources.imageUrls.push(dataImage);
          // console.log("Image récupérée avec succès :", dataImage);
        }
      })
      .catch(error => {
        console.error("Erreur lors de la requête API :", error);
      });
    choice = false
  }
  else if (choice === false) {
    fetch("https://api.thecatapi.com/v1/images/search")
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Erreur de récupération de l'image depuis l'API");
          return null;
        }
      })
      .then(data => {
        if (data) {
          // Ajouter l'image à la liste des ressources
          let dataImage;
          dataImage = data[0].url
          resources.imageUrls.push(dataImage);
          // console.log("Image récupérée avec succès :", dataImage);
        }
      })
      .catch(error => {
        console.error("Erreur lors de la requête API :", error);
      });
    choice = true
  }
}

// Appeler la fonction pour récupérer une image
fetchImagesFromAPI();

// Utiliser la liste des ressources dans le reste de ton code
// Par exemple, tu peux utiliser la première image ainsi :
let firstImage = resources.imageUrls[0]
// console.log("DataImage :", firstImage);

// va chercher une fun fact dans une API
let dataAnecdote;
let content;
function fetchTextFromAPI() {
  fetch("https://uselessfacts.jsph.pl/api/v2/facts/random").then(function (response) {
    if (response.ok) {
      return response.json()
    }
    console.log("success!", response)
  })

    .then(data => {
      dataAnecdote = data.text
      resources.anecdoteUrls.push(dataAnecdote);
      // console.log("Anecdote récupérée avec succès :", dataAnecdote);
    })
}
// console.log("dataAnecdote: " + dataAnecdote)

fetchTextFromAPI()
export { fetchImagesFromAPI, fetchTextFromAPI };
export default resources;