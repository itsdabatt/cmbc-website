/* CMBC usability refresh: optional draggable hymnal, accessible tools, no floating journey overlay. */
(() => {
  'use strict';
  if (window.__CMBC_UI_REFINEMENT__) return;
  window.__CMBC_UI_REFINEMENT__ = true;
  const $ = (s,r=document) => r.querySelector(s);
  const body = document.body;
  let musicReady = false;
  let musicPlayer = null;
  let musicLauncher = null;
  let savedPosition = null;
  try { const p=JSON.parse(localStorage.getItem('cmbc-music-position')||'null'); if(p && Number.isFinite(p.x) && Number.isFinite(p.y))savedPosition=p; } catch (_) {}
  const isPhone = () => window.matchMedia('(max-width:760px)').matches;
  const headerHeight = () => Math.ceil($('.site-header')?.getBoundingClientRect().height||72);
  function updateHeaderHeight(){
    document.documentElement.style.setProperty('--cmbc-header-height',headerHeight()+'px');
  }
  function menuToolBefore(menu,el){
    const actions=$('.site-header .nav-actions');
    if(!actions||!el)return false;
    if(el.parentElement!==actions)actions.insertBefore(el,menu&&menu.parentElement===actions?menu:null);
    return true;
  }
  function moveAccessibility(){
    const t=$('#cmbcToolsToggle'),menu=$('#menuBtn');
    if(!t)return false;
    t.classList.add('cmbc-header-tool');
    t.title='Reading & accessibility';
    menuToolBefore(menu,t);
    return true;
  }
  function moveJourney(){
    const launch=$('.journey-launch'),app=$('#cmbc-app');
    if(!launch||!app)return false;
    let slot=$('.cmbc-journey-slot');
    if(!slot){slot=document.createElement('div');slot.className='cmbc-journey-slot';slot.setAttribute('aria-label','Explore CMBC');app.insertAdjacentElement('beforebegin',slot);}
    if(launch.parentElement!==slot)slot.appendChild(launch);
    return true;
  }
  function setPosition(x,y,store=false){
    if(!musicPlayer||musicPlayer.hidden)return;
    const w=musicPlayer.getBoundingClientRect().width||66;
    const h=musicPlayer.getBoundingClientRect().height||56;
    const minY=headerHeight()+8;
    const reserve=isPhone()?92:12;
    const maxX=Math.max(8,window.innerWidth-w-8);
    const maxY=Math.max(minY,window.innerHeight-h-reserve);
    const clampedX=Math.max(8,Math.min(maxX,x));
    const clampedY=Math.max(minY,Math.min(maxY,y));
    musicPlayer.style.setProperty('left',clampedX+'px','important');
    musicPlayer.style.setProperty('top',clampedY+'px','important');
    if(store){savedPosition={x:clampedX,y:clampedY};try{localStorage.setItem('cmbc-music-position',JSON.stringify(savedPosition));}catch(_){}}
  }
  function placePlayer(preferSaved=true){
    if(!musicPlayer||musicPlayer.hidden)return;
    requestAnimationFrame(()=>{
      const box=musicPlayer.getBoundingClientRect();
      if(preferSaved&&savedPosition){setPosition(savedPosition.x,savedPosition.y);return;}
      setPosition(window.innerWidth-box.width-16,window.innerHeight-box.height-(isPhone()?104:18));
    });
  }
  function synchronizeMinimize(){
    if(!musicPlayer)return;
    const b=$('#musicMinimize');
    if(!b)return;
    const mini=musicPlayer.classList.contains('minimized');
    b.textContent=mini?'🎵':'−';
    b.setAttribute('aria-label',mini?'Expand music player':'Minimize music player');
    b.title=mini?'Expand music player':'Minimize music player';
    placePlayer(true);
  }
  function hidePlayer(){
    if(!musicPlayer)return;
    musicPlayer.hidden=true;
    musicPlayer.style.setProperty('display','none');
    musicLauncher?.setAttribute('aria-expanded','false');
    const audio=$('#hymnAudio');
    if(audio&&!audio.paused)audio.pause();
    musicLauncher?.focus({preventScroll:true});
  }
  function showPlayer(){
    if(!musicPlayer)return;
    musicPlayer.hidden=false;
    musicPlayer.style.removeProperty('display');
    musicPlayer.classList.remove('minimized');
    musicLauncher?.setAttribute('aria-expanded','true');
    synchronizeMinimize();
    placePlayer(true);
  }
  function installMusic(){
    if(musicReady)return true;
    const player=$('#musicPlayer'),menu=$('#menuBtn'),actions=$('.site-header .nav-actions');
    if(!player||!actions)return false;
    musicPlayer=player;
    player.classList.add('ui-music-player');
    player.hidden=true;
    player.style.setProperty('display','none');
    const launcher=document.createElement('button');
    launcher.id='cmbcMusicLauncher';
    launcher.type='button';
    launcher.className='cmbc-header-tool cmbc-music-launcher';
    launcher.innerHTML='🎵 <span>Music</span>';
    launcher.setAttribute('aria-label','Open hymns and music player');
    launcher.setAttribute('aria-controls','musicPlayer');
    launcher.setAttribute('aria-expanded','false');
    launcher.title='Open hymn player';
    menuToolBefore(menu,launcher);
    musicLauncher=launcher;
    launcher.addEventListener('click',()=>player.hidden?showPlayer():hidePlayer());
    const handle=document.createElement('button');
    handle.type='button';
    handle.id='musicDragHandle';
    handle.textContent='⠿';
    handle.title='Drag to move the music player';
    handle.setAttribute('aria-label','Drag to move music player');
    player.appendChild(handle);
    const close=document.createElement('button');
    close.type='button';
    close.id='musicClose';
    close.textContent='×';
    close.title='Close music player';
    close.setAttribute('aria-label','Close music player');
    player.appendChild(close);
    close.addEventListener('click',hidePlayer);
    const mini=$('#musicMinimize');
    mini?.addEventListener('click',()=>setTimeout(synchronizeMinimize,0));
    handle.addEventListener('pointerdown',e=>{
      if(e.button!==0&&e.pointerType==='mouse')return;
      e.preventDefault();
      const bounds=player.getBoundingClientRect();
      const dx=e.clientX-bounds.left,dy=e.clientY-bounds.top;
      try{handle.setPointerCapture(e.pointerId)}catch(_){}
      function move(ev){setPosition(ev.clientX-dx,ev.clientY-dy);}
      function end(ev){
        handle.removeEventListener('pointermove',move);
        handle.removeEventListener('pointerup',end);
        handle.removeEventListener('pointercancel',end);
        try{handle.releasePointerCapture(ev.pointerId)}catch(_){}
        const b=player.getBoundingClientRect();
        setPosition(b.left,b.top,true);
      }
      handle.addEventListener('pointermove',move);
      handle.addEventListener('pointerup',end);
      handle.addEventListener('pointercancel',end);
    });
    $('#hymnAudio')?.removeAttribute('autoplay');
    musicReady=true;
    return true;
  }
  function update(){
    updateHeaderHeight();
    installMusic();
    moveAccessibility();
    moveJourney();
  }
  const observer=new MutationObserver(()=>update());
  if(document.body)observer.observe(document.body,{childList:true,subtree:true});
  update();
  setTimeout(update,250);
  setTimeout(update,1000);
  setTimeout(()=>{update();observer.disconnect();},4500);
  window.addEventListener('resize',()=>{
    updateHeaderHeight();
    if(musicPlayer&&!musicPlayer.hidden){
      const b=musicPlayer.getBoundingClientRect();
      setPosition(b.left,b.top);
    }
  },{passive:true});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&musicPlayer&&!musicPlayer.hidden)hidePlayer();
  });
})();
