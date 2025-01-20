//Adresse de l'API pour les projets
const urlApiProjets = "http://localhost:5678/api/works";

//Fonction pour récupèrer les Projets
async function recuperationProjets() {
  const reponseProjets = await fetch(urlApiProjets); //Appel des projets avec la variable précèdement créer
  console.log("appel url :", urlApiProjets);
  const projets = await reponseProjets.json(); // Transformation de la réponse en JSON
  console.log("Projets récupérés :", projets); // Affiche les projets pour voir si ok
  return projets; // Renvoie de la variable pour une nouvelle utilisation
}
recuperationProjets(); //appel à exécuter la fonction

// Affichage des projets dans notre galerie
function affichageProjets(projets) {
  const gallery = document.querySelector(".gallery"); //on recupère la gallery dans le DOM
  gallery.innerHTML = ""; //remettre à 0 les elements présent au cas ou.

  for (let i = 0; i < projets.length; i++) {
    console.log("projet ok :", projets[i]);

    // Cration de la balise figure et la rattacher à la classe gallery
    const baliseFigure = document.createElement("figure");
    const classGallery = document.querySelector(".gallery");
    classGallery.appendChild(baliseFigure);
    // Création de la balise image et la rattacher à la balise figure
    const img = document.createElement("img");
    baliseFigure.appendChild(img);
    // Création de la balise figcaption et la rattacher à la balise figure
    const baliseFigcaption = document.createElement("figcaption");
    baliseFigure.appendChild(baliseFigcaption);

    //récupération de l'image depuis l'api
    img.src = projets[i].imageUrl;
    //récupèration du titre pour mettre dans le alt de l'image
    img.alt = projets[i].title;
    //récupèration de la description pour mettre sous l'image
    baliseFigcaption.textContent = projets[i].title;
  }
}
// Appel de la fonction seulement après récupération des projets avec async pour être sur que le projet soit chargé avant secondes étapes
async function demarrageAffichageProjets() {
  const projets = await recuperationProjets(); // récup des projets
  affichageProjets(projets); // Passer les projets récup à la fonction d'affichage
}
demarrageAffichageProjets();

// Fonction génèration des filtres du menu catégorie
//Adresse de l'API pour les projets
const urlApiCategories = "http://localhost:5678/api/categories";

//Fonction pour récupérer les catégories
async function recuperationCategories() {
  const reponseCategories = await fetch(urlApiCategories); //Appel des categories avec la variable précèdement créer
  console.log("appel categories :", urlApiCategories);
  const categories = await reponseCategories.json(); // Transformation de la réponse en JSON
  console.log("Categories récupérés :", categories); // Affiche les categories pour voir si ok
  return categories; // Renvoie de la variable pour une nouvelle utilisation
}
recuperationCategories(); //appel à exécuter la fonction

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
