// Import des variables et fonctions depuis script.js
import {
  urlApiProjects,
  recoveryProjects,
  recoveryCategories,
  refreshGallery,
} from "../script.js";

////////////////////////////////////////////
//                                       //
// Gestion de l'overlay et de la modal 1 //
//                                       //
////////////////////////////////////////////

function toggleModal() {
  const modifyButton = document.querySelector(".modifier-projet");
  const overlay = document.getElementById("overlay");
  const modal = document.getElementById("modal1");
  const closeButton = document.querySelector(".modal-close");

  if (modifyButton && overlay && modal && closeButton) {
    modifyButton.addEventListener("click", () => {
      overlay.style.display = "block";
      modal.style.display = "block";
    });

    [overlay, closeButton].forEach((element) => {
      element.addEventListener("click", () => {
        overlay.style.display = "none";
        modal.style.display = "none";
      });
    });
  }
}

// Exécuter au chargement du DOM
document.addEventListener("DOMContentLoaded", toggleModal);

///////////////////////////////////////////////////////////////////////
//                                                                  //
// Affichage des projets et supression des projets                 //
//                                                                //
///////////////////////////////////////////////////////////////////

// Fonction pour créer une carte "projet" dans la modale
function createProjectCardModal(project) {
  const card = document.createElement("figure");
  card.setAttribute("data-id", project.id); // Ajout d'un data-id a figure pour l'utiliser dans la suppression par la suite
  card.classList.add("project"); // Ajout de la classe "project" pour bien cibler l'élément

  const img = document.createElement("img");
  img.src = project.imageUrl;
  img.alt = project.title;
  img.classList.add("img-card");
  card.appendChild(img);

  addDeleteIconToProject(card); // Ajouter l'icône  de la poubelle à chaque carte projet

  return card;
}

// Fonction pour afficher les projets dans la modal
async function startDisplayProjectsModal() {
  const projects = await recoveryProjects();
  if (projects) {
    displayProjectsModal(projects);
  }
}

function displayProjectsModal(projects) {
  const modalGallery = document.querySelector(".gallery-modal");
  modalGallery.innerHTML = "";

  projects.forEach((project) => {
    const card = createProjectCardModal(project);
    modalGallery.appendChild(card);
  });
}
startDisplayProjectsModal();

// Fonction pour ajouter l'icône de la poubelle aux projets
function addDeleteIconToProject(projectElement) {
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "./assets/icons/trash-can-solid.png";
  deleteIcon.alt = "Supprimer le projet";
  deleteIcon.classList.add("delete-icon");

  projectElement.appendChild(deleteIcon);

  // Ajouter l'écouteur d'événements pour la suppression
  deleteIcon.addEventListener("click", function (event) {
    const projectElement = event.target.closest(".project");
    if (projectElement) {
      const projectId = projectElement.getAttribute("data-id");
      deleteProject(projectId);
    } else {
      console.error("L'élément parent .project n'a pas été trouvé.");
    }
  });
}

// Fonction pour supprimer un projet
function deleteProject(projectId) {
  const authToken = localStorage.getItem("authToken");

  //requête DELETE à l'api
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
      return null;
    })
    .then(() => {
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

////////////////////////////////////////////////////////////
//                                                       //
// Ouverture de la modal 2 depuis "ajouter les photos"  //
//                                                     //
////////////////////////////////////////////////////////

function openSecondModal() {
  const addPhotoButton = document.querySelector(".add-photo");
  const modal2 = document.getElementById("modal2");
  const overlay = document.getElementById("overlay");

  if (addPhotoButton && modal2 && overlay) {
    addPhotoButton.addEventListener("click", () => {
      modal2.style.display = "block";
      overlay.style.display = "block";
      // Fermer la première modal et overlay si nécessaire
      const modal1 = document.getElementById("modal1");
      if (modal1) {
        modal1.style.display = "none";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  openSecondModal();
});

//////////////////////////////////////////////
//                                         //
// Fermeture de la modal 2 + overlay      //
//                                       //
//////////////////////////////////////////

function closeSecondModal() {
  const modal2 = document.getElementById("modal2");
  const overlay = document.getElementById("overlay");
  const closeButtons = modal2.querySelectorAll(".modal-close");

  function closeModal() {
    modal2.style.display = "none";
    overlay.style.display = "none";
  }

  closeButtons.forEach((button) =>
    button.addEventListener("click", closeModal)
  );
  overlay.addEventListener("click", closeModal);
}

document.addEventListener("DOMContentLoaded", closeSecondModal);

/////////////////////////////////////////////
//                                        //
// Retour à la modal 1 avec la félche    //
//                                      //
/////////////////////////////////////////
function returnToFirstModal() {
  const modal2 = document.getElementById("modal2");
  const modal1 = document.getElementById("modal1");
  const backButton = modal2.querySelector(".modal-arrow-left");

  function goBack() {
    modal2.style.display = "none";
    modal1.style.display = "block";
  }

  backButton.addEventListener("click", goBack);
}

document.addEventListener("DOMContentLoaded", returnToFirstModal);

///////////////////////////////////////////////////////////////////////
//                                                                  //
// Affichage des catégories dans l'ajout de projet de la modale 2  //
//                                                                //
///////////////////////////////////////////////////////////////////

async function dropdownCategoryListe() {
  const selectElement = document.querySelector(".select-category"); // Sélectionne de l'élèment
  if (!selectElement) return; // on vérifie si l'élèment existe bien

  const categories = await recoveryCategories(); // Récupère les catégories depuis l'API
  if (!categories) return; // Si erreur, stoppe l'exécution

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id; // on utilise l'id
    option.textContent = category.name; // Utilise le nom pour le visuel
    selectElement.appendChild(option);
  });
}

dropdownCategoryListe();

////////////////////////////////////
//                               //
// Ajout d'un nouveau projet    //
//                             //
////////////////////////////////

// Chargement de l'image
const fileInput = document.getElementById("file");
const pictureRepo = document.querySelector(".picture-repo");

// Écouter l'événement 'change' sur l'input type="file"
fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0]; // Récupérer le fichier sélectionné
  if (file) {
    // Créer un objet URL pour afficher l'image
    const imageUrl = URL.createObjectURL(file);

    // Changer la source de l'image pour la photo sélectionnée
    pictureRepo.src = imageUrl;
  }
});

// Ajout du projet à l'api
document
  .querySelector(".validate-add-project")
  .addEventListener("click", async () => {
    const fileInput = document.querySelector("#file");
    const titleInput = document.querySelector("#input-title");
    const categorySelect = document.querySelector(".select-category");

    // Vérification si tous les champs sont remplis
    if (!fileInput.files[0] || !titleInput.value || !categorySelect.value) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("image", fileInput.files[0]); // Vérifie si "image" est bien le bon champ
    formData.append("category", categorySelect.value.toString()); // Conversion en string

    console.log("Données envoyées :", {
      title: titleInput.value,
      image: fileInput.files[0],
      category: categorySelect.value.toString(),
    });

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData, // Envoi en multipart/form-data
      });

      if (!response.ok) {
        const errorText = await response.text(); // Récupérer le message exact de l'API
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Projet ajouté avec succès :", result);

      // Affichage du message de confirmation
      const successMessage = document.querySelector(".success-message");
      successMessage.textContent = "Projet ajouté avec succès !";
      successMessage.style.display = "block";

      // Cacher le message après 3 secondes
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 3000);

      // Rafraîchir la galerie de l'index et de la modale 1 sans recharger la page
      refreshGallery();
      startDisplayProjectsModal();

      // Réinitialiser le formulaire
      fileInput.value = "";
      titleInput.value = "";
      categorySelect.value = "";
      document.querySelector(".picture-repo").src =
        "./assets/icons/picture-svgrepo-com.png";
    } catch (error) {
      console.error("Erreur lors de l'envoi du projet :", error);
      alert("Une erreur est survenue : " + error.message);
    }
  });
