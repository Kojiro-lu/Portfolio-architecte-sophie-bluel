const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribut("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal, true");
};

document.querySelector("btn-modifier").forEach((a) => {
  a.addEventListener("click", openModal);
});
