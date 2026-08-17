(() => {
  if (window.__CMBC_APP__) return;
  window.__CMBC_APP__ = true;

  const storageKey='cmbc-app-state-v1';
  const defaultState={mode:'',xp:0,done:[],name:'',showPlan:false};
  let state={...defaultState};
  try{ state={...defaultState,...JSON.parse(localStorage.getItem(storageKey)||'{}')}; }catch(_){ }
  const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(state))}catch(_){}};
  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];

  function addXp(id,amount=15){
    if(state.done.includes(id)) return;
    state.done.push(id); state.xp=Math.min(100,state.xp+amount); save(); renderProgress();
    toast('✨','Journey updated',`+${amount} progress`);
    if(state.xp>=100) celebrate();
  }
  function toast(icon,title,text){
    let t=q('#cmbcToast'); if(!t){t=document.createElement('div');t.id='cmbcToast';t.className='fixed left-1/2 -translate-x-1/2 bottom-28 z-[9999] opacity-0 pointer-events-none transition-all duration-300';document.body.appendChild(t)}
    t.innerHTML=`<div class="bg-slate-950/95 text-white border border-amber-300/30 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 min-w-[260px]"><span class="text-2xl">${icon}</span><div><b class="block text-sm">${title}</b><span class="text-xs text-slate-300">${text}</span></div></div>`;
    t.classList.remove('opacity-0','translate-y-3'); t.classList.add('opacity-100');
    clearTimeout(t._x); t._x=setTimeout(()=>t.classList.add('opacity-0'),2200);
  }
  function celebrate(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for(let i=0;i<28;i++){
      const c=document.createElement('i'); const colors=['#fbbf24','#ffffff','#60a5fa','#34d399'];
      Object.assign(c.style,{position:'fixed',zIndex:'9998',left:(5+Math.random()*90)+'vw',top:'-20px',width:'8px',height:'12px',background:colors[i%colors.length],pointerEvents:'none',borderRadius:'2px',transition:`top ${2+Math.random()*1.5}s linear,transform ${2+Math.random()*1.5}s linear,opacity .5s`});
      document.body.appendChild(c); requestAnimationFrame(()=>{c.style.top='108vh';c.style.transform=`translateX(${Math.random()*120-60}px) rotate(720deg)`}); setTimeout(()=>c.remove(),3800);
    }
    toast('🎉','Journey complete!','You explored the whole CMBC hub.');
  }

  const hero=q('.hero'); if(!hero) return;
  const app=document.createElement('section');
  app.id='cmbc-app';
  app.className='relative overflow-hidden bg-slate-950 text-white border-y border-white/10';
  app.innerHTML=`
  <div class="absolute inset-0 opacity-30 pointer-events-none" style="background:radial-gradient(circle at 10% 10%,rgba(251,191,36,.28),transparent 32%),radial-gradient(circle at 90% 20%,rgba(59,130,246,.28),transparent 34%),linear-gradient(135deg,#020617,#071b39 52%,#082f49)"></div>
  <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
    <div class="flex items-start justify-between gap-4 mb-6">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-300 text-slate-950 font-black text-xs tracking-wider">🎮 CMBC JOURNEY</div>
        <h2 class="text-3xl sm:text-5xl font-black tracking-tight mt-4 leading-none">Your interactive church hub.</h2>
        <p class="text-slate-300 mt-3 max-w-2xl text-sm sm:text-base">Choose what brings you here and the site will guide you to the right next step. Your progress stays on this device.</p>
      </div>
      <button id="cmbcReset" class="shrink-0 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition px-3 py-2 text-xs font-bold" title="Clear your CMBC Journey progress and start over">↻ Reset</button>
    </div>

    <div class="grid lg:grid-cols-[1.1fr_.9fr] gap-5">
      <div class="rounded-3xl border border-white/10 bg-white/[.06] backdrop-blur-xl p-4 sm:p-6 shadow-2xl">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div><p class="text-amber-300 text-xs font-black tracking-[.15em]">START HERE</p><h3 class="text-xl sm:text-2xl font-black">What brings you to CMBC today?</h3></div>
          <div class="text-right"><b id="cmbcXpText" class="text-amber-300 text-lg">0%</b><span class="block text-[10px] uppercase tracking-wider text-slate-400">Journey</span></div>
        </div>
        <div class="h-2 rounded-full bg-white/10 overflow-hidden mb-5"><div id="cmbcXpBar" class="h-full w-0 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-sky-400 transition-all duration-700"></div></div>

        <div id="cmbcModeGrid" class="grid grid-cols-2 gap-3">
          <button data-mode="new" class="cmbc-mode text-left rounded-2xl border border-white/10 bg-slate-900/70 hover:-translate-y-1 hover:border-amber-300/50 transition p-4 min-h-[132px]"><span class="text-3xl">👋</span><b class="block mt-2">I’m New Here</b><small class="text-slate-400">Show me what to expect and where to go.</small></button>
          <button data-mode="sunday" class="cmbc-mode text-left rounded-2xl border border-white/10 bg-slate-900/70 hover:-translate-y-1 hover:border-amber-300/50 transition p-4 min-h-[132px]"><span class="text-3xl">⛪</span><b class="block mt-2">I’m Coming Sunday</b><small class="text-slate-400">Build me a simple visit plan.</small></button>
          <button data-mode="prayer" class="cmbc-mode text-left rounded-2xl border border-white/10 bg-slate-900/70 hover:-translate-y-1 hover:border-amber-300/50 transition p-4 min-h-[132px]"><span class="text-3xl">🙏</span><b class="block mt-2">I Need Prayer</b><small class="text-slate-400">Take me straight to prayer and encouragement.</small></button>
          <button data-mode="explore" class="cmbc-mode text-left rounded-2xl border border-white/10 bg-slate-900/70 hover:-translate-y-1 hover:border-amber-300/50 transition p-4 min-h-[132px]"><span class="text-3xl">🧭</span><b class="block mt-2">Let Me Explore</b><small class="text-slate-400">Discover services, BYF, photos, events and more.</small></button>
        </div>

        <div id="cmbcMission" class="mt-5 hidden"></div>
      </div>

      <aside class="grid gap-4">
        <div class="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-300/15 to-white/[.04] p-5 sm:p-6">
          <div class="flex items-center justify-between"><span class="text-xs font-black tracking-[.15em] text-amber-300">🔴 LIVE NOW / NEXT</span><span id="cmbcLiveBadge" class="text-[10px] rounded-full border border-white/10 px-2 py-1">AUTO</span></div>
          <h3 id="cmbcLiveTitle" class="text-2xl sm:text-3xl font-black mt-3">Loading church schedule…</h3>
          <p id="cmbcLiveDetails" class="text-slate-300 text-sm mt-2">Checking what’s happening next.</p>
          <div id="cmbcMiniCountdown" class="grid grid-cols-4 gap-2 mt-4"></div>
          <a id="cmbcLiveAction" href="#next" class="mt-4 inline-flex w-full justify-center items-center rounded-xl bg-amber-300 text-slate-950 font-black px-4 py-3 hover:bg-amber-200 transition">See Details →</a>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/[.05] p-5 sm:p-6">
          <div class="flex items-center justify-between mb-3"><div><span class="text-xs font-black tracking-[.15em] text-sky-300">MISSIONS</span><h3 class="text-xl font-black">Explore CMBC</h3></div><span title="Complete these by visiting each section. Progress is just for exploring the website — not a measure of faith." class="cursor-help text-slate-400">ⓘ</span></div>
          <div id="cmbcTaskList" class="grid gap-2"></div>
        </div>
      </aside>
    </div>

    <div class="mt-5 grid sm:grid-cols-3 gap-3">
      <button data-jump="#picnic" data-task="event" class="cmbc-jump rounded-2xl border border-white/10 bg-white/[.05] hover:bg-white/[.09] transition p-4 text-left"><span class="text-2xl">🌳</span><b class="block mt-1">Praise in the Park</b><small class="text-slate-400">See Sunday’s picnic details.</small></button>
      <button data-jump="#photos" data-task="photos" class="cmbc-jump rounded-2xl border border-white/10 bg-white/[.05] hover:bg-white/[.09] transition p-4 text-left"><span class="text-2xl">📸</span><b class="block mt-1">Memory Wall</b><small class="text-slate-400">Meet the church family through photos.</small></button>
      <button data-jump="#byf" data-task="byf" class="cmbc-jump rounded-2xl border border-white/10 bg-white/[.05] hover:bg-white/[.09] transition p-4 text-left"><span class="text-2xl">🎉</span><b class="block mt-1">BYF Youth</b><small class="text-slate-400">See what’s happening for young people.</small></button>
    </div>
  </div>`;
  hero.insertAdjacentElement('afterend',app);

  const tasks=[
    {id:'schedule',icon:'🔴',label:'Check what’s next',target:'#next'},
    {id:'services',icon:'⛪',label:'See service times',target:'#times'},
    {id:'prayer',icon:'🙏',label:'Find prayer',target:'#prayer'},
    {id:'photos',icon:'📸',label:'Explore memories',target:'#photos'},
    {id:'visit',icon:'📍',label:'Plan a visit',target:'#visit'}
  ];

  function renderProgress(){
    const pct=Math.min(100,state.xp); const bar=q('#cmbcXpBar'),text=q('#cmbcXpText'); if(bar)bar.style.width=pct+'%'; if(text)text.textContent=pct+'%';
    const list=q('#cmbcTaskList'); if(list) list.innerHTML=tasks.map(t=>`<button data-taskid="${t.id}" data-target="${t.target}" class="cmbc-task flex items-center gap-3 rounded-xl border ${state.done.includes(t.id)?'border-emerald-400/30 bg-emerald-400/10':'border-white/10 bg-slate-900/50'} p-3 text-left hover:bg-white/10 transition"><span class="text-xl">${state.done.includes(t.id)?'✅':t.icon}</span><span class="flex-1 text-sm font-bold">${t.label}</span><span class="text-slate-500">›</span></button>`).join('');
    qa('.cmbc-task').forEach(b=>b.onclick=()=>{addXp(b.dataset.taskid,20);document.querySelector(b.dataset.target)?.scrollIntoView({behavior:'smooth'});});
  }

  const modeContent={
    new:{icon:'👋',title:'Welcome to Campbell Memorial',copy:'You do not have to know what to do before you come. Start with the visitor guide, then check service times and directions.',actions:[['👋 Open Visitor Guide','guide'],['🕙 Service Times','#times'],['📍 Directions','#visit']]},
    sunday:{icon:'⛪',title:'Build Your Sunday Plan',copy:'Sunday School begins at 10:00 AM and Morning Worship at 11:00 AM. Use the buttons below to build a simple plan for your visit.',actions:[['✅ Make My Visit Plan','plan'],['🕙 Service Times','#times'],['📍 Get Directions','#visit']]},
    prayer:{icon:'🙏',title:'Prayer is one tap away',copy:'You can send a prayer request privately or with your name and email. CMBC is here to pray with you.',actions:[['🙏 Go to Prayer','#prayer'],['🎵 Play a Hymn','music'],['📖 Read Encouragement','verse']]},
    explore:{icon:'🧭',title:'Explore CMBC Your Way',copy:'Complete the missions, discover the church calendar, BYF, memories, featured events, and visitor information.',actions:[['🎮 Start Exploring','missions'],['📅 Calendar','#calendar'],['📸 Memory Wall','#photos']]}
  };

  function selectMode(mode){
    state.mode=mode; addXp('mode',10); save();
    qa('.cmbc-mode').forEach(b=>b.classList.toggle('ring-2',b.dataset.mode===mode));
    const data=modeContent[mode],box=q('#cmbcMission'); if(!data||!box)return;
    box.classList.remove('hidden');
    box.innerHTML=`<div class="rounded-2xl border border-amber-300/20 bg-amber-300/[.07] p-4 sm:p-5"><div class="flex gap-3 items-start"><span class="text-3xl">${data.icon}</span><div><h4 class="font-black text-xl">${data.title}</h4><p class="text-slate-300 text-sm mt-1">${data.copy}</p></div></div><div class="grid sm:grid-cols-3 gap-2 mt-4">${data.actions.map(([label,action])=>`<button data-action="${action}" class="cmbc-action rounded-xl bg-white text-slate-950 font-black text-xs px-3 py-3 hover:bg-amber-200 transition">${label}</button>`).join('')}</div><div id="cmbcPlanArea" class="mt-3"></div></div>`;
    qa('.cmbc-action').forEach(b=>b.onclick=()=>handleAction(b.dataset.action));
  }

  function handleAction(action){
    if(action.startsWith('#')){ const id=action.replace('#',''); addXp(id,15); document.querySelector(action)?.scrollIntoView({behavior:'smooth'}); return; }
    if(action==='guide'){ addXp('visit',20); q('#newHereBtn')?.click(); }
    if(action==='music'){ q('#musicToggle')?.click(); addXp('music',10); }
    if(action==='verse'){ toast('📖','Psalm 34:3','“O magnify the Lord with me, and let us exalt his name together.”'); addXp('verse',10); }
    if(action==='missions'){ q('#cmbcTaskList')?.scrollIntoView({behavior:'smooth',block:'center'}); }
    if(action==='plan'){
      state.showPlan=true; save(); addXp('plan',20); const a=q('#cmbcPlanArea'); if(a)a.innerHTML=`<div class="rounded-xl border border-white/10 bg-slate-950/50 p-4"><b class="text-amber-300">Your Sunday visit plan</b><ul class="mt-2 text-sm text-slate-300 space-y-1"><li>✓ Arrive a few minutes before your chosen service.</li><li>✓ Sunday School — 10:00 AM</li><li>✓ Morning Worship — 11:00 AM</li><li>✓ Campbell Memorial Baptist Church, 115 Longacre Way, Smithers.</li><li>✓ Come as you are. Bring the whole family.</li></ul><div class="grid grid-cols-2 gap-2 mt-3"><button id="copyPlan" class="rounded-lg bg-amber-300 text-slate-950 font-black text-xs p-2">📋 Copy Plan</button><button id="clearPlan" class="rounded-lg border border-white/10 text-white text-xs p-2">Clear</button></div><p id="planError" class="text-red-300 text-xs mt-2 hidden">Could not copy automatically. Press and hold the text above to copy it.</p></div>`;
      q('#copyPlan')?.addEventListener('click',async()=>{const text='CMBC Sunday Plan: Sunday School 10:00 AM • Morning Worship 11:00 AM • 115 Longacre Way, Smithers, WV • Come as you are.';try{await navigator.clipboard.writeText(text);toast('📋','Copied!','Your Sunday plan is ready to paste.')}catch(_){q('#planError')?.classList.remove('hidden')}});
      q('#clearPlan')?.addEventListener('click',()=>{state.showPlan=false;save();if(a)a.innerHTML='';});
    }
  }

  qa('.cmbc-mode').forEach(b=>b.onclick=()=>selectMode(b.dataset.mode));
  qa('.cmbc-jump').forEach(b=>b.onclick=()=>{addXp(b.dataset.task,15);document.querySelector(b.dataset.jump)?.scrollIntoView({behavior:'smooth'});});
  q('#cmbcReset')?.addEventListener('click',()=>{state={...defaultState};save();renderProgress();q('#cmbcMission')?.classList.add('hidden');qa('.cmbc-mode').forEach(b=>b.classList.remove('ring-2'));toast('↻','Journey reset','Start fresh whenever you’re ready.');});

  async function loadLive(){
    const title=q('#cmbcLiveTitle'),details=q('#cmbcLiveDetails'),count=q('#cmbcMiniCountdown'),action=q('#cmbcLiveAction'),badge=q('#cmbcLiveBadge');
    try{
      const r=await fetch('events.json?app='+Date.now(),{cache:'no-store'}); if(!r.ok) throw new Error('schedule'); const data=await r.json();
      const now=new Date(), candidates=[];
      (data.weekly||[]).forEach(item=>{const d=new Date(now);let add=(item.day-d.getDay()+7)%7;d.setDate(d.getDate()+add);d.setHours(item.hour,item.minute,0,0);if(d<=now)d.setDate(d.getDate()+7);candidates.push({...item,date:d,special:false});});
      if(data.featured?.start){const d=new Date(data.featured.start);if(d>now)candidates.push({title:data.featured.title,details:`${data.featured.location} • ${data.featured.summary}`,anchor:data.featured.anchor,date:d,special:true});}
      candidates.sort((a,b)=>a.date-b.date); const e=candidates[0]; if(!e) throw new Error('empty');
      title.textContent=e.title; details.textContent=e.details||e.summary||''; action.href=e.anchor||'#next'; badge.textContent=e.special?'FEATURED':'AUTO'; addXp('schedule',0);
      const tick=()=>{let ms=Math.max(0,e.date-Date.now());const d=Math.floor(ms/86400000);ms%=86400000;const h=Math.floor(ms/3600000);ms%=3600000;const m=Math.floor(ms/60000);const s=Math.floor((ms%60000)/1000);count.innerHTML=[[d,'DAYS'],[h,'HRS'],[m,'MIN'],[s,'SEC']].map(([v,l])=>`<div class="rounded-xl bg-white text-slate-950 py-3 text-center"><b class="block text-lg leading-none">${String(v).padStart(2,'0')}</b><span class="text-[9px] font-black text-slate-500">${l}</span></div>`).join('')};tick();setInterval(tick,1000);
    }catch(_){
      title.textContent='Church schedule unavailable'; details.textContent='Use the service times below while we reconnect.'; count.innerHTML='<div class="col-span-4 rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">Could not load live schedule.</div>'; badge.textContent='OFFLINE';
    }
  }

  renderProgress(); if(state.mode)selectMode(state.mode); loadLive();
})();