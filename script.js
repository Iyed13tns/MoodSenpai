document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("searchBtn");
    const input = document.getElementById("moodInput");
    const result = document.getElementById("result");
    const themeToggle = document.getElementById("themeToggle");
  
    console.log("Le DOM est chargé.");
  
    // Lancer la recherche en appuyant sur la touche Entrée
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        button.click();
      }
    });
  
    // Gestion du changement de thème (dark/light)
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light");
      document.body.classList.toggle("dark");
      console.log("Changement de thème.");
    });
  
    // Fonction pour classifier le texte saisi via zero-shot classification
    async function classifyInput(text) {
      const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
      const TOKEN = "YOUR_HUGGINGFACE_TOKEN";  // Remplace par ton token Hugging Face
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
          },
          body: JSON.stringify({
            inputs: text,
            parameters: {
              // Liste des genres candidats – tu peux bien évidemment la modifier selon tes besoins.
              candidate_labels: ["action", "romance", "comedy", "drama", "horror", "fantasy", "slice of life"]
            }
          })
        });
        const data = await response.json();
        console.log("Classification Data:", data);
        
        if (data && data.labels && data.scores) {
          // Récupérer le label avec le score le plus élevé
          let maxScore = -1;
          let bestLabel = "";
          for (let i = 0; i < data.labels.length; i++) {
            if (data.scores[i] > maxScore) {
              maxScore = data.scores[i];
              bestLabel = data.labels[i];
            }
          }
          return bestLabel;
        }
        return text; // En cas d'erreur, retourne le texte original
      } catch (err) {
        console.error("Erreur lors de la classification:", err);
        return text;
      }
    }
  
    button.addEventListener("click", async () => {
      const userInput = input.value.trim();
      console.log("Recherche lancée pour :", userInput);
      
      if (!userInput) {
        result.innerHTML = "<p>Veuillez entrer une phrase ou un mot-clé valide.</p>";
        return;
      }
  
      // Affichage d'un spinner pendant le chargement
      result.innerHTML = '<div class="spinner"></div>';
      button.disabled = true;
  
      // Utiliser la classification pour comprendre le contenu de la phrase
      const classification = await classifyInput(userInput);
      console.log("Classification label:", classification);
      
      // On utilise le label obtenu comme mot-clé de recherche
      const searchKeyword = classification;
      console.log("Recherche avec le mot-clé:", searchKeyword);
  
      try {
        const apiUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchKeyword)}&limit=3`;
        console.log("Appel de l'URL :", apiUrl);
        const res = await fetch(apiUrl);
        const data = await res.json();
        console.log("Données reçues de Jikan :", data);
  
        if (data.data && data.data.length > 0) {
          result.innerHTML = "";
          data.data.forEach(animeItem => {
            const card = document.createElement("div");
            card.classList.add("anime-card");
            card.innerHTML = `
              <h2>${animeItem.title}</h2>
              <p>${animeItem.synopsis ? animeItem.synopsis.substring(0, 200) + "..." : "Pas de description."}</p>
              <img src="${animeItem.images.jpg.image_url}" alt="${animeItem.title}">
              <a href="${animeItem.url}" target="_blank">Voir sur MyAnimeList</a>
            `;
            result.appendChild(card);
          });
  
          // Animation des cartes grâce à Anime.js
          anime({
            targets: '.anime-card',
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(100), // décalage entre chaque carte
            easing: 'easeOutElastic(1, .6)'
          });
        } else {
          result.innerHTML = "<p>Aucun résultat trouvé pour ce mot-clé.</p>";
        }
      } catch (err) {
        result.innerHTML = `<p>Erreur : ${err.message}</p>`;
        console.error("Erreur lors de l'appel à l'API Jikan :", err);
      }
      
      button.disabled = false;
    });
  });
  