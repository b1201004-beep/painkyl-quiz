function isInternalLink(a) {
  if (!a) return false;
  const href = a.getAttribute('href');
  if (!href || !href.endsWith('.html')) return false;
  if (a.target === '_blank' || a.hasAttribute('download')) return false;
  return a.origin === location.origin;
}

async function render(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error('bad status');
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    swapContent(doc);
  } catch {
    location.href = path;
  }
}

function swapContent(doc) {
  document.title = doc.title;
  document.body.dataset.page = doc.body.dataset.page || '';
  if (doc.body.dataset.question) {
    document.body.dataset.question = doc.body.dataset.question;
  } else {
    delete document.body.dataset.question;
  }

  const oldMain = document.querySelector('main');
  const newMain = doc.querySelector('main');
  if (!oldMain || !newMain) throw new Error('missing main');

  oldMain.replaceWith(document.importNode(newMain, true));

  doc.querySelectorAll('script[type="module"][src]').forEach(s => {
    const url = new URL(s.getAttribute('src'), location.href);
    url.searchParams.set('v', Date.now() + Math.random().toString(36).slice(2));
    import(url.href).catch(() => {});
  });

  window.scrollTo(0, 0);
}

export async function softNavigate(path) {
  history.pushState({}, '', path);
  await render(path);
}

document.addEventListener('click', e => {
  if (e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a');
  if (!isInternalLink(a)) return;
  e.preventDefault();
  history.pushState({}, '', a.getAttribute('href'));
  render(a.getAttribute('href'));
});

window.addEventListener('popstate', () => {
  render(location.pathname);
});
