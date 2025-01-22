//Adresse de l'API pour les projets
const urlApiProjets = "http://localhost:5678/api/works";

// Fonction pour récupérer les projets
async function recuperationProjets() {
  try {
    const reponseProjets = await fetch(urlApiProjets); // Appel des projets avec la variable précédemment créée
    console.log("appel url :", urlApiProjets);

    if (!reponseProjets.ok) {
      throw new Error(`Erreur HTTP : ${reponseProjets.status}`); // Vérification si la réponse est ok ou non
    }

    const projets = await reponseProjets.json(); // Transformation de la réponse en JSON
    console.log("Projets récupérés :", projets); // Affiche les projets pour voir si ok
    return projets; // Renvoie de la variable pour une nouvelle utilisation
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des projets :",
      error.message
    ); // Affichage des erreurs dans la console
  }
}

recuperationProjets(); // Appel à exécuter la fonction

//Création des fonctions pour les cards, images, titles.
function createProjectCard() {
  return document.createElement("figure");
}

function createProjectImage(imageUrl, title) {
  const img = document.createElement("img");
  img.src = imageUrl; //url de l'image
  img.alt = title; //titre du projet qui sert au titre de l'image
  return img;
}

function createProjectTitle(title) {
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = title; //titre du projet
  return figcaption;
}

// Affichage des projets dans notre galerie
function affichageProjets(projets) {
  const gallery = document.querySelector(".gallery"); //on recupère la gallery dans le DOM
  gallery.innerHTML = ""; //remettre à 0 les elements présent au cas ou.

  projets.forEach((projet) => {
    console.log(projet);

    const card = createProjectCard();
    const img = createProjectImage(projet.imageUrl, projet.title);
    const title = createProjectTitle(projet.title);

    card.appendChild(img);
    card.appendChild(title);
    gallery.appendChild(card);
  });
}
// Appel de la fonction seulement après récupération des projets avec async pour être sur que le projet soit chargé avant secondes étapes
async function demarrageAffichageProjets() {
  const projets = await recuperationProjets(); // récup des projets
  affichageProjets(projets); // Passer les projets récup à la fonction d'affichage
}
demarrageAffichageProjets();

// Fonction génèration des filtres du menu catégorie
// Adresse de l'API pour les projets
const urlApiCategories = "http://localhost:5678/api/categories";

// Fonction pour récupérer les catégories
async function recuperationCategories() {
  try {
    const reponseCategories = await fetch(urlApiCategories); // Appel des catégories avec la variable précèdement créée
    console.log("appel categories :", urlApiCategories);

    if (!reponseCategories.ok) {
      throw new Error(`Erreur HTTP : ${reponseCategories.status}`); // Vérifie si la réponse est OK
    }

    const categories = await reponseCategories.json(); // Transformation de la réponse en JSON
    console.log("Catégories récupérées :", categories); // Affiche les catégories pour voir si tout est OK
    return categories; // Renvoie de la variable pour une nouvelle utilisation
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des catégories :",
      error.message
    ); // Gère et affiche les erreurs
    return null; // Retourne null en cas d'erreur
  }
}

recuperationCategories(); // Appel pour exécuter la fonction

//Fonction pour création du menu des filtres catégories
function menuFiltreCategories(categories, projets) {
  const menu = document.querySelector(".menu-filtre-categories"); // recuperation du menu dans le DOM
  menu.innerHTML = ""; // on remet à 0 le menu au cas ou

  //Création du bouton pour tous les projets
  const boutonTousProjets = document.createElement("button"); //Création du bouton
  boutonTousProjets.textContent = "Tous"; //texte du bouton

  menu.appendChild(boutonTousProjets); //on ajoute le bouton au menu

  //activation au clique du filtre, pour afficher tous les projets
  boutonTousProjets.addEventListener("click", () => {
    affichageProjets(projets);
  });

  //Création des autres boutons
  for (let i = 0; i < categories.length; i++) {
    console.log("categories ok :", categories[i]);

    const boutonCategories = document.createElement("button");
    boutonCategories.textContent = categories[i].name; // pour le nom de chàque catégories

    menu.appendChild(boutonCategories); // Ajouter les boutons au menu

    //activation au clique du filtre, pour afficher chàque menu suivent sur lequel on clique gràce au id des boutons et des catégories
    boutonCategories.addEventListener("click", () => {
      const projetsFiltres = projets.filter(
        (projet) => projet.categoryId === categories[i].id
      );
      affichageProjets(projetsFiltres);
    });
  }
}

//Appel à la fonction quand tout est chargé correctement avec async
async function demarrageAffichageMenuFiltre() {
  const categories = await recuperationCategories(); // récup des catégories
  const projets = await recuperationProjets(); // récupèration également des projets
  menuFiltreCategories(categories, projets); // Passer les categories et les projets récup à la fonction d'affichage
}
demarrageAffichageMenuFiltre();
