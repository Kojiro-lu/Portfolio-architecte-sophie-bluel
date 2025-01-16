//Adresse de l'API pour les projets
const UrlApiProjets = "http://localhost:5678/api/works";

//Fonction pour récupèrer les Projets
async function recuperationProjet() {
  const reponseProjets = await fetch(UrlApiProjets); //Appel des projets avec la variable précèdement créer
  const projets = await reponseProjets.json; // Transformation de la réponse en JSON
  console.log("Projets récupérés :", projets); // Affiche les projets
  return projets; // Renvoie de la variable pour une nouvelle utilisation
}
