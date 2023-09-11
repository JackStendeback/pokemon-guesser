// * Importing my gifs array from gifs.js, to help with modularization within my file structure.
import { gifs } from './gifs.js';
import { setInitialTheme } from './themes.js';
import { toggleTheme } from './themes.js';

document.addEventListener("DOMContentLoaded", () => {
  const pokemonImage = document.getElementById("pokemonImage");
  const scoreElement = document.getElementById("score");
  const scoreList = document.getElementById("scoreList");
  const themeToggle = document.getElementById("theme-toggle");

// ! Theme Toggle Stuff

themeToggle.innerText = 'Click Me';
// Set initial background color and text based on theme
themeToggle.style.backgroundColor = '#8E4585';
// Log current theme
console.log(localStorage.getItem("theme"));
// Change color when hovered over
themeToggle.addEventListener('mouseenter', function() {
  themeToggle.style.backgroundColor = '#9F5090';  // A slightly different purple
});
// Revert to original color when hover ends
themeToggle.addEventListener('mouseleave', function() {
  themeToggle.style.backgroundColor = '#8E4585';  // Original purple
});
// Add click event listener
themeToggle.addEventListener("click", () => toggleTheme(themeToggle));

// ! Theme Toggle Stuff

  window.addEventListener("load", function() {
    // Assuming that generationButtons is already defined and is a NodeList or array
    generationButtons.forEach(function(button) {
      button.style.display = 'none';
    });
  
    // Show the buttons after 3 seconds
    setTimeout(function() {
      generationButtons.forEach(function(button) {
        button.style.display = 'block';
      });
    }, 3000);
  });

  const result = document.getElementById("result");

  setInitialTheme();

  let currentGeneration = null;
  let score = 0;
  let consecutiveCorrectAnswers = 0;
  const scoreIncreasePerCorrectAnswer = 5; // Initial score increase
  let incorrectTries = 0;
  let allScores = [];

  const updateScore = () => {
    consecutiveCorrectAnswers++;
    score += scoreIncreasePerCorrectAnswer * consecutiveCorrectAnswers;
    scoreElement.textContent = "Score: " + score;
  };

  // Function to reset the consecutive correct answers and score on incorrect answer
  const resetConsecutiveCorrectAnswers = () => {
    consecutiveCorrectAnswers = 0;
  };

  const updateLeaderboard = () => {
    allScores.sort((a, b) => b.score - a.score);
    scoreList.innerHTML = '';

    // Display only the top 5 highest scores
    const top5Scores = allScores.slice(0, 5);

    for (const scoreWithUser of top5Scores) {
      const newScoreItem = document.createElement("li");
      newScoreItem.textContent = `${scoreWithUser.name}: ${scoreWithUser.score}`;
      scoreList.appendChild(newScoreItem);
    }

    // Store the leaderboard in local storage
    localStorage.setItem("leaderboard", JSON.stringify(allScores));
  };

  const resetGame = () => {
    const username = prompt("You've reached 5 incorrect guesses! Enter your name to submit your score:");

    if (username && username.trim() !== "") {
      allScores.push({ name: username.trim(), score: score });
      updateLeaderboard();
    } else {
      alert("No username entered. Your score will not be recorded.");
    }

    // Reset the score to 0
    score = -5;
    consecutiveCorrectAnswers = 0; // Reset consecutive correct answers
    incorrectTries = 0;
    updateScore(); // Update the displayed score

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

    const randomGifIndex = Math.floor(Math.random() * gifs.length);
    pokemonImage.src = gifs[randomGifIndex];

    // Delay for 3 seconds
    setTimeout(async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomID}/`);
      const data = await response.json();
      pokemonImage.src = data.sprites.front_default;

      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      const generationString = speciesData.generation.name.split("-")[1].toUpperCase();
      currentGeneration = romanToInt(generationString);

      // Load the leaderboard from local storage if it exists
      const leaderboardData = localStorage.getItem("leaderboard");
      if (leaderboardData) {
        allScores = JSON.parse(leaderboardData);
        updateLeaderboard();
      }
    }, 2500); // * 2 Second Delay Between Guesses
  };

  // ? This is the fetch that occurs during a page refresh, so this is neccessary.
  fetchRandomPokemon();

  // * I need to find a way to hide the generationButtons for 2.5 seconds after click event occurs, but to still have time to show
  // * If the user got the answer correct, to prevent multiple clicks during gif 2.5s process.
  const generationButtons = document.querySelectorAll(".generation-button");

generationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const userGuess = parseInt(button.getAttribute("data-generation"), 10);

    if (userGuess === currentGeneration) {
      result.textContent = "Correct! It's from generation " + currentGeneration;
      result.classList.remove("wrong");
      result.classList.add("correct");
      updateScore(); // Only update the score for correct answers
    } else {
      result.textContent = "Wrong! The correct generation is " + currentGeneration;
      result.classList.remove("correct");
      result.classList.add("wrong");
      resetConsecutiveCorrectAnswers();
      incorrectTries++;

      if (incorrectTries >= 5) {
        resetGame();
      }
    }
    // Function to hide Gen buttons for 2.5 seconds
    // * Changed this from an arrow function into a function declaration so I am able to call it higher up in the script.
    function hideGenButtons() {
      generationButtons.forEach(function(button) {
        button.style.display = 'none';
      });
    
      setTimeout(function() {
        generationButtons.forEach(function(button) {
          button.style.display = 'block';
        });
      }, 3000);
    }

    hideGenButtons();  // * Execute the function to hide the buttons for 3 seconds.
    fetchRandomPokemon();
  });
});
});