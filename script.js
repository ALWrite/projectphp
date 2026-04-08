/**
 * RAMBO NETWORK — script.js
 * Handles: preloader, custom cursor, navbar, theme toggle,
 *          particles, scroll reveal, counter animation,
 *          mobile nav, back-to-top, contact form → WhatsApp
 */

/* ── Helpers ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── 1. Preloader ────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = $('#preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    // Trigger hero reveal immediately after load
    triggerReveal();
  }, 600);
});

/* ── 2. Theme Toggle ─────────────────────────────────────────── */
const html = document.documentElement;
const themeToggle = $('#themeToggle');

// Load saved preference
const savedTheme = localStorage.getItem('rambo-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('rambo-theme', next);
});

/* ── 3. Custom Cursor ────────────────────────────────────────── */
const dot = $('#cursorDot');
const ring = $('#cursorRing');

let mx = -100, my = -100;
let rx = -100, ry = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  if (dot) {
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  }
});

// Smooth ring follow
function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  if (ring) {
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover expand
document.addEventListener('mouseover', e => {
  const isLink = e.target.closest('a, button, .feature-card, .testi-card, .pricing-card');
  ring?.classList.toggle('hovered', !!isLink);
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  if (dot) dot.style.opacity = '0';
  if (ring) ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  if (dot) dot.style.opacity = '1';
  if (ring) ring.style.opacity = '1';
});

/* ── 4. Navbar Scroll Behavior ───────────────────────────────── */
const navbar = $('#navbar');
const navLinks = $$('.nav-link');
const sections = $$('section[id]');

const updateNav = () => {
  const scrollY = window.scrollY;

  // Sticky style
  navbar?.classList.toggle('scrolled', scrollY > 50);

  // Back to top button
  const btt = $('#backToTop');
  btt?.classList.toggle('visible', scrollY > 400);

  // Active nav link based on scroll position
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 100) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href')?.slice(1);
    link.classList.toggle('active', href === current);
  });
};

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── 5. Mobile Navigation ────────────────────────────────────── */
const hamburger = $('#hamburger');
const mobileNav = $('#navLinks');

hamburger?.addEventListener('click', () => {
  const open = mobileNav?.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

// Close on link click
mobileNav?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (mobileNav?.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger?.contains(e.target)) {
    mobileNav.classList.remove('open');
    hamburger?.classList.remove('open');
  }
});

/* ── 6. Particle Canvas ──────────────────────────────────────── */
(function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '234,51,35' : '37,211,102';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(234,51,35,${0.06 * (1 - dist / 90)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── 7. Scroll Reveal (Intersection Observer) ────────────────── */
function triggerReveal() {
  const revealEls = $$('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Trigger bar animations inside feature cards
          const bar = entry.target.querySelector?.('.feature-bar-fill');
          if (bar) entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => observer.observe(el));
}
// Called after preloader removal, but also run directly in case
if (document.readyState === 'complete') triggerReveal();
else document.addEventListener('DOMContentLoaded', triggerReveal);

/* ── 8. Counter Animation ────────────────────────────────────── */
(function initCounters() {
  const counterEls = $$('.stat-num[data-target]');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));
})();

/* ── 9. Back to Top ──────────────────────────────────────────── */
$('#backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 10. Smooth Scroll for anchor links ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 11. Contact Form → WhatsApp ─────────────────────────────── */
$('#contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const nama = $('#c-name')?.value.trim();
  const wa = $('#c-phone')?.value.trim();
  const subjek = $('#c-subject')?.value.trim();
  const pesan = $('#c-message')?.value.trim();

  if (!nama || !wa || !subjek || !pesan) return;

  const text = `Halo admin Rambo Network! 👋\n\nNama: ${nama}\nWhatsApp: ${wa}\nSubjek: ${subjek}\n\nPesan:\n${pesan}`;
  const url = `https://wa.me/6289510811261?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');

  this.reset();
  showToast('Mengalihkan ke WhatsApp…');
});

/* ── 12. Toast Notification ──────────────────────────────────── */
function showToast(msg) {
  const existing = $('.rambo-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'rambo-toast';
  toast.innerHTML = `<i class="fa-brands fa-whatsapp"></i> ${msg}`;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '80px',
    right: '28px',
    background: '#25d366',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '50px',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '0.88rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 8px 24px rgba(37,211,102,0.35)',
    zIndex: '9999',
    animation: 'toastIn 0.3s ease forwards',
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes toastOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ── 13. Navbar color inversion in hero ──────────────────────── */
// The hero is dark background so no text inversion needed;
// handled purely via CSS variables.

/* ── 14. Parallax tilt on hero title (subtle) ────────────────── */
document.addEventListener('mousemove', e => {
  const heroTitle = $('.hero-title');
  if (!heroTitle) return;
  const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
  const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
  heroTitle.style.transform = `translate(${xRatio * 4}px, ${yRatio * 2}px)`;
});

/* ── 15. Marquee pause on hover ──────────────────────────────── */
const marqueeTrack = $('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}
