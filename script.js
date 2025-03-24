// Global flag for index page
const isIndexPage =
  window.location.pathname === "/" ||
  window.location.pathname.endsWith("index.html");

// Initialize AOS
AOS.init({
  duration: 300,
  easing: "ease-in-out",
  once: true,
  mirror: true,
  offset: -100,
});

// Animate flagText spans with GSAP
const flagText = document.querySelectorAll(".flag-text span");
if (flagText.length > 0) {
  gsap.to(flagText, {
    y: 20,
    rotation: 10,
    ease: "sine.inOut",
    stagger: {
      each: 0.1,
      yoyo: true,
      repeat: -1,
    },
    duration: 1.5,
  });
}

// Disable automatic scroll restoration
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.onload = () => {
  if (isIndexPage) {
    // On index page: clear the flag so the full animation runs.
    localStorage.removeItem("skipAnimation");
    window.scrollTo(0, 0);
    if (window.innerWidth <= 768) {
      initializeScrollTriggers();
      animateLogoAndNav();
      ScrollTrigger.refresh();
    } else {
      Promise.all([
        document.fonts.ready,
        new Promise((resolve) => {
          const video = document.querySelector("video");
          if (video && video.readyState >= 3) resolve();
          else if (video) video.addEventListener("loadeddata", resolve);
          else resolve();
        }),
      ]).then(() => {
        initializeScrollTriggers();
        animateLogoAndNav();
        ScrollTrigger.refresh();
      });
    }
  } else {
    // On non-index pages: set the flag and immediately skip the animation.
    localStorage.setItem("skipAnimation", "true");
    skipToFixedHeaderState();
  }
};

function skipToFixedHeaderState() {
  const videoSection = document.querySelector("#video-section");
  const header = document.querySelector("header");
  const projectsSection = document.querySelector("#projects");

  if (videoSection) {
    videoSection.style.position = "relative";
    videoSection.style.top = "0";
    videoSection.style.width = "100%";
    // Use 50vh as in the original non-animation state
    videoSection.style.height = "50vh";
    videoSection.style.zIndex = "100";
  }
  if (header) {
    header.style.position = "relative";
    header.style.top = "0";
    header.style.width = "100%";
    header.style.zIndex = "101";
  }
  if (projectsSection) {
    projectsSection.style.pointerEvents = "auto";
    projectsSection.style.overflow = "visible";
    projectsSection.style.opacity = "1";
  }
}

function initializeScrollTriggers() {
  gsap.registerPlugin(ScrollTrigger);

  // Height tween: shrink video-section from extended height to 40vh quickly.
  gsap.to("#video-section", {
    height: "40vh",
    ease: "power1.out",
    duration: 1,
    scrollTrigger: {
      trigger: "#video-section",
      start: "top top",
      end: "+=100",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // Opacity tween: fade out the graphic text and arrow quickly.
  gsap.to([".flag-text", "#vahan-text", "#arrow"], {
    opacity: 0,
    ease: "power1.out",
    scrollTrigger: {
      trigger: "#video-section",
      start: "top top",
      end: "+=50", // shorter scroll range for quicker opacity change
      scrub: 1,
    },
  });
}

function animateLogoAndNav() {
  console.log("Animating logo and navigation");
}

// jQuery-based plugin initializations
$(document).ready(function () {
  // Initialize Slick sliders only if the elements exist and the slick function is available
  if ($('.slider').length > 0 && typeof $.fn.slick === 'function') {
    $('.slider').slick({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      adaptiveHeight: true,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  if ($('.slider-2').length > 0 && typeof $.fn.slick === 'function') {
    $('.slider-2').slick({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      adaptiveHeight: true,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    });
  }

  // Menu toggle for mobile navigation
  const menuToggle = document.querySelector(".js-menu-toggle");
  const menu = document.querySelector(".js-menu");
  const menuClose = document.querySelector(".js-menu-close");
  if (menuToggle && menu && menuClose) {
    menuToggle.addEventListener("click", () => {
      menu.classList.remove("hidden");
    });
    menuClose.addEventListener("click", () => {
      menu.classList.add("hidden");
    });
  }

  // Set initial transform for video section text and image
  const videoSectionText = document.querySelector("#video-section h2");
  const videoSectionImage = document.querySelector("#video-section img");
  if (videoSectionText) videoSectionText.style.transform = "translateY(0)";
  if (videoSectionImage) videoSectionImage.style.transform = "translateY(0)";

  // Ensure the arrow element does not block clicks.
  const arrow = document.querySelector("#arrow");
  if (arrow) {
    arrow.style.pointerEvents = "none";
  }
});

// Initialize Lightbox only if the library is loaded
if (typeof lightbox !== 'undefined' && typeof lightbox.option === 'function') {
  lightbox.option({
    resizeDuration: 200,
    wrapAround: true,
    fadeDuration: 300,
    imageFadeDuration: 300,
  });
}

// Masonry initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const masonryGrid = document.querySelector(".masonry-grid");
  if (masonryGrid && typeof Masonry !== 'undefined') {
    new Masonry(masonryGrid, {
      itemSelector: ".masonry-item",
      columnWidth: ".masonry-item",
      percentPosition: true,
      gutter: 10,
    });
  }
});

// Scroll event listener for parallax effect on the video section
window.addEventListener("scroll", function () {
  const videoSection = document.querySelector("#video-section");
  if (!videoSection) return;
  const videoSectionText = videoSection.querySelector("h2");
  const videoSectionImage = videoSection.querySelector("img");
  const scrollPosition = window.scrollY;
  const maxScroll = videoSection.offsetHeight - 200;

  if (scrollPosition <= maxScroll) {
    if (videoSectionText)
      videoSectionText.style.transform = `translateY(${-scrollPosition * 0.15}px)`;
    if (videoSectionImage)
      videoSectionImage.style.transform = `translateY(${scrollPosition * 0.2}px)`;
  } else {
    if (videoSectionText)
      videoSectionText.style.transform = `translateY(${-maxScroll * 0.15}px)`;
    if (videoSectionImage)
      videoSectionImage.style.transform = `translateY(${maxScroll * 0.2}px)`;
  }
});

// GSAP parallax effects for elements with .parallax-image and .parallax-text
document.addEventListener("DOMContentLoaded", function () {
  gsap.utils.toArray(".parallax-image").forEach((layer) => {
    const depth = layer.dataset.speed;
    const movement = -(layer.offsetHeight * depth);
    gsap.fromTo(
      layer,
      { y: movement },
      {
        y: 0,
        scrollTrigger: {
          trigger: layer,
          scrub: true,
        },
      }
    );
  });

  gsap.utils.toArray(".parallax-text").forEach((layer) => {
    const depth = layer.dataset.speed;
    const movement = -(layer.offsetHeight * depth);
    gsap.fromTo(
      layer,
      { y: movement },
      {
        y: 0,
        scrollTrigger: {
          trigger: layer,
          scrub: true,
        },
      }
    );
  });
});

// Fetch and insert SVG content into elements with the .svg-container class
document.addEventListener("DOMContentLoaded", function () {
  fetch("src/cta.svg")
    .then((response) => response.text())
    .then((svgContent) => {
      document.querySelectorAll(".svg-container").forEach((container) => {
        container.innerHTML = svgContent;
      });
    })
    .catch((err) => console.error("Error loading SVG:", err));
});
