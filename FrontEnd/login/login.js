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

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur durant la  connexion:", error.message);
    throw error;
  }
}

// Fonction pour gérer la réponse de connexion
function LoginResponse(data) {
  const token = data.token;
  localStorage.setItem("authToken", token);
  window.location.href = "index.html"; // Redirection vers la page d'accueil
}

// Fonction pour afficher un message d'erreur
function displayErrorMessage(message) {
  const errorMessage = document.querySelector("#error-message");
  errorMessage.textContent = message;
}
