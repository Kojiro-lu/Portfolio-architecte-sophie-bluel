//Adresse de l'API pour les projets
const urlApiProjets = "http://localhost:5678/api/works";

//Fonction pour récupèrer les Projets
async function recuperationProjet() {
  const reponseProjets = await fetch(urlApiProjets); //Appel des projets avec la variable précèdement créer
  console.log("appel url :", urlApiProjets);
  const projets = await reponseProjets.json(); // Transformation de la réponse en JSON
  console.log("Projets récupérés :", projets); // Affiche les projets pour voir si ok
  return projets; // Renvoie de la variable pour une nouvelle utilisation
}
recuperationProjet(); //appel à exécuter la fonction

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
// Appel de la fonction seulement après récupération des projets avec async pour être sur que le projet soit chargé
async function demarrageAffichageProjets() {
  const projets = await recuperationProjet(); // récup des projets
  affichageProjets(projets); // Passer les projets récup à la fonction d'affichage
}
demarrageAffichageProjets();
