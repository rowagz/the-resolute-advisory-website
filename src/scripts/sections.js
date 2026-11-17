// Section behaviors: scroll progress, nav scrolled state, counters, reveals, footer time
(function(){
  const nav = document.getElementById('nav');
  const sp = document.getElementById('scrollProgress');

  function onScroll(){
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (y / max) * 100 : 0;
    sp.style.setProperty('--sp', pct + '%');
    nav.classList.toggle('scrolled', y > 40);

    // signature pin clip
    const sig = document.getElementById('signature');
    const light = document.getElementById('sigLight');
    if(sig && light){
      const r = sig.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -r.top / total));
      const inset = (1 - progress) * 100;
      light.style.clipPath = `inset(0 0 0 ${inset}%)`;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // ── Counters (proof bar numbers) ──
  const counters = document.querySelectorAll('.proof-n');
  const cObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target;
        const raw = el.textContent.trim();
        // Parse number and suffix from text like "50+", "7", "~12"
        const prefix = raw.match(/^[^0-9]*/)[0] || '';
        const numMatch = raw.match(/\d+/);
        if(!numMatch){ cObs.unobserve(el); return; }
        const target = parseInt(numMatch[0], 10);
        const suffix = raw.slice(raw.indexOf(numMatch[0]) + numMatch[0].length);
        const start = performance.now();
        const dur = 1600;
        function step(t){
          const k = Math.min(1, (t - start) / dur);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = prefix + Math.floor(eased * target) + (k >= 0.99 ? suffix : '');
          if(k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cObs.unobserve(el);
      }
    });
  }, {threshold: 0.3});
  counters.forEach(c => cObs.observe(c));

  // ── Reveal-on-scroll ──
  const revealSelector = [
    '.c-title','.c-sub','.position-lead','.prac-row','.eng-cell',
    '.proof-cell','.t-row','.b-aside-block','.pcp-row',
    '.ins-item','.impl-arm',
    '.work-section-title','.work-section-sub'
  ].join(',');

  const revealEls = document.querySelectorAll(revealSelector);
  const rObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        // Stagger: find sibling index among same-class elements
        const parent = e.target.parentElement;
        if(parent){
          const cls = e.target.classList[0];
          const siblings = [...parent.children].filter(c => c.classList.contains(cls));
          const idx = siblings.indexOf(e.target);
          if(idx > 0) e.target.style.transitionDelay = (idx * 0.06) + 's';
        }
        e.target.classList.add('revealed');
        rObs.unobserve(e.target);
      }
    });
  }, {threshold: 0.06});
  revealEls.forEach(el => rObs.observe(el));

  // Case stack (§06) is handled by the CaseStack React island.

  // ── Footer time ──
  const ft = document.getElementById('footerTime');
  function updateTime(){
    const d = new Date();
    const h = String(d.getHours()).padStart(2,'0');
    const m = String(d.getMinutes()).padStart(2,'0');
    if(ft) ft.textContent = `${h}:${m} local`;
  }
  updateTime();
  setInterval(updateTime, 30000);

  // Brief form (§08) is handled by the BriefForm React island.
})();
