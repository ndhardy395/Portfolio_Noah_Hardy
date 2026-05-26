const emailButtons = document.querySelectorAll("[data-copy-email]");

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

emailButtons.forEach((emailButton) => {
  const originalMarkup = emailButton.innerHTML;

  emailButton.addEventListener("click", async () => {
    const email = emailButton.dataset.copyEmail;

    try {
      await copyText(email);
      const strongLabel = emailButton.querySelector("strong");
      if (strongLabel) {
        strongLabel.textContent = "Email copied";
      } else {
        emailButton.textContent = "Email copied";
      }
      emailButton.classList.add("is-copied");
    } catch {
      const strongLabel = emailButton.querySelector("strong");
      if (strongLabel) {
        strongLabel.textContent = email;
      } else {
        emailButton.textContent = email;
      }
    }

    window.setTimeout(() => {
      emailButton.innerHTML = originalMarkup;
      emailButton.classList.remove("is-copied");
    }, 2200);
  });
});

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const images = gallery.dataset.gallery.split("|").filter(Boolean);
  const image = gallery.querySelector("img");
  const button = gallery.querySelector(".gallery-button");
  let index = 0;

  if (!image || !button || images.length < 2) {
    return;
  }

  button.addEventListener("click", () => {
    index = (index + 1) % images.length;
    image.src = images[index];
    button.textContent = `${index + 1}/${images.length}`;
  });
});

const lightbox = document.querySelector("#image-lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCount = lightbox?.querySelector(".lightbox-count");
const lightboxPrev = lightbox?.querySelector("[data-lightbox-prev]");
const lightboxNext = lightbox?.querySelector("[data-lightbox-next]");
let lightboxImages = [];
let lightboxIndex = 0;

function renderLightbox() {
  if (!lightbox || !lightboxImage || !lightboxCount) {
    return;
  }

  lightboxImage.src = lightboxImages[lightboxIndex];
  lightboxImage.alt = "Full-size project screenshot";
  lightboxCount.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;

  const hasMultipleImages = lightboxImages.length > 1;
  lightboxPrev.hidden = !hasMultipleImages;
  lightboxNext.hidden = !hasMultipleImages;
}

function openLightbox(images, index) {
  if (!lightbox || !images.length) {
    return;
  }

  lightboxImages = images;
  lightboxIndex = index;
  renderLightbox();
  lightbox.hidden = false;
  document.body.classList.add("is-lightbox-open");
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("is-lightbox-open");
}

function moveLightbox(step) {
  lightboxIndex = (lightboxIndex + step + lightboxImages.length) % lightboxImages.length;
  renderLightbox();
}

document.querySelectorAll(".project-card img").forEach((image) => {
  image.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const gallery = image.closest("[data-gallery]");
    const images = gallery ? gallery.dataset.gallery.split("|").filter(Boolean) : [image.src];
    const index = Math.max(0, images.indexOf(image.getAttribute("src")));
    openLightbox(images, index);
  });
});

lightbox?.querySelectorAll("[data-lightbox-close]").forEach((control) => {
  control.addEventListener("click", closeLightbox);
});

lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
lightboxNext?.addEventListener("click", () => moveLightbox(1));

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft" && lightboxImages.length > 1) moveLightbox(-1);
  if (event.key === "ArrowRight" && lightboxImages.length > 1) moveLightbox(1);
});
