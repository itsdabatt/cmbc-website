/* Fire Safety Evening media/resources for September 2026. */
(() => {
  if(window.__CMBC_FIREFEST_MEDIA__) return;
  window.__CMBC_FIREFEST_MEDIA__=true;

  const resources=[
    {
      type:'flyer',
      title:'🚒 Fire Safety Evening Flyer',
      text:'Event details, date, time, family activities, church information, and how to join us.',
      src:'images/fire-safety-evening-2026.png',
      alt:'Campbell Memorial Baptist Church Fire Safety Evening flyer for Friday September 25, 2026 from 5:00 PM to 7:00 PM'
    },
    {
      type:'kids',
      title:'🧯 Kids Fire Safety Activity Page',
      text:'A kid-friendly color, learn, and stay-safe page with simple fire-safety reminders.',
      src:'images/fire-safety-kids-2026.png',
      alt:'CMBC kids Fire Safety Evening activity and coloring page with fire safety tips'
    }
  ];

  function build(){
    const host=document.getElementById('featured-event');
    if(!host || document.getElementById('firefestResources')) return;
    const container=host.querySelector('.container')||host;
    const section=document.createElement('section');
    section.id='firefestResources';
    section.className='firefest-resources';
    section.setAttribute('aria-labelledby','firefestResourcesTitle');
    section.innerHTML=`
      <div class="firefest-resources-head">
        <span>🚒 TAKE IT WITH YOU</span>
        <h3 id="firefestResourcesTitle">Fire Safety Evening Resources</h3>
        <p>Tap either page to see it full size. Parents can save the event flyer, and kids can use the safety page before or after the event.</p>
      </div>
      <div class="firefest-resource-grid">
        ${resources.map((r,i)=>`<article class="firefest-resource-card" data-fire-resource="${r.type}">
          <button class="firefest-image-button" type="button" data-fire-open="${i}" aria-label="Open ${r.title.replace(/[🚒🧯]/g,'').trim()} full size">
            <img src="${r.src}" alt="${r.alt}" loading="lazy" decoding="async">
            <span>🔎 TAP TO VIEW FULL SIZE</span>
          </button>
          <div class="firefest-resource-copy"><h4>${r.title}</h4><p>${r.text}</p>
            <div class="firefest-resource-actions"><button type="button" data-fire-open="${i}">👀 View Full Size</button><button type="button" data-fire-print="${i}">🖨️ Print</button></div>
          </div>
        </article>`).join('')}
      </div>`;
    container.appendChild(section);

    resources.forEach((r,i)=>{
      const card=section.querySelector(`[data-fire-resource="${r.type}"]`);
      const img=card?.querySelector('img');
      if(img) img.addEventListener('error',()=>{card.classList.add('resource-missing');card.innerHTML=`<div class="firefest-resource-copy"><h4>${r.title}</h4><p>This resource is ready in the site layout and will appear as soon as the image file is uploaded.</p></div>`;},{once:true});
    });

    section.querySelectorAll('[data-fire-open]').forEach(btn=>btn.addEventListener('click',()=>openViewer(resources[Number(btn.dataset.fireOpen)])));
    section.querySelectorAll('[data-fire-print]').forEach(btn=>btn.addEventListener('click',()=>printResource(resources[Number(btn.dataset.firePrint)])));
  }

  function openViewer(r){
    if(!r)return;
    let modal=document.getElementById('firefestViewer');
    if(!modal){modal=document.createElement('div');modal.id='firefestViewer';modal.className='firefest-viewer';modal.innerHTML='<button class="firefest-close" type="button" aria-label="Close full size image">×</button><figure><img alt=""><figcaption></figcaption></figure>';document.body.appendChild(modal);modal.querySelector('.firefest-close').onclick=()=>modal.classList.remove('open');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('open')});}
    const img=modal.querySelector('img');img.src=r.src;img.alt=r.alt;modal.querySelector('figcaption').textContent=r.title.replace(/[🚒🧯]/g,'').trim();modal.classList.add('open');modal.querySelector('.firefest-close').focus();
  }

  function printResource(r){
    if(!r)return;
    const w=window.open('','_blank','noopener,noreferrer');
    if(!w)return;
    w.document.write(`<!doctype html><html><head><title>${r.title}</title><style>html,body{margin:0;background:#fff}body{display:grid;place-items:center;min-height:100vh}img{display:block;max-width:100%;max-height:100vh;object-fit:contain}@media print{@page{margin:.25in}body{min-height:0}img{width:100%;max-height:none}}</style></head><body><img src="${r.src}" alt="${r.alt}" onload="setTimeout(()=>window.print(),250)"></body></html>`);
    w.document.close();
  }

  const run=()=>{build();setTimeout(build,400);setTimeout(build,1200);setTimeout(build,2600)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
