let modal = null;

const openModal = async function (e) {
  e.preventDefault();

  modal = document.querySelector(e.target.getAttribute("href"));
  modal.style.display = "flex"; // Ou 'block' si tu préfères
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  // Empêcher la fermeture si on clique sur le contenu de la modal
  modal
    .querySelector(".block-modal")
    .addEventListener("click", (e) => e.stopPropagation());

  modal.addEventListener("click", closeModal);
  modal.querySelector(".modal-close").addEventListener("click", closeModal);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".modal-close").removeEventListener("click", closeModal);
  modal = null;
};

document.querySelectorAll(".btn-modifier").forEach((btn) => {
  btn.addEventListener("click", openModal);
});
