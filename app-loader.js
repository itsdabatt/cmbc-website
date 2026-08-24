/* Loader for the full CMBC interactive app. */
(function(){
  const version='20260824prayer2';
  if(!document.querySelector('script[data-tailwind-cmbc]')){
    const tw=document.createElement('script');tw.src='https://cdn.tailwindcss.com';tw.dataset.tailwindCmbc='1';document.head.appendChild(tw);
  }
  const css=[['church-app.css','cmbcApp'],['kids-corner.css','cmbcKids'],['connect.css','cmbcConnect']];
  css.forEach(([href,key])=>{if(!document.querySelector(`link[data-${key}]`)){const l=document.createElement('link');l.rel='stylesheet';l.href=href+'?v='+version;l.setAttribute(`data-${key}`,'1');document.head.appendChild(l)}});
  const start=()=>{
    const js=[['normal-mode.js','cmbcNormal'],['church-app.js','cmbcApp'],['kids-corner.js','cmbcKids'],['connect.js','cmbcConnect'],['gallery-rotation.js','cmbcGalleryRotation']];
    js.forEach(([src,key])=>{if(!document.querySelector(`script[data-${key}]`)){const s=document.createElement('script');s.src=src+'?v='+version;s.defer=true;s.setAttribute(`data-${key}`,'1');document.body.appendChild(s)}});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,80));else setTimeout(start,80);
})();