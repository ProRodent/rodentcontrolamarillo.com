(function(){
'use strict';
// Cache selectors
var navbar=document.getElementById('navbar');
var hb=document.getElementById('mob-toggle');
var drawer=document.getElementById('nav-drawer');
var backdrop=document.getElementById('nav-backdrop');

// Sticky navbar
if(navbar){
  window.addEventListener('scroll',function(){
    navbar.classList.toggle('scrolled',window.scrollY>80);
  },{passive:true});
}

// Mobile drawer (Bug Fix #3)
function openDrawer(){
  drawer.classList.add('is-open');
  backdrop.classList.add('is-open');
  hb.classList.add('is-open');
  hb.setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';
}
function closeDrawer(){
  drawer.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  hb.classList.remove('is-open');
  hb.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}
if(hb&&drawer&&backdrop){
  hb.addEventListener('click',function(e){
    e.stopPropagation();
    drawer.classList.contains('is-open')?closeDrawer():openDrawer();
  });
  backdrop.addEventListener('click',closeDrawer);
  drawer.addEventListener('click',function(e){if(e.target.closest('a'))closeDrawer();});
  var dc=drawer.querySelector('.drawer-close');
  if(dc)dc.addEventListener('click',closeDrawer);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDrawer();});
}

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(function(btn){
  btn.addEventListener('click',function(){
    var item=btn.closest('.faq-item');
    var isOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(o){
      o.classList.remove('open');
      o.querySelector('.faq-q').setAttribute('aria-expanded','false');
    });
    if(!isOpen){
      item.classList.add('open');
      btn.setAttribute('aria-expanded','true');
    }
  });
});

// Stats counter: IntersectionObserver, integers only (Bug Fix #9)
var counters=document.querySelectorAll('[data-target]');
if(counters.length){
  var counted=false;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting&&!counted){
        counted=true;
        counters.forEach(function(el){
          var target=parseInt(el.getAttribute('data-target'),10);
          var suffix=el.getAttribute('data-suffix')||'';
          var dur=1800;
          var start=performance.now();
          (function step(now){
            var p=Math.min((now-start)/dur,1);
            el.textContent=Math.floor((1-Math.pow(1-p,3))*target)+suffix;
            if(p<1)requestAnimationFrame(step);
          })(start);
        });
      }
    });
  },{threshold:.3});
  counters.forEach(function(el){io.observe(el);});
}

// Active nav link
var path=window.location.pathname.replace(/\/$/,'');
document.querySelectorAll('.nav-links a,.drawer-links a').forEach(function(a){
  var h=a.getAttribute('href').replace(/\/$/,'');
  if(h&&(h===path||(h.length>1&&path.startsWith(h)))){
    a.classList.add('active');
  }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});
})();
