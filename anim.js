/* Comptoir du Portugal — reveal-on-scroll + micro-animations */
(function () {
  if (window.__cdpAnimInit) return;
  window.__cdpAnimInit = true;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var base = el.getAttribute('data-rev-base') || '';
      el.style.opacity = '1';
      el.style.transform = base || 'none';
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

  var stagger = 0;
  function prep(el) {
    if (el.hasAttribute('data-rev-ready')) return;
    var r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return; // not laid out yet — retry on next scan
    el.setAttribute('data-rev-ready', '1');
    var cur = el.style.transform;
    var base = (cur && cur !== 'none') ? cur : '';
    el.setAttribute('data-rev-base', base);
    var inView = r.top < window.innerHeight && r.bottom > 0;
    var delay = 0;
    if (inView) { delay = Math.min(stagger * 85, 510); stagger++; }
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = (base ? base + ' ' : '') + 'translateY(18px)';
    void el.offsetWidth; // flush so the transition doesn't animate the hide
    el.style.transition = 'opacity .7s ease ' + delay + 'ms, transform .7s cubic-bezier(.22,1,.36,1) ' + delay + 'ms';
    io.observe(el);
  }

  function scan() {
    document.querySelectorAll('[data-reveal]').forEach(prep);
  }

  function start() {
    scan();
    new MutationObserver(function () { scan(); }).observe(document.body, { childList: true, subtree: true });
    var tries = 0;
    var t = setInterval(function () { scan(); if (++tries > 24) clearInterval(t); }, 250);
  }

  if (document.body) start();
  else addEventListener('DOMContentLoaded', start);
})();
