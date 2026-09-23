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

// Share the canonical page URL through the device share sheet. Browsers that
// do not expose the Web Share API fall back to copying the link.
(function () {
  const shareButtons = document.querySelectorAll(".hextra-share-button");

  async function copyToClipboard(value) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();

    const copied = document.execCommand("copy");
    textArea.remove();
    if (!copied) throw new Error("Clipboard copy failed");
  }

  function showStatus(button, state, message) {
    const status = button.nextElementSibling;
    window.clearTimeout(button.shareStatusTimeout);
    button.dataset.state = state;
    status.textContent = message;
    button.shareStatusTimeout = window.setTimeout(() => {
      delete button.dataset.state;
      status.textContent = "";
    }, 2000);
  }

  shareButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const shareData = {
        title: button.dataset.shareTitle,
        url: button.dataset.shareUrl,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (error) {
          if (error.name === "AbortError") return;
        }
      }

      try {
        await copyToClipboard(shareData.url);
        showStatus(button, "copied", button.dataset.copiedLabel);
      } catch (_error) {
        showStatus(button, "error", button.dataset.errorLabel);
      }
    });
  });
})();
