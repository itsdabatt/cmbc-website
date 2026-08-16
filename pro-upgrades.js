/* CMBC live schedule display upgrade — Aug. 16, 2026 */
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

    // If today's occurrence has fully ended, use next week.
    if (end <= now) {
      start = weeklyStart(item, now, 1);
      end = new Date(start.getTime() + duration);
    }

    // If today's start is later in the week logic but a currently-running
    // occurrence started last week, check that too.
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
    return {
      ...f,
      start,
      end,
      special:true,
      details:`${start.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})} • ${start.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})} • ${f.location || ''}`
    };
  }

  function chooseLive() {
    const now = new Date();
    const all = (schedule?.weekly || []).map(w => occurrence(w, now));
    const featured = featuredOccurrence(schedule?.featured, now);
    if (featured) all.push(featured);

    const happening = all
      .filter(e => e.start <= now && e.end > now)
      .sort((a,b) => b.start - a.start);

    if (happening.length) return {mode:'live', event:happening[0]};

    const upcoming = all
      .filter(e => e.start > now)
      .sort((a,b) => a.start - b.start);

    return upcoming.length ? {mode:'next', event:upcoming[0]} : null;
  }

  function renderLive() {
    if (!schedule) return;
    const state = chooseLive();
    if (!state) return;

    const e = state.event;
    const badge = $('#nextBadge');
    const title = $('#nextTitle');
    const details = $('#nextDetails');
    const action = $('#nextAction');
    const count = $('#nextCount');

    if (!badge || !title || !details || !action || !count) return;

    title.textContent = e.title;
    action.href = e.anchor || '#visit';

    if (state.mode === 'live') {
      badge.textContent = e.special ? '🎉 HAPPENING NOW' : '🔴 HAPPENING NOW';
      const endTime = e.end.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});
      details.textContent = `${e.details || 'Happening now at CMBC'} • In progress until about ${endTime}`;
      action.textContent = e.special ? 'See Event Details' : 'Service Info';

      const left = Math.max(0, e.end - Date.now());
      const p = parts(left);
      count.innerHTML = `
        <div class="live-now-box"><b>LIVE</b><span>Now</span></div>
        <div><b>${String(p.hours).padStart(2,'0')}</b><span>Hours Left</span></div>
        <div><b>${String(p.minutes).padStart(2,'0')}</b><span>Minutes</span></div>
        <div><b>${String(p.seconds).padStart(2,'0')}</b><span>Seconds</span></div>`;
      count.classList.add('is-live');
    } else {
      badge.textContent = e.special ? '⭐ FEATURED EVENT' : '🔴 NEXT AT CMBC';
      details.textContent = e.details || `${e.start.toLocaleDateString()} • ${e.start.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})}`;
      action.textContent = e.special ? 'See Event Details' : 'Plan Your Visit';
      count.innerHTML = countMarkup(parts(e.start - Date.now()));
      count.classList.remove('is-live');
    }
  }

  async function load() {
    try {
      const r = await fetch('events.json?live=' + Date.now(), {cache:'no-store'});
      if (r.ok) schedule = await r.json();
    } catch (_) {}
    renderLive();
  }

  load();
  setInterval(renderLive, 250);
  setInterval(load, 60000);
})();
