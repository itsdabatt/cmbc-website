/* CMBC September 2026 mode — public-facing month hub + Fire Safety Evening. */
(() => {
  const MONTH_KEY='cmbc-fire-safety-2026';
  const ticker=[
    '📖 Verse of the Month • Psalm 29:11 KJV',
    '⛪ Sunday School • Sundays 10:00 AM',
    '🙌 Morning Worship • Sundays 11:00 AM',
    '🎉 BYF • Wednesdays 6:25–7:45 PM',
    '📖 Adult Bible Study • Wednesdays 7:00–8:00 PM',
    '🚒 Fire Safety Evening • Friday, September 25 • 5:00–7:00 PM',
    '🍕 Pizza Night • Wednesday, September 30',
    '🎬 Movie Night • Friday, October 2',
    '🙏 Prayer requests are always welcome — send as many as you need',
    '🧒 Kids Corner • Monthly Bible Adventure + printables'
  ];

  function injectStyles(){
    if(document.getElementById('septemberModeStyles'))return;
    const s=document.createElement('style');s.id='septemberModeStyles';s.textContent=`
      .sep-hub{background:linear-gradient(145deg,#071b39 0%,#102d57 58%,#3f2417 100%);color:#fff;position:relative;overflow:hidden}.sep-hub:before{content:'🚒';position:absolute;right:-30px;top:-35px;font-size:220px;opacity:.045;transform:rotate(-9deg);pointer-events:none}.sep-kicker{display:inline-flex;gap:8px;align-items:center;padding:8px 12px;border-radius:999px;background:#ffca3a;color:#071b39;font-weight:1000;font-size:12px;letter-spacing:.08em}.sep-title{font-size:clamp(34px,6vw,72px);line-height:.95;margin:16px 0 10px;font-weight:1000}.sep-title span{color:#ffca3a}.sep-lead{max-width:780px;color:#e3eaf3;font-size:clamp(16px,2vw,20px);line-height:1.6}.sep-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:22px;margin-top:28px}.sep-card{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);border-radius:24px;padding:22px;box-shadow:0 18px 45px rgba(0,0,0,.2);backdrop-filter:blur(10px)}.sep-fire{background:linear-gradient(145deg,rgba(255,91,54,.22),rgba(255,202,58,.08));border-color:rgba(255,202,58,.32)}.sep-card h3{font-size:clamp(24px,3vw,38px);margin:5px 0 8px}.sep-meta{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 18px}.sep-meta span{background:#fff;color:#071b39;border-radius:999px;padding:8px 11px;font-weight:900;font-size:13px}.sep-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}.sep-btn{display:inline-flex;justify-content:center;align-items:center;min-height:46px;padding:11px 15px;border-radius:13px;border:0;font-weight:1000;text-decoration:none;cursor:pointer}.sep-btn.gold{background:#ffca3a;color:#071b39}.sep-btn.white{background:#fff;color:#071b39}.sep-verse{background:#fff;color:#071b39}.sep-verse blockquote{font-family:Georgia,serif;font-size:clamp(22px,3.4vw,38px);line-height:1.25;margin:10px 0}.sep-verse b{color:#9b3d1f}.sep-upcoming{display:grid;gap:10px;margin-top:14px}.sep-upcoming div{padding:14px;border-radius:15px;background:rgba(255,255,255,.08);display:flex;gap:12px;align-items:center}.sep-upcoming strong{min-width:92px;color:#ffca3a}.sep-safety{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:15px}.sep-safety button{border:1px solid rgba(255,255,255,.16);background:#0b2242;color:#fff;border-radius:16px;padding:15px 10px;font-weight:900;cursor:pointer;min-height:92px}.sep-safety button.done{background:#166534;border-color:#4ade80}.sep-safety-result{margin-top:12px;min-height:24px;color:#fde68a;font-weight:800}.sep-calendar-preview{margin-top:22px}.sep-calendar-preview img{display:block;width:100%;border-radius:20px;box-shadow:0 18px 45px rgba(0,0,0,.25);background:#fff}.sep-calendar-fallback{border:1px dashed rgba(255,255,255,.35);border-radius:18px;padding:18px;text-align:center;color:#dbeafe}.sep-note{font-size:13px;color:#bfd0e7;margin-top:8px}.sep-public-list{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:15px}.sep-public-list div{background:rgba(255,255,255,.07);border-radius:14px;padding:13px}.sep-public-list b{display:block;color:#ffca3a;margin-bottom:3px}@media(max-width:800px){.sep-grid{grid-template-columns:1fr}.sep-safety{grid-template-columns:1fr}.sep-public-list{grid-template-columns:1fr}.sep-card{padding:17px}.sep-actions .sep-btn{width:100%}.sep-meta span{width:100%;text-align:center}}
    `;document.head.appendChild(s);
  }

  function fireChallenge(root){
    let done={};try{done=JSON.parse(localStorage.getItem(MONTH_KEY)||'{}')}catch(_){}
    const paint=()=>root.querySelectorAll('[data-fire-step]').forEach(b=>b.classList.toggle('done',!!done[b.dataset.fireStep]));
    root.querySelectorAll('[data-fire-step]').forEach(b=>b.addEventListener('click',()=>{
      const id=b.dataset.fireStep;done[id]=true;try{localStorage.setItem(MONTH_KEY,JSON.stringify(done))}catch(_){}
      paint();const out=root.querySelector('.sep-safety-result');
      const tips={two:'🚪 Great! Families should know two ways out when possible.',roll:'🛑 Great! If clothing catches fire: Stop, Drop, and Roll.',meet:'📍 Great! Pick a safe family meeting place outside.'};
      if(out)out.textContent=tips[id]||'✅ Safety step complete!';
    }));paint();
  }

  function applySeptember(){
    injectStyles();
    const title=document.getElementById('headlineTitle'),sub=document.getElementById('headlineSub'),link=document.getElementById('headlineLink');
    if(title)title.textContent='🚒 FIRE SAFETY EVENING • SEPTEMBER 25 • 5–7 PM';
    if(sub)sub.textContent='Free community outreach • Campbell Memorial Baptist Church • Everyone welcome';
    if(link){link.textContent='EVENT DETAILS →';link.href='#picnic';}
    document.querySelectorAll('.ticker-group').forEach(g=>g.innerHTML=ticker.map(x=>`<span>${x}</span>`).join(''));

    const featured=document.getElementById('picnic');
    if(featured && featured.dataset.september!=='1'){
      featured.dataset.september='1';featured.dataset.normalized='1';featured.className='section sep-hub';
      featured.innerHTML=`<div class="container">
        <div class="sep-kicker">🍂 SEPTEMBER 2026 AT CMBC</div>
        <h2 class="sep-title">Serve. Learn. <span>Stay Safe.</span></h2>
        <p class="sep-lead">September brings our regular Sunday and Wednesday church life plus a special free community Fire Safety Evening. Come meet neighbors, connect with local first responders, learn practical fire-safety basics, and get to know Campbell Memorial Baptist Church.</p>
        <div class="sep-grid">
          <article class="sep-card sep-fire">
            <small>🚒 FEATURED COMMUNITY OUTREACH</small><h3>Fire Safety Evening</h3>
            <div class="sep-meta"><span>📅 Friday, Sept. 25</span><span>⏰ 5:00–7:00 PM</span><span>📍 115 Longacre Way, Smithers</span><span>💛 FREE • Everyone Welcome</span></div>
            <p>Designed to bring families together, share fire-safety information, support local first responders, and welcome our community to CMBC.</p>
            <div class="sep-public-list"><div><b>🚒 Fire Department Area</b>Planned/possible activities include meeting firefighters, equipment demonstrations, fire-safety education, smoke-detector information, and truck exploration if approved.</div><div><b>⛪ CMBC Welcome</b>Church information, service times, friendly greeters, and ways to connect with the church family.</div><div><b>🧒 BYF Youth</b>Learn about BYF, upcoming youth activities, Wednesday nights, and ways for kids and youth to get involved.</div><div><b>🙏 Prayer & Connection</b>Visitors can connect with CMBC and share a prayer request if they would like.</div></div>
            <div class="sep-actions"><a class="sep-btn gold" href="#visit">📍 Plan Your Visit</a><a class="sep-btn white" href="#prayer">🙏 Request Prayer</a></div>
            <h4 style="margin:24px 0 5px">🔥 Mini Fire-Safety Challenge</h4><p style="margin:0;color:#dbeafe">Tap all three before Fire Safety Evening.</p>
            <div class="sep-safety"><button data-fire-step="two">🚪 Know 2 Ways Out</button><button data-fire-step="roll">🛑 Stop • Drop • Roll</button><button data-fire-step="meet">📍 Pick a Meeting Spot</button></div><div class="sep-safety-result"></div>
          </article>
          <div style="display:grid;gap:22px">
            <article class="sep-card sep-verse"><small>📖 VERSE OF THE MONTH • SEPTEMBER</small><blockquote>“The LORD will give strength unto his people; the LORD will bless his people with peace.”</blockquote><b>Psalm 29:11 KJV</b></article>
            <article class="sep-card"><small>📅 END-OF-MONTH & NEXT UP</small><h3 style="font-size:27px">Mark Your Calendar</h3><div class="sep-upcoming"><div><strong>SEPT. 25</strong><span>🚒 Fire Safety Evening • 5:00–7:00 PM</span></div><div><strong>SEPT. 30</strong><span>🍕 Pizza Night • BYF Wednesday</span></div><div><strong>OCT. 2</strong><span>🎬 Movie Night</span></div></div><p class="sep-note">Regular schedule continues: Sunday School 10 AM • Morning Worship 11 AM • BYF Wednesday 6:25 PM • Adult Bible Study Wednesday 7 PM.</p></article>
          </div>
        </div>
        <div class="sep-calendar-preview"><img id="sepCalendarImg" src="images/sepcalender26.jpg" alt="Campbell Memorial Baptist Church September 2026 calendar"><div id="sepCalendarFallback" class="sep-calendar-fallback" hidden>📅 September calendar graphic will appear here when <b>images/sepcalender26.jpg</b> is uploaded to the website.</div><p class="sep-note">September church calendar • tap/zoom on your phone for details.</p></div>
      </div>`;
      const img=featured.querySelector('#sepCalendarImg'),fb=featured.querySelector('#sepCalendarFallback');if(img)img.addEventListener('error',()=>{img.hidden=true;if(fb)fb.hidden=false});fireChallenge(featured);
    }

    // Update the interactive Journey's old picnic references after it renders.
    document.querySelectorAll('[data-jump="#picnic"]').forEach(b=>{b.innerHTML='<span class="text-2xl">🚒</span><b class="block mt-1">Fire Safety Evening</b><small class="text-slate-400">September 25 • 5–7 PM • Free community event.</small>';});
    const mission=document.querySelector('#cmbcMission');
    document.querySelectorAll('#cmbc-app button,#cmbc-app a').forEach(el=>{if(/Praise in the Park/i.test(el.textContent||''))el.textContent=(el.textContent||'').replace(/Praise in the Park/ig,'Fire Safety Evening')});
  }

  const run=()=>{applySeptember();setTimeout(applySeptember,350);setTimeout(applySeptember,1100);setTimeout(applySeptember,2600);setTimeout(applySeptember,5200)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();