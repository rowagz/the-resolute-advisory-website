// Motion discipline: signature moments only (hero ambient + signature wipe).
// Proof + Contact use a static etched pattern instead of animated speed-lines.
function initStaticEtch(){
  const proofCanvas = document.getElementById('proofCanvas');
  const contactSl = document.getElementById('contactSl');
  if(!window.fillSvgSpeedLines) return;

  function etchStatic(canvas, color){
    if(!canvas || !canvas.parentNode) return;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(rect.width || canvas.offsetWidth || canvas.parentNode.offsetWidth || window.innerWidth, 600);
    const h = Math.max(rect.height || canvas.offsetHeight || canvas.parentNode.offsetHeight || 800, 400);
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio','xMidYMid slice');
    svg.setAttribute('aria-hidden','true');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.5';
    svg.className = canvas.className;
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('stroke', color);
    g.setAttribute('stroke-width', '1');
    svg.appendChild(g);
    window.fillSvgSpeedLines(g, w, h, {spacing: 22, maxLen: 140, minLen: 20});
    canvas.parentNode.replaceChild(svg, canvas);
  }

  etchStatic(proofCanvas, 'rgba(255,255,255,0.18)');
  etchStatic(contactSl, 'rgba(255,255,255,0.14)');
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=> requestAnimationFrame(initStaticEtch));
} else {
  requestAnimationFrame(initStaticEtch);
}
