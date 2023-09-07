// Function to toggle between light and dark modes
function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  themeToggle.textContent = body.classList.contains("dark-mode") ? "Toggle Light Mode" : "Toggle Dark Mode";
}

document.addEventListener("DOMContentLoaded", () => {
  const pokemonImage = document.getElementById("pokemonImage");
  const scoreElement = document.getElementById("score");
  const scoreList = document.getElementById("scoreList");
  const themeToggle = document.getElementById("theme-toggle");
  const result = document.getElementById("result");

  function setInitialTheme() {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (localStorage.getItem("theme") === "dark" || (prefersDarkMode && !localStorage.getItem("theme"))) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  setInitialTheme();

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

    // Display only the top 5 highest scores
    const top5Scores = allScores.slice(0, 5);

    for (const scoreWithUser of top5Scores) {
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

    // * Choose a random GIF from the array
    const gifs = [
      'https://media.tenor.com/29p75Sk-P8EAAAAM/pikachu-pokemon.gif',
      'https://media.tenor.com/-UySwvEyDMMAAAAi/bulbasaur-pokemon.gif',
      'https://media.tenor.com/3sJ4Qpyio-QAAAAM/wooper-pokemon.gif',
      'https://media.tenor.com/NHk1vFM59h0AAAAM/jolton-pokemon.gif',
      'https://media.tenor.com/ezOoD-uw_0wAAAAM/pokemon-cute.gif',
      'https://media.tenor.com/52I7tEtSoH8AAAAM/purugly-pokemon.gif',
      'https://media.tenor.com/cQtoIIrpSxQAAAAj/pokemon-mudkip.gif',
      'https://media.tenor.com/Pwn9ZYb7C2QAAAAj/gengar-pokemon.gif',
      'https://media.tenor.com/DrdU6bRAfusAAAAj/bulbasaur-pokemon.gif',
      'https://media.tenor.com/ukCijpKsjhEAAAAj/pokemon-venusaur.gif',
      'https://media.tenor.com/2KcqhP4elWkAAAAj/drifblim-drifloon.gif',
      'https://media.tenor.com/YvAZ_CtrtlMAAAAj/espeon.gif',
      'https://media.tenor.com/R-IQmr-QVTYAAAAj/darkrai-pok%C3%A9mon-darkrai.gif',
      'https://media.tenor.com/Uc1_BQNb7O8AAAAj/sylveon-pixell.gif',
      'https://media.tenor.com/IBWoFq2aazQAAAAj/amazing-wow.gif',
      'https://media.tenor.com/FfHjNfODLkgAAAAj/buizel-pokemon.gif',
      'https://media.tenor.com/40q2xXN6gfMAAAAj/meowth-pokemon.gif',
      'https://media.tenor.com/F_Pp03QwWaIAAAAj/water.gif',
      'https://media.tenor.com/pBM7dzGyfokAAAAj/snorlax-pixel.gif',
      'https://media.tenor.com/gjxJnAFTKNAAAAAj/hoean-staters-pokemon.gif',
      'https://media.tenor.com/HFotit6PSgUAAAAj/timotainmental-playin-piano.gif',
      'https://media.tenor.com/IgUGgEFr_o4AAAAj/supermegaespecifictag.gif',
      'https://media.tenor.com/tnR5ShiNRyIAAAAj/multiple-colors-cute-pony.gif',
      'https://media.tenor.com/gxvJFh-wA88AAAAj/cuphead.gif',
      'https://media.tenor.com/y6ko93COrOQAAAAj/reshiram-pokemon-reshiram.gif',
      'https://media.tenor.com/Q1GffEXQrgAAAAAj/cyndaquil-pokemon.gif',
      'https://media.tenor.com/WkesrjxP9rAAAAAj/pokemon-pikachu.gif',
      'https://media.tenor.com/gZXUDhpuZR4AAAAj/keckleon-being-sick.gif',
      'https://media.tenor.com/TnD8y7cA2uIAAAAj/pokemon-cynthia.gif',
      'https://media.tenor.com/FH4xWxbhf2kAAAAj/pokemon.gif',
      'https://media.tenor.com/X_xh7_GIN9YAAAAj/rojo-pokemon.gif',
      'https://media.tenor.com/4zAQPJNQKxAAAAAj/barry-pokemon.gif',
      'https://media.tenor.com/vdV8xin-290AAAAj/haxorus-pokemon.gif',
      'https://media.tenor.com/Xuxf8MjsCvkAAAAj/magikarp-pokemon.gif',
      'https://media.tenor.com/WIwUWwq6JpUAAAAj/pokemon-dragonite.gif',
      'https://media.tenor.com/WdulATnpfMQAAAAj/vapoeron-danceing.gif',
      'https://media.tenor.com/o7WxPa0RpkUAAAAj/pikachu.gif',
      'https://media.tenor.com/pZlKyUDs0RgAAAAj/pokemon-nintendo.gif',
      'https://media.tenor.com/iGSsICUR-2oAAAAj/mewtwo-sprite.gif',
      'https://media.tenor.com/ptl9U5YvK_wAAAAj/shiny-charizard-fire.gif',
      'https://media.tenor.com/gPI9EkLBgkIAAAAj/pokemon-piplup.gif',
      'https://media.tenor.com/VjjL8PS5Z3MAAAAj/charmander-ian-boschero.gif',
      'https://media.tenor.com/EAAxkwW71WcAAAAj/pokemon-pokemon-black-and-white.gif',
      'https://media.tenor.com/qycQatpHyVkAAAAj/vaporeon-pokemon.gif',
      'https://media.tenor.com/jwHkGGFNoH8AAAAj/shiny-charmander-pokemon.gif',
      'https://media.tenor.com/CeiYlOyw55oAAAAj/pokemon-pixel-art.gif'
    ];
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
    }, 2500); // * 2 Second Delay Between Guesses
  };

  fetchRandomPokemon();

  const generationButtons = document.querySelectorAll(".generation-button");

  generationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const userGuess = parseInt(button.getAttribute("data-generation"), 10);

      if (userGuess === currentGeneration) {
        result.textContent = "Correct! It's from generation " + currentGeneration;
        result.classList.remove("wrong");
        result.classList.add("correct");
        score += 10;
      } else {
        result.textContent = "Wrong! The correct generation is " + currentGeneration;
        result.classList.remove("correct");
        result.classList.add("wrong");
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

const themeToggle = document.getElementById("theme-toggle");
themeToggle.textContent = document.body.classList.contains("dark-mode") ? "Toggle Light Mode" : "Toggle Dark Mode";