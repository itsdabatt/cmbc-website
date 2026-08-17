/* CMBC IMMERSIVE 2026 — meaningful gamification, no heavy libraries */
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
 const sections=[['#next','LIVE BULLETIN'],['#times','WORSHIP'],['#picnic','FEATURED EVENT'],['#calendar','CALENDAR'],['#byf','YOUTH'],['#prayer','PRAYER'],['#photos','MEMORIES'],['#visit','WELCOME']];
 sections.forEach(([id,label],i)=>{const el=$(id);if(el)el.dataset.journey=`${String(i+1).padStart(2,'0')} • ${label}`});
 const chip=document.createElement('div');chip.className='journey-chip';chip.innerHTML='✝️ Journey <b>0%</b>';document.body.appendChild(chip);
 const toast=document.createElement('div');toast.className='journey-toast';toast.innerHTML='<b>CMBC JOURNEY</b><span></span>';document.body.appendChild(toast);
 let toastTimer;
 const say=t=>{toast.querySelector('span').textContent=t;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2200)};
 const progress=()=>{const max=document.documentElement.scrollHeight-innerHeight;const p=max?Math.min(100,Math.round(scrollY/max*100)):0;chip.querySelector('b').textContent=p+'%';if(p>=98&&!sessionStorage.cmbcJourney){sessionStorage.cmbcJourney='1';say('You explored CMBC! ❤️ Come worship with us.') }};
 addEventListener('scroll',progress,{passive:true});progress();
 // Ripple/tactile feedback
 document.addEventListener('pointerdown',e=>{const target=e.target.closest('.btn,.quick-card,.album-tab,.mobile-dock a,.mobile-menu a');if(!target||reduced)return;const r=document.createElement('span');r.className='ripple';const box=target.getBoundingClientRect(),size=Math.max(box.width,box.height);r.style.width=r.style.height=size+'px';r.style.left=(e.clientX-box.left-size/2)+'px';r.style.top=(e.clientY-box.top-size/2)+'px';target.appendChild(r);setTimeout(()=>r.remove(),600)});
 // Milestone discovery rewards
 const seen=new Set();const io=new IntersectionObserver(entries=>entries.forEach(x=>{if(!x.isIntersecting||x.intersectionRatio<.5)return;const id=x.target.id;if(seen.has(id))return;seen.add(id);const msgs={next:'🔴 Live bulletin unlocked',times:'⛪ Service times found',picnic:'🌳 Praise in the Park discovered',byf:'🎉 BYF discovered',prayer:'🙏 Prayer is always open',photos:'📸 Memory Wall unlocked',visit:'❤️ You found your invitation'};if(msgs[id]&&seen.size>1)say(msgs[id])}),{threshold:[.5]});sections.forEach(([id])=>{const el=$(id);if(el)io.observe(el)});
 // Three useful mini-quests, stored only on this device/session.
 const next=$('#next .container');if(next){const q=document.createElement('div');q.className='quest-panel';q.innerHTML='<button class="quest" data-q="schedule"><b>📅 Find a Service</b><span>Check when CMBC gathers.</span></button><button class="quest" data-q="prayer"><b>🙏 Prayer</b><span>Visit the prayer area.</span></button><button class="quest" data-q="memories"><b>📸 See the Family</b><span>Explore church memories.</span></button>';next.appendChild(q);q.addEventListener('click',e=>{const b=e.target.closest('.quest');if(!b)return;const map={schedule:'#times',prayer:'#prayer',memories:'#photos'};document.querySelector(map[b.dataset.q])?.scrollIntoView({behavior:reduced?'auto':'smooth'});b.classList.add('done');localStorage.setItem('cmbc-q-'+b.dataset.q,'1')});$$('.quest',q).forEach(b=>{if(localStorage.getItem('cmbc-q-'+b.dataset.q))b.classList.add('done')})}
 // Mark quests complete when destination is actually reached.
 const mark=(id,q)=>{const el=$(id);if(!el)return;new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){localStorage.setItem('cmbc-q-'+q,'1');document.querySelector(`.quest[data-q="${q}"]`)?.classList.add('done')}}),{threshold:.35}).observe(el)};mark('#times','schedule');mark('#prayer','prayer');mark('#photos','memories');
 // Picnic countdown gets a celebratory pulse in final 24h.
 const picnic=$('#picnic');if(picnic){const check=()=>{const target=new Date('2026-08-23T11:00:00-04:00');const d=target-Date.now();picnic.classList.toggle('final-day',d>0&&d<=86400000)};check();setInterval(check,60000)}
})();
