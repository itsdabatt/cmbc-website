/* CMBC live schedule display upgrade — normal weekly mode after Aug. 23 picnic */
(() => {
  const $ = s => document.querySelector(s);
  let schedule = null;

  const parts = ms => {
    ms = Math.max(0, ms);
    const days = Math.floor(ms / 86400000); ms %= 86400000;
    const hours = Math.floor(ms / 3600000); ms %= 3600000;
    const minutes = Math.floor(ms / 60000); ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    return {days, hours, minutes, seconds};
  };

  const countMarkup = p => `
    <div><b>${String(p.days).padStart(2,'0')}</b><span>Days</span></div>
    <div><b>${String(p.hours).padStart(2,'0')}</b><span>Hours</span></div>
    <div><b>${String(p.minutes).padStart(2,'0')}</b><span>Minutes</span></div>
    <div><b>${String(p.seconds).padStart(2,'0')}</b><span>Seconds</span></div>`;

  function weeklyStart(item, now, weekOffset = 0) {
    const d = new Date(now);
    const delta = (item.day - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + delta + weekOffset * 7);
    d.setHours(item.hour, item.minute, 0, 0);
    return d;
  }

  function occurrence(item, now) {
    let start = weeklyStart(item, now, 0);
    const duration = Number(item.durationMinutes || 60) * 60000;
    let end = new Date(start.getTime() + duration);
    if (end <= now) {
      start = weeklyStart(item, now, 1);
      end = new Date(start.getTime() + duration);
    }
    const previous = weeklyStart(item, now, -1);
    const previousEnd = new Date(previous.getTime() + duration);
    if (previous <= now && previousEnd > now) {
      start = previous;
      end = previousEnd;
    }
    return {...item, start, end, special:false};
  }

  function featuredOccurrence(f, now) {
    if (!f || !f.start) return null;
    const start = new Date(f.start);
    const duration = Number(f.durationMinutes || 120) * 60000;
    const end = f.end ? new Date(f.end) : new Date(start.getTime() + duration);
    if (end <= now) return null;
    return {...f,start,end,special:true,details:`${start.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})} • ${start.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})} • ${f.location || ''}`};
  }

  function chooseLive() {
    const now = new Date();
    const all = (schedule?.weekly || []).map(w => occurrence(w, now));
    const featured = featuredOccurrence(schedule?.featured, now);
    if (featured) all.push(featured);
    const happening = all.filter(e => e.start <= now && e.end > now).sort((a,b) => b.start - a.start);
    if (happening.length) return {mode:'live', event:happening[0]};
    const upcoming = all.filter(e => e.start > now).sort((a,b) => a.start - b.start);
    return upcoming.length ? {mode:'next', event:upcoming[0]} : null;
  }

  function renderLive() {
    if (!schedule) return;
    const state = chooseLive();
    if (!state) return;
    const e = state.event;
    const badge = $('#nextBadge'), title = $('#nextTitle'), details = $('#nextDetails'), action = $('#nextAction'), count = $('#nextCount');
    if (!badge || !title || !details || !action || !count) return;
    title.textContent = e.title;
    action.href = e.anchor || '#visit';
    if (state.mode === 'live') {
      badge.textContent = e.special ? '🎉 HAPPENING NOW' : '🔴 HAPPENING NOW';
      const endTime = e.end.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});
      details.textContent = `${e.details || 'Happening now at CMBC'} • In progress until about ${endTime}`;
      action.textContent = e.special ? 'See Event Details' : 'Service Info';
      const p = parts(Math.max(0, e.end - Date.now()));
      count.innerHTML = `<div class="live-now-box"><b>LIVE</b><span>Now</span></div><div><b>${String(p.hours).padStart(2,'0')}</b><span>Hours Left</span></div><div><b>${String(p.minutes).padStart(2,'0')}</b><span>Minutes</span></div><div><b>${String(p.seconds).padStart(2,'0')}</b><span>Seconds</span></div>`;
      count.classList.add('is-live');
    } else {
      badge.textContent = e.special ? '⭐ FEATURED EVENT' : '🔴 NEXT AT CMBC';
      details.textContent = e.details || `${e.start.toLocaleDateString()} • ${e.start.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})}`;
      action.textContent = e.special ? 'See Event Details' : 'Plan Your Visit';
      count.innerHTML = countMarkup(parts(e.start - Date.now()));
      count.classList.remove('is-live');
    }
  }

  function applyNormalChurchMode(){
    if(schedule?.featured) return;

    const headlineTitle=$('#headlineTitle'), headlineSub=$('#headlineSub'), headlineLink=$('#headlineLink');
    if(headlineTitle) headlineTitle.textContent='⛪ THIS WEEK AT CMBC • COME WORSHIP WITH US';
    if(headlineSub) headlineSub.textContent='Sunday School 10:00 AM • Morning Worship 11:00 AM • BYF Wednesday 6:25 PM • Adult Bible Study 7:00 PM';
    if(headlineLink){headlineLink.textContent='SERVICE TIMES →';headlineLink.href='#times'}

    const tickerItems=[
      '⛪ Sunday School • Sunday 10:00 AM',
      '🙌 Morning Worship • Sunday 11:00 AM',
      '🎉 BYF Youth Service • Wednesday 6:25–7:45 PM',
      '📖 Adult Bible Study • Wednesday 7:00–8:00 PM',
      '🙏 Prayer requests are always welcome',
      '🧒 Visit Kids Corner for this month’s Bible Adventure',
      '📸 Share and explore CMBC church memories',
      '📬 Questions? Use Contact CMBC',
      '❤️ Come worship • Come belong • Everyone is welcome'
    ];
    document.querySelectorAll('.ticker-group').forEach(group=>{group.innerHTML=tickerItems.map(x=>`<span>${x}</span>`).join('')});

    const section=$('#picnic');
    if(section){
      section.classList.remove('event-mode','picnic');
      section.classList.add('weekly-feature');
      section.innerHTML=`<div class="container">
        <div class="section-head light reveal in"><span>✝️ WEEKLY LIFE AT CMBC</span><h2>There’s a Place for You This Week</h2><p>Worship, study God’s Word, pray together, and bring the whole family. Here’s the regular rhythm of church life at Campbell Memorial.</p></div>
        <div class="event-grid weekly-service-grid">
          <article class="event-card featured reveal in"><small>SUNDAY • 10:00 AM</small><h3>📖 Sunday School</h3><p>Start Sunday in God’s Word with Bible study and fellowship.</p><a class="text-link" href="#times">See Sunday times →</a></article>
          <article class="event-card reveal in"><small>SUNDAY • 11:00 AM</small><h3>🙌 Morning Worship</h3><p>Come sing, pray, hear biblical preaching, and worship together as a church family.</p><a class="text-link" href="#visit">Plan your visit →</a></article>
          <article class="event-card reveal in"><small>WEDNESDAY • 6:25 PM</small><h3>🎉 BYF Youth</h3><p>Kids and youth gather for Bible learning, friendship, activities, and growing in faith.</p><a class="text-link" href="#byf">Explore BYF →</a></article>
          <article class="event-card reveal in"><small>WEDNESDAY • 7:00 PM</small><h3>📖 Adult Bible Study</h3><p>A midweek opportunity for adults to study Scripture and grow together.</p><a class="text-link" href="#times">See Wednesday times →</a></article>
        </div>
        <div class="countdown-shell reveal in"><div><span>❤️ YOU’RE INVITED</span><h3>Come as you are. Bring your Bible. Bring your family. There’s room for you at CMBC.</h3></div><a class="btn gold" href="#visit">📍 Plan Your Visit</a></div>
      </div>`;
    }
  }

  async function load() {
    try {
      const r = await fetch('events.json?live=' + Date.now(), {cache:'no-store'});
      if (r.ok) schedule = await r.json();
    } catch (_) {}
    applyNormalChurchMode();
    renderLive();
  }

  load();
  setInterval(renderLive, 250);
  setInterval(load, 60000);
})();

/* Load the lightweight immersive/gamified CMBC Journey layer. */
(() => {
  const s=document.createElement('script');
  s.src='experience.js?v=20260823normal1';
  s.defer=true;
  document.head.appendChild(s);
})();
