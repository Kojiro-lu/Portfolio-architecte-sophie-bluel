//Adresse de l'API pour la connexion
const urlApiLogin = "http://localhost:5678/api/users/login";

// Fonction pour envoyer la requête de connexion à l'API
async function apiLoginRequest(email, password) {
  const loginData = { email, password };

  try {
    const response = await fetch(urlApiLogin, {
      method: "POST", //type de requête post pour l'envoie des données à l'api
      headers: { "Content-Type": "application/json" }, //requête en json
      body: JSON.stringify(loginData), //convertir loginData en json pour l'envoie de la requête
    });

    const responseBody = await response.json(); //stocké la réponse dans la constante

    if (!response.ok) {
      //vérification de la réponse et si erreur alors
      throw new Error( //gràce à throw on créer l'erreur dans réponse status
        `HTTP Error: ${response.status} - ${
          responseBody.message || "Erreur inconnue" //message d'erreur ou erreur iconnue
        }`
      );
    }

    return responseBody;
  } catch (error) {
    console.error("Erreur durant la connexion :", error.message);
    throw error;
  }
}

// Fonction pour gérer la réponse ok aprés tentative de connexion
function handleLoginResponse(data) {
  const token = data.token; // on récupère le token transmis
  localStorage.setItem("authToken", token); //on stock le tocken dans le localStorage de l'ordinateur
  window.location.href = "../index.html"; // Redirection vers la page d'accueil
}

// Fonction pour afficher un message d'erreur si tentative de connexion ko
function displayErrorMessage(message) {
  const errorMessage = document.querySelector("#message-erreur-connexion");
  errorMessage.textContent = message; //on affiche notre message d'erreur récupérer
}

// Fonction pour gérer la soumission du formulaire de connexion
async function handleLogin(event) {
  event.preventDefault(); //on enpêche le rechargement par dêfaut de la page

  const email = document.querySelector("#mail").value.trim(); //on récupère ce qu'on a écris dans la case email
  const password = document.querySelector("#password").value.trim(); //on récupère ce qu'on a écris dans la case password

  if (!email || !password) {
    displayErrorMessage("Merci de remplir les 2 champs"); //message d'erreur si un des 2 champs n'est pas remplie
    return;
  }

  //utilisation de try/catch pour l'affichage d'une erreur si mots de passe ou mail invalide
  try {
    const data = await apiLoginRequest(email, password);
    handleLoginResponse(data); //si ok pas de probléme
  } catch (error) {
    //si ko on affiche le message d'erreur
    displayErrorMessage(
      "Email ou mot de passe invalide, merci de saisir de nouveau vos informations de connexion."
    );
  }
}

// Ajouter l'événement au formulaire
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".formulaire-login");
  //on vérifie d'abord que le formulaire existe bien
  if (!form) {
    console.error("Le formulaire n'a pas été trouvé dans le DOM.");
    return;
  }

  form.addEventListener("submit", handleLogin); //écouteur pour le submint du formulaire qui appel la fonction handlelogin
});
