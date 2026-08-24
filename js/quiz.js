import { questions } from './data.js';
import { sfxClick } from './immersive.js';
import { softNavigate } from './router.js';

const KEY = 'painkyl_answers';
const idx = Number(document.body.dataset.question) - 1;
const q = questions[idx];

const els = {
  title: document.querySelector('.question-title'),
  scenario: document.querySelector('.question-scenario'),
  options: document.querySelector('.options-container'),
  nextBtn: document.getElementById('nextBtn'),
  prevBtn: document.getElementById('prevBtn')
};

function loadAnswers() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function saveAnswer(type) {
  const answers = loadAnswers();
  answers[idx] = type;
  sessionStorage.setItem(KEY, JSON.stringify(answers));
}

function render() {
  document.title = `第 ${idx + 1} 題 | Painkyl 醫護人格測驗`;
  els.title.textContent = q.title;
  els.scenario.textContent = q.scenario;

  q.options.forEach((opt, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'option-item';
    wrap.innerHTML = `
      <input class="option-input" type="radio" name="q" id="opt-${i}" value="${opt.type}">
      <label class="option-label" for="opt-${i}">
        <span class="option-radio" aria-hidden="true"></span>
        <span class="option-text">${opt.text}</span>
      </label>`;
    const input = wrap.querySelector('input');
    input.addEventListener('change', () => {
      saveAnswer(opt.type);
      sfxClick();
      els.options.querySelectorAll('.option-label').forEach(l => l.classList.remove('pop'));
      wrap.querySelector('.option-label').classList.add('pop');
      els.nextBtn.disabled = false;
    });
    els.options.appendChild(wrap);
  });

  const saved = loadAnswers()[idx];
  if (saved) {
    const target = q.options.findIndex(o => o.type === saved);
    if (target >= 0) {
      document.getElementById(`opt-${target}`).checked = true;
      els.nextBtn.disabled = false;
    }
  }
}

els.nextBtn.addEventListener('click', () => {
  const selected = loadAnswers()[idx];
  if (!selected) return;
  sfxClick();
  softNavigate(idx < questions.length - 1 ? `quiz${idx + 2}.html` : 'result.html');
});

render();
