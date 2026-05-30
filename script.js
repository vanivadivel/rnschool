/* ==========================================================================
   R.N. Oxford Institutions - Upgraded Interactive App Logic (script.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- View Switcher (SPA Navigation) ---
  const navItems = document.querySelectorAll(".nav-item:not(.has-dropdown)");
  const dropdownLinks = document.querySelectorAll(".dropdown-link");
  const appViews = document.querySelectorAll(".app-view");
  const mobileMenu = document.querySelector(".main-nav");
  const burgerMenu = document.querySelector(".burger-menu");

  function switchView(targetViewId) {
    if (!targetViewId) return;
    
    // Hide all views
    appViews.forEach(view => {
      view.classList.remove("active-view");
    });
    
    // Remove active markers from main links
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.remove("active");
    });

    // Close any active dropdown accordion menu toggles
    document.querySelectorAll(".nav-item.has-dropdown").forEach(drop => {
      drop.classList.remove("active-drop");
    });

    // Show target view
    const activeView = document.getElementById(targetViewId);
    if (activeView) {
      activeView.classList.add("active-view");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Set active link highlight
    navItems.forEach(item => {
      const link = item.querySelector("a");
      if (link && link.getAttribute("data-view") === targetViewId) {
        item.classList.add("active");
      }
    });

    // Handle dropdown parents styling active state
    dropdownLinks.forEach(link => {
      if (link.getAttribute("data-view") === targetViewId) {
        const parentNavItem = link.closest(".nav-item");
        if (parentNavItem) {
          parentNavItem.classList.add("active");
        }
      }
    });

    // Close mobile side menu
    if (mobileMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      burgerMenu.classList.remove("active");
      burgerMenu.setAttribute("aria-expanded", "false");
    }
  }

  // Bind Navigation Links
  document.querySelectorAll("[data-view]").forEach(element => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = element.getAttribute("data-view");
      switchView(targetView);
      window.location.hash = targetView;
    });
  });

  // Handle URL hashes directly
  const initialHash = window.location.hash.substring(1);
  if (initialHash && document.getElementById(initialHash)) {
    switchView(initialHash);
  } else {
    // Switch to our new Kindergarten homepage default
    switchView("home-view");
  }

  // Mobile navigation drawer toggle
  if (burgerMenu && mobileMenu) {
    burgerMenu.addEventListener("click", () => {
      const isActive = burgerMenu.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      burgerMenu.setAttribute("aria-expanded", isActive.toString());
    });
  }

  // Responsive mobile sub-menu toggling (accordion style)
  const parentDropdowns = document.querySelectorAll(".nav-item.has-dropdown");
  parentDropdowns.forEach(drop => {
    const trigger = drop.querySelector(".nav-link");
    trigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        // Close all other dropdowns first
        parentDropdowns.forEach(other => {
          if (other !== drop) {
            other.classList.remove("active-drop");
          }
        });
        drop.classList.toggle("active-drop");
      }
    });
  });


  // --- Header Sticky Styling ---
  const header = document.querySelector(".main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });


  // --- Hero Carousel Controls ---
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.querySelector(".carousel-nav-btn.prev");
  const nextBtn = document.querySelector(".carousel-nav-btn.next");
  
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 6000;

  function updateSlider(index) {
    if (slides.length === 0) return;
    
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  function startSlideTimer() {
    stopSlideTimer();
    slideInterval = setInterval(() => {
      updateSlider(currentSlide + 1);
    }, slideDuration);
  }

  function stopSlideTimer() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    updateSlider(0);
    startSlideTimer();

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        updateSlider(currentSlide - 1);
        startSlideTimer();
      });
      nextBtn.addEventListener("click", () => {
        updateSlider(currentSlide + 1);
        startSlideTimer();
      });
    }

    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        const index = parseInt(dot.getAttribute("data-carousel-index"));
        updateSlider(index);
        startSlideTimer();
      });
    });
  }


  // --- Age Criteria Card Toggles ---
  const ageCards = document.querySelectorAll(".age-card");
  ageCards.forEach(card => {
    card.addEventListener("click", () => {
      // Toggle a class to animate or highlight requirements
      ageCards.forEach(c => c.classList.remove("highlighted"));
      card.classList.add("highlighted");
      
      // Gentle micro-feedback sound or visual border animation
      card.style.transform = "scale(1.03) translateY(-4px)";
      setTimeout(() => {
        card.style.transform = "";
      }, 300);
    });
  });


  // --- Gallery Filters ---
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-grid .gallery-item");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        if (filterValue === "all" || itemCategory === filterValue) {
          item.style.display = "block";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 50);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.8)";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });


  // --- Lightbox Popup overlay ---
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = lightbox ? lightbox.querySelector(".lightbox-img") : null;
  const lightboxCaption = lightbox ? lightbox.querySelector(".lightbox-caption") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  if (lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        const titleEl = item.querySelector(".gallery-title");
        const tagEl = item.querySelector(".gallery-tag");
        
        const title = titleEl ? titleEl.textContent : "";
        const tag = tagEl ? tagEl.textContent : "";

        if (img && lightboxImg && lightboxCaption) {
          lightboxImg.src = img.src;
          if (title || tag) {
            lightboxCaption.innerHTML = `<strong>${title}</strong><br><span style="font-size: 0.85rem; text-transform: uppercase; color: var(--accent-amber); letter-spacing: 1px">${tag}</span>`;
          } else {
            lightboxCaption.innerHTML = "";
          }
          lightbox.classList.add("active");
        }
      });
    });

    lightboxClose.addEventListener("click", () => {
      lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("active");
      }
    });
  }


  // --- Live Counters ---
  const counterSection = document.querySelector(".counter-section");
  const counters = document.querySelectorAll(".counter-number");
  let countersAnimated = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-target"));
      const duration = 2000;
      const stepTime = 35;
      const steps = duration / stepTime;
      const stepVal = target / steps;
      let currentVal = 0;
      
      const timer = setInterval(() => {
        currentVal += stepVal;
        if (currentVal >= target) {
          counter.textContent = target.toLocaleString() + "+";
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(currentVal).toLocaleString() + "+";
        }
      }, stepTime);
    });
  }

  if (counterSection && counters.length > 0) {
    window.addEventListener("scroll", () => {
      const sectionPos = counterSection.getBoundingClientRect().top;
      const screenPos = window.innerHeight;
      
      if (sectionPos < screenPos - 80 && !countersAnimated) {
        animateCounters();
        countersAnimated = true;
      }
    });
  }


  // --- Admissions Enrollment forms submissions ---
  const forms = [
    document.getElementById("admission-apply-form"),
    document.getElementById("admission-view-apply-form")
  ];
  
  const successModal = document.getElementById("success-modal");
  const successClose = successModal ? successModal.querySelector(".success-close") : null;

  forms.forEach(form => {
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Simulate API call state
        const submitBtn = form.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Registering... <i class="fas fa-spinner fa-spin"></i>`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          form.reset();

          if (successModal) {
            successModal.classList.add("active");
          }
        }, 1500);
      });
    }
  });

  if (successClose && successModal) {
    successClose.addEventListener("click", () => {
      successModal.classList.remove("active");
    });
  }
});
