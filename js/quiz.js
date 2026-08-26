import { questions } from './data.js';
import { sfxClick } from './immersive.js';
import { softNavigate } from './router.js';

const KEY = 'painkyl_answers';
const SET_KEY = 'painkyl_quiz_set';
const idx = Number(document.body.dataset.question) - 1;

function loadAnswers() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 每次測驗從題庫隨機抽 3 題；作答中途保持同一組題目
function ensureSet() {
  let set = null;
  try {
    set = JSON.parse(sessionStorage.getItem(SET_KEY));
  } catch {}
  const hasAnswers = loadAnswers().some(Boolean);
  if (!Array.isArray(set) || set.length !== 3 || (!hasAnswers && idx === 0)) {
    set = shuffle(questions.map(qq => qq.id)).slice(0, 3);
    sessionStorage.setItem(SET_KEY, JSON.stringify(set));
  }
  return set;
}

const setId = ensureSet()[idx] ?? questions[idx].id;
const q = questions.find(x => x.id === setId) || questions[idx];

const els = {
  title: document.querySelector('.question-title'),
  scenario: document.querySelector('.question-scenario'),
  options: document.querySelector('.options-container'),
  nextBtn: document.getElementById('nextBtn'),
  prevBtn: document.getElementById('prevBtn')
};

function saveAnswer(type) {
  const answers = loadAnswers();
  answers[idx] = type;
  sessionStorage.setItem(KEY, JSON.stringify(answers));
}

function render() {
  document.title = `第 ${idx + 1} 題 | Painkyl 癌症疼痛管理者人格測驗`;
  els.title.textContent = q.title;
  els.scenario.textContent = q.scenario;
  if (q.hint && !els.scenario.nextElementSibling?.classList.contains('question-hint')) {
    const hint = document.createElement('p');
    hint.className = 'question-hint';
    hint.textContent = q.hint;
    els.scenario.after(hint);
  }

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
  softNavigate(idx < 2 ? `quiz${idx + 2}.html` : 'result.html');
});

render();
