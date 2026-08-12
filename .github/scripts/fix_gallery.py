import json
from pathlib import Path

ALBUMS = {
    'worship': 'gallery/worship',
    'church-family': 'gallery/church-family',
    'special-events': 'gallery/special-events',
    'byf-youth': 'gallery/byf-youth',
}
ALLOWED = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'}

photos = []
for album, folder in ALBUMS.items():
    p = Path(folder)
    if not p.exists():
        continue
    for f in sorted(p.iterdir(), key=lambda x: x.name.lower(), reverse=True):
        if f.is_file() and f.suffix.lower() in ALLOWED:
            photos.append({'album': album, 'src': f.as_posix()})
Path('gallery-manifest.json').write_text(json.dumps({'photos': photos}, indent=2) + '\n')

index = Path('index.html')
s = index.read_text()
markers = ['// LIVE CMBC Memory Wall', '// CMBC Memory Wall — loads a same-site manifest', '// CMBC Memory Wall — phone-safe same-site photo loader.']
starts = [s.find(m) for m in markers if s.find(m) != -1]
start = min(starts) if starts else -1
end = s.find("const lb=document.getElementById('photoLightbox')")

loader = r'''// CMBC Memory Wall — phone-safe same-site photo loader.
const CMBC_ALBUMS={
 'worship':{label:'⛪ Worship & Church Services'},
 'church-family':{label:'👨‍👩‍👧‍👦 Church Family & Fellowship'},
 'special-events':{label:'🎉 Special Events'},
 'byf-youth':{label:'🧒 BYF & Youth'}
};
let CMBC_GALLERY=[];
async function getGalleryManifest(){
 if(CMBC_GALLERY.length)return CMBC_GALLERY;
 const res=await fetch('gallery-manifest.json?fresh='+Date.now(),{cache:'no-store'});
 if(!res.ok)throw new Error('gallery unavailable');
 const data=await res.json();
 CMBC_GALLERY=Array.isArray(data.photos)?data.photos:[];
 return CMBC_GALLERY;
}
async function loadApprovedGallery(album='all'){
 const wall=document.getElementById('galleryLive'); if(!wall)return;
 document.querySelectorAll('.album-card').forEach(b=>b.classList.toggle('active',b.dataset.album===album));
 wall.innerHTML='<div class="gallery-status">📸 Loading our church memories…</div>';
 try{
  const all=await getGalleryManifest();
  const imgs=album==='all'?all:all.filter(f=>f.album===album);
  if(!imgs.length){wall.innerHTML='<div class="gallery-empty">📷 More memories from this part of church life are coming soon.</div>';return;}
  wall.innerHTML='';
  let visible=0;
  imgs.forEach((f,i)=>{
   const meta=CMBC_ALBUMS[f.album]||{label:'CMBC Church Memory'};
   const card=document.createElement('figure'); card.className='gallery-item'; card.tabIndex=0; card.title=meta.label;
   const img=document.createElement('img'); img.loading=i<4?'eager':'lazy'; img.decoding='async'; img.src=encodeURI(f.src); img.alt=meta.label+' — Campbell Memorial Baptist Church';
   img.addEventListener('load',()=>{visible++;});
   img.addEventListener('error',()=>{card.remove(); setTimeout(()=>{if(!wall.querySelector('.gallery-item'))wall.innerHTML='<div class="gallery-empty">📷 These memories are being prepared for your device. Please check back soon.</div>';},50);});
   const open=()=>openLightbox(img.src); card.addEventListener('click',open); card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}}); card.appendChild(img); wall.appendChild(card);
  });
 }catch(e){wall.innerHTML='<div class="gallery-empty">📷 The Memory Wall is taking a moment to load. Please refresh and try again.</div>';}
}
document.querySelectorAll('.album-card').forEach(btn=>btn.addEventListener('click',()=>{loadApprovedGallery(btn.dataset.album);document.getElementById('galleryLive')?.scrollIntoView({behavior:'smooth',block:'center'});}));
loadApprovedGallery('all');
'''

if start != -1 and end != -1 and end > start:
    s = s[:start] + loader + s[end:]

mobile_css = '''\n/* CMBC phone gallery reliability */\n@media(max-width:620px){.gallery-live{grid-template-columns:1fr!important}.gallery-item{min-height:0!important;background:#eef3f9}.gallery-item img{width:100%!important;height:auto!important;max-height:none!important;aspect-ratio:auto!important;object-fit:contain!important}.approved-gallery{margin-top:28px}.gallery-status,.gallery-empty{font-size:1rem;line-height:1.5}}\n'''
if 'CMBC phone gallery reliability' not in s:
    s = s.replace('</style>', mobile_css + '</style>', 1)

index.write_text(s)
print(f'Gallery ready: {len(photos)} photos listed')
