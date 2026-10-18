(function(){
var $=function(s,r){return (r||document).querySelector(s)},all=function(s,r){return [].slice.call((r||document).querySelectorAll(s))},
rm=matchMedia('(prefers-reduced-motion:reduce)').matches,root=document.documentElement,tpl=$('#phone'),
full='mamajollof.seepay.shop',busy=false,step=-1;
var hp=$('#hp'),sp=$('#sp');
hp.appendChild(tpl.content.cloneNode(true));sp.appendChild(tpl.content.cloneNode(true));
var hph=$('.phone',hp),spp=$('.phone',sp);
hph.classList.add('static');$('.u',hph).textContent=full;
var screen=$('.screen',spp),panes=all('.pane',spp),urlEl=$('.u',spp),sts=all('.st'),story=$('#how'),nav=$('#nav');
function size(){
  var h=innerHeight,w=innerWidth;
  root.style.setProperty('--s',Math.min(1,(h*.56-24)/576,(w-48)/280));
  root.style.setProperty('--hs',Math.min(1,(h*.5)/(576*.6),(w-48)/280));
}
function setStep(s){
  step=s;
  panes.forEach(function(e,i){e.classList.toggle('on',i===s)});
  sts.forEach(function(e,i){e.classList.toggle('on',i===s)});
  screen.className='screen s'+s+' go';
}
function tick(){
  busy=false;
  nav.classList.toggle('sc',scrollY>8);
  var r=story.getBoundingClientRect(),f=sts[0].getBoundingClientRect(),t=Math.min(1,Math.max(0,1-f.top/(innerHeight*.9)));
  urlEl.textContent=full.slice(0,Math.round(Math.min(1,t*1.5)*full.length));
  var line=innerHeight*.8,best=0,bd=1e9;
  sts.forEach(function(e,i){var b=e.getBoundingClientRect(),d=Math.abs((b.top+90)-line);if(d<bd){bd=d;best=i}});
  if(r.top>innerHeight*.35)best=0;
  if(best!==step)setStep(best);
}
function req(){if(!busy){busy=true;requestAnimationFrame(tick)}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',function(){size();req()});
size();tick();

/* business cloud */
var biz=['Chop bars','Boutiques','Hair salons','Barbershops','Phone repair','Bakeries','Caterers','Provision shops','Tailors','Fabric sellers','Photographers','Printing','Car wash','Mechanics','Cleaners','Event planners','Cosmetics','Jewellery','Furniture','Electronics','Tutors','Delivery riders','Fruit and veg','Bags and shoes','Handmade crafts','Laundry','Fitness trainers','Makeup artists','Yours'],cl=$('#cloud');
biz.forEach(function(b,i){var e=document.createElement('i');e.textContent=b;e.style.transitionDelay=Math.min(i*30,600)+'ms';if(i===biz.length-1)e.className='you';cl.appendChild(e)});

/* fee calculator */
var amt=$('#amt'),qa=all('#qa button');
function money(n){return n.toFixed(2)}
function calc(){
  var v=parseFloat(amt.value);if(!(v>0))v=0;
  var pf=Math.round(v*1.95)/100,sf=Math.min(.2,v),you=Math.max(0,v-pf-sf);
  $('#r1').textContent='GH₵ '+money(v);$('#r2').textContent='− '+money(pf);$('#r3').textContent='− '+money(sf);$('#r4').textContent='GH₵ '+money(you);
  qa.forEach(function(b){b.classList.toggle('on',parseFloat(b.textContent)===v)});
}
amt.addEventListener('input',calc);
qa.forEach(function(b){b.addEventListener('click',function(){amt.value=b.textContent;calc()})});

function count(el,to,ms){var t0=performance.now();(function f(n){var k=Math.min(1,(n-t0)/ms);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0)}
var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;var t=e.target;io.unobserve(t);t.classList.add('in');
  if(t.id==='wallet'){var chips=all('.shops i'),bal=$('#bal');
    chips.forEach(function(c,i){setTimeout(function(){c.classList.add('on');count(bal,(i+1)*50,500)},500+i*800)})}
})},{threshold:.2,rootMargin:'0px 0px -6% 0px'});
all('.rv,#rc,#cloud').forEach(function(n){io.observe(n)});

var names=['yourshop','mamajollof','amasbeauty','kofifixes'],ni=0,ci=8,del=true,tp=$('#typed');
if(!rm)(function type(){
  var w=names[ni];ci+=del?-1:1;tp.textContent=w.slice(0,ci);
  var d=del?50:100;
  if(!del&&ci===w.length){del=true;d=1800}
  else if(del&&ci<=0){del=false;ni=(ni+1)%names.length;d=350}
  setTimeout(type,d);
})();
})();
