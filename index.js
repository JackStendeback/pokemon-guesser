document.addEventListener("DOMContentLoaded", () => {
    const pokemonImage = document.getElementById("pokemonImage");
    const guessForm = document.getElementById("guessForm");
    const result = document.getElementById("result");
    const scoreElement = document.getElementById("score");
    const scoreList = document.getElementById("scoreList");
  
    let currentGeneration = null;
    let score = 0;
    let incorrectTries = 0;
    let allScores = [];
  
    const updateScore = () => {
      scoreElement.textContent = "Score: " + score;
    };
  
    const updateLeaderboard = () => {
      allScores.sort((a, b) => b.score - a.score);
      scoreList.innerHTML = '';
      for (const scoreWithUser of allScores) {
        const newScoreItem = document.createElement("li");
        newScoreItem.textContent = `${scoreWithUser.name}: ${scoreWithUser.score}`;
        scoreList.appendChild(newScoreItem);
      }
    };
  
    const resetGame = () => {
      const username = prompt("You've reached 5 incorrect guesses! Enter your name to submit your score:");
  
      if (username && username.trim() !== "") {
        allScores.push({name: username.trim(), score: score});
        updateLeaderboard();
      } else {
        alert("No username entered. Your score will not be recorded.");
      }
  
      score = 0;
      incorrectTries = 0;
      updateScore();
      fetchRandomPokemon();
    };
  
    function romanToInt(roman) {
      const romanNumerals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let total = 0;
      for (let i = 0; i < roman.length; i++) {
        const current = romanNumerals[roman[i]];
        const next = romanNumerals[roman[i + 1]];
        if (next && next > current) {
          total += next - current;
          i++;
        } else {
          total += current;
        }
      }
      return total;
    }
  
    const fetchRandomPokemon = async () => {
      const randomID = Math.floor(Math.random() * 898) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomID}/`);
      const data = await response.json();
      pokemonImage.src = data.sprites.front_default;
  
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      const generationString = speciesData.generation.name.split("-")[1].toUpperCase();
      currentGeneration = romanToInt(generationString);
    };
  
    fetchRandomPokemon();
  
    guessForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userGuess = parseInt(document.getElementById("generation").value, 10);
  
      if (userGuess < 1 || userGuess > 8) {
        result.textContent = "Please enter a number between 1 and 8.";
        return;
      }
  
      if (userGuess === currentGeneration) {
        result.textContent = "Correct! It's from generation " + currentGeneration;
        score += 10;
      } else {
        result.textContent = "Wrong! The correct generation is " + currentGeneration;
        score -= 5;
        incorrectTries++;
  
        if (incorrectTries >= 5) {
          resetGame();
        }
      }
  
      updateScore();
      fetchRandomPokemon();
    });
  
  fetchRandomPokemon();
});