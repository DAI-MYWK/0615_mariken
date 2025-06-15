// DOM Elements
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const contactForm = document.getElementById("contactForm");

// Mobile Navigation Toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Smooth scrolling for navigation links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");

    // 下層ページへのリンク（.htmlファイル）の場合は通常の遷移を許可
    if (targetId.includes(".html")) {
      return; // デフォルトの動作（ページ遷移）を許可
    }

    // アンカーリンクの場合のみスムーススクロールを適用
    e.preventDefault();
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(10, 10, 10, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(255, 107, 53, 0.1)";
  } else {
    navbar.style.background = "rgba(10, 10, 10, 0.95)";
    navbar.style.boxShadow = "none";
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll(
  ".tech-card, .product-card, .partner-card, .section-header, .vision-item, .job-item, .data-point, .representative-message"
);
animatedElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

// Bar animation observer
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Delay the bar animation slightly after the card appears
        setTimeout(() => {
          entry.target.classList.add("animate-bar");

          // Reset animation after completion for repeated viewing
          setTimeout(() => {
            entry.target.classList.remove("animate-bar");
          }, 1000);
        }, 300);
      }
    });
  },
  {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px",
  }
);

// Observe cards for bar animation
const cardElements = document.querySelectorAll(
  ".tech-card, .product-card, .partner-card"
);
cardElements.forEach((card) => {
  barObserver.observe(card);
});

// Additional scroll-based bar animation for dynamic effect
let animationTimeouts = new Map();

window.addEventListener("scroll", () => {
  const cards = document.querySelectorAll(
    ".tech-card, .product-card, .partner-card"
  );

  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible && !card.classList.contains("animate-bar")) {
      // Clear any existing timeout for this card
      if (animationTimeouts.has(card)) {
        clearTimeout(animationTimeouts.get(card));
      }

      // Set new timeout with staggered delay
      const timeout = setTimeout(() => {
        card.classList.add("animate-bar");

        // Remove class after animation completes
        setTimeout(() => {
          card.classList.remove("animate-bar");
        }, 1000);
      }, index * 100); // Stagger animations by 100ms

      animationTimeouts.set(card, timeout);
    }
  });
});

// Contact form handling
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const message = formData.get("message");

    // Basic validation
    if (!name || !email || !message) {
      showNotification("必須項目をすべて入力してください。", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("正しいメールアドレスを入力してください。", "error");
      return;
    }

    // Show success message (in real implementation, you would send data to server)
    showNotification(
      "お問い合わせありがとうございます。3営業日以内にご連絡いたします。",
      "success"
    );
    contactForm.reset();
  });
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${
          type === "success"
            ? "#4caf50"
            : type === "error"
            ? "#f44336"
            : "#ff6b35"
        };
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: 'Noto Sans JP', sans-serif;
        font-weight: 500;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector(".hero-background");
  const heatEffect = document.querySelector(".heat-effect");

  if (heroBackground && scrolled < window.innerHeight) {
    // Background image parallax effect
    heroBackground.style.backgroundPosition = `center ${scrolled * 0.5}px`;
  }

  if (heatEffect && scrolled < window.innerHeight) {
    heatEffect.style.transform = `translateY(${scrolled * 0.3}px) scale(${
      1 + scrolled * 0.0005
    })`;
  }
});

// Add heat pulse effect to tech icons on hover
document.addEventListener("DOMContentLoaded", () => {
  const techIcons = document.querySelectorAll(".tech-icon");

  techIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", () => {
      icon.style.animation = "heatPulse 1s ease-in-out";
    });

    icon.addEventListener("mouseleave", () => {
      icon.style.animation = "";
    });
  });
});

// Dynamic particle effect enhancement
function createParticle() {
  const particle = document.createElement("div");
  particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 107, 53, 0.6);
        border-radius: 50%;
        pointer-events: none;
        animation: particleFade 3s ease-out forwards;
    `;

  particle.style.left = Math.random() * window.innerWidth + "px";
  particle.style.top = Math.random() * window.innerHeight + "px";

  document.body.appendChild(particle);

  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, 3000);
}

// Add CSS for particle fade animation
const style = document.createElement("style");
style.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(0);
        }
    }
`;
document.head.appendChild(style);

// Create particles periodically when on hero section
let particleInterval;
window.addEventListener("scroll", () => {
  const heroSection = document.querySelector(".hero");
  const heroRect = heroSection.getBoundingClientRect();

  if (heroRect.top <= 0 && heroRect.bottom >= 0) {
    if (!particleInterval) {
      particleInterval = setInterval(createParticle, 2000);
    }
  } else {
    if (particleInterval) {
      clearInterval(particleInterval);
      particleInterval = null;
    }
  }
});

// CTA button hover effects
document.querySelectorAll(".cta-button").forEach((button) => {
  button.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-3px) scale(1.05)";
  });

  button.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Loading animation for images
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("load", () => {
      img.style.opacity = "0";
      img.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        img.style.opacity = "1";
      }, 100);
    });
  });
});

// Add scroll indicator functionality
document.querySelector(".scroll-indicator")?.addEventListener("click", () => {
  const technologySection = document.querySelector("#technology");
  if (technologySection) {
    technologySection.scrollIntoView({ behavior: "smooth" });
  }
});

// Tab functionality for products page
document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
});
