// Hero: fills the wordmark with speed-lines on reveal, runs reveal-mode variants
(function(){
  const heroSvg = document.getElementById('heroSvg');
  const heroLines = document.getElementById('heroLines');
  const heroWord = document.querySelector('.hero-word');
  const heroFillRect = document.getElementById('heroFillRect');
  const hero = document.querySelector('.hero');
  const heroSl = document.getElementById('heroSl');

  if(window.fillSvgSpeedLines && heroLines){
    window.fillSvgSpeedLines(heroLines, 1200, 260, {spacing: 6, maxLen: 260});
  }

  // ambient hero speed-line field — angle locked to logo (+9°)
  let heroField = null;
  if(heroSl && window.SpeedLineField){
    heroField = window.SpeedLineField(heroSl, {
      color:'rgba(27,42,74,0.16)',
      starColor:'rgba(27,42,74,1)',
      density: window.__TWEAKS.accentDensity || 'low',
      speedMul: 0.55,
      angleDeg: -45
    });
  }
  window.heroField = heroField;

  function reveal(){
    const mode = (window.__TWEAKS && window.__TWEAKS.heroMode) || 'draw';
    if(hero) hero.classList.add('loaded');
    if(heroWord) heroWord.classList.add('filled');
    if(!heroFillRect) return;
    if(mode === 'draw'){
      // animate fill rect from below to cover
      heroFillRect.setAttribute('y', '260');
      requestAnimationFrame(()=>{
        heroFillRect.style.transition = 'transform 1.2s cubic-bezier(0.65,0,0.35,1)';
        heroFillRect.style.transform = 'translateY(-260px)';
        setTimeout(()=> heroWord && heroWord.classList.add('filled'), 700);
      });
    } else if(mode === 'burst'){
      heroFillRect.setAttribute('y', '0');
      heroWord && heroWord.classList.add('filled');
      // spawn extra speed lines
      if(heroLines) window.fillSvgSpeedLines(heroLines, 1200, 260, {spacing: 4, maxLen: 400});
    } else if(mode === 'scan'){
      heroFillRect.setAttribute('y', '130');
      heroFillRect.setAttribute('height', '0');
      requestAnimationFrame(()=>{
        heroFillRect.style.transition = 'y 1s cubic-bezier(0.65,0,0.35,1), height 1s cubic-bezier(0.65,0,0.35,1)';
        heroFillRect.setAttribute('y', '0');
        heroFillRect.setAttribute('height', '260');
        setTimeout(()=> heroWord && heroWord.classList.add('filled'), 500);
      });
    }
  }

  window.addEventListener('loader:done', reveal);

  // ── Logo glow when a shooting star passes through it ──────────────────────
  // Subtle, brief pulse on the hero logo only when a star's head is actually
  // INSIDE the logo bounding box. Glow returns to zero quickly between stars.
  const heroLogoImg = document.querySelector('.hero-logo-img');
  if(heroLogoImg && heroSl && heroField && heroField.getStarPositions){
    let glowRaf = 0;
    let curGlow = 0; // 0..1 smoothed
    const FALL = 0.18; // fast decay so glow doesn't linger
    const RISE = 0.45; // fast attack as star enters
    function tickGlow(){
      const stars = heroField.getStarPositions();
      const canvasRect = heroSl.getBoundingClientRect();
      const logoRect = heroLogoImg.getBoundingClientRect();
      const lcx = (logoRect.left + logoRect.right) / 2;
      const lcy = (logoRect.top + logoRect.bottom) / 2;
      const halfW = (logoRect.right - logoRect.left) / 2;
      const halfH = (logoRect.bottom - logoRect.top) / 2;
      let target = 0;
      for(const s of stars){
        const px = canvasRect.left + s.x;
        const py = canvasRect.top  + s.y;
        // Strict containment: must be inside the actual logo rect
        const inside = px >= logoRect.left && px <= logoRect.right
                    && py >= logoRect.top  && py <= logoRect.bottom;
        if(!inside) continue;
        // Proximity to center (1 at center, 0 at edge)
        const nx = (px - lcx) / halfW;
        const ny = (py - lcy) / halfH;
        const d = Math.min(1, Math.hypot(nx, ny));
        const proximity = 1 - d;
        const intensity = proximity * s.a;
        if(intensity > target) target = intensity;
      }
      // Cap
      target = Math.min(0.6, target);
      if(target > curGlow) curGlow += (target - curGlow) * RISE;
      else curGlow = Math.max(0, curGlow - FALL);
      const g = curGlow;
      if(g > 0.01){
        const blur = (2 + g * 14).toFixed(1);
        const opa  = (g * 0.45).toFixed(2);
        heroLogoImg.style.filter =
          `drop-shadow(0 0 ${blur}px rgba(120,150,210,${opa}))`;
      } else if(heroLogoImg.style.filter){
        heroLogoImg.style.filter = '';
      }
      glowRaf = requestAnimationFrame(tickGlow);
    }
    if(!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
      glowRaf = requestAnimationFrame(tickGlow);
    }
  }

  // footer fill (static, full)
  const footerLines = document.getElementById('footerLines');
  if(footerLines && window.fillSvgSpeedLines){
    window.fillSvgSpeedLines(footerLines, 1200, 260, {spacing: 6, maxLen: 240});
  }
})();
