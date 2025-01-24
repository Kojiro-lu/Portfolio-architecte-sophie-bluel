//Adresse de l'API pour la connexion
const urlApiLogin = "http://localhost:5678/api/users/login";

// Fonction pour envoyer la requête de connexion
async function sendLoginRequest(email, password) {
  const loginData = { email, password };

  try {
    const response = await fetch(urlApiLogin, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    console.log("Statut de la réponse : ", response.status); // Ajout
    const responseBody = await response.json();
    console.log("Réponse complète de l'API :", responseBody); // Ajout

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${
          responseBody.message || "Erreur inconnue"
        }`
      );
    }

    return responseBody;
  } catch (error) {
    console.error("Erreur durant la connexion :", error.message);
    throw error;
  }
}

// Fonction pour gérer la réponse de connexion
function handleLoginResponse(data) {
  const token = data.token;
  localStorage.setItem("authToken", token);
  window.location.href = "../index.html"; // Redirection vers la page d'accueil
}

// Fonction pour afficher un message d'erreur
function displayErrorMessage(message) {
  const errorMessage = document.querySelector("#message-erreur-connexion");
  errorMessage.textContent = message;
}

// Fonction pour appel à la connexion
async function handleLogin(event) {
  event.preventDefault();

  const email = document.querySelector("#mail").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (!email || !password) {
    displayErrorMessage("Merci de remplir les 2 champs");
    return;
  }

  try {
    const data = await sendLoginRequest(email, password);
    handleLoginResponse(data);
  } catch (error) {
    displayErrorMessage(
      "Email ou mot de passe invalide, merci de saisir de nouveau vos informations de connexion."
    );
  }
}

// Ajouter l'événement au formulaire
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".formulaire-login");

  if (!form) {
    console.error("Le formulaire n'a pas été trouvé dans le DOM.");
    return;
  }

  form.addEventListener("submit", handleLogin);
});
