// Light / Dark theme toggle (single button — no "system" option in the UI).
// "system" remains the default for first-time visitors (set via head.html);
// clicking the toggle commits an explicit "light" or "dark" preference.
(function () {
  const defaultTheme = '{{ site.Params.theme.default | default `system` }}';

  const themeToggleButtons = document.querySelectorAll(".hextra-theme-toggle");

  function resolveTheme(theme) {
    if (theme === "light" || theme === "dark") return theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function storedTheme() {
    return "color-theme" in localStorage ? localStorage.getItem("color-theme") : defaultTheme;
  }

  function updateButtons(resolved) {
    themeToggleButtons.forEach((btn) => (btn.parentElement.dataset.theme = resolved));
  }

  function commitTheme(theme) {
    setTheme(theme);
    localStorage.setItem("color-theme", theme);
    updateButtons(resolveTheme(theme));
  }

  // head.html already applied the theme class to avoid FOUC; just sync the icons.
  updateButtons(resolveTheme(storedTheme()));

  themeToggleButtons.forEach((toggler) => {
    toggler.addEventListener("click", function (e) {
      e.preventDefault();
      const current = resolveTheme(storedTheme());
      commitTheme(current === "dark" ? "light" : "dark");
    });
  });

  // While the preference is still "system", follow OS theme changes.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (storedTheme() === "system") {
      setTheme("system");
      updateButtons(resolveTheme("system"));
    }
  });
})();
