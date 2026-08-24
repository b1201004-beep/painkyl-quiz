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
  const targets = document.querySelectorAll('.result-section, .edu-section, .share-image-section, .result-actions');
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

function svgToImage(svgText) {
  return new Promise((resolve, reject) => {
    let fixed = svgText;
    if (!fixed.includes('width=')) {
      fixed = fixed.replace('<svg', '<svg width="200" height="260"');
    }
    const blob = new Blob([fixed], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = e => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = text.split('');
  let line = '';
  let curY = y;
  for (let i = 0; i < chars.length; i++) {
    const test = line + chars[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = chars[i];
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, curY);
  return curY + lineHeight;
}

function wrapTextCentered(ctx, text, centerX, y, maxWidth, lineHeight) {
  const chars = text.split('');
  let line = '';
  const lines = [];
  for (let i = 0; i < chars.length; i++) {
    const test = line + chars[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = chars[i];
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  let curY = y;
  lines.forEach(l => {
    ctx.fillText(l, centerX, curY);
    curY += lineHeight;
  });
  return curY;
}

async function generateShareImage(result) {
  const canvas = document.getElementById('shareCanvas');
  const W = 1080;
  const H = 1920;
  const dpr = 2;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  await document.fonts.ready;
  // 填滿 9:16，內容垂直均分，避免底部留白

  // background
  ctx.fillStyle = '#F8FAF9';
  ctx.fillRect(0, 0, W, H);
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#E8F5EE');
  bgGrad.addColorStop(0.5, '#F8FAF9');
  bgGrad.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);
  // blobs
  ctx.globalAlpha = 0.35;
  const blob1 = ctx.createRadialGradient(120, 120, 0, 120, 120, 320);
  blob1.addColorStop(0, 'rgba(64,145,108,0.45)');
  blob1.addColorStop(1, 'rgba(64,145,108,0)');
  ctx.fillStyle = blob1;
  ctx.beginPath();
  ctx.arc(120, 120, 320, 0, Math.PI * 2);
  ctx.fill();
  const blob2 = ctx.createRadialGradient(960, 1180, 0, 960, 1180, 280);
  blob2.addColorStop(0, 'rgba(212,168,67,0.32)');
  blob2.addColorStop(1, 'rgba(212,168,67,0)');
  ctx.fillStyle = blob2;
  ctx.beginPath();
  ctx.arc(960, 1180, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // card
  const cardX = 56;
  const cardY = 56;
  const cardW = W - 112;
  const cardH = H - 112;
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.08)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 12;
  // rounded rect
  const r = 32;
  ctx.beginPath();
  ctx.moveTo(cardX + r, cardY);
  ctx.lineTo(cardX + cardW - r, cardY);
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
  ctx.lineTo(cardX + cardW, cardY + cardH - r);
  ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
  ctx.lineTo(cardX + r, cardY + cardH);
  ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
  ctx.lineTo(cardX, cardY + r);
  ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'transparent';
  // top accent
  ctx.fillStyle = result.color;
  ctx.beginPath();
  ctx.moveTo(cardX + r, cardY);
  ctx.lineTo(cardX + cardW - r, cardY);
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + 10);
  ctx.lineTo(cardX + cardW, cardY + 18);
  ctx.lineTo(cardX, cardY + 18);
  ctx.lineTo(cardX, cardY + 10);
  ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
  ctx.closePath();
  ctx.fill();

  // 測驗標題（9:16 置中，上方留白 96）
  ctx.textAlign = 'center';
  ctx.fillStyle = result.color;
  ctx.font = '900 56px "Noto Sans TC", sans-serif';
  ctx.fillText('癌症疼痛管理人格測驗', W / 2, 148);

  // character（垂直置中段，放大填滿 9:16）
  let charDrawH = 0;
  let charBottom = 0;
  try {
    const svgText = characters[result.character];
    const img = await svgToImage(svgText);
    const drawW = 520;
    const drawH = 676;
    charDrawH = drawH;
    const cx = W / 2 - drawW / 2;
    const cy = 188;
    charBottom = cy + drawH;
    ctx.drawImage(img, cx, cy, drawW, drawH);
  } catch {
    charBottom = 864;
  }

  // 角色名（與圖片保持 48px 淨空，真正置中）
  let y = charBottom + 48;
  ctx.textAlign = 'center';
  ctx.fillStyle = result.color;
  ctx.font = '900 62px "Noto Sans TC", sans-serif';
  ctx.fillText(result.name, W / 2, y);
  y += 68;
  ctx.fillStyle = '#616161';
  ctx.font = '600 26px "Noto Sans TC", sans-serif';
  ctx.fillText(`${result.enName}`, W / 2, y);
  y += 42;
  ctx.fillStyle = '#757575';
  ctx.font = '500 24px "Noto Sans TC", sans-serif';
  const tagY = wrapTextCentered(ctx, result.tagline, W / 2, y, 780, 36);
  y = tagY + 18;

  // traits pills — 放大填滿
  const traits = result.traits;
  ctx.font = '700 24px "Noto Sans TC", sans-serif';
  const gap = 18;
  const pillH = 52;
  const pillPad = 26;
  let totalW = 0;
  const widths = traits.map(t => ctx.measureText(t).width + pillPad * 2);
  totalW = widths.reduce((a, b) => a + b, 0) + gap * (traits.length - 1);
  let startX = W / 2 - totalW / 2;
  traits.forEach((t, i) => {
    const pw = widths[i];
    const px = startX;
    const py = y;
    ctx.fillStyle = '#E8F5EE';
    ctx.beginPath();
    ctx.moveTo(px + 22, py);
    ctx.lineTo(px + pw - 22, py);
    ctx.quadraticCurveTo(px + pw, py, px + pw, py + 22);
    ctx.lineTo(px + pw, py + pillH - 22);
    ctx.quadraticCurveTo(px + pw, py + pillH, px + pw - 22, py + pillH);
    ctx.lineTo(px + 22, py + pillH);
    ctx.quadraticCurveTo(px, py + pillH, px, py + pillH - 22);
    ctx.lineTo(px, py + 22);
    ctx.quadraticCurveTo(px, py, px + 22, py);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = result.color;
    ctx.textAlign = 'center';
    ctx.fillText(t, px + pw / 2, py + 33);
    startX += pw + gap;
  });
  ctx.textAlign = 'center';
  y += pillH + 28;

  // 小知識卡 — 再放大
  const knowY = y;
  const knowH = 104;
  const knowX = cardX + 32;
  const knowW = cardW - 64;
  ctx.fillStyle = 'rgba(232,245,238,0.96)';
  ctx.beginPath();
  ctx.moveTo(knowX + 16, knowY);
  ctx.lineTo(knowX + knowW - 16, knowY);
  ctx.quadraticCurveTo(knowX + knowW, knowY, knowX + knowW, knowY + 16);
  ctx.lineTo(knowX + knowW, knowY + knowH - 16);
  ctx.quadraticCurveTo(knowX + knowW, knowY + knowH, knowX + knowW - 16, knowY + knowH);
  ctx.lineTo(knowX + 16, knowY + knowH);
  ctx.quadraticCurveTo(knowX, knowY + knowH, knowX, knowY + knowH - 16);
  ctx.lineTo(knowX, knowY + 16);
  ctx.quadraticCurveTo(knowX, knowY, knowX + 16, knowY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2D6A4F';
  ctx.font = '800 24px "Noto Sans TC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('小知識', W / 2, knowY + 46);
  ctx.fillStyle = '#616161';
  ctx.font = '500 22px "Noto Sans TC", sans-serif';
  ctx.fillText('66% 晚期癌症患者持續受疼痛困擾，早期評估很重要', W / 2, knowY + 78);
  y = knowY + knowH + 40;

  // 最合拍的夥伴 — 獨立區塊，有底色，置中放大
  const partnerMap = {
    A: { name: '溫暖同行者', enName: 'The Empathetic Companion', color: '#B0578D', character: 'companion' },
    B: { name: '精準評估家', enName: 'The Precision Assessor', color: '#2D6A4F', character: 'assessor' },
    C: { name: '全景統籌者', enName: 'The Holistic Integrator', color: '#4A6FA5', character: 'integrator' },
    D: { name: '果斷行動派', enName: 'The Decisive Advocate', color: '#C75B39', character: 'advocate' },
  };
  const buddy = partnerMap[result.code] || partnerMap['A'];
  // 區塊背景：向下延伸至頁尾上緣，吃掉所有下方留白
  const sectionY = y;
  const sectionX = cardX + 24;
  const sectionW = cardW - 48;
  const sectionBottom = H - 208;
  const sectionH = Math.max(260, sectionBottom - sectionY);
  ctx.fillStyle = '#F0F7F3';
  ctx.strokeStyle = '#D5E8DD';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sectionX + 20, sectionY);
  ctx.lineTo(sectionX + sectionW - 20, sectionY);
  ctx.quadraticCurveTo(sectionX + sectionW, sectionY, sectionX + sectionW, sectionY + 20);
  ctx.lineTo(sectionX + sectionW, sectionY + sectionH - 20);
  ctx.quadraticCurveTo(sectionX + sectionW, sectionY + sectionH, sectionX + sectionW - 20, sectionY + sectionH);
  ctx.lineTo(sectionX + 20, sectionY + sectionH);
  ctx.quadraticCurveTo(sectionX, sectionY + sectionH, sectionX, sectionY + sectionH - 20);
  ctx.lineTo(sectionX, sectionY + 20);
  ctx.quadraticCurveTo(sectionX, sectionY, sectionX + 20, sectionY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 區塊標籤
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1B4D3E';
  ctx.font = '800 28px "Noto Sans TC", sans-serif';
  ctx.fillText('最合拍的夥伴', W / 2, sectionY + 54);
  // 內部大卡（白色圓角，幾乎填滿區塊）
  const innerX = sectionX + 36;
  const innerW = sectionW - 72;
  const innerY = sectionY + 88;
  const innerH = sectionY + sectionH - 40 - innerY;
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#E3EFE8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(innerX + 24, innerY);
  ctx.lineTo(innerX + innerW - 24, innerY);
  ctx.quadraticCurveTo(innerX + innerW, innerY, innerX + innerW, innerY + 24);
  ctx.lineTo(innerX + innerW, innerY + innerH - 24);
  ctx.quadraticCurveTo(innerX + innerW, innerY + innerH, innerX + innerW - 24, innerY + innerH);
  ctx.lineTo(innerX + 24, innerY + innerH);
  ctx.quadraticCurveTo(innerX, innerY + innerH, innerX, innerY + innerH - 24);
  ctx.lineTo(innerX, innerY + 24);
  ctx.quadraticCurveTo(innerX, innerY, innerX + 24, innerY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 內容：頭像＋名稱 置中群組，字級匹配大卡
  const avatarSize = 128;
  ctx.font = '800 38px "Noto Sans TC", sans-serif';
  const nameW = ctx.measureText(buddy.name).width;
  ctx.font = '500 19px "Noto Sans TC", sans-serif';
  const enW = ctx.measureText(buddy.enName).width;
  const textW = Math.max(nameW, enW);
  const groupW = avatarSize + 30 + textW;
  const gx = W / 2 - groupW / 2;
  const gy = innerY + innerH / 2;
  // 頭像底圓
  ctx.fillStyle = '#F0F7F3';
  ctx.beginPath();
  ctx.arc(gx + avatarSize / 2, gy, avatarSize / 2 + 6, 0, Math.PI * 2);
  ctx.fill();
  // 頭像圖片（圓形裁切，取上半身避免壓扁）
  ctx.save();
  ctx.beginPath();
  ctx.arc(gx + avatarSize / 2, gy, avatarSize / 2, 0, Math.PI * 2);
  ctx.clip();
  try {
    const svgText2 = characters[buddy.character];
    const img2 = await svgToImage(svgText2);
    const dh = avatarSize * 1.3;
    ctx.drawImage(img2, gx, gy - dh / 2, avatarSize, dh);
  } catch {}
  ctx.restore();
  ctx.strokeStyle = buddy.color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(gx + avatarSize / 2, gy, avatarSize / 2 + 6, 0, Math.PI * 2);
  ctx.stroke();
  // 名稱（放大）
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1A1A1A';
  ctx.font = '800 38px "Noto Sans TC", sans-serif';
  ctx.fillText(buddy.name, gx + avatarSize + 30, gy - 6);
  ctx.fillStyle = '#757575';
  ctx.font = '500 19px "Noto Sans TC", sans-serif';
  ctx.fillText(buddy.enName, gx + avatarSize + 30, gy + 30);

  // 頁尾一句話 A
  ctx.fillStyle = '#757575';
  ctx.font = '700 22px "Noto Sans TC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('疼痛控制是治療的起點 — 認識 Painkyl', W / 2, H - 146);

  // footer
  ctx.fillStyle = '#9E9E9E';
  ctx.font = '400 20px "Noto Sans TC", sans-serif';
  ctx.fillText('台灣東洋 · Painkyl 專業醫護測驗', W / 2, H - 112);
  ctx.fillStyle = '#BDBDBD';
  ctx.font = '400 18px "Noto Sans TC", sans-serif';
  ctx.fillText('https://b1201004-beep.github.io/painkyl-quiz/', W / 2, H - 82);

  // to image
  const url = canvas.toDataURL('image/png');
  const imgEl = document.getElementById('shareImage');
  const wrap = document.getElementById('shareImageWrap');
  const dl = document.getElementById('downloadImageBtn');
  imgEl.src = url;
  dl.href = url;
  dl.download = `painkyl-${result.code}.png`;
  wrap.hidden = false;
  dl.hidden = false;
  return url;
}

function setupShareImage(result) {
  const btn = document.getElementById('generateImageBtn');
  const wrap = document.getElementById('shareImageWrap');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const span = btn.querySelector('span');
    const original = span ? span.textContent : btn.textContent;
    if (span) span.textContent = '產生中...';
    else btn.textContent = '產生中...';
    btn.disabled = true;
    try {
      await generateShareImage(result);
      if (span) span.textContent = '已產生 ✓ 長按圖片儲存';
      else btn.textContent = '已產生 ✓ 長按圖片儲存';
      wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
      if (span) span.textContent = original;
      else btn.textContent = original;
      btn.disabled = false;
    }
  });
}

const answers = loadAnswers();
if (answers.filter(Boolean).length === 0) {
  softNavigate('index.html');
} else {
  const result = renderResult(calculateResult(answers));
  renderEducation();
  bindShare(result);
  setupShareImage(result);
  setupReveal();
  setTimeout(() => {
    sfxSuccess();
    confetti(result.color);
  }, 500);
}
