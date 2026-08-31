/* CMBC all-ages ease-of-use controls. Does not own event/content state. */
(() => {
  if(window.__CMBC_EASE__)return;window.__CMBC_EASE__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const root=document.documentElement,body=document.body;
  const state={scale:1,calm:false,read:false};
  try{Object.assign(state,JSON.parse(localStorage.getItem('cmbc-ease-v1')||'{}'))}catch(_){}
  const save=()=>{try{localStorage.setItem('cmbc-ease-v1',JSON.stringify(state))}catch(_){}};
  const apply=()=>{root.style.setProperty('--cmbc-user-scale',String(state.scale));body.classList.toggle('cmbc-calm',state.calm);body.classList.toggle('cmbc-high-read',state.read);$('#cmbcCalm')?.setAttribute('aria-pressed',String(state.calm));$('#cmbcRead')?.setAttribute('aria-pressed',String(state.read));};

  function tools(){
    const toggle=document.createElement('button');toggle.className='cmbc-tools-toggle';toggle.type='button';toggle.id='cmbcToolsToggle';toggle.setAttribute('aria-label','Open reading and accessibility tools');toggle.setAttribute('aria-expanded','false');toggle.textContent='Aa';
    const panel=document.createElement('aside');panel.className='cmbc-tools';panel.id='cmbcTools';panel.setAttribute('aria-label','Reading and accessibility tools');panel.innerHTML=`<h3>👓 Make the site easier to use</h3><p>Change text size or reduce movement. Your choice stays on this device.</p><div class="cmbc-tools-grid"><button type="button" id="cmbcSmaller" aria-label="Make text smaller">A−</button><button type="button" id="cmbcResetText">A</button><button type="button" id="cmbcLarger" aria-label="Make text larger">A+</button><button type="button" class="wide" id="cmbcRead" aria-pressed="false">📖 Extra-readable text</button><button type="button" class="wide" id="cmbcCalm" aria-pressed="false">🕊️ Calm view / less motion</button></div>`;
    body.append(panel,toggle);
    const close=()=>{panel.classList.remove('open');toggle.setAttribute('aria-expanded','false')};
    toggle.onclick=()=>{const open=panel.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));if(open)panel.querySelector('button')?.focus()};
    $('#cmbcSmaller').onclick=()=>{state.scale=Math.max(.9,Math.round((state.scale-.1)*10)/10);save();apply()};
    $('#cmbcResetText').onclick=()=>{state.scale=1;save();apply()};
    $('#cmbcLarger').onclick=()=>{state.scale=Math.min(1.3,Math.round((state.scale+.1)*10)/10);save();apply()};
    $('#cmbcRead').onclick=()=>{state.read=!state.read;save();apply()};
    $('#cmbcCalm').onclick=()=>{state.calm=!state.calm;save();apply()};
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    document.addEventListener('pointerdown',e=>{if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==toggle)close()});
  }

  function phoneDock(){
    if($('.cmbc-phone-dock'))return;
    const nav=document.createElement('nav');nav.className='cmbc-phone-dock';nav.setAttribute('aria-label','Quick mobile navigation');
    nav.innerHTML=`<a href="#top" data-dock="top"><i>🏠</i><span>Home</span></a><a href="#times" data-dock="times"><i>⛪</i><span>Services</span></a><a href="#prayer" data-dock="prayer"><i>🙏</i><span>Prayer</span></a><a href="#kids-corner" data-dock="kids-corner"><i>🧒</i><span>Kids</span></a><a href="#visit" data-dock="visit"><i>📍</i><span>Visit</span></a>`;
    body.appendChild(nav);
  }

  function backToTop(){
    const b=document.createElement('button');b.type='button';b.className='cmbc-top';b.setAttribute('aria-label','Back to top');b.textContent='↑';body.appendChild(b);b.onclick=()=>$('#top')?.scrollIntoView({behavior:state.calm?'auto':'smooth'});const paint=()=>b.classList.toggle('show',scrollY>700);addEventListener('scroll',paint,{passive:true});paint();
  }

  function activeNav(){
    const links=$$('a[href^="#"]').filter(a=>a.getAttribute('href').length>1);const byId=new Map();links.forEach(a=>{const id=a.getAttribute('href').slice(1);if(!byId.has(id))byId.set(id,[]);byId.get(id).push(a)});
    const sections=[...byId.keys()].map(id=>document.getElementById(id)).filter(Boolean);
    if(!sections.length)return;
    const obs=new IntersectionObserver(es=>{const hit=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!hit)return;links.forEach(a=>a.removeAttribute('aria-current'));(byId.get(hit.target.id)||[]).forEach(a=>a.setAttribute('aria-current','page'));},{rootMargin:'-25% 0px -60% 0px',threshold:[0,.2,.5]});sections.forEach(s=>obs.observe(s));
  }

  function polishForms(){
    $$('form').forEach(form=>{form.setAttribute('novalidate','');form.addEventListener('submit',e=>{const bad=[...form.querySelectorAll('[required]')].find(x=>!x.value.trim());if(bad){e.preventDefault();bad.setAttribute('aria-invalid','true');bad.focus();bad.addEventListener('input',()=>bad.removeAttribute('aria-invalid'),{once:true});}})});
    $$('a[target="_blank"]').forEach(a=>{if(!a.getAttribute('aria-label'))a.setAttribute('aria-label',(a.textContent.trim()||'Open link')+' (opens in a new tab)')});
  }

  function menuAccessibility(){
    const btn=$('#menuBtn'),menu=$('#mobileMenu');if(!btn||!menu)return;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){menu.classList.remove('open');btn.textContent='☰';btn.setAttribute('aria-expanded','false');btn.focus()}});
  }

  const run=()=>{tools();phoneDock();backToTop();polishForms();menuAccessibility();apply();setTimeout(activeNav,800)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();