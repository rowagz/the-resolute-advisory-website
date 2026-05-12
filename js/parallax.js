// Parallax — subtle upward drift on scroll, shared RAF loop
// Uses data-parallax="0.05" (speed factor) on elements.
// Positive factor = element drifts up slower than page (depth feel).
// Respects prefers-reduced-motion.
(function(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(window.innerWidth <= 820) return; // skip on mobile

  const els = [];
  let ticking = false;

  function collect(){
    els.length = 0;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      els.push({
        el,
        factor: parseFloat(el.dataset.parallax) || 0.05,
        cached: null // will cache rect on first visible pass
      });
    });
  }

  function update(){
    const scrollY = window.scrollY;
    const viewH = window.innerHeight;

    for(const item of els){
      const rect = item.el.getBoundingClientRect();
      // Only process if element is near viewport (±200px buffer)
      if(rect.bottom < -200 || rect.top > viewH + 200) continue;

      // Calculate how far the element's center is from viewport center
      const elCenter = rect.top + rect.height / 2;
      const viewCenter = viewH / 2;
      const offset = (elCenter - viewCenter) * item.factor;

      item.el.style.transform = `translateY(${offset.toFixed(1)}px)`;
    }
    ticking = false;
  }

  function onScroll(){
    if(!ticking){
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  collect();
  window.addEventListener('scroll', onScroll, {passive: true});
  window.addEventListener('resize', () => { collect(); onScroll(); });
  onScroll();
})();
