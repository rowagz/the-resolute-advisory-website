// Tweaks panel + edit-mode protocol
(function(){
  const panel = document.getElementById('tweaks');
  const closeBtn = document.getElementById('tweaksClose');

  const state = Object.assign({
    heroMode: 'draw',
    cursorStyle: 'speedline',
    accentDensity: 'medium',
    loaderEnabled: true
  }, window.__TWEAKS || {});

  function apply(){
    document.body.setAttribute('data-cursor-style', state.cursorStyle);
    if(window.heroField){
      try{ window.heroField.setDensity(state.accentDensity); }catch(_){}
    }
  }
  apply();

  function persist(partial){
    try{
      window.parent.postMessage({type:'__edit_mode_set_keys', edits: partial}, '*');
    }catch(_){}
  }

  function setActive(){
    panel.querySelectorAll('.tweak-opts').forEach(group => {
      const key = group.getAttribute('data-key');
      group.querySelectorAll('button').forEach(b => {
        const v = b.getAttribute('data-val');
        const match = String(state[key]) === v;
        b.classList.toggle('active', match);
      });
    });
  }
  setActive();

  panel.querySelectorAll('.tweak-opts button').forEach(btn => {
    btn.addEventListener('click', ()=>{
      const group = btn.closest('.tweak-opts');
      const key = group.getAttribute('data-key');
      let v = btn.getAttribute('data-val');
      if(v === 'true') v = true;
      else if(v === 'false') v = false;
      state[key] = v;
      const patch = {}; patch[key] = v;
      persist(patch);
      setActive();
      apply();
    });
  });

  // Edit-mode host protocol — listener first
  window.addEventListener('message', (e)=>{
    const data = e.data || {};
    if(data.type === '__activate_edit_mode'){
      panel.classList.add('open');
      panel.setAttribute('aria-hidden','false');
    } else if(data.type === '__deactivate_edit_mode'){
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden','true');
    }
  });
  closeBtn.addEventListener('click', ()=>{
    panel.classList.remove('open');
    try{ window.parent.postMessage({type:'__edit_mode_deactivate'}, '*'); }catch(_){}
  });

  // Announce availability last
  try{ window.parent.postMessage({type:'__edit_mode_available'}, '*'); }catch(_){}
})();
