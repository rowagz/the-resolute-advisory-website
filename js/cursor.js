// Custom cursor with speed-line trail
(function(){
  const cursor = document.getElementById('cursor');
  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  const label = document.getElementById('cursorLabel');
  const trailCanvas = document.getElementById('cursorTrail');

  if(window.matchMedia('(max-width:820px)').matches || !window.matchMedia('(pointer: fine)').matches){
    document.body.classList.add('no-cursor-fx');
    return;
  }

  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let dx = mx, dy = my; // dot
  let rx = mx, ry = my; // ring
  let vx = 0, vy = 0;
  let pmx = mx, pmy = my;

  const tctx = trailCanvas.getContext('2d');
  let tw=0, th=0, dpr = Math.min(window.devicePixelRatio||1, 2);
  function resize(){
    tw = window.innerWidth; th = window.innerHeight;
    trailCanvas.width = tw * dpr; trailCanvas.height = th * dpr;
    tctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  const trail = [];
  const ANGLE = -55 * Math.PI/180;
  const cos = Math.cos(ANGLE), sin = Math.sin(ANGLE);

  window.addEventListener('mousemove', (e)=>{
    mx = e.clientX; my = e.clientY;
    vx = mx - pmx; vy = my - pmy;
    const speed = Math.hypot(vx, vy);
    if(speed > 3){
      // spawn a few trail lines
      const n = Math.min(3, Math.floor(speed / 8));
      for(let i=0;i<n;i++){
        trail.push({
          x: mx + (Math.random()-0.5)*20,
          y: my + (Math.random()-0.5)*20,
          len: 20 + Math.random() * 50,
          life: 1
        });
      }
    }
    pmx = mx; pmy = my;
  });

  // Magnetic CTA collection (used in tick)
  const MAG_RADIUS = 90, MAG_STRENGTH = 0.22, MAG_RETURN = 0.16;
  const magnets = [];
  document.querySelectorAll('[data-cursor="cta"]:not(.case-head)').forEach(el => {
    magnets.push({el, rx: 0, ry: 0});
  });

  let frame = 0;
  function tick(){
    frame++;
    // dot follows fast
    dx += (mx - dx) * 0.6;
    dy += (my - dy) * 0.6;
    // ring eases
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;

    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    if(label && cursor.classList.contains('has-label')){
      label.style.transform = `translate(${mx}px, ${my}px) translate(18px, 18px)`;
    }

    // draw trail
    tctx.clearRect(0, 0, tw, th);
    const dark = cursor.classList.contains('over-dark');
    const stroke = dark ? 'rgba(255,255,255,' : 'rgba(15,26,46,';
    for(let i = trail.length - 1; i >= 0; i--){
      const t = trail[i];
      t.life -= 0.04;
      if(t.life <= 0){ trail.splice(i,1); continue; }
      tctx.strokeStyle = stroke + (t.life * 0.5).toFixed(2) + ')';
      tctx.lineWidth = 1;
      tctx.beginPath();
      tctx.moveTo(t.x, t.y);
      tctx.lineTo(t.x + cos * t.len * t.life, t.y + sin * t.len * t.life);
      tctx.stroke();
    }

    // magnetic CTAs
    for(let i = 0; i < magnets.length; i++){
      const m = magnets[i];
      const r = m.el.getBoundingClientRect();
      const ddx = mx - (r.left + r.width / 2);
      const ddy = my - (r.top + r.height / 2);
      const dist = Math.hypot(ddx, ddy);
      const tx = dist < MAG_RADIUS ? ddx * MAG_STRENGTH : 0;
      const ty = dist < MAG_RADIUS ? ddy * MAG_STRENGTH : 0;
      m.rx += (tx - m.rx) * MAG_RETURN;
      m.ry += (ty - m.ry) * MAG_RETURN;
      m.el.style.transform = `translate(${m.rx.toFixed(2)}px, ${m.ry.toFixed(2)}px)`;
    }

    // dark detection — every 8 frames (~7Hz)
    if((frame & 7) === 0) checkDark();

    requestAnimationFrame(tick);
  }

  // Hover states
  function setHover(type, labelText){
    cursor.classList.remove('hover-link','hover-cta','hover-field','hover-svc');
    if(type) cursor.classList.add('hover-' + type);
    if(labelText){ label.textContent = labelText; cursor.classList.add('has-label'); }
    else cursor.classList.remove('has-label');
  }

  document.addEventListener('mouseover', (e)=>{
    const el = e.target.closest('[data-cursor]');
    if(!el){ setHover(null); return; }
    const kind = el.getAttribute('data-cursor');
    const labels = {
      cta: 'Click',
      svc: 'View',
      link: '',
      logo: '↑ Top',
      chip: 'Pick',
      field: ''
    };
    if(kind === 'cta') setHover('cta', labels.cta);
    else if(kind === 'svc') setHover('link', labels.svc);
    else if(kind === 'field') setHover('field', '');
    else if(kind === 'chip') setHover('link', labels.chip);
    else if(kind === 'logo') setHover('link', labels.logo);
    else setHover('link', '');
  });

  // Dark section detection (driven by tick — see ~7Hz call above)
  const darkEls = document.querySelectorAll('.proof, .studio, .contact, .footer, .signature .sig-pane--dark');
  const navDarkEls = document.querySelectorAll('.proof, .studio, .contact, .footer');
  function checkDark(){
    let isDark = false;
    for(const el of darkEls){
      const r = el.getBoundingClientRect();
      if(my >= r.top && my <= r.bottom && mx >= r.left && mx <= r.right){ isDark = true; break; }
    }
    cursor.classList.toggle('over-dark', isDark);

    let navDark = false;
    for(const el of navDarkEls){
      const r = el.getBoundingClientRect();
      if(r.top <= 60 && r.bottom > 60){ navDark = true; break; }
    }
    document.body.classList.toggle('nav-dark', navDark);
  }

  tick();
})();
