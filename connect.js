/* CMBC Kids Corner navigation + Contact CMBC */
(() => {
  if (window.__CMBC_CONNECT__) return;
  window.__CMBC_CONNECT__ = true;

  const addNavLink=(nav,href,label,cls='')=>{
    if(!nav || nav.querySelector(`a[href="${href}"]`)) return;
    const a=document.createElement('a');a.href=href;a.textContent=label;if(cls)a.className=cls;nav.appendChild(a);
  };

  function build(){
    addNavLink(document.querySelector('.desktop-nav'),'#kids-corner','🧒 Kids','kids-nav-link');
    addNavLink(document.querySelector('.desktop-nav'),'#contact','Contact','contact-nav-link');
    addNavLink(document.querySelector('#mobileMenu'),'#kids-corner','🧒 Kids Corner','kids-nav-link');
    addNavLink(document.querySelector('#mobileMenu'),'#contact','📬 Contact CMBC','contact-nav-link');

    if(!document.querySelector('#contact')){
      const visit=document.querySelector('#visit');
      const section=document.createElement('section');
      section.id='contact';section.className='contact-cmbc';
      section.innerHTML=`<div class="contact-wrap">
        <div class="contact-copy">
          <span class="eyebrow">📬 CONNECT WITH CMBC</span>
          <h2>Questions? Reach Out.</h2>
          <p>Planning a visit, asking about BYF, looking for church information, or just need to get in touch? Send us a message and someone from Campbell Memorial Baptist Church can follow up.</p>
          <div class="contact-note"><b>🙏 Need prayer instead?</b><span>Use the Prayer Request section so your request goes through the prayer form and can be marked private.</span></div>
        </div>
        <div>
          <form id="contactForm" class="contact-form" action="https://formsubmit.co/campbellmemorialbyf@gmail.com" method="POST">
            <h3>Send CMBC a Message</h3><p>Fields marked required must be completed before sending.</p>
            <input type="hidden" name="_subject" value="New CMBC Website Contact Message">
            <input type="hidden" name="_captcha" value="false">
            <input type="hidden" name="_next" value="https://cmbc-website.pages.dev/?contact=sent#contact">
            <div class="contact-row"><label>Name<input name="Name" required autocomplete="name" placeholder="Your name"></label><label>Email<input name="Email" type="email" required autocomplete="email" placeholder="Your email"></label></div>
            <div class="contact-row"><label>Phone <small>(optional)</small><input name="Phone" type="tel" autocomplete="tel" placeholder="Phone number"></label><label>What can we help with?<select name="Reason"><option>General question</option><option>Planning a visit</option><option>BYF / Youth</option><option>Church event</option><option>Community outreach</option><option>Other</option></select></label></div>
            <label>Message<textarea name="Message" required placeholder="How can we help?"></textarea></label>
            <button type="submit">📬 Send Message</button>
          </form>
          <div id="contactThanks" class="contact-thanks" hidden><div class="big">💛</div><h3>Message sent!</h3><p>Thanks for reaching out to Campbell Memorial Baptist Church. Your message has been sent to the church inbox.</p></div>
        </div>
      </div>`;
      if(visit) visit.insertAdjacentElement('beforebegin',section); else document.querySelector('main')?.appendChild(section);
    }

    const params=new URLSearchParams(location.search);
    if(params.get('contact')==='sent'){
      const form=document.querySelector('#contactForm'),thanks=document.querySelector('#contactThanks');
      if(form)form.hidden=true;if(thanks)thanks.hidden=false;
      setTimeout(()=>document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'}),250);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();