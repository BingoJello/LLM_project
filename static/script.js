document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("add-btn");
  const sendButton = document.getElementById("send-btn");
  const ingredientInput = document.getElementById("ingredient");
  const ingredientsList = document.getElementById("ingredients-list");
  const responseDiv = document.getElementById("response");

  let ingredients = []; // Liste des ingrédients
  function formatRecipes(response) {
    // Diviser la réponse en recettes
    let recipes = response.trim().split("\n*   "); // Séparer chaque recette

    // Créer un container pour toutes les recettes
    let container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column"; // Les cartes seront maintenant affichées verticalement
    container.style.gap = "20px";

    // Pour chaque recette (en commençant par l'index 1, donc on saute la première)
    recipes.forEach((recipe, index) => {
      if (index === 0) return; // Ignore la première recette (index 0)

      // Créer un élément de carte pour la recette
      let card = document.createElement("div");
      card.style.border = "1px solid #ccc";
      card.style.padding = "15px";
      card.style.borderRadius = "8px";
      card.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      card.style.backgroundColor = "#f9f9f9";

      // Séparer le titre de la recette et les ingrédients
      let lines = recipe.split("\n");
      let title = lines[0]; // Le premier élément est le titre
      let ingredients = lines
        .slice(1)
        .map((line) => `<li>${line.trim().replace("- ", "")}</li>`)
        .join("");

      // Créer la structure HTML pour chaque recette
      card.innerHTML = `
            <h3 style="margin: 0; font-size: 1.5em;">${title}</h3>
            <ul style="padding-left: 20px; font-size: 1em; margin-top: 10px;">${ingredients}</ul>
        `;

      // Ajouter la carte au container
      container.appendChild(card);
    });

    return container;
  }

  // Ajouter un ingrédient à la liste
  addButton.addEventListener("click", function () {
    const ingredient = ingredientInput.value.trim();
    if (ingredient) {
      ingredients.push(ingredient);

      // Ajouter l'ingrédient à la liste affichée
      const li = document.createElement("li");
      li.textContent = ingredient;
      ingredientsList.appendChild(li);

      ingredientInput.value = ""; // Réinitialiser le champ
    }
  });

  // Envoyer les ingrédients au serveur
  sendButton.addEventListener("click", function () {
    fetch("/ingredients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingredients),
    })
      .then((response) => response.text()) // Récupérer la réponse en JSON
      .then((data) => {
        let recipesContainer = formatRecipes(data);
        document
          .getElementById("recipes-display")
          .appendChild(recipesContainer);
      });
  });
});
