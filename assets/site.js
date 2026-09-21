// Configured for aisultanp.goatcounter.com.
// Upload this file to the repository's assets folder as assets/site.js.
const GOATCOUNTER_CODE = 'aisultanp';

const menu = document.querySelector('.menu-btn');
const links = document.querySelector('.nav-links');
if (menu && links) {
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
}
const form = document.querySelector('[data-contact-form]');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    status.textContent = 'Thank you! Your message is ready to send.';
    form.reset();
  });
}

(() => {
  const meta = document.querySelector('.article-meta');
  // No account configured: leave the site unchanged and send no requests.
  if (!meta || !/^[a-z0-9][a-z0-9-]*$/.test(GOATCOUNTER_CODE)) return;
  if (location.hostname !== 'aisultanp.github.io') return;
  if (document.getElementById('article-visitors')) return;

  // Root-level duplicate article URLs share the canonical article counter.
  const filename = location.pathname.split('/').pop();
  const articles = ['ai-changing-student-life.html', 'five-ai-tools.html',
    'learning-programming-ai.html'];
  if (!articles.includes(filename)) return;
  const path = '/student-tech-lab/articles/' + filename;
  const origin = 'https://' + GOATCOUNTER_CODE + '.goatcounter.com';

  const badge = document.createElement('p');
  badge.id = 'article-visitors';
  badge.setAttribute('aria-live', 'polite');
  badge.title = 'Estimated visits to this article since tracking began. Repeat opens within an 8-hour session count once. Totals may take up to 4 hours to update.';
  badge.style.cssText = 'display:table;margin:18px 0 0;padding:8px 14px;border:1px solid #36cddd55;border-radius:999px;background:#102b3e;color:#b9f5ff;font:500 14px/1.5 system-ui,sans-serif;max-width:100%;box-sizing:border-box';
  badge.textContent = 'Visitors: …';
  meta.insertAdjacentElement('afterend', badge);

  const tracker = document.createElement('script');
  tracker.async = true;
  tracker.src = 'https://gc.zgo.at/count.js';
  tracker.setAttribute('data-goatcounter', origin + '/count');
  tracker.setAttribute('data-goatcounter-settings', JSON.stringify({path, no_events: true}));
  document.head.appendChild(tracker);

  async function loadCount() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(origin + '/counter/' + encodeURIComponent(path) + '.json', {
        signal: controller.signal, credentials: 'omit'
      });
      if (!response.ok) throw new Error('Counter unavailable');
      const data = await response.json();
      const count = String(data.count ?? '');
      if (!/^\d[\d,.\s]*$/.test(count)) throw new Error('Invalid counter');
      badge.textContent = 'Visitors: ' + count;
    } catch (_) {
      // Never invent a zero or a locally incremented total on failure.
      badge.textContent = 'Visitors: temporarily unavailable';
    } finally {
      clearTimeout(timeout);
    }
  }
  loadCount();
})();
