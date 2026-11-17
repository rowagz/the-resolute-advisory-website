// Nav toggle, smooth anchor scroll, Lenis smooth scroll engine
(function(){
  // ── Lenis smooth scroll ──
  let lenis = null;
  if(window.Lenis && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
    lenis = new Lenis({
      duration: 1.15,
      easing: function(t){ return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, // expo-out
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5
    });
    function raf(time){
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ── Smooth anchor clicks ──
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(!target) return;
    e.preventDefault();
    if(lenis){
      lenis.scrollTo(target, {offset: 0, duration: 1.4});
    } else {
      target.scrollIntoView({behavior:'smooth'});
    }
  });

  // ── Nav toggle (mobile fallback) ──
  const toggle = document.getElementById('navToggle');
  if(toggle){
    toggle.addEventListener('click', ()=>{
      const brief = document.getElementById('brief');
      if(lenis){
        lenis.scrollTo(brief, {duration: 1.4});
      } else {
        brief.scrollIntoView({behavior:'smooth'});
      }
    });
  }
})();
