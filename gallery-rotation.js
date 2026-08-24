/* People-first rotating CMBC Memory Wall */
(() => {
  if (window.__CMBC_ROTATING_MEMORY_WALL__) return;
  window.__CMBC_ROTATING_MEMORY_WALL__ = true;

  const LABELS = {
    'church-family': '👨‍👩‍👧‍👦 Church Family & Fellowship',
    'byf-youth': '🧒 BYF & Youth',
    'worship': '⛪ Worship & Church Services',
    'special-events': '🎉 Special Events'
  };
  const PRIORITY = ['church-family','byf-youth','worship','church-family','special-events','byf-youth','worship'];
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let photos = [], queue = [], current = -1, timer = null, paused = false;

  const basename = src => decodeURIComponent((src || '').split('/').pop() || '').toLowerCase();
  const valid = p => p && p.src && /\.(jpe?g|png|webp|gif)$/i.test(p.src);

  function dedupe(items){
    const seen = new Set();
    return items.filter(valid).filter(p => {
      const key = basename(p.src);
      if(!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function shuffle(a){
    const x=[...a];
    for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}
    return x;
  }

  function buildQueue(items){
    const pools={};
    Object.keys(LABELS).forEach(k=>pools[k]=shuffle(items.filter(p=>p.album===k)));
    const out=[], used=new Set();
    let guard=0;
    while(out.length<items.length && guard++<500){
      let added=false;
      for(const album of PRIORITY){
        const pool=pools[album]||[];
        while(pool.length){
          const p=pool.shift(), key=basename(p.src);
          if(used.has(key)) continue;
          used.add(key);out.push(p);added=true;break;
        }
        if(out.length>=items.length) break;
      }
      if(!added) break;
    }
    items.forEach(p=>{const key=basename(p.src);if(!used.has(key)){used.add(key);out.push(p)}});
    return out;
  }

  function ensureUI(){
    const host=document.getElementById('featuredMemory');
    if(!host) return null;
    host.classList.add('cmbc-rotating-memory');
    if(!document.getElementById('cmbcMemoryRotationStyles')){
      const s=document.createElement('style');s.id='cmbcMemoryRotationStyles';s.textContent=`
      .cmbc-rotating-memory{position:relative;overflow:hidden;isolation:isolate;min-height:260px;background:#071b39;border-radius:24px;cursor:pointer}
      .cmbc-rotating-memory img{width:100%;height:100%;min-height:260px;max-height:560px;object-fit:cover;display:block;transition:opacity .5s ease,transform .7s ease;opacity:1;transform:scale(1.001)}
      .cmbc-rotating-memory.is-changing img{opacity:.18;transform:scale(1.025)}
      .cmbc-memory-caption{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:42px 18px 16px;background:linear-gradient(transparent,rgba(2,10,24,.88));color:white;display:flex;align-items:flex-end;justify-content:space-between;gap:12px;pointer-events:none}
      .cmbc-memory-caption b{display:block;font-size:1rem}.cmbc-memory-caption span{display:block;font-size:.76rem;opacity:.88;margin-top:3px}.cmbc-memory-live{background:#ffc83d;color:#071b39;border-radius:999px;padding:6px 9px;font-size:.68rem;font-weight:900;white-space:nowrap}
      .cmbc-memory-dots{position:absolute;top:12px;right:12px;z-index:4;background:rgba(7,27,57,.8);backdrop-filter:blur(8px);color:#fff;border-radius:999px;padding:7px 10px;font-size:.7rem;font-weight:800;pointer-events:none}
      @media(max-width:700px){.cmbc-rotating-memory{min-height:220px;border-radius:18px}.cmbc-rotating-memory img{min-height:220px;max-height:390px}.cmbc-memory-caption{padding:34px 13px 12px}.cmbc-memory-caption b{font-size:.9rem}.cmbc-memory-caption span{font-size:.69rem}.cmbc-memory-live{font-size:.62rem}}
      @media(prefers-reduced-motion:reduce){.cmbc-rotating-memory img{transition:none!important}}
      `;document.head.appendChild(s);
    }
    return host;
  }

  function openCurrent(){
    const p=queue[current]; if(!p) return;
    const box=document.getElementById('photoLightbox'), img=document.getElementById('lightboxImage');
    if(box&&img){img.src=encodeURI(p.src);box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
    else window.open(p.src,'_blank','noopener');
  }

  function render(index){
    const host=ensureUI(); if(!host || !queue.length) return;
    current=(index+queue.length)%queue.length;
    const p=queue[current];
    host.classList.add('is-changing');
    const swap=()=>{
      host.innerHTML=`<img src="${encodeURI(p.src)}" alt="${LABELS[p.album]||'CMBC church family memory'}"><div class="cmbc-memory-dots">${current+1} / ${queue.length}</div><div class="cmbc-memory-caption"><div><b>${LABELS[p.album]||'📸 CMBC Memory Wall'}</b><span>Real moments from our church family • Tap to view</span></div><em class="cmbc-memory-live">📸 LIVE MEMORY WALL</em></div>`;
      host.onclick=openCurrent;
      host.classList.remove('is-changing');
    };
    REDUCE ? swap() : setTimeout(swap,180);
  }

  function next(){if(!paused&&queue.length>1)render(current+1)}
  function restart(){clearInterval(timer);if(!REDUCE&&queue.length>1)timer=setInterval(next,5600)}

  async function load(){
    try{
      const r=await fetch('gallery-manifest.json?rotate='+Date.now(),{cache:'no-store'});
      if(!r.ok) return;
      const data=await r.json();
      photos=dedupe(Array.isArray(data.photos)?data.photos:[]);
      queue=buildQueue(photos);
      if(!queue.length) return;
      render(Math.floor(Math.random()*queue.length));restart();
      const host=ensureUI();
      if(host){
        host.addEventListener('mouseenter',()=>paused=true);host.addEventListener('mouseleave',()=>paused=false);
        host.addEventListener('focusin',()=>paused=true);host.addEventListener('focusout',()=>paused=false);
        host.addEventListener('touchstart',()=>{paused=true},{passive:true});host.addEventListener('touchend',()=>setTimeout(()=>paused=false,1800),{passive:true});
      }
    }catch(_){}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(load,900));else setTimeout(load,900);
})();