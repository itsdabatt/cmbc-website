/* Loader for the full CMBC interactive app. */
(function(){
  const version='20260816app2';
  if(!document.querySelector('script[data-tailwind-cmbc]')){
    const tw=document.createElement('script');tw.src='https://cdn.tailwindcss.com';tw.dataset.tailwindCmbc='1';document.head.appendChild(tw);
  }
  if(!document.querySelector('link[data-cmbc-app]')){
    const l=document.createElement('link');l.rel='stylesheet';l.href='church-app.css?v='+version;l.dataset.cmbcApp='1';document.head.appendChild(l);
  }
  const start=()=>{if(document.querySelector('script[data-cmbc-app]'))return;const s=document.createElement('script');s.src='church-app.js?v='+version;s.defer=true;s.dataset.cmbcApp='1';document.body.appendChild(s)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,120));else setTimeout(start,120);
})();