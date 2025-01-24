//Adresse de l'API pour les projets
const urlApiProjects = "http://localhost:5678/api/works";

//////////////////////////////////////////////////////////////
//                                                         //
//Récupèration et affichage des projets sur la page index //
//                                                       //
//////////////////////////////////////////////////////////

// Fonction pour récupérer les projets
async function recoveryProjects() {
  try {
    const answerProjects = await fetch(urlApiProjects); // Appel des projets avec la variable précédemment créée
    console.log("appel url :", urlApiProjects);

    if (!answerProjects.ok) {
      throw new Error(`Erreur HTTP : ${answerProjects.status}`); // Vérification si la réponse est ok ou non
    }

    const projects = await answerProjects.json(); // Transformation de la réponse en JSON
    console.log("Projets récupérés :", projects); // Affiche les projets pour voir si ok
    return projects; // Renvoie de la variable pour une nouvelle utilisation
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des projets :",
      error.message
    ); // Affichage des erreurs dans la console
  }
}

recoveryProjects(); // Appel à exécuter la fonction

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
function displayProjects(projects) {
  const gallery = document.querySelector(".gallery"); //on recupère la gallery dans le DOM
  gallery.innerHTML = ""; //remettre à 0 les elements présent au cas ou.

  projects.forEach((project) => {
    console.log(project);

    const card = createProjectCard();
    const img = createProjectImage(project.imageUrl, project.title);
    const title = createProjectTitle(project.title);

    card.appendChild(img);
    card.appendChild(title);
    gallery.appendChild(card);
  });
}
// Appel de la fonction seulement après récupération des projets avec async pour être sur que le projet soit chargé avant secondes étapes
async function startDisplayProjects() {
  const projects = await recoveryProjects(); // récup des projets
  displayProjects(projects); // Passer les projets récup à la fonction d'affichage
}
startDisplayProjects();

//////////////////////////////////////////////////////////
//                                                     //
// Fonction génèration des filtres du menu catégorie  //
//                                                   //
//////////////////////////////////////////////////////

// Adresse de l'API pour les projets
const urlApiCategories = "http://localhost:5678/api/categories";

// Fonction pour récupérer les catégories
async function recoveryCategories() {
  try {
    const answerCategories = await fetch(urlApiCategories); // Appel des catégories avec la variable précèdement créée
    console.log("appel categories :", urlApiCategories);

    if (!answerCategories.ok) {
      throw new Error(`Erreur HTTP : ${answerCategories.status}`); // Vérifie si la réponse est OK
    }

    const categories = await answerCategories.json(); // Transformation de la réponse en JSON
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

recoveryCategories(); // Appel pour exécuter la fonction

// Fonction pour créer un bouton de catégorie
function createCategoryButton(categoryName) {
  const buttonCategories = document.createElement("button");
  buttonCategories.textContent = categoryName; // pour le nom de chaque catégorie
  return buttonCategories;
}

// Fonction pour ajouter un événement de filtrage aux boutons
function addFilterEvent(buttonCategories, categoryId, projects) {
  buttonCategories.addEventListener("click", () => {
    const menuButtons = document.querySelectorAll(
      ".menu-filter-categories button"
    ); //on sélèctionne le selecteur button de notre classe manu-filter-catégories
    menuButtons.forEach((button) => {
      button.classList.remove("active");
    }); //Enlever la classe active de tous les boutons

    buttonCategories.classList.add("active"); //Ajouter la classe active au bouton qui a été cliquer

    const projectsFiltres = projects.filter(
      (project) => project.categoryId === categoryId
    );
    displayProjects(projectsFiltres);
  }); //Filtre des catégories
}

// Fonction pour la création du menu des filtres catégories
function menuFilterCategories(categories, projects) {
  const menu = document.querySelector(".menu-filter-categories"); // récupération du menu dans le DOM
  menu.innerHTML = ""; // on remet à 0 le menu au cas où

  // Création du bouton pour tous les projets
  const buttonAllProjects = document.createElement("button"); // Création du bouton
  buttonAllProjects.textContent = "Tous"; // texte du bouton

  menu.appendChild(buttonAllProjects); // on ajoute le bouton au menu

  // activation au clic du filtre, pour afficher tous les projets
  buttonAllProjects.addEventListener("click", () => {
    const menuButtons = document.querySelectorAll(
      ".menu-filter-categories button"
    ); //on sélèctionne le selecteur button de notre classe manu-filter-catégories
    menuButtons.forEach((button) => {
      button.classList.remove("active");
    }); //Enlever la classe active de tous les boutons

    buttonAllProjects.classList.add("active"); //Ajouter la classe active au bouton qui a été cliquer
    displayProjects(projects);
  });

  // Création des autres boutons avec forEach
  categories.forEach((category) => {
    console.log("categorie ok :", category);

    const buttonCategories = createCategoryButton(category.name); // création des boutons
    menu.appendChild(buttonCategories); // Ajouter le bouton au menu
    addFilterEvent(buttonCategories, category.id, projects); // ajout de l'événement au bouton
  });
}

//Appel à la fonction quand tout est chargé correctement avec async
async function startDisplayMenuProjects() {
  const categories = await recoveryCategories(); // récup des catégories
  const projects = await recoveryProjects(); // récupèration également des projets
  menuFilterCategories(categories, projects); // Passer les categories et les projets récup à la fonction d'affichage
}
startDisplayMenuProjects();

////////////////////////////////////////////////////////////////////////
//                                                                   //
//Mise en place de la déconnexion une fois que nous sommes connecté //
//                                                                 //
////////////////////////////////////////////////////////////////////

// On met à jour le bouton login/logout
function checkLoginStatus() {
  const token = localStorage.getItem("authToken"); // Récupérer le token dans localStorage
  const loginLink = document.querySelector("nav ul li:nth-child(3) a"); // Cibler le lien "login" gràce à nth-child(3) qui correspond au troisiéme fils de li

  console.log("Token présent ou non:", token); // Affiche le token ou null si non fonctionnel

  if (token) {
    // Si l'utilisateur est bien connecté
    loginLink.textContent = "Logout"; // Changer le texte en "Logout" pour pouvoir ce déconnecté
    loginLink.href = "#"; // Désactiver le lien de redirection au cas ou
    loginLink.addEventListener("click", handleLogout); // Ajouter l'événement de déconnexion
  } else {
    // Si l'utilisateur n'est pas connecté
    loginLink.textContent = "Login"; // laisser le login pour pouvoir ce connecté
    loginLink.href = "./login/login.html"; // rediriger vers la page de connexion
  }
}

// fonction pour la déconnexion
function handleLogout(event) {
  event.preventDefault(); // Empêcher le comportement par défaut du lien
  localStorage.removeItem("authToken"); // Supprimer le token du localStorage pour pas de reco-automatique si on revient sur la page.
  window.location.reload(); // charger de nouveau notre page pour revenir à non connecté
}

// Exécuter au chargement de la page pour voir si nous sommes connecté ou non.
document.addEventListener("DOMContentLoaded", () => {
  console.log("Vérification de la connexion ok ou non.");
  checkLoginStatus(); // Vérification du statut de la connexion
});

/////////////////////////////////////////////////////////
//                                                    //
// Affichage du bandeau lorsque nous sommes connecté //
//                                                  //
/////////////////////////////////////////////////////

// on vérifie si l'utilisateur est connecté pour mettre à jour le bandeau
function checkLoginStatusForDisplayBanner() {
  const token = localStorage.getItem("authToken"); // Vérifier le token dans localStorage
  const bandeau = document.querySelector(".bandeau-noir"); // Cibler le bandeau noir dans le DOM

  if (bandeau && token) {
    // Si l'utilisateur est bien connecté et que le bandeau noir est bien présent
    bandeau.style.display = "flex"; // on afficher le bandeau noir
    console.log("L'utilisateur est connecté : bandeau affiché.");
  } else {
    bandeau.style.display = "none"; // Masquer le bandeau noir
    console.log("L'utilisateur n'est pas connecté : bandeau masqué.");
  }
}

// Exécuter au chargement de la page pour voir si nous sommes connecté ou non.
document.addEventListener("DOMContentLoaded", () => {
  console.log("Vérification de la connexion ok ou non.");
  checkLoginStatusForDisplayBanner(); // Vérification du statut de connexion
});
