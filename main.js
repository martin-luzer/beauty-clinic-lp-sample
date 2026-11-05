(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger) { document.documentElement.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger);

  // なめらかなスクロール
  if (!reduced && window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -72, duration: 1.4 });
      });
    });
  }

  // ヘッダーとスマホの予約帯
  const header = document.querySelector('.header');
  ScrollTrigger.create({ trigger: '.hero', start: 'bottom 90px', onEnter: () => header.classList.add('is-solid'), onLeaveBack: () => header.classList.remove('is-solid') });
  const bar = document.querySelector('.spBar');
  ScrollTrigger.create({ trigger: '.hero', start: 'bottom 70%', endTrigger: '.reserve', end: 'top bottom', onToggle: (s) => bar.classList.toggle('is-on', s.isActive) });

  if (reduced) return;

  // ---------- 開くとき：写真がゆっくり引き、文字が一行ずつ浮かぶ ----------
  const open = gsap.timeline({ defaults: { ease: 'power3.out' } });
  open
    .fromTo('.hero_photo img', { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 3, ease: 'power2.out' }, 0)
    .fromTo('.hero_place', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.2 }, 0.6)
    .fromTo('.hero_line', { opacity: 0, y: 24, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, stagger: 0.28 }, 0.8)
    .fromTo('.hero_lead', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.2 }, 1.6)
    .fromTo('.hero_btn, .hero_note', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 1.85)
    .to('.header, .hero_en', { opacity: 1, duration: 1.2, ease: 'sine.out' }, 1.9);

  // 最初の画面：スクロールで写真が少し沈む
  gsap.to('.hero_photo', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero_body', { yPercent: -10, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

  // ---------- 出てくる動き：ゆっくり下から ----------
  const up = (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, overwrite: true });
  document.querySelectorAll('[data-each]').forEach((g) => {
    const kids = g.querySelectorAll(':scope > [data-up]');
    ScrollTrigger.create({ trigger: g, start: 'top 85%', once: true, onEnter: () => up(kids) });
  });
  document.querySelectorAll('[data-up]').forEach((el) => {
    if (el.parentElement.hasAttribute('data-each')) return;
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => up(el) });
  });

  // 見出しの金の線が中央から伸びる
  gsap.utils.toArray('.secHead_ja').forEach((h) => {
    gsap.fromTo(h, { '--lineScale': 0 }, { '--lineScale': 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
  });

  // 写真：幕が上がるように出て、中の写真はゆっくり引く
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    const img = el.querySelector('img');
    const st = { trigger: el, start: 'top 82%', once: true };
    gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'power4.inOut', scrollTrigger: st });
    gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 2.4, ease: 'power3.out', scrollTrigger: st });
    // 出たあとは、スクロールに合わせてわずかに上下
    gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // 院内の写真：ゆっくり動く
  gsap.fromTo('[data-parallax]', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.inside', start: 'top bottom', end: 'bottom top', scrub: true } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
