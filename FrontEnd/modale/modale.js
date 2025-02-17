// Import des variables et fonctions depuis script.js
import {
  urlApiProjects,
  getProjects,
  getCategories,
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
      modal.setAttribute("aria-hidden", "false");
    });

    [overlay, closeButton].forEach((element) => {
      element.addEventListener("click", () => {
        overlay.style.display = "none";
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
      });
    });
  }
}
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

  addDeleteIconToProject(card);

  return card;
}

// Fonction pour afficher les projets dans la modal
async function startDisplayProjectsModal() {
  const projects = await getProjects();
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
  fetch(`${urlApiProjects}/${projectId}`, {
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

      refreshGallery();
    })
    .catch((error) => {
      console.error("Erreur:", error);
      alert("La suppression a échoué");
    });
}

/////////////////////////////////////////////
//                                        //
// Gestion de la modal 2 + félche retour  //
//                                        //
////////////////////////////////////////////

function handleSecondModal() {
  const addPhotoButton = document.querySelector(".add-photo");
  const modal1 = document.getElementById("modal1");
  const modal2 = document.getElementById("modal2");
  const overlay = document.getElementById("overlay");
  const closeButtons = modal2?.querySelectorAll(".modal-close");
  const backButton = modal2?.querySelector(".modal-arrow-left");

  if (addPhotoButton && modal1 && modal2 && overlay) {
    // Ouverture de la modal 2
    addPhotoButton.addEventListener("click", () => {
      modal2.style.display = "block";
      overlay.style.display = "block";
      modal2.setAttribute("aria-hidden", "false");
      modal1.style.display = "none";
      modal1.setAttribute("aria-hidden", "true");
    });

    // Fermeture de la modal 2
    const closeModal = () => {
      modal2.style.display = "none";
      overlay.style.display = "none";
      modal2.setAttribute("aria-hidden", "true");
    };

    closeButtons?.forEach((button) =>
      button.addEventListener("click", closeModal)
    );
    overlay?.addEventListener("click", closeModal);

    // Retour à la modal 1 via la flèche
    backButton?.addEventListener("click", () => {
      modal2.style.display = "none";
      modal1.style.display = "block";
      modal2.setAttribute("aria-hidden", "true");
      modal1.setAttribute("aria-hidden", "false");
    });
  }
}

document.addEventListener("DOMContentLoaded", handleSecondModal);

////////////////////////////////////////////////////////
//                                                   //
// Affichage des catégories dans l'ajout de projet   //
//                                                   //
///////////////////////////////////////////////////////

async function dropdownCategoryListe() {
  const selectElement = document.querySelector(".select-category"); // Sélectionne de l'élèment
  if (!selectElement) return; // on vérifie si l'élèment existe bien

  const categories = await getCategories(); // Récupère les catégories depuis l'API
  if (!categories) return; // Si erreur, stoppe l'exécution

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    selectElement.appendChild(option);
  });
}

dropdownCategoryListe();

/////////////////////////////////
//                            //
// Ajout d'un nouveau projet  //
//                            //
/////////////////////////////////

// Chargement de l'image
const fileInput = document.getElementById("file");
const pictureRepo = document.querySelector(".picture-repo");
const upPhotoText = document.querySelector(".up-photo");
const typesImages = document.querySelector(".types-images");

// Écouter l'événement pour l'ajout de l'image
fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    // Créer un objet URL pour afficher l'image
    const imageUrl = URL.createObjectURL(file);

    // Remplacer l'image dans .picture-repo
    pictureRepo.src = imageUrl;

    // Ajouter une nouvelle classe à l'image pour la styliser différemment
    pictureRepo.classList.add("uploaded-image");

    // Cacher les éléments texte
    if (upPhotoText) upPhotoText.style.display = "none";
    if (typesImages) typesImages.style.display = "none";
  }
});

// Désactivation du bouton tant que le formulaire est incomplet
const validateButton = document.querySelector(".validate-add-project");
const titleInput = document.querySelector("#input-title");
const categorySelect = document.querySelector(".select-category");

function checkFormValidity() {
  if (
    fileInput.files.length > 0 &&
    titleInput.value.trim() !== "" &&
    categorySelect.value !== ""
  ) {
    validateButton.removeAttribute("disabled");
  } else {
    validateButton.setAttribute("disabled", "true");
  }
}

// Ajouter les écouteurs d'événements pour activer/désactiver le bouton
fileInput.addEventListener("change", checkFormValidity);
titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);

// Ajout du projet à l'api
document
  .querySelector(".validate-add-project")
  .addEventListener("click", async () => {
    const fileInput = document.querySelector("#file");
    const titleInput = document.querySelector("#input-title");
    const categorySelect = document.querySelector(".select-category");
    const pictureRepo = document.querySelector(".picture-repo");
    const uploadedImage = document.querySelector(".uploaded-image");
    const upPhoto = document.querySelector(".up-photo");
    const typesImages = document.querySelector(".types-images");

    // Vérification si tous les champs sont remplis
    if (!fileInput.files[0] || !titleInput.value || !categorySelect.value) {
      return;
    }

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("image", fileInput.files[0]);
    formData.append("category", categorySelect.value.toString());

    try {
      const response = await fetch(urlApiProjects, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      // Affichage du message de confirmation
      const successMessage = document.querySelector(".success-message");
      successMessage.textContent = "Projet ajouté avec succès !";
      successMessage.style.display = "block";

      setTimeout(() => {
        successMessage.style.display = "none";
      }, 3000);

      refreshGallery();
      startDisplayProjectsModal();

      // Réinitialiser le formulaire
      fileInput.value = "";
      titleInput.value = "";
      categorySelect.value = "";
      pictureRepo.src = "./assets/icons/picture-svgrepo-com.png";

      // Désactiver le bouton après ajout
      validateButton.setAttribute("disabled", "true");

      // Si une image est affichée, enlever la classe 'uploaded-image' et remettre 'picture-repo'
      if (uploadedImage) {
        uploadedImage.classList.remove("uploaded-image");
        pictureRepo.classList.add("picture-repo");
      }

      // Réafficher les éléments "up-photo" et "types-images"
      if (upPhoto && typesImages) {
        upPhoto.style.display = "flex";
        typesImages.style.display = "block";
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du projet :", error);
      alert("Une erreur est survenue : " + error.message);
    }
  });
