// Loader
(function(){
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  const pct = document.getElementById('loaderPct');
  const linesG = loader.querySelector('.loader-lines');

  if(window.__TWEAKS && window.__TWEAKS.loaderEnabled === false){
    loader.style.display = 'none';
    document.body.classList.remove('loading');
    window.dispatchEvent(new Event('loader:done'));
    return;
  }
  document.body.classList.add('loading');

  // Fill speed lines in loader mark (legacy SVG only)
  if(linesG && window.fillSvgSpeedLines){
    window.fillSvgSpeedLines(linesG, 800, 180, {spacing: 5});
  }

  let p = 0, finished = false;
  const start = performance.now();

  function finish(){
    if(finished) return;
    finished = true;
    bar.style.width = '100%';
    pct.textContent = '100';
    loader.classList.add('done');
    document.body.classList.remove('loading');
    window.dispatchEvent(new Event('loader:done'));
  }

  // Hard floor: regardless of rAF throttling (backgrounded tab), release the page.
  setTimeout(finish, 2600);

  // If the tab was hidden during load, finish as soon as it returns.
  document.addEventListener('visibilitychange', ()=>{
    if(!document.hidden && performance.now() - start > 1800) finish();
  });

  function tick(){
    const elapsed = performance.now() - start;
    // ease to 100 over ~1800ms
    const target = Math.min(100, (elapsed / 1800) * 100);
    p += (target - p) * 0.15;
    const shown = Math.round(p);
    bar.style.width = shown + '%';
    pct.textContent = String(shown).padStart(2, '0');
    if(finished) return;
    if(p < 99.5){ requestAnimationFrame(tick); }
    else { setTimeout(finish, 280); }
  }
  requestAnimationFrame(tick);
})();
