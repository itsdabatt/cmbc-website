/* CMBC normal weekly mode — removes finished picnic promotion from the live homepage. */
(() => {
  const weeklyTicker = [
    '⛪ Sunday School • Sunday 10:00 AM',
    '🙌 Morning Worship • Sunday 11:00 AM',
    '🎉 BYF Youth Service • Wednesday 6:25–7:45 PM',
    '📖 Adult Bible Study • Wednesday 7:00–8:00 PM',
    '🙏 Prayer requests are always welcome — send as many as you need',
    '🧒 Kids Corner • Monthly Bible Adventure + printables',
    '📸 Visit the CMBC Church Memory Wall',
    '📬 Questions? Use Contact CMBC',
    '❤️ Come as you are — everyone is welcome at Campbell Memorial'
  ];

  function keepPrayerOpen(){
    const form=document.getElementById('prayerForm');
    const thanks=document.getElementById('prayerThanks');
    if(!form)return;
    form.hidden=false;
    if(thanks && new URLSearchParams(location.search).get('prayer')==='sent'){
      thanks.hidden=false;
      let again=document.getElementById('prayAgainBtn');
      if(!again){
        again=document.createElement('button');
        again.id='prayAgainBtn';again.type='button';again.className='btn white';again.textContent='🙏 Send Another Prayer Request';
        again.addEventListener('click',()=>{form.reset();thanks.hidden=true;form.scrollIntoView({behavior:'smooth',block:'center'});form.querySelector('textarea')?.focus();});
        thanks.appendChild(again);
      }
    }
  }

  function applyNormalMode(){
    const headlineTitle=document.getElementById('headlineTitle');
    const headlineSub=document.getElementById('headlineSub');
    const headlineLink=document.getElementById('headlineLink');
    if(headlineTitle) headlineTitle.textContent='⛪ THIS WEEK AT CMBC • COME WORSHIP WITH US';
    if(headlineSub) headlineSub.textContent='Sunday School • Morning Worship • BYF • Adult Bible Study';
    if(headlineLink){headlineLink.textContent='SERVICE TIMES →';headlineLink.href='#times';}

    document.querySelectorAll('.ticker-group').forEach(group=>{group.innerHTML=weeklyTicker.map(x=>`<span>${x}</span>`).join('');});

    const old=document.getElementById('picnic');
    if(old && !old.dataset.normalized){
      old.dataset.normalized='1';old.className='section picnic weekly-mode';
      old.innerHTML=`<div class="container"><div class="section-head light reveal in"><span>✝️ WORSHIP • GROW • BELONG</span><h2>This Week at Campbell Memorial</h2><p>No special event needed to come be part of the church family. Join us for our regular weekly services, Bible study, youth, prayer, and fellowship.</p></div><div class="event-grid"><article class="event-card featured reveal in"><small>☀️ EVERY SUNDAY</small><h3>📖 Sunday School</h3><p><b>10:00 AM</b></p><p>Start Sunday in God’s Word as we learn and grow together.</p><a class="text-link" href="#times">See service times →</a></article><article class="event-card reveal in"><small>🙌 EVERY SUNDAY</small><h3>⛪ Morning Worship</h3><p><b>11:00 AM</b></p><p>Come worship, pray, sing, hear God’s Word, and fellowship with our church family.</p><a class="text-link" href="#visit">Plan your visit →</a></article><article class="event-card reveal in"><small>🎉 EVERY WEDNESDAY</small><h3>🧒 BYF Youth Service</h3><p><b>6:25–7:45 PM</b></p><p>A place for kids and youth to learn, laugh, build friendships, and grow in faith.</p><a class="text-link" href="#byf">Explore BYF →</a></article><article class="event-card reveal in"><small>📖 EVERY WEDNESDAY</small><h3>✝️ Adult Bible Study</h3><p><b>7:00–8:00 PM</b></p><p>Open the Bible with us for study, discussion, prayer, and Christian fellowship.</p><a class="text-link" href="#times">See Wednesday times →</a></article></div><div class="countdown-shell reveal in"><div><span>❤️ YOU’RE INVITED</span><h3>There’s a place for you at CMBC.</h3><p>115 Longacre Way • Smithers, WV 25186</p></div><a class="btn gold" href="#visit">👋 Plan Your Visit</a></div></div>`;
    }

    const side=document.querySelector('.calendar-side');
    if(side){const cards=side.querySelectorAll('.cal-card');if(cards[0])cards[0].innerHTML='<b>☀️ Every Sunday</b><span>Sunday School 10:00 AM • Morning Worship 11:00 AM</span>';if(cards[1])cards[1].innerHTML='<b>✝️ Every Wednesday</b><span>BYF 6:25 PM • Adult Bible Study 7:00 PM</span>';if(cards[2])cards[2].innerHTML='<b>🧒 Kids Corner</b><span>Monthly Bible Adventure • Coloring page • Activity sheet</span>';}
    keepPrayerOpen();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(applyNormalMode,50));else setTimeout(applyNormalMode,50);
  setTimeout(applyNormalMode,500);setTimeout(applyNormalMode,1600);
})();