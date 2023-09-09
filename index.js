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
      'https://media.tenor.com/CeiYlOyw55oAAAAj/pokemon-pixel-art.gif',
      'https://media.tenor.com/kCxKQPlvR0cAAAAj/pokemon.gif',
      'https://media.tenor.com/TzmXI2XDJuEAAAAj/maril-pokemon.gif',
      'https://media.tenor.com/PrAs4Q8lV54AAAAj/furret-happy.gif',
      'https://media.tenor.com/8CRuK01WKcMAAAAj/pokemon-pikachu.gif',
      'https://media.tenor.com/FvFAZLdNAnkAAAAj/simisage-shiny-simisage.gif',
      'https://media.tenor.com/4K2_dLLq-pwAAAAj/charmander-chases-tail.gif',
      'https://media.tenor.com/fmq6j6VkFwUAAAAj/spheal-spheal-pokemon.gif',
      'https://media.tenor.com/ksrXvJ5a9XEAAAAj/yveltal-pokemon-xy.gif',
      'https://media.tenor.com/QsR5hCUZXXgAAAAj/mimikyu-aesthetic.gif',
      'https://media.tenor.com/1r1AOFqPg5oAAAAj/flying-pikachu-transparent-balloon-pikachu.gif',
      'https://media.tenor.com/lr6evdW49pcAAAAj/totodile-pokemon.gif',
      'https://media.tenor.com/DBuccIlXTCEAAAAj/pokemon-crasher-wake.gif',
      'https://media.tenor.com/2kfnMx1LFoQAAAAj/pokemon-umbreon.gif',
      'https://media.tenor.com/dnWAp31CgmsAAAAj/lugia-pokemon.gif',
      'https://media.tenor.com/or7dYahB5t8AAAAj/pikachu-pokemon.gif',
      'https://media.tenor.com/tEJ08WIj9lcAAAAj/charizard-pokemon-charizard.gif',
      'https://media.tenor.com/3Qj2zvHVl40AAAAj/snorlax-sleeping.gif',
      'https://media.tenor.com/0GRl16naN8YAAAAj/pokemon-nintendo.gif',
      'https://media.tenor.com/hzVy-nB15DoAAAAj/music-pokemon.gif',
      'https://media.tenor.com/GfzFmhWoWdMAAAAj/pikachu-run.gif',
      'https://media.tenor.com/1mw3bna7DccAAAAj/armaldo-pok%C3%A9mon-armaldo.gif',
      'https://media.tenor.com/gqrozSetSvoAAAAj/sprite-pokemon.gif',
      'https://media.tenor.com/Kal1GGUVeD8AAAAj/shiny-charmeleon-pokemon.gif',
      'https://media.tenor.com/Ebufw1twfFIAAAAj/bronzong-bronzor.gif',
      'https://media.tenor.com/SbCYyNZXhhcAAAAj/raichu-happy.gif',
      'https://media.tenor.com/lv9hpaXqXu4AAAAj/sprite-pokemon.gif',
      'https://media.tenor.com/fQ4Up-08a2MAAAAj/pokemon-leafeon.gif',
      'https://media.tenor.com/XlMe6e3sSY0AAAAj/pokemon-pokemon-gen5.gif',
      'https://media.tenor.com/Da4LECXrrgkAAAAj/pokemon-arcanine.gif',
      'https://media.tenor.com/AFAWzUb_qP4AAAAj/pokemon-flareon.gif',
      'https://media.tenor.com/rW10vmnkejoAAAAj/pokemon-buneary.gif',
      'https://media.tenor.com/upy0CZ6C0I0AAAAj/eevee-pokemon.gif',
      'https://media.tenor.com/jQVquc_t1-kAAAAj/dugtrio-pokemon.gif',
      'https://media.tenor.com/EWuYRdEBqLkAAAAj/prosecutor-prosecut0r.gif',
      'https://media.tenor.com/fPy5h_wW5IQAAAAj/torchic-pokemon.gif',
      'https://media.tenor.com/i9B0jt7sIToAAAAj/pokemon.gif',
      'https://media.tenor.com/j_7hBOVj_S8AAAAj/shaymin-pokemon.gif',
      'https://media.tenor.com/2r3Ub1sj-M8AAAAj/picachu.gif',
      'https://media.tenor.com/c1bTbi47HuEAAAAj/pikachu-kanahei.gif',
      'https://media.tenor.com/aauAESZ3cTIAAAAj/pokemon.gif',
      'https://media.tenor.com/-6naFQxWxG0AAAAj/pokemon-gengar.gif',
      'https://media.tenor.com/byVUQrJnFGQAAAAj/pokemon-jolteon.gif',
      'https://media.tenor.com/tvr8PaFAvr8AAAAj/clay-pokemon.gif',
      'https://media.tenor.com/obN3ZIDBAD8AAAAj/pok%C3%A9mon-lugulabre-shiny.gif',
      'https://media.tenor.com/4eBTewwQyt8AAAAj/quagsire-quag.gif',
      'https://media.tenor.com/lNvvMluzI0QAAAAj/charizard-pokemon.gif',
      'https://media.tenor.com/Q3Iks96Pn64AAAAj/iris-pokemon.gif',
      'https://media.tenor.com/2jgkHvq13g0AAAAj/misdreavus-gold.gif',
      'https://media.tenor.com/Itc32ImvUW0AAAAj/craig.gif',
      'https://media.tenor.com/rTUcYxiUem8AAAAj/suicune-pokemon.gif',
      'https://media.tenor.com/JJKM5ewBqSYAAAAj/blaine-pokemon-radical-red.gif',
      'https://media.tenor.com/lzG4tNAbJhYAAAAj/pokemon-rotom.gif',
      'https://media.tenor.com/FgjFLYdUJ30AAAAj/froakie-pokemon.gif',
      'https://media.tenor.com/mUMECLNPNSEAAAAj/octillery-octopus.gif',
      'https://media.tenor.com/R29umFwZh5gAAAAj/torde-palpitoad.gif',
      'https://media.tenor.com/WP7Y2IWIChQAAAAj/pokemon-pokememes-frikoid-cute-funny-lileep-yes-yesyesyes-yesyes.gif',
      'https://media.tenor.com/rQlLsMnFj3IAAAAj/primeape-pokemon.gif',
      'https://media.tenor.com/mMl5Q9sAYLoAAAAj/scizor.gif',
      'https://media.tenor.com/GIyYKhIPVRQAAAAj/nidoking-nidoqueen.gif',
      'https://media.tenor.com/a7Wi8j3rYmEAAAAj/pokemon-legendary.gif',
      'https://media.tenor.com/pW8D2Mxaod0AAAAj/ghetsis-pokemon.gif',
      'https://media.tenor.com/pJ4Ufj_JlngAAAAj/dance-moves.gif',
      'https://media.tenor.com/zOasP5PZ80kAAAAj/plusle-minun.gif',
      'https://media.tenor.com/CzwinPzN9nQAAAAj/scorbunny-cute.gif',
      'https://media.tenor.com/2yzvgWyZK7kAAAAj/animation-pixel-art.gif',
      'https://media.tenor.com/LbZrWjrahKsAAAAj/cinderace.gif',
      'https://media.tenor.com/B5oRa2uSYfEAAAAj/notlikeduck-duck.gif',
      'https://media.tenor.com/ZneZ0AkjHSUAAAAj/bw2-rosa.gif',
      'https://media.tenor.com/u0LicYPDHX0AAAAj/furret.gif',
      'https://media.tenor.com/fmvhNwUbfOsAAAAj/spheal-pokemon.gif',
      'https://media.tenor.com/b7mLfFBxtD4AAAAj/piplup.gif',
      'https://media.tenor.com/omg3YGVdUm4AAAAj/empoleon-impoleon.gif',
      'https://media.tenor.com/JtywcWsWnGMAAAAj/pok%C3%A9mon.gif',
      'https://media.tenor.com/Vf_Zf6tx_CAAAAAj/durant-pokemondurant.gif',
      'https://media.tenor.com/rHzyCjzAVKcAAAAj/porygon-shiny-porygon.gif',
      'https://media.tenor.com/_vZ6G0GfrnQAAAAj/nidorino-pokemon.gif'

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
    const hideGenButtons = () => {
      generationButtons.forEach((button) => {
        button.style.display = 'none';
      });

      setTimeout(() => {
        generationButtons.forEach((button) => {
          button.style.display = 'block';
        });
      }, 3000);
    }

    hideGenButtons();  // * Execute the function to hide the buttons for 2.5 seconds.
    fetchRandomPokemon();
  });
});
  // ? This was calling the function twice, potentially having it reload the pokemon selection twice, instead of only once as intended.
  // fetchRandomPokemon();
});

const themeToggle = document.getElementById("theme-toggle");
themeToggle.textContent = document.body.classList.contains("dark-mode") ? "Toggle Light Mode" : "Toggle Dark Mode";