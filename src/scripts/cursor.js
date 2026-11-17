// Minimal custom cursor — dot + ring follow, subtle hover, no trail/label/magnetic
(function(){
  const cursor = document.getElementById('cursor');
  if(!cursor) return;
  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  // Disable on touch / coarse-pointer / small viewport
  if(window.matchMedia('(max-width:820px)').matches || !window.matchMedia('(pointer: fine)').matches){
    document.body.classList.add('no-cursor-fx');
    return;
  }

  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let dx = mx, dy = my; // dot position
  let rx = mx, ry = my; // ring position

  window.addEventListener('mousemove', (e)=>{
    mx = e.clientX; my = e.clientY;
  });

  // Hover state: ring grows for any [data-cursor] interactive element
  document.addEventListener('mouseover', (e)=>{
    const el = e.target.closest('[data-cursor]');
    cursor.classList.toggle('hover-link', !!el);
  });

  // Nav-dark detection (~7Hz) — drives the scroll-progress bar color over dark sections
  const navDarkEls = document.querySelectorAll('.engagement, .brief, .site-footer');
  function checkNavDark(){
    let navDark = false;
    for(const el of navDarkEls){
      const r = el.getBoundingClientRect();
      if(r.top <= 60 && r.bottom > 60){ navDark = true; break; }
    }
    document.body.classList.toggle('nav-dark', navDark);
  }

  let frame = 0;
  function tick(){
    frame++;
    // dot snaps faster, ring eases
    dx += (mx - dx) * 0.6;
    dy += (my - dy) * 0.6;
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    if((frame & 7) === 0) checkNavDark();
    requestAnimationFrame(tick);
  }
  tick();
})();
