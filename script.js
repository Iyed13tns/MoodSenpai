function generateAnime() {
    const input = document.getElementById('moodInput').value.toLowerCase();
    let anime = "";
    let description = "";
  
    if (input.includes("triste") || input.includes("nostalgique")) {
      anime = "Your Lie in April";
      description = "Un chef-d'œuvre émouvant sur la musique, l'amour et la perte.";
    } else if (input.includes("motivé") || input.includes("déterminé")) {
      anime = "My Hero Academia";
      description = "Un animé inspirant plein d'action et de dépassement de soi.";
    } else if (input.includes("amour") || input.includes("coeur") || input.includes("romance")) {
      anime = "Toradora!";
      description = "Une comédie romantique pleine de tendresse et de rebondissements.";
    } else if (input.includes("colère") || input.includes("rage")) {
      anime = "Attack on Titan";
      description = "Un monde brutal où les héros se battent pour leur liberté.";
    } else {
      anime = "One Piece";
      description = "Une aventure épique avec des amis fidèles et beaucoup d'émotions.";
    }
  
    document.getElementById('result').innerHTML = `
      <h2>${anime}</h2>
      <p>${description}</p>
    `;
  }
  