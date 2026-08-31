/* Single source-of-truth controller for current CMBC public content. */
(() => {
  if (window.__CMBC_SITE_CONTROLLER__) return;
  window.__CMBC_SITE_CONTROLLER__ = true;

  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  let config=null;

  async function loadConfig(){
    try{
      const r=await fetch('site-config.json?ts='+Date.now(),{cache:'no-store'});
      if(!r.ok) throw new Error('config');
      config=await r.json();
    }catch(_){config={};}
    applyAll();
  }

  function applyHeadline(){
    const f=config.featuredEvent||{};
    const title=$('#headlineTitle'),sub=$('#headlineSub'),link=$('#headlineLink');
    if(title) title.textContent=f.title?`🚒 ${f.title.toUpperCase()} • SEPTEMBER 25 • 5–7 PM`:'⛪ THIS WEEK AT CMBC';
    if(sub) sub.textContent=f.summary||'Sunday School • Morning Worship • BYF • Adult Bible Study';
    if(link){link.textContent=f.title?'EVENT DETAILS →':'SERVICE TIMES →';link.href=f.anchor||'#times';}
  }

  function applyTicker(){
    const items=config.ticker||[];
    if(!items.length)return;
    $$('.ticker-group').forEach(g=>g.innerHTML=items.map(x=>`<span>${x}</span>`).join(''));
  }

  function applyFeatured(){
    const host=$('#picnic'); if(!host)return;
    host.id='featured-event'; host.className='section sep-hub';
    const f=config.featuredEvent||{},v=config.verseOfMonth||{},up=config.upcoming||[];
    host.innerHTML=`<div class="container">
      <div class="sep-kicker">🍂 SEPTEMBER 2026 AT CMBC</div>
      <h2 class="sep-title">Serve. Learn. <span>Stay Safe.</span></h2>
      <p class="sep-lead">September brings our regular Sunday and Wednesday church life plus a special free community Fire Safety Evening. Come meet neighbors, connect with local first responders, learn practical fire-safety basics, and get to know Campbell Memorial Baptist Church.</p>
      <div class="sep-grid">
        <article class="sep-card sep-fire"><small>🚒 FEATURED COMMUNITY OUTREACH</small><h3>${f.title||'Fire Safety Evening'}</h3><div class="sep-meta"><span>📅 ${f.dateLabel||''}</span><span>⏰ ${f.timeLabel||''}</span><span>📍 ${f.address||''}</span><span>💛 FREE • Everyone Welcome</span></div><p>${f.summary||''}</p><div class="sep-public-list"><div><b>🚒 Fire Department Area</b>Possible activities include fire trucks, meeting firefighters, equipment demonstrations, fire-safety education, smoke-detector information, and truck exploration if approved.</div><div><b>⛪ CMBC Welcome</b>Church information, service times, friendly greeters, and ways to connect with the church family.</div><div><b>🧒 BYF Youth</b>Learn about BYF, upcoming youth activities, Wednesday nights, and ways for kids and youth to get involved.</div><div><b>🙏 Prayer & Connection</b>Visitors can connect with CMBC and share a prayer request if they would like.</div></div><div class="sep-actions"><a class="sep-btn gold" href="#visit">📍 Plan Your Visit</a><a class="sep-btn white" href="#prayer">🙏 Request Prayer</a></div><h4 style="margin:24px 0 5px">🔥 Mini Fire-Safety Challenge</h4><p style="margin:0;color:#dbeafe">Tap all three before Fire Safety Evening.</p><div class="sep-safety"><button data-fire-step="two">🚪 Know 2 Ways Out</button><button data-fire-step="roll">🛑 Stop • Drop • Roll</button><button data-fire-step="meet">📍 Pick a Meeting Spot</button></div><div class="sep-safety-result"></div></article>
        <div style="display:grid;gap:22px"><article class="sep-card sep-verse"><small>📖 VERSE OF THE MONTH • ${v.month||'SEPTEMBER'}</small><blockquote>“${v.text||''}”</blockquote><b>${v.reference||''}</b></article><article class="sep-card"><small>📅 END-OF-MONTH & NEXT UP</small><h3 style="font-size:27px">Mark Your Calendar</h3><div class="sep-upcoming">${up.map(x=>`<div><strong>${x.date}</strong><span>${x.icon||''} ${x.title} • ${x.details}</span></div>`).join('')}</div><p class="sep-note">Regular schedule continues: Sunday School 10 AM • Morning Worship 11 AM • BYF Wednesday 6:25 PM • Adult Bible Study Wednesday 7 PM.</p></article></div>
      </div>
      <div class="sep-calendar-preview"><img id="sepCalendarImg" src="images/sepcalender26.jpg" alt="Campbell Memorial Baptist Church September 2026 calendar"><div id="sepCalendarFallback" class="sep-calendar-fallback" hidden>📅 September calendar graphic will appear here when <b>images/sepcalender26.jpg</b> is uploaded.</div><p class="sep-note">September church calendar • tap/zoom on your phone for details.</p></div>
    </div>`;
    const img=$('#sepCalendarImg'),fb=$('#sepCalendarFallback'); if(img) img.addEventListener('error',()=>{img.hidden=true;if(fb)fb.hidden=false});
    let done={}; try{done=JSON.parse(localStorage.getItem('cmbc-fire-safety-2026')||'{}')}catch(_){}
    const paint=()=>$$('[data-fire-step]',host).forEach(b=>b.classList.toggle('done',!!done[b.dataset.fireStep]));
    $$('[data-fire-step]',host).forEach(b=>b.onclick=()=>{done[b.dataset.fireStep]=true;try{localStorage.setItem('cmbc-fire-safety-2026',JSON.stringify(done))}catch(_){}paint();const out=$('.sep-safety-result',host);const tips={two:'🚪 Great! Families should know two ways out when possible.',roll:'🛑 Great! If clothing catches fire: Stop, Drop, and Roll.',meet:'📍 Great! Pick a safe family meeting place outside.'};if(out)out.textContent=tips[b.dataset.fireStep]||'✅ Safety step complete!';});paint();
  }

  function applyCalendarCards(){
    const side=$('.calendar-side');if(!side)return;const cards=$$('.cal-card',side),up=config.upcoming||[];
    if(cards[0])cards[0].innerHTML='<b>🚒 September 25 • 5:00 PM</b><span>Fire Safety Evening • Free community outreach</span>';
    if(cards[1])cards[1].innerHTML='<b>🍕 September 30</b><span>Pizza Night • BYF Wednesday</span>';
    if(cards[2])cards[2].innerHTML='<b>🎬 October 2</b><span>Movie Night • More details coming soon</span>';
  }

  function applyJourney(){
    $$('[data-jump="#picnic"],[data-jump="#featured-event"]').forEach(b=>{b.dataset.jump='#featured-event';b.innerHTML='<span class="text-2xl">🚒</span><b class="block mt-1">Fire Safety Evening</b><small class="text-slate-400">September 25 • 5–7 PM • Free community event.</small>';});
    $$('#cmbc-app button,#cmbc-app a').forEach(el=>{if(/Praise in the Park/i.test(el.textContent||''))el.textContent=(el.textContent||'').replace(/Praise in the Park/ig,'Fire Safety Evening')});
  }

  function fixPrayer(){
    const form=$('#prayerForm'),thanks=$('#prayerThanks');if(!form)return;
    form.hidden=false;form.style.display='';form.removeAttribute('aria-hidden');
    const sent=new URLSearchParams(location.search).get('prayer')==='sent';
    if(thanks){thanks.hidden=!sent;thanks.style.display=sent?'block':'none';}
    if(!$('#prayerRepeatNote')){const p=document.createElement('p');p.id='prayerRepeatNote';p.className='prayer-repeat-note';p.innerHTML='🙏 <b>You can send as many prayer requests as you need.</b> This form stays available after every request.';form.querySelector('h3')?.insertAdjacentElement('afterend',p);}
    if(thanks&&!$('#prayAgainBtn')){const b=document.createElement('button');b.id='prayAgainBtn';b.type='button';b.className='btn white';b.textContent='🙏 Send Another Prayer Request';b.onclick=()=>{form.reset();thanks.hidden=true;thanks.style.display='none';form.hidden=false;form.style.display='';try{history.replaceState({},'',location.pathname+'#prayer')}catch(_){}form.scrollIntoView({behavior:'smooth',block:'center'});form.querySelector('textarea')?.focus();};thanks.appendChild(b);}
  }

  function applyAll(){applyHeadline();applyTicker();applyFeatured();applyCalendarCards();applyJourney();fixPrayer();}
  const run=()=>{loadConfig();setTimeout(applyAll,400);setTimeout(applyAll,1300);setTimeout(applyAll,3000)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();