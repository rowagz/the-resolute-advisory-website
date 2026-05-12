// Speed-line generator — angle locked to logo (-45° from horizontal — lines tilt down-right \)
// Per-instance angle can be passed in opts.angleDeg.
(function(){
  const LOGO_ANGLE_DEG = -45;
  const DEFAULT_ANGLE = LOGO_ANGLE_DEG * Math.PI / 180;

  // Fill an SVG <g> with speed lines inside a bounding box
  window.fillSvgSpeedLines = function(gEl, w, h, opts){
    if(!gEl) return;
    opts = opts || {};
    const angle = (opts.angleDeg !== undefined ? opts.angleDeg : LOGO_ANGLE_DEG) * Math.PI / 180;
    const minLen = opts.minLen || 20;
    const maxLen = opts.maxLen || 180;
    const spacing = opts.spacing || 8;

    while(gEl.firstChild) gEl.removeChild(gEl.firstChild);

    const cos = Math.cos(angle), sin = Math.sin(angle);
    const span = Math.abs(w * cos) + Math.abs(h * sin) + 200;
    const perp = Math.abs(w * sin) + Math.abs(h * cos) + 200;

    const cx = w/2, cy = h/2;
    const px = -sin, py = cos;

    const count = Math.floor(perp / spacing);
    const frag = document.createDocumentFragment();
    for(let i = 0; i < count; i++){
      const t = (i / count - 0.5) * perp;
      const ax = cx + px * t;
      const ay = cy + py * t;

      const off = (Math.random() - 0.5) * span * 0.8;
      const len = minLen + Math.random() * (maxLen - minLen);

      const x1 = ax + cos * (off - len/2);
      const y1 = ay + sin * (off - len/2);
      const x2 = ax + cos * (off + len/2);
      const y2 = ay + sin * (off + len/2);

      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', x1.toFixed(1));
      line.setAttribute('y1', y1.toFixed(1));
      line.setAttribute('x2', x2.toFixed(1));
      line.setAttribute('y2', y2.toFixed(1));
      line.setAttribute('opacity', (0.3 + Math.random() * 0.7).toFixed(2));
      frag.appendChild(line);
    }
    gEl.appendChild(frag);
  };

  // Canvas speed-line field (ambient drift)
  window.SpeedLineField = function(canvas, opts){
    opts = opts || {};
    if(!canvas) return null;
    const ctx = canvas.getContext('2d');
    const color = opts.color || 'rgba(27,42,74,0.25)';
    const densityMap = {low: 0.0004, medium: 0.0010, high: 0.0018};
    let density = densityMap[opts.density || 'medium'];
    const speedMul = opts.speedMul !== undefined ? opts.speedMul : 1;
    let angle = (opts.angleDeg !== undefined ? opts.angleDeg : LOGO_ANGLE_DEG) * Math.PI / 180;
    let cos = Math.cos(angle), sin = Math.sin(angle);

    let lines = [];
    let stars = [];           // shooting-star streaks
    let nextStarAt = 0;       // timestamp for next spawn
    const enableStars = opts.shootingStars !== false;
    const starColor = opts.starColor || color.replace(/rgba?\([^)]+\)/, m => {
      // brighter version of the base color: bump alpha to ~1
      const parts = m.match(/[\d\.]+/g);
      if(!parts) return 'rgba(27,42,74,1)';
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, 1)`;
    });
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio||1, 2);
    let rafId = 0, mouseX = 0.5, mouseY = 0.5, scrollY = 0;
    let lastT = performance.now();

    function resize(){
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor(w * h * density);
      lines = [];
      for(let i=0;i<count;i++) lines.push(makeLine());
    }

    function makeLine(){
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        len: 30 + Math.random() * 160,
        speed: (0.2 + Math.random() * 0.8) * speedMul,
        opacity: 0.15 + Math.random() * 0.5
      };
    }

    function spawnStar(kind){
      // Spawn off-screen on the upstream edge so the streak crosses the canvas.
      const margin = 80;
      const diag = Math.sqrt(w*w + h*h);
      const px = -sin, py = cos;
      const t = (Math.random() - 0.5) * (Math.abs(w*sin) + Math.abs(h*cos) + 200);
      const cx0 = w/2 + px * t;
      const cy0 = h/2 + py * t;
      const back = diag/2 + margin;
      const x = cx0 - cos * back;
      const y = cy0 - sin * back;

      // "main event" streaks: faster, longer, brighter, thicker head
      const isHero = kind === 'hero' || (kind === undefined && Math.random() < 0.18);

      const speed = isHero ? 11 + Math.random() * 6 : 6 + Math.random() * 6;
      const tail  = isHero ? 180 + Math.random() * 220 : 90 + Math.random() * 140;
      const head  = isHero ? 2.0 + Math.random() * 1.4 : 1.4 + Math.random() * 1.0;
      const opacity = isHero ? 0.85 + Math.random() * 0.15 : 0.55 + Math.random() * 0.4;

      stars.push({
        x, y,
        speed,
        tail,
        head,
        opacity,
        traveled: 0,
        maxTravel: diag + margin*2,
        // tiny lateral wobble offset (perpendicular to travel) so streaks don't all sit on one band
        wobble: (Math.random() - 0.5) * 4,
        // sparkle chance + cooldown
        sparkleCooldown: 0,
        sparkles: []
      });
    }

    function scheduleNextStar(now){
      // very rare — average ~ every 12–22s
      nextStarAt = now + 12000 + Math.random() * 10000;
    }

    function draw(){
      const now = performance.now();
      const dt = Math.min(48, now - lastT) / 16.67; // frame factor (1 = 60fps)
      lastT = now;
      ctx.clearRect(0, 0, w, h);
      const mx = (mouseX - 0.5) * 40;
      const my = (mouseY - 0.5) * 40;
      const parY = scrollY * 0.05;

      // Ambient drift lines
      for(const L of lines){
        L.x += cos * L.speed;
        L.y += sin * L.speed;
        if(L.x < -L.len || L.y < -L.len || L.x > w + L.len || L.y > h + L.len){
          Object.assign(L, makeLine());
          if(Math.random() < 0.5){
            // come in from the upstream side
            if(cos >= 0){ L.x = -L.len; L.y = Math.random() * h; }
            else { L.x = w + L.len; L.y = Math.random() * h; }
          } else {
            if(sin >= 0){ L.y = -L.len; L.x = Math.random() * w; }
            else { L.y = h + L.len; L.x = Math.random() * w; }
          }
        }
        ctx.strokeStyle = color.replace(/[\d\.]+\)$/, L.opacity.toFixed(2) + ')');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(L.x + mx, L.y + my - parY);
        ctx.lineTo(L.x + cos * L.len + mx, L.y + sin * L.len + my - parY);
        ctx.stroke();
      }

      // Shooting stars
      if(enableStars){
        if(now > nextStarAt){
          spawnStar();
          // sometimes a quick second one (a "pair")
          if(Math.random() < 0.08) {
            setTimeout(()=> { if(stars.length < 12) spawnStar(); }, 120 + Math.random()*180);
          }
          // very rare hero-streak guarantee
          if(Math.random() < 0.04) spawnStar('hero');
          scheduleNextStar(now);
        }
        // perp axis (for wobble + sparkle offsets)
        const px = -sin, py = cos;

        for(let i = stars.length - 1; i >= 0; i--){
          const S = stars[i];
          S.x += cos * S.speed * dt;
          S.y += sin * S.speed * dt;
          S.traveled += S.speed * dt;

          // Position w/ parallax + slight perpendicular wobble
          const hx = S.x + mx + px * S.wobble;
          const hy = S.y + my - parY + py * S.wobble;

          // Tail end coords (opposite to travel direction)
          const tx = hx - cos * S.tail;
          const ty = hy - sin * S.tail;

          // Fade ramp: fade in fast, sustain, fade out at the end
          const k = S.traveled / S.maxTravel;
          const envelope = k < 0.12 ? (k / 0.12)
                          : k > 0.85 ? Math.max(0, 1 - (k - 0.85) / 0.15)
                          : 1;
          const a = S.opacity * envelope;

          if(a > 0.02){
            // ── Long fading tail (gradient stroke) ──
            const grad = ctx.createLinearGradient(tx, ty, hx, hy);
            grad.addColorStop(0,    starColor.replace(/[\d\.]+\)$/, '0)'));
            grad.addColorStop(0.55, starColor.replace(/[\d\.]+\)$/, (a*0.30).toFixed(3)+')'));
            grad.addColorStop(0.85, starColor.replace(/[\d\.]+\)$/, (a*0.65).toFixed(3)+')'));
            grad.addColorStop(1,    starColor.replace(/[\d\.]+\)$/, a.toFixed(3)+')'));
            ctx.strokeStyle = grad;
            ctx.lineWidth = S.head;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(hx, hy);
            ctx.stroke();

            // ── Elongated teardrop head glow (stretched along travel axis) ──
            const headLen = 14 + S.head * 4;   // along travel axis
            const headW   = 4 + S.head * 1.2;  // perpendicular width
            const ang = Math.atan2(sin, cos);
            ctx.save();
            ctx.translate(hx, hy);
            ctx.rotate(ang);
            // shift gradient center slightly back so tip is the brightest point
            const cxg = -headLen * 0.25;
            const rgrad = ctx.createRadialGradient(cxg, 0, 0, cxg, 0, headLen);
            rgrad.addColorStop(0,    starColor.replace(/[\d\.]+\)$/, (a * 1.0).toFixed(3)+')'));
            rgrad.addColorStop(0.35, starColor.replace(/[\d\.]+\)$/, (a * 0.55).toFixed(3)+')'));
            rgrad.addColorStop(1,    starColor.replace(/[\d\.]+\)$/, '0)'));
            ctx.fillStyle = rgrad;
            ctx.scale(1, headW / headLen);     // squish vertically → ellipse
            ctx.beginPath();
            ctx.arc(cxg, 0, headLen, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();

            // ── Sharp bright core streak right at the head (very short, very bright) ──
            const coreLen = headLen * 0.55;
            const coreGrad = ctx.createLinearGradient(
              hx - cos * coreLen, hy - sin * coreLen, hx, hy
            );
            coreGrad.addColorStop(0, starColor.replace(/[\d\.]+\)$/, '0)'));
            coreGrad.addColorStop(1, starColor.replace(/[\d\.]+\)$/, Math.min(1, a*1.1).toFixed(3)+')'));
            ctx.strokeStyle = coreGrad;
            ctx.lineWidth = Math.max(1, S.head * 0.55);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(hx - cos * coreLen, hy - sin * coreLen);
            ctx.lineTo(hx, hy);
            ctx.stroke();
          }

          // ── Sparkles: tiny dots that pop off near the head ──
          S.sparkleCooldown -= dt;
          if(envelope > 0.4 && S.sparkleCooldown <= 0 && Math.random() < 0.35){
            S.sparkleCooldown = 1 + Math.random() * 2;
            // spawn a tiny sparkle behind the head
            S.sparkles.push({
              x: hx - cos * (5 + Math.random()*15),
              y: hy - sin * (5 + Math.random()*15),
              vx: (Math.random()-0.5) * 0.6,
              vy: (Math.random()-0.5) * 0.6,
              life: 1
            });
          }
          // update + draw sparkles
          for(let j = S.sparkles.length - 1; j >= 0; j--){
            const sp = S.sparkles[j];
            sp.x += sp.vx * dt;
            sp.y += sp.vy * dt;
            sp.life -= 0.04 * dt;
            if(sp.life <= 0){ S.sparkles.splice(j,1); continue; }
            const sa = sp.life * a * 0.9;
            if(sa > 0.02){
              ctx.fillStyle = starColor.replace(/[\d\.]+\)$/, sa.toFixed(3)+')');
              ctx.beginPath();
              ctx.arc(sp.x, sp.y, 0.9 + sp.life*0.6, 0, Math.PI*2);
              ctx.fill();
            }
          }

          if(S.traveled > S.maxTravel + S.tail) stars.splice(i, 1);
        }
        ctx.lineCap = 'butt';
      }

      rafId = requestAnimationFrame(draw);
    }

    const onResize = ()=> resize();
    const onMove = (e)=>{ mouseX = e.clientX / window.innerWidth; mouseY = e.clientY / window.innerHeight; };
    const onScroll = ()=>{ scrollY = window.scrollY; };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, {passive:true});

    resize();
    scheduleNextStar(performance.now());
    draw();

    return {
      setDensity: (d)=>{ density = densityMap[d] || densityMap.medium; resize(); },
      setAngle: (deg)=>{ angle = deg * Math.PI / 180; cos = Math.cos(angle); sin = Math.sin(angle); },
      shoot: ()=>{ spawnStar(); },
      // Returns the current active stars' canvas-space head positions [{x,y,intensity}, ...]
      getStarPositions: ()=>{
        const out = [];
        for(const S of stars){
          const k = S.traveled / S.maxTravel;
          const envelope = k < 0.12 ? (k / 0.12)
                          : k > 0.85 ? Math.max(0, 1 - (k - 0.85) / 0.15)
                          : 1;
          const a = S.opacity * envelope;
          if(a <= 0.05) continue;
          // World-to-canvas mapping mirrors draw():
          // hx = S.x + mx + px * S.wobble; hy = S.y + my - parY + py * S.wobble
          const mx = (mouseX - 0.5) * 30;
          const my = (mouseY - 0.5) * 30;
          const parY = scrollY * 0.05;
          const px2 = -sin, py2 = cos;
          const hx = S.x + mx + px2 * S.wobble;
          const hy = S.y + my - parY + py2 * S.wobble;
          out.push({ x: hx, y: hy, a });
        }
        return out;
      },
      destroy: ()=>{
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('scroll', onScroll);
      }
    };
  };

  // Auto-mount ambient speed-line canvases on any [data-speedlines] element
  function mountAmbient(){
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('[data-speedlines]').forEach(host => {
      if(host.__slMounted) return;
      host.__slMounted = true;
      // Ensure host can host an absolute child
      const cs = getComputedStyle(host);
      if(cs.position === 'static') host.style.position = 'relative';
      const canvas = document.createElement('canvas');
      canvas.className = 'sl-ambient';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:'+(host.dataset.slOpacity || '0.35');
      host.insertBefore(canvas, host.firstChild);
      const dark = host.dataset.slTheme === 'dark';
      const color = host.dataset.slColor || (dark ? 'rgba(220,230,245,0.18)' : 'rgba(27,42,74,0.18)');
      window.SpeedLineField(canvas, {
        color,
        density: host.dataset.slDensity || 'low',
        speedMul: parseFloat(host.dataset.slSpeed || '0.5'),
        angleDeg: parseFloat(host.dataset.slAngle || '9')
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', mountAmbient);
  } else {
    mountAmbient();
  }
  // Re-mount on dynamic content
  window.mountAmbientSpeedlines = mountAmbient;
})();
