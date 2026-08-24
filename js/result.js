import { personalityTypes, painkylEducation } from './data.js';
import { characters } from './characters.js';
import { sfxSuccess } from './immersive.js';
import { softNavigate } from './router.js';

const KEY = 'painkyl_answers';
const ICONS = {
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
};

function loadAnswers() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function calculateResult(answers) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  answers.forEach(t => {
    if (counts[t] !== undefined) counts[t] += 1;
  });
  let best = 'A';
  let bestCount = -1;
  Object.entries(counts).forEach(([type, count]) => {
    if (count > bestCount) {
      bestCount = count;
      best = type;
    }
  });
  return personalityTypes[best];
}

function renderResult(result) {
  document.title = `${result.name} | Painkyl 醫護人格測驗`;
  const charEl = document.getElementById('resultCharacter');
  charEl.innerHTML = characters[result.character];

  const titleEl = document.getElementById('resultTitle');
  titleEl.textContent = result.name;
  titleEl.style.color = result.color;

  document.getElementById('resultTagline').textContent = `${result.enName} — ${result.tagline}`;
  document.getElementById('resultTraits').innerHTML = result.traits
    .map(t => `<span class="trait-tag">${t}</span>`)
    .join('');

  document.getElementById('analysisContent').innerHTML = result.analysis
    .map(item => `<div class="content-item">${item}</div>`)
    .join('');
  document.getElementById('recommendationContent').innerHTML = result.recommendation
    .map(item => `<div class="content-item content-item-accent">${item}</div>`)
    .join('');

  const card = document.querySelector('.result-card');
  card.style.borderTopColor = result.color;
  card.classList.add('visible');

  return result;
}

function renderEducation() {
  const edu = painkylEducation;
  document.getElementById('eduBrandLine').textContent = edu.brandLine;
  document.getElementById('eduIntro').textContent = edu.intro;
  document.getElementById('eduGrid').innerHTML = edu.points
    .map(
      p => `
    <div class="edu-point">
      <span class="edu-icon">${ICONS[p.icon]}</span>
      <h3 class="edu-point-title">${p.title}</h3>
      <p class="edu-point-desc">${p.desc}</p>
    </div>`
    )
    .join('');
  document.getElementById('eduDisclaimer').textContent = edu.disclaimer;
}

function buildSharePayload(result) {
  const url = location.href.split('#')[0];
  const text = `我的癌症疼痛照護人格是「${result.name}」— ${result.tagline}！你也來測測看你的照護風格`;
  return { text: `${text}\n${url}`, url, textOnly: text };
}

function legacyCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {}
  ta.remove();
  return ok;
}

async function copyText(text, btnEl) {
  const fallback = () => {
    if (legacyCopy(text)) {
      toast(btnEl, '已複製到剪貼簿 ✓');
    } else {
      prompt('請手動複製：', text);
    }
  };
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      toast(btnEl, '已複製到剪貼簿 ✓');
    } catch {
      fallback();
    }
  } else {
    fallback();
  }
}

function toast(btnEl, msg) {
  const span = btnEl ? btnEl.querySelector('span') : null;
  const target = span || btnEl;
  if (!target) return;
  const original = target.textContent;
  target.textContent = msg;
  setTimeout(() => (target.textContent = original), 2200);
}

function bindShare(result) {
  const modal = document.getElementById('shareModal');
  const preview = document.getElementById('sharePreview');
  const lineLink = document.getElementById('shareLine');
  const copyBtn = document.getElementById('shareCopy');
  const nativeBtn = document.getElementById('shareNative');
  const cancelBtn = document.getElementById('shareCancel');
  const backdrop = document.getElementById('shareBackdrop');
  const openBtn = document.getElementById('shareBtn');
  if (!modal || !openBtn) return;

  const payload = buildSharePayload(result);
  preview.textContent = payload.textOnly;
  lineLink.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(payload.url)}&text=${encodeURIComponent(payload.textOnly)}`;
  lineLink.href = `https://line.me/R/msg/text/?${encodeURIComponent(payload.text)}`;

  if (!navigator.share) nativeBtn.style.display = 'none';

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  copyBtn.addEventListener('click', async () => {
    await copyText(payload.text, copyBtn);
    setTimeout(closeModal, 900);
  });

  nativeBtn.addEventListener('click', async () => {
    try {
      await navigator.share({ title: `我是「${result.name}」`, text: payload.textOnly, url: payload.url });
      closeModal();
    } catch (e) {
      if (e && e.name !== 'AbortError') await copyText(payload.text, nativeBtn);
    }
  });
}

function setupReveal() {
  const targets = document.querySelectorAll('.result-section, .edu-section, .result-actions');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  targets.forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

function confetti(mainColor) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  document.body.appendChild(canvas);
  const c = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  c.scale(dpr, dpr);
  const W = window.innerWidth;
  const H = window.innerHeight;
  const colors = [mainColor, '#D4A843', '#40916C', '#B0578D', '#4A6FA5'];
  const pieces = Array.from({ length: 110 }, () => ({
    x: Math.random() * W,
    y: -30 - Math.random() * H * 0.4,
    w: 6 + Math.random() * 6,
    h: 9 + Math.random() * 8,
    vx: (Math.random() - 0.5) * 1.8,
    vy: 2.2 + Math.random() * 3,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.18,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
  const start = performance.now();
  function frame(now) {
    const elapsed = now - start;
    c.clearRect(0, 0, W, H);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      c.fillStyle = p.color;
      c.globalAlpha = Math.max(0, 1 - elapsed / 3400);
      c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      c.restore();
    });
    if (elapsed < 3500) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}

const answers = loadAnswers();
if (answers.filter(Boolean).length === 0) {
  softNavigate('index.html');
} else {
  const result = renderResult(calculateResult(answers));
  renderEducation();
  bindShare(result);
  setupReveal();
  setTimeout(() => {
    sfxSuccess();
    confetti(result.color);
  }, 500);
}
