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
