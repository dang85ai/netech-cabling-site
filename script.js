document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        if (o !== item) {
          o.classList.remove('open');
          o.querySelector('.faq-a').style.maxHeight = null;
          o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        a.style.maxHeight = null;
        q.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal — JS marks elements as will-reveal right before observing,
  // so content already on screen (or with JS disabled) is never hidden.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealSelector = '.sec-head, .value-cell, .cap-card, .case-card, .process-step, .trust-tile, .metric';
    var revealEls = document.querySelectorAll(revealSelector);
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      el.classList.add('will-reveal');
      el.style.transitionDelay = Math.min(i % 6, 5) * 70 + 'ms';
      revealObserver.observe(el);
    });
  }

  // Metrics count-up — fires once, only for elements already marked up
  // with data-count (added on the homepage metrics band).
  var metrics = document.querySelectorAll('.metric[data-count]');
  if (metrics.length && !reduceMotion && 'IntersectionObserver' in window) {
    var metricObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.dataset.animated) return;
        var valueEl = el.querySelector('.metric-value');
        var target = parseInt(el.dataset.count, 10);
        if (!valueEl || isNaN(target)) return;
        el.dataset.animated = 'true';
        var duration = 1100;
        var start = performance.now();
        function tick(now) {
          var t = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          valueEl.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        metricObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    metrics.forEach(function (m) { metricObserver.observe(m); });
  }
});
