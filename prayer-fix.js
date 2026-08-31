/* Keep CMBC prayer requests reusable forever, even after a prior successful submission. */
(() => {
  function fix(){
    const form=document.getElementById('prayerForm'),thanks=document.getElementById('prayerThanks');if(!form)return;
    const keepVisible=()=>{if(form.hidden)form.hidden=false;form.removeAttribute('hidden');form.style.removeProperty('display');form.setAttribute('aria-hidden','false')};
    keepVisible();
    if(!form.dataset.repeatGuard){
      form.dataset.repeatGuard='1';
      new MutationObserver(keepVisible).observe(form,{attributes:true,attributeFilter:['hidden','style','aria-hidden']});
    }
    if(!document.getElementById('prayerRepeatNote')){
      const p=document.createElement('p');p.id='prayerRepeatNote';p.innerHTML='🙏 <b>Prayer is always open.</b> Send one request or as many as you need.';p.style.cssText='margin:8px 0 16px;padding:10px 12px;border-radius:12px;background:rgba(255,200,61,.15);font-size:14px;line-height:1.4';form.querySelector('h3')?.insertAdjacentElement('afterend',p);
    }
    if(thanks){
      const sent=new URLSearchParams(location.search).get('prayer')==='sent';
      if(sent){thanks.hidden=false;thanks.style.display='block';}
      let again=document.getElementById('prayAgainBtn');if(!again){again=document.createElement('button');again.id='prayAgainBtn';again.type='button';again.className='btn gold';again.textContent='🙏 Send Another Prayer Request';again.style.marginTop='12px';again.onclick=()=>{form.reset();thanks.hidden=true;thanks.style.display='none';keepVisible();try{history.replaceState({},'',location.pathname+'#prayer')}catch(_){}form.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>form.querySelector('textarea')?.focus(),350)};thanks.appendChild(again);}
    }
  }
  const run=()=>{fix();setTimeout(fix,100);setTimeout(fix,600);setTimeout(fix,1800);setTimeout(fix,4000)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();