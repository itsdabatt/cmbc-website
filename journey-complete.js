/* Hide CMBC Journey UI permanently on this device once the Journey reaches 100%. */
(() => {
  if (window.__CMBC_JOURNEY_COMPLETE__) return;
  window.__CMBC_JOURNEY_COMPLETE__ = true;
  const key='cmbc-app-state-v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(_){return {}}};
  const complete=()=>Number(read().xp||0)>=100;
  const removeJourney=()=>{
    if(!complete()) return false;
    document.getElementById('cmbc-app')?.remove();
    document.getElementById('cmbcToast')?.remove();
    document.querySelectorAll('[data-cmbc-journey],[aria-label*="Journey" i]').forEach(el=>el.remove());
    return true;
  };
  const run=()=>{
    removeJourney();
    const obs=new MutationObserver(()=>removeJourney());
    obs.observe(document.documentElement,{childList:true,subtree:true});
    window.addEventListener('storage',e=>{if(e.key===key)removeJourney()});
    let last=localStorage.getItem(key);
    setInterval(()=>{const now=localStorage.getItem(key);if(now!==last){last=now;removeJourney()}},700);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
