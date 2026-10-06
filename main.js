gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHero();
  initFeatures();
  initStickyStack();
  initTestimonials();
});

function initNav() {
  const nav = document.querySelector('.nav-island');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

function initHero() {
  // Staggered text reveal
  gsap.from(".hero-text-stagger", {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    delay: 0.2
  });

  // Hero image parallax & reveal
  gsap.from(".hero-image-wrapper", {
    scale: 1.05,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out",
    delay: 0.4
  });

  gsap.to(".hero-image-wrapper", {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Floating stat cards spring entry
  gsap.from(".stat-card", {
    x: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "elastic.out(1, 0.7)",
    delay: 0.8
  });

  // Simple number counter
  const counters = document.querySelectorAll('.counter-val');
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isFloat = target % 1 !== 0;
    
    gsap.to(counter, {
      innerHTML: target,
      duration: 2,
      delay: 1,
      snap: { innerHTML: isFloat ? 0.1 : 1 },
      onUpdate: function() {
        if (isFloat) {
          counter.innerHTML = Number(this.targets()[0].innerHTML).toFixed(1);
        }
      }
    });
  });
}

function initFeatures() {
  const featureRows = document.querySelectorAll('.feature-row');
  
  featureRows.forEach((row, i) => {
    const isLeft = i % 2 === 0;
    gsap.from(row, {
      x: isLeft ? -40 : 40,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: row,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });

  // Perpetual float for feature icons
  gsap.to(".feature-icon", {
    y: -8,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
    stagger: {
      each: 0.2,
      from: "random"
    }
  });
}

function initStickyStack() {
  const cards = document.querySelectorAll('.sticky-card');
  
  cards.forEach((card, i) => {
    // Set sticky top based on index so they stack nicely
    card.style.setProperty('--sticky-top', `${120 + (i * 20)}px`);
    
    if (i < cards.length - 1) {
      // Scale down when subsequent cards stack on top
      gsap.to(card, {
        scale: 0.95 - (0.02 * (cards.length - i - 1)),
        opacity: 0.7,
        scrollTrigger: {
          trigger: card,
          start: `top ${120 + (i * 20)}px`,
          endTrigger: ".sticky-stack-container",
          end: "bottom bottom",
          scrub: true
        }
      });
    }
  });
}

function initTestimonials() {
  const quotes = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentIdx = 0;
  let timer;

  if (!quotes.length) return;

  function showSlide(index) {
    // Crossfade
    gsap.to(quotes[currentIdx], { opacity: 0, zIndex: 0, duration: 0.5 });
    dots[currentIdx].classList.remove('bg-teal-600');
    dots[currentIdx].classList.add('bg-warm-200');
    
    currentIdx = index;
    
    gsap.fromTo(quotes[currentIdx], 
      { opacity: 0, y: 10, zIndex: 10 }, 
      { opacity: 1, y: 0, duration: 0.5 }
    );
    dots[currentIdx].classList.remove('bg-warm-200');
    dots[currentIdx].classList.add('bg-teal-600');
  }

  function nextSlide() {
    showSlide((currentIdx + 1) % quotes.length);
  }

  // Initialize
  gsap.set(quotes, { opacity: 0, zIndex: 0 });
  gsap.set(quotes[0], { opacity: 1, zIndex: 10 });
  dots[0].classList.add('bg-teal-600');
  dots[0].classList.remove('bg-warm-200');

  // Auto-rotate
  timer = setInterval(nextSlide, 5000);

  // Manual dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (i === currentIdx) return;
      clearInterval(timer);
      showSlide(i);
      timer = setInterval(nextSlide, 5000);
    });
  });
}
