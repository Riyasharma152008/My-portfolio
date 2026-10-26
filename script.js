/* ---------- Particle background ---------- */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const COUNT = 70;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function make() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      hue: [190, 260, 330, 160][Math.floor(Math.random() * 4)]
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},90%,70%,.7)`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(167,139,250,${0.15 * (1 - d / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  resize(); make(); draw();
  window.addEventListener('resize', () => { resize(); make(); });
})();

/* ---------- Typing effect ---------- */
(function () {
  const roles = ['Software Developer', 'Web Developer', 'Python Enthusiast', 'Problem Solver', 'Lifelong Learner'];
  const el = document.getElementById('typed');
  let r = 0, c = 0, deleting = false;
  function tick() {
    const word = roles[r];
    el.textContent = word.substring(0, c);
    let delay = deleting ? 45 : 95;
    if (!deleting && c === word.length) { delay = 1600; deleting = true; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
    c += deleting ? -1 : 1;
    setTimeout(tick, delay);
  }
  tick();
})();

/* ---------- Scroll reveal, skill bars, timeline, counters ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');

    el.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
    if (el.classList.contains('counter')) animateCount(el);
    observer.unobserve(el);
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal, .skill-card, .timeline').forEach(el => observer.observe(el));
document.querySelectorAll('.counter').forEach(el => observer.observe(el));

function animateCount(el) {
  const target = +el.dataset.count;
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(p * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* Skill bars inside cards that are already revealed */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill').forEach(b => b.style.width = b.dataset.width + '%');
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach(c => barObserver.observe(c));

/* ---------- Navbar, active link, back to top ---------- */
const navbar = document.getElementById('navbar');
const toTop = document.getElementById('toTop');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 50);
  toTop.classList.toggle('show', y > 600);

  let current = '';
  sections.forEach(s => {
    if (y >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
});

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Mobile menu ---------- */
const menuToggle = document.getElementById('menuToggle');
const navList = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  navList.classList.toggle('open');
});
navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuToggle.classList.remove('open');
  navList.classList.remove('open');
}));

/* ---------- 3D tilt on project cards ---------- */
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---------- Cursor glow ---------- */
const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

/* ---------- Contact form (opens the visitor's email app) ---------- */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent('Portfolio message from ' + name);
  const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');
  window.location.href = `mailto:riyasharma152008@gmail.com?subject=${subject}&body=${body}`;
  document.getElementById('formNote').textContent = 'Thanks! Your email app should open with the message ready.';
});

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
