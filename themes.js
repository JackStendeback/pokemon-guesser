// * Modularizing functions relating to themes. (Settings & Toggles)
// Function to toggle between light and dark modes
let firstClick = true;  // Initialize a flag outside of your function

export function toggleTheme(themeToggle) {
  const body = document.body;
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  if (firstClick) {
    themeToggle.textContent = body.classList.contains("dark-mode") ? "Toggle Light Mode" : "Toggle Dark Mode";
    firstClick = false;
    return;
  }

  themeToggle.textContent = body.classList.contains("dark-mode") ? "Toggle Light Mode" : "Toggle Dark Mode";
}

  export function setInitialTheme(themeClassName = 'dark-mode', storageKey = 'theme') {
    const body = document.body;
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem(storageKey);
  
    if (storedTheme === 'dark' || (prefersDarkMode && !storedTheme)) {
      body.classList.add(themeClassName);
    } else {
      body.classList.remove(themeClassName);
    }
  }