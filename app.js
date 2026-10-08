(function(){
var L=document.documentElement.getAttribute('data-lang'),Q=window.A2_Q,T=window.A2_T,I=window.A2_I,P=window.A2_P;
var root=document.getElementById('app'),i=0,picks={},start=0,timer=null;
function h(s){var d=document.createElement('div');d.innerHTML=s;return d.firstElementChild||d}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function speak(lines,btn){if(!('speechSynthesis' in window)){btn.textContent='—';return}
 speechSynthesis.cancel();var k=0;btn.textContent='■ '+T.playing;
 var v=(speechSynthesis.getVoices()||[]).filter(function(x){return /^ja/i.test(x.lang)})[0];
 (function nx(){if(k>=lines.length){btn.textContent='▶ '+T.play;return}var a=lines[k++],u=new SpeechSynthesisUtterance(a.ja);u.lang='ja-JP';if(v)u.voice=v;u.rate=0.9;u.pitch=a.who==='M'?0.8:a.who==='F'?1.2:1;u.onend=function(){setTimeout(nx,450)};u.onerror=function(){btn.textContent='▶ '+T.play};speechSynthesis.speak(u)})()}
function intro(){root.innerHTML='<div class="card"><p class="meta"><span>'+P.minutes+'</span><span>'+Q.length+'</span></p><p>'+esc(T.mockIntro)+'</p><button class="btn" id="go">'+esc(P.start)+'</button><p class="meta" style="margin-top:8px"><span>'+esc(P.voice)+'</span></p></div>';
 document.getElementById('go').onclick=function(){i=0;picks={};start=Date.now();show()}}
function show(){var q=Q[i],ins=I[q.type]||{};var picked=picks[q.id];
 var html='<div class="meta"><span>'+esc(T.sections[q.s])+'</span><span>'+(i+1)+' / '+Q.length+'</span></div><div class="bar"><i style="width:'+Math.round(i/Q.length*100)+'%"></i></div>'+
 '<div class="card"><div class="type">'+esc(T.types[q.type]||q.type)+'</div><div class="ins">'+(ins.ja||'')+'</div><div class="insl">'+esc(ins[L]||'')+'</div>'+
 (q.audio?'<button class="play" id="play">▶ '+esc(T.play)+'</button>':'')+(q.passage?'<div class="passage">'+q.passage+'</div>':'')+
 '<div class="q" lang="ja">'+q.prompt+'</div><div class="choices">'+q.choices.map(function(c,k){var cls=picked==null?'':(k===q.answer?' good':k===picked?' bad':'');return '<button class="choice'+cls+'" data-k="'+k+'"'+(picked!=null?' disabled':'')+'><span class="n">'+(picked!=null&&k===q.answer?'✓':picked===k?'✕':(k+1))+'</span><span lang="ja">'+c+'</span></button>'}).join('')+'</div>';
 if(picked!=null){var ok=picked===q.answer;html+='<div class="ex '+(ok?'good':'bad')+'"><h3>'+esc(ok?T.correct:T.wrong)+'</h3><p><b>'+esc(T.answerIs.replace('{a}',(q.answer+1)+'.'))+'</b></p><p>'+esc(q.explain[L])+'</p>'+
  (q.audio?'<p lang="ja" style="color:var(--soft)">'+q.audio.map(function(a){return esc(a.ja)}).join('<br>')+'</p>':'')+'<details><summary>'+esc(T.showJa)+'</summary><p lang="ja">'+esc(q.explain.ja)+'</p></details></div><button class="btn" id="next">'+esc(i+1<Q.length?T.next:T.finish)+'</button>'}
 html+='</div>';root.innerHTML=html;
 var pb=document.getElementById('play');if(pb)pb.onclick=function(){if(pb.textContent.charAt(0)==='■'){speechSynthesis.cancel();pb.textContent='▶ '+T.play}else speak(q.audio,pb)};
 [].forEach.call(root.querySelectorAll('.choice'),function(b){b.onclick=function(){picks[q.id]=+b.getAttribute('data-k');show()}});
 var nb=document.getElementById('next');if(nb)nb.onclick=function(){if('speechSynthesis' in window)speechSynthesis.cancel();i++;if(i<Q.length){show();window.scrollTo(0,root.offsetTop-8)}else done()}}
function done(){var by={},c=0;Q.forEach(function(q){by[q.s]=by[q.s]||[0,0];by[q.s][1]++;if(picks[q.id]===q.answer){by[q.s][0]++;c++}});
 root.innerHTML='<div class="card"><p class="meta"><span>'+esc(P.score)+'</span></p><div class="big">'+c+' / '+Q.length+'</div>'+Object.keys(by).map(function(s){return '<div class="sec"><span>'+esc(T.sections[s])+'</span><b>'+by[s][0]+'/'+by[s][1]+'</b></div><div class="bar"><i style="width:'+Math.round(by[s][0]/by[s][1]*100)+'%"></i></div>'}).join('')+'</div>'+
 (P.appUrl?'<a class="btn" href="'+P.appUrl+'">'+esc(P.app)+'</a>':'<div class="btn ghost">'+esc(P.appSoon)+'</div>')+'<p></p><button class="btn ghost" id="again">'+esc(P.again)+'</button>';
 document.getElementById('again').onclick=function(){intro()};window.scrollTo(0,root.offsetTop-8)}
intro()})();