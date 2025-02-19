// Adresse de l'API pour les projets mis en export pour réutilisation dans moadle.js
export const urlApiProjects = "http://localhost:5678/api/works";

//////////////////////////////////////////////////////////////
//                                                         //
// Récupération et affichage des projets sur la page index //
//                                                         //
////////////////////////////////////////////////////////////

// Fonction pour récupérer les projets
export async function getProjects() {
  try {
    const answerProjects = await fetch(urlApiProjects); 

    if (!answerProjects.ok) {
      throw new Error(`Erreur HTTP : ${answerProjects.status}`); 
    }

    return await answerProjects.json(); 
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des projets :",
      error.message
    );
  }
}

getProjects(); 

// Création des fonctions pour les cards, images, titles.
function createProjectCard() {
  return document.createElement("figure");
}

function createProjectImage(imageUrl, title, card) {
  const img = document.createElement("img");
  img.src = imageUrl; 
  img.alt = title; 
  card.appendChild(img);
}

function createProjectTitle(title, card) {
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = title; 
  card.appendChild(figcaption);
}

// Affichage des projets dans notre galerie
function displayProjects(projects) {
  const gallery = document.querySelector(".gallery"); 
  gallery.innerHTML = ""; 

  // On lance une boucle forEach pour parcourir le tableau projects
  projects.forEach((project) => {
    const card = createProjectCard();
    createProjectImage(project.imageUrl, project.title, card);
    createProjectTitle(project.title, card);
    gallery.appendChild(card);
  });
}

// Appel de la fonction seulement après récupération des projets avec async
async function startDisplayProjects() {
  const projects = await getProjects(); 
  if (projects) displayProjects(projects); 
}

startDisplayProjects();

// Mise à jour de l'affichage lors de l'ajout d'un nouveau projet
export async function refreshGallery() {
  const projects = await getProjects();
  if (projects) displayProjects(projects);
}

//////////////////////////////////////////////////////////
//                                                     //
// Fonction génération des filtres du menu catégorie   //
//                                                     //
/////////////////////////////////////////////////////////

// Adresse de l'API pour les catégories
const urlApiCategories = "http://localhost:5678/api/categories";

// Fonction pour récupérer les catégories
export async function getCategories() {
  try {
    const answerCategories = await fetch(urlApiCategories);

    if (!answerCategories.ok) {
      throw new Error(`Erreur HTTP : ${answerCategories.status}`);
    }

    return await answerCategories.json(); 
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des catégories :",
      error.message
    );
    return null;
  }
}

getCategories();

// Fonction pour créer un bouton de catégorie
function createCategoryButton(categoryName) {
  const buttonCategories = document.createElement("button");
  buttonCategories.textContent = categoryName;
  return buttonCategories;
}

// Fonction pour ajouter un événement de filtrage aux boutons
function addFilterEvent(buttonCategories, categoryId, projects) {
  buttonCategories.addEventListener("click", () => {
    const menuButtons = document.querySelectorAll(
      ".menu-filter-categories button"
    );
    menuButtons.forEach((button) => button.classList.remove("active"));

    buttonCategories.classList.add("active");

    const projectsFiltres = projects.filter(
      (project) => project.categoryId === categoryId
    );
    displayProjects(projectsFiltres);
  });
}

// Fonction pour la création du menu des filtres catégories
function menuFilterCategories(categories, projects) {
  const menu = document.querySelector(".menu-filter-categories");
  menu.innerHTML = ""; 

  // Création du bouton pour afficher tous les projets
  const buttonAllProjects = document.createElement("button");
  buttonAllProjects.textContent = "Tous";

  menu.appendChild(buttonAllProjects);

  buttonAllProjects.addEventListener("click", () => {
    const menuButtons = document.querySelectorAll(
      ".menu-filter-categories button"
    );
    menuButtons.forEach((button) => button.classList.remove("active"));

    buttonAllProjects.classList.add("active");
    displayProjects(projects);
  });

  // Création des boutons pour chaque catégorie
  categories.forEach((category) => {
    const buttonCategories = createCategoryButton(category.name);
    menu.appendChild(buttonCategories);
    addFilterEvent(buttonCategories, category.id, projects);
  });
}

// Appel à la fonction quand tout est chargé correctement avec async
async function startDisplayMenuProjects() {
  const categories = await getCategories();
  const projects = await getProjects();

  if (categories && projects) {
    menuFilterCategories(categories, projects);
  }
}

startDisplayMenuProjects();

////////////////////////////////////////////////////////////////////////
//                                                                   //
// Mise en place de la déconnexion une fois que nous sommes connecté //
//                                                                   //
////////////////////////////////////////////////////////////////////////

// Mise à jour du bouton login/logout
function checkLoginStatus() {
  const token = localStorage.getItem("authToken");
  const loginLink = document.querySelector("nav ul li:nth-child(3) a"); 

  if (token) {
    loginLink.textContent = "Logout"; 
    loginLink.href = "#"; 
    loginLink.addEventListener("click", handleLogout); 
  } else {
    loginLink.textContent = "Login"; 
    loginLink.href = "./login/login.html"; 
  }
}

// Fonction pour la déconnexion
function handleLogout(event) {
  event.preventDefault(); 
  localStorage.removeItem("authToken"); 
  window.location.reload(); 
}

// Exécuter au chargement de la page pour vérifier la connexion
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
});

/////////////////////////////////////////////////////////
//                                                     //
// Affichage du bandeau lorsque nous sommes connectés  //
//                                                     //
////////////////////////////////////////////////////////

// Vérification de la connexion pour afficher le bandeau
function checkLoginStatusForDisplayBanner() {
  const token = localStorage.getItem("authToken"); 
  const bandeau = document.querySelector(".bandeau-noir"); 
  const bodyConnected = document.body; 

  if (token && bandeau) {
    bandeau.style.display = "flex";
    bodyConnected.style.marginTop = "69px";
  } else {
    bandeau.style.display = "none";
    bodyConnected.style.marginTop = "0";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatusForDisplayBanner();
});
/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// Suppression des filtres et ajout du bouton modifier pour ouverture de la Modale   //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////

function checkLoginStatusForDeletedFilter() {
  const token = localStorage.getItem("authToken"); 
  const menuFilter = document.querySelector(".menu-filter-categories"); 
  const buttonModifyProjets = document.querySelector(".modifier-projet"); 
  const myProjects = document.querySelector(".mes-projets"); 

  if (token) {
    menuFilter.style.display = "none"; 
    buttonModifyProjets.style.display = "flex"; 
    myProjects.style.flexDirection = "row";
  } else {
    menuFilter.style.display = "flex"; 
    buttonModifyProjets.style.display = "none"; 
    myProjects.style.flexDirection = "column";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatusForDeletedFilter();
});
