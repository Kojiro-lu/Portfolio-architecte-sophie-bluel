// Import des variables et fonctions depuis script.js
import { urlApiProjects, recoveryProjects } from "../script.js";

console.log(
  "Jeton récupéré dans modale.js :",
  localStorage.getItem("authToken")
);

/////////////////////////////////////////////////////
//                                                //
// Fermeture au clique de la modal et overlay    //
//                                              //
/////////////////////////////////////////////////

function closeModal() {
  const overlay = document.getElementById("overlay"); // Sélection de l'overlay
  const modal = document.getElementById("modal"); // Sélection de la modal
  const closeButton = document.querySelector(".modal-close"); // Sélection du bouton de fermeture

  if (overlay && closeButton && modal) {
    // Si l'overlay ou la croix est cliqué, on ferme la modal
    [overlay, closeButton].forEach((element) => {
      element.addEventListener("click", () => {
        overlay.style.display = "none"; // Cache l'overlay
        modal.style.display = "none"; // Cache la modal
      });
    });
  }
}

// Exécuter au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initialisation de la fermeture de la modal.");
  closeModal();
});

///////////////////////////////////////////////////////////////////////
//                                                                  //
// Récupèration/affichage des projets et supression des projets     //
//                                                                //
///////////////////////////////////////////////////////////////////

// Fonction pour supprimer un projet
function deleteProject(projectId) {
  const authToken = localStorage.getItem("authToken");

  console.log("Envoi du token avec la requête DELETE :", authToken);

  fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status} : ${response.statusText}`
        );
      }
      // Vérifier si la réponse a du contenu avant de la parser
      return response.status === 204 ? null : response.json();
    })
    .then((data) => {
      console.log("Réponse API après suppression :", data);

      const projectElement = document.querySelector(
        `.project[data-id="${projectId}"]`
      );
      if (projectElement) {
        projectElement.remove();
      }
      alert("Projet supprimé avec succès");
    })
    .catch((error) => {
      console.error("Erreur:", error);
      alert("La suppression a échoué");
    });
}

// Fonction pour ajouter l'icône de la poubelle à un projet
function addDeleteIconToProject(projectElement) {
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "./assets/icons/trash-can-solid.png";
  deleteIcon.alt = "Supprimer le projet";
  deleteIcon.classList.add("delete-icon");

  projectElement.appendChild(deleteIcon);

  // Ajouter l'écouteur d'événements pour la suppression
  deleteIcon.addEventListener("click", function (event) {
    const projectElement = event.target.closest(".project"); // Récupère l'élément parent avec la classe .project
    if (projectElement) {
      const projectId = projectElement.getAttribute("data-id");
      deleteProject(projectId);
    } else {
      console.error("L'élément parent .project n'a pas été trouvé.");
    }
  });
}

// Fonction pour créer une carte projet dans la modale (sans le titre)
function createProjectCardModal(project) {
  const card = document.createElement("figure");
  card.setAttribute("data-id", project.id); // Ajout d'un data-id dans figure pour l'utiliser dans la suppression par la suite
  card.classList.add("project"); // Ajout de la classe "project" pour bien cibler l'élément

  const img = document.createElement("img");
  img.src = project.imageUrl;
  img.alt = project.title;
  img.classList.add("img-card");
  card.appendChild(img);

  addDeleteIconToProject(card); // Ajouter l'icône de la poubelle à chaque carte projet

  return card;
}

// Fonction pour afficher les projets sans le titre dans la modale
function displayProjectsModal(projects) {
  const modalGallery = document.querySelector(".gallery-modal");
  modalGallery.innerHTML = "";

  projects.forEach((project) => {
    const card = createProjectCardModal(project);
    modalGallery.appendChild(card);
  });
}

async function startDisplayProjectsModal() {
  const projects = await recoveryProjects();
  if (projects) {
    displayProjectsModal(projects);
  }
}

startDisplayProjectsModal();
