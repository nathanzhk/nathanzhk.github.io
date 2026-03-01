(function () {
  const trigger = document.querySelector(".skills-game-invite__trigger");
  const modal = document.querySelector("#skills-game-modal");

  if (!trigger || !modal) {
    return;
  }

  let previousFocus = null;

  const openModal = () => {
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("skills-game-modal-open");

    const closeButton = modal.querySelector(".skills-game-modal__close");
    closeButton?.focus();

    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("skills-game-modal-open");
    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  };

  trigger.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    openModal();
  });

  trigger.addEventListener("click", () => {
    if (modal.hidden) {
      openModal();
    }
  });

  modal.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-skills-game-close]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
})();
