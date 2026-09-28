/* =============================================
   Arnold Rey Strader Lapuz Portfolio — main.js
   Full-Stack Web & Android Developer
   ============================================= */

'use strict';

// ─── CUSTOM CURSOR ───
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }
});

(function animateTrail() {
  if (cursorTrail) {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
  }
  requestAnimationFrame(animateTrail);
})();


// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  updateActiveNav();
  animateOnScroll();
});


// ─── ACTIVE NAV LINK ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === current) link.classList.add('active');
  });
}


// ─── MOBILE NAV TOGGLE ───
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
const btnHire = document.getElementById('btnHire');

if (navToggle && navLinksEl) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
    btnHire && btnHire.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksEl.classList.remove('open');
      btnHire && btnHire.classList.remove('open');
    });
  });
}


// ─── TYPEWRITER EFFECT ───
const typed = document.getElementById('typedText');
const phrases = [
  'Enterprise Web Platforms',
  'Native Android Apps',
  'Laravel & PHP Architectures',
  'Jetpack Compose UIs',
  'Financial Billing & Case Systems',
];
let phraseIdx = 0;
let charIdx = 0;
let deleting = false;
const TYPING_SPEED = 85;
const DELETE_SPEED = 40;
const PAUSE = 1900;

function type() {
  if (!typed) return;
  const current = phrases[phraseIdx];
  if (!deleting) {
    typed.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, PAUSE);
      return;
    }
    setTimeout(type, TYPING_SPEED);
  } else {
    typed.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(type, DELETE_SPEED);
  }
}
setTimeout(type, 600);


// ─── COUNTER ANIMATION ───
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  const hero = document.getElementById('hero');
  if (!hero) return;
  const rect = hero.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    countersStarted = true;
    counters.forEach(c => animateCounter(c));
  }
}
startCounters();
window.addEventListener('scroll', startCounters, { passive: true });


// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll('.skill-category, .project-card, .reveal');

function animateOnScroll() {
  revealEls.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : (i % 3) * 100;
      setTimeout(() => {
        el.classList.add('visible');
        el.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }, delay);
    }
  });
}
animateOnScroll();


// ─── PARTICLES CANVAS ───
const canvas = document.getElementById('particlesCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.r     = Math.random() * 1.5 + 0.4;
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.vy    = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.05;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(42, 90%, 58%, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 85; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(42, 90%, 58%, ${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  (function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  })();
}


// ─── PROJECT FILTERING ───
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });
  });
});


// ─── PROJECT DATA REPOSITORY (AUTHENTIC DATA) ───
const projectsData = {
  law_billing: {
    title: 'Perez Law Office — Billing & Expense Tracker System',
    category: 'Enterprise Web Application',
    image: 'assets/img/project_law_billing.jpg',
    desc: 'An automated financial management platform built for Perez Law Office. Automates client retainer billing, installment payment schedules, 4-tier cost categorizations, and official accounting documentation.',
    features: [
      'Client & Case Management: Handles Regular and Retainer clients with multi-line fee tracking per legal matter.',
      'Installment Billing (Amortization): Configures flexible monthly payment terms with automated 5-day and 3-day email reminders.',
      'Multi-Channel Receipts: Records Cash, GCash, Bank Transfer, and Check payments with automated PDF official receipt generation.',
      'Statement of Account (SOA): Generates client-ready PDF statements with detailed payment logs and remaining balances.',
      '4-Tier Expense Tracking: Categorizes Operating, Employee, Case-linked Client, and Reimbursable expenses.',
      'Cash Fund & Audit Trail: Real-time balance calculations with automated user, IP, and timestamp audit logging.'
    ],
    tech: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Tailwind CSS', 'DomPDF', 'Pest PHP', 'Vite', 'JavaScript'],
    github: 'https://github.com/arnldry/billing_and_expense_tracker_system'
  },
  regcomp: {
    title: 'RegComp — Legal Hearings & Compliance Portal',
    category: 'Legal Practice Management',
    image: 'assets/img/project_regcomp.jpg',
    desc: 'A corporate legal practice and regulatory compliance platform. Provides law firms and corporate retainers with an interactive visual calendar for court hearings, litigation timelines, and secure client document storage.',
    features: [
      'Visual Hearing Scheduler: Custom-built calendar view supporting time-slot allocation and multi-day hearing timelines.',
      'Secure Document Client Vault: Role-scoped file repository allowing clients and legal staff to upload, preview, and download pleadings.',
      'Regulatory Compliance Tracker: Centralized oversight of statutory regulations, filings, and compliance milestones.',
      'Retainer Reports & Notes: Enables attorneys to document real-time notes and dispatch client status reports.',
      'Role-Based Access Control: Granular security gates separating Managing Partners, Senior Associates, and Retainer Clients.'
    ],
    tech: ['Laravel 11', 'PHP', 'MySQL', 'Blade', 'Tailwind CSS', 'Vite', 'JavaScript'],
    github: 'https://github.com/arnldry/Regcomp-program'
  },
  student_profiling: {
    title: 'OCNHS Guidance Counseling Profiling System',
    category: 'EdTech & Psychological Assessment (Capstone)',
    image: 'assets/img/project_student_profiling.jpg',
    desc: 'A high school guidance counseling system created as a Capstone project for Olongapo City National High School (OCNHS). Digitizes student records, career aptitude evaluations, and psychological inventories.',
    features: [
      'Holland RIASEC Assessment Engine: Automates career interest scoring across Realistic, Investigative, Artistic, Social, Enterprising, and Conventional traits.',
      'Life Values Evaluation: Evaluates personal and psychological values to guide personalized counseling sessions.',
      'Automated Dossier Generation: Exports comprehensive student behavioral and academic summary reports to PDF via DomPDF.',
      'Student & Counselor Portals: Streamlined self-service testing for students with administrative dashboards for counselors.',
      'Archived Record Preservation: Secure archival and retrieval mechanism for student longitudinal counseling history.'
    ],
    tech: ['Laravel 11', 'PHP', 'MySQL', 'Tailwind CSS', 'DomPDF', 'Vite', 'JavaScript'],
    github: 'https://github.com/arnldry/Student_profiling_system_105-main'
  },
  alps_hotels: {
    title: 'The Alps Hotels — Alpine Discovery App',
    category: 'Native Android Mobile App',
    image: 'assets/img/project_alps_hotels.jpg',
    desc: 'A native Android mobile application designed for discovering ski resorts and alpine hotels. Built entirely in Kotlin utilizing modern Jetpack Compose declarative UI and edge-to-edge layout styling.',
    features: [
      'Dynamic Search Filtering: Real-time search by hotel name, location, and amenities with zero UI stutter.',
      'Proximity Indicators: Computes and displays distance metrics to nearby ski lifts and slope facilities.',
      'Interactive Star Ratings: Dynamic visual star rating indicators paired with review scores.',
      'Async Image Pipeline: High-performance remote image decoding, disk caching, and crossfading powered by Coil.',
      'Material Design 3 Theming: Implements dynamic typography, custom elevation cards, and edge-to-edge scaffolding.'
    ],
    tech: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Material 3', 'Coil', 'Gson'],
    github: 'https://github.com/arnldry/Lapuz_TheAlpsHotels'
  },
  notecraft: {
    title: 'NoteCraft — Tag-Based Notes & SQLite Room DB',
    category: 'Native Android Mobile App',
    image: 'assets/img/project_notecraft.jpg',
    desc: 'An offline-first Android note organization application architected according to Google Android Architecture Guidelines. Utilizes Room Database with SQLite, Kotlin Coroutines, and Jetpack Compose.',
    features: [
      'Many-to-Many Relational Schema: Models cross-referencing between Notes and Tags using Room @Relation and CrossRef mapping.',
      'MVVM Architecture: Clean separation of concerns through ViewModels, Repository pattern, and StateFlow observables.',
      'Instant Keyword Search: Query notes and tags instantaneously with SQLite indexed search operations.',
      'Material 3 Card System: Dynamic card list presentation with tag chips, timestamps, and quick action controls.'
    ],
    tech: ['Kotlin', 'Jetpack Compose', 'Room DB', 'SQLite', 'MVVM', 'Coroutines', 'StateFlow'],
    github: 'https://github.com/arnldry/NoteTakingApp_Lapuz'
  },
  dtr_salary: {
    title: 'Workforce Hub — DTR & Salary Payroll System',
    category: 'Enterprise HR & Payroll Management',
    image: 'assets/img/project_dtr_salary.jpg',
    desc: 'An automated Daily Time Record (DTR) and payroll computation platform that streamlines employee attendance tracking, shift logging, leave requests, and payroll disbursements.',
    features: [
      'Automated Attendance Punch Clock: Tracks employee check-in and check-out times with auto tardiness and overtime calculation.',
      'Statutory Deductions Engine: Automatically calculates SSS, PhilHealth, Pag-IBIG, and withholding taxes.',
      'Automated Payslip PDF Export: Renders official pay stubs with itemized allowances, deductions, and net salary.',
      'Leave & Holiday Management: Streamlines employee vacation/sick leave approvals and official holiday adjustments.'
    ],
    tech: ['Laravel', 'PHP', 'MySQL', 'Blade', 'Vite', 'DomPDF'],
    github: 'https://github.com/ryanerichdelacruz17-blip/Dtr_salary_system'
  },
  jokes_api: {
    title: 'Jokes REST API Client — Retrofit & Coroutines',
    category: 'Native Android Mobile App',
    image: 'assets/img/project_notecraft.jpg',
    desc: 'A native Android demonstration application showcasing asynchronous REST API consumption, robust network error handling, and reactive Jetpack Compose state architecture.',
    features: [
      'Retrofit 2 & OkHttp Integration: Asynchronous HTTP requests with JSON serialization via Gson.',
      'Kotlin Coroutines: Background dispatching for non-blocking I/O operations.',
      'StateFlow ViewModels: UI updates reactively to network success, error, and loading states.'
    ],
    tech: ['Kotlin', 'Android SDK', 'Retrofit 2', 'OkHttp', 'Coroutines', 'Jetpack Compose'],
    github: 'https://github.com/arnldry/JokesAPIClient'
  },
  museum_app: {
    title: 'Museum Explorer & Interactive Ticketing App',
    category: 'Native Android Mobile App',
    image: 'assets/img/project_alps_hotels.jpg',
    desc: 'An interactive Android application combining a virtual cultural gallery exhibition guide with an integrated ticketing and seat reservation workflow.',
    features: [
      'Multi-Activity Navigation: Smooth transitions between Explorer, Ticket Booking, and Details activities.',
      'Virtual Exhibition Showcase: Rich image and description layouts for historic and artistic artifacts.',
      'Interactive Ticketing System: Visitor ticket selection, tier pricing, and confirmation flow.'
    ],
    tech: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Android Navigation', 'Material 3'],
    github: 'https://github.com/arnldry/Lapuz_Museum'
  }
};


// ─── PROJECT MODAL CONTROLLER ───
const modalBackdrop  = document.getElementById('projectModalBackdrop');
const modalCloseBtn  = document.getElementById('modalCloseBtn');
const modalDismiss   = document.getElementById('modalDismissBtn');
const modalImage     = document.getElementById('modalImage');
const modalCategory  = document.getElementById('modalCategory');
const modalTitle     = document.getElementById('modalTitle');
const modalDesc      = document.getElementById('modalDesc');
const modalFeatures  = document.getElementById('modalFeatures');
const modalTechStack = document.getElementById('modalTechStack');
const modalGithubBtn = document.getElementById('modalGithubBtn');

function openProjectModal(projectId) {
  const p = projectsData[projectId];
  if (!p) return;

  modalImage.src = p.image;
  modalImage.alt = p.title;
  modalCategory.textContent = p.category;
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.desc;
  modalGithubBtn.href = p.github;

  // Populate Features
  modalFeatures.innerHTML = '';
  p.features.forEach(feat => {
    const li = document.createElement('li');
    li.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${feat}</span>
    `;
    modalFeatures.appendChild(li);
  });

  // Populate Tech Stack
  modalTechStack.innerHTML = '';
  p.tech.forEach(t => {
    const span = document.createElement('span');
    span.className = 'project-tag';
    span.textContent = t;
    modalTechStack.appendChild(span);
  });

  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (modalBackdrop) {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// Attach event listeners for open modal buttons
document.querySelectorAll('.btn-open-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const pid = btn.dataset.project;
    openProjectModal(pid);
  });
});

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
if (modalDismiss)  modalDismiss.addEventListener('click', closeProjectModal);

if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeProjectModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
    closeProjectModal();
  }
});


// ─── CONTACT FORM ───
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmailInput').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
      shakeForm();
      return;
    }

    submitBtn.disabled = true;
    submitBtnText.textContent = 'Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Send Message';
      contactForm.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    }, 1200);
  });
}

function shakeForm() {
  if (!contactForm) return;
  contactForm.style.animation = 'shake 0.4s ease';
  contactForm.addEventListener('animationend', () => {
    contactForm.style.animation = '';
  }, { once: true });
}

// Inject shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}`;
document.head.appendChild(shakeStyle);


// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#' || href === '') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ─── HIDE SCROLL INDICATOR AFTER SCROLL ───
const scrollIndicator = document.getElementById('scrollIndicator');
window.addEventListener('scroll', () => {
  if (scrollIndicator) {
    if (window.scrollY > 200) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.transition = 'opacity 0.5s';
    } else {
      scrollIndicator.style.opacity = '0.6';
    }
  }
}, { passive: true });


// ─── TECH PILLS HOVER TILT ───
document.querySelectorAll('.tech-pill').forEach(pill => {
  pill.addEventListener('mousemove', (e) => {
    const rect = pill.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    pill.style.transform = `translateY(-2px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.transform = '';
  });
});
