function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-mode");

  // Store the user's preference in local storage
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const pokemonImage = document.getElementById("pokemonImage");
  const scoreElement = document.getElementById("score");
  const scoreList = document.getElementById("scoreList");
  const themeToggle = document.getElementById("theme-toggle");
  const result = document.getElementById("result"); // Added this line for result display

  // Function to set the initial theme based on user preference or system settings
  function setInitialTheme() {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (localStorage.getItem("theme") === "dark" || (prefersDarkMode && !localStorage.getItem("theme"))) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  setInitialTheme(); // Call the function to set the initial theme

  // Function to toggle between light and dark modes

  // Add click event listener to the theme toggle button
  themeToggle.addEventListener("click", toggleTheme);

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
      allScores.push({ name: username.trim(), score: score });
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

  // Add click event listener to the generation buttons
  const generationButtons = document.querySelectorAll(".generation-button");

  generationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const userGuess = parseInt(button.getAttribute("data-generation"), 10);

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
  });

  fetchRandomPokemon();
});