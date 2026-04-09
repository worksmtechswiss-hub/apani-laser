/* ============================================
   APANI Laser Technology — main.js
   Animations, Interactions & UX
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHamburger();
  initParticles();
  initTextReveal();
  initScrollAnimations();
  initCounters();
  initTabs();
  initFAQ();
  initBackToTop();
  initSmoothScroll();
  initHeroVideoSequence();
});

/* --- Sticky Header --- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Hamburger Menu --- */
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Gold Particle Animation (Canvas) --- */
function initParticles() {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.02;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 150, 104, ${currentOpacity})`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 122, 80, ${currentOpacity * 0.15})`;
      ctx.fill();
    });

    animId = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

/* --- Hero Text Reveal Animation --- */
function initTextReveal() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  const text = title.textContent.trim();
  title.innerHTML = '';
  title.style.visibility = 'visible';

  const words = text.split(' ');
  let charIndex = 0;

  words.forEach((word, wordIdx) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';

    [...word].forEach((char) => {
      const span = document.createElement('span');
      span.classList.add('char');
      span.textContent = char;
      span.style.animationDelay = `${0.3 + charIndex * 0.04}s`;
      wordSpan.appendChild(span);
      charIndex++;
    });

    title.appendChild(wordSpan);

    if (wordIdx < words.length - 1) {
      title.appendChild(document.createTextNode(' '));
      charIndex++;
    }
  });
}

/* --- Scroll-Triggered Fade-In Animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* --- Animated Counters --- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);

    el.textContent = current.toLocaleString('de-CH') + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString('de-CH') + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* --- Application Tabs --- */
function initTabs() {
  const tabButtons = document.querySelectorAll('.app-tab');
  const tabContents = document.querySelectorAll('.app-content');
  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const content = document.getElementById(target);
      if (content) content.classList.add('active');
    });
  });
}

/* --- FAQ Accordion --- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const inner = item.querySelector('.faq-answer-inner');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });
}

/* --- Back to Top --- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Smooth Scroll for Anchor Links --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* --- Fade-in animation keyframes helper --- */
const fadeUpStyle = document.createElement('style');
fadeUpStyle.textContent = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(fadeUpStyle);

/* --- Hero Video Sequence with Laser Flash Transition --- */
function initHeroVideoSequence() {
  const v1 = document.getElementById('heroVid1');
  const v2 = document.getElementById('heroVid2');
  if (!v1 || !v2) return;

  // Create laser flash overlay
  const flash = document.createElement('div');
  flash.className = 'hero-laser-flash';
  v1.parentElement.appendChild(flash);

  const videos = [v1, v2];
  let current = 0;
  let transitioning = false;

  function playNext() {
    if (transitioning) return;
    transitioning = true;

    const cur = videos[current];
    const next = videos[(current + 1) % 2];

    // Phase 1: Laser flash fires
    flash.classList.add('active');

    // Phase 2: At peak brightness, swap videos
    setTimeout(() => {
      next.currentTime = 0;
      next.style.opacity = '0.65';
      next.play();
      cur.style.opacity = '0';
    }, 400);

    // Phase 3: Flash fades out
    setTimeout(() => {
      flash.classList.remove('active');
      current = (current + 1) % 2;
      transitioning = false;
    }, 800);
  }

  v1.addEventListener('ended', playNext);
  v2.addEventListener('ended', playNext);
}

/* ===== Before / After Slider ===== */
(function initBaSliders(){
  const sliders = document.querySelectorAll('.ba-slider');
  if (!sliders.length) return;

  sliders.forEach((el) => {
    const before = el.dataset.before;
    const after = el.dataset.after;
    const lblBefore = el.dataset.labelBefore || 'Vorher';
    const lblAfter = el.dataset.labelAfter || 'Nachher';

    el.innerHTML = `
      <img class="ba-after" src="${after}" alt="${lblAfter}" loading="lazy">
      <img class="ba-before" src="${before}" alt="${lblBefore}" loading="lazy">
      <span class="ba-label ba-label-before">${lblBefore}</span>
      <span class="ba-label ba-label-after">${lblAfter}</span>
      <div class="ba-handle"></div>
    `;

    const beforeImg = el.querySelector('.ba-before');
    const handle = el.querySelector('.ba-handle');
    let dragging = false;

    function setPos(clientX) {
      const rect = el.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + '%';
    }

    function start(e) {
      dragging = true;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    }
    function move(e) {
      if (!dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    }
    function end() { dragging = false; }

    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);

    // Hover-driven scrubbing on desktop without click
    el.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      setPos(e.clientX);
    });
  });
})();

/* ===== Product Gallery ===== */
(function initProductGalleries(){
  const galleries = document.querySelectorAll('[data-gallery]');
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const track = gallery.querySelector('.product-gallery-track');
    const slides = gallery.querySelectorAll('.product-gallery-slide');
    const prevBtn = gallery.querySelector('.product-gallery-prev');
    const nextBtn = gallery.querySelector('.product-gallery-next');
    const dotsWrap = gallery.querySelector('.product-gallery-dots');
    if (!track || !slides.length) return;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'product-gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Bild ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function currentIndex() {
      return Math.round(track.scrollLeft / track.clientWidth);
    }
    function goTo(i) {
      const max = slides.length - 1;
      const target = Math.max(0, Math.min(max, i));
      track.scrollTo({ left: target * track.clientWidth, behavior: 'smooth' });
    }
    function updateDots() {
      const idx = currentIndex();
      dotsWrap.querySelectorAll('.product-gallery-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    }

    prevBtn?.addEventListener('click', () => goTo(currentIndex() - 1));
    nextBtn?.addEventListener('click', () => goTo(currentIndex() + 1));
    track.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateDots);
    });

    // Keyboard arrows when gallery focused
    gallery.tabIndex = 0;
    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex() - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex() + 1); }
    });
  });
})();
