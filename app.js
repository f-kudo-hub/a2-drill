(function(){
var L=document.documentElement.getAttribute('data-lang'),Q=window.A2_Q,T=window.A2_T,I=window.A2_I,P=window.A2_P;
var CODE={moji:'m',kaiwa:'k',choukai:'c',dokkai:'d'},LET={moji:'M',kaiwa:'K',choukai:'C',dokkai:'D'};
var root=document.getElementById('app'),i=0,picks={};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
// 1〜2字だけ次の行に落ちないよう、日本語は最後の4字を見えない字（U+2060）でつなぐ。数字と後ろの日本語も離さない
function nob(s){s=String(s).replace(/([0-9])(?=[぀-ヿ㐀-鿿])/g,'$1⁠');var a=Array.from(s),k=a.length-1;if(k>3&&/[　-ヿ㐀-鿿＀-￯]/.test(a[k])){return a.slice(0,k-3).join('')+a.slice(k-3).join('⁠')}return s.replace(/ (S{1,12})$/,' $1')}
function tag(s,n){return '<span class="tag tagL s'+CODE[s]+'"><small>'+LET[s]+'</small><span>'+n+'</span></span>'}
function speak(lines,btn){var lab=btn.querySelector('.l'),dot=btn.querySelector('.dot');if(!('speechSynthesis' in window)){lab.textContent='—';return}
 speechSynthesis.cancel();var k=0;lab.textContent=T.playing;dot.textContent='■';
 var v=(speechSynthesis.getVoices()||[]).filter(function(x){return /^ja/i.test(x.lang)})[0];
 function reset(){lab.textContent=T.play;dot.textContent='▶'}
 (function nx(){if(k>=lines.length){reset();return}var a=lines[k++],u=new SpeechSynthesisUtterance(a.ja);u.lang='ja-JP';if(v)u.voice=v;u.rate=0.9;u.pitch=a.who==='M'?0.8:a.who==='F'?1.2:1;u.onend=function(){setTimeout(nx,450)};u.onerror=reset;speechSynthesis.speak(u)})()}
function intro(){var by={};Q.forEach(function(q){by[q.s]=(by[q.s]||0)+1});
 root.innerHTML='<div class="ticket"><div class="body"><h2>'+esc(P.start)+'</h2><p>'+esc(P.minutes)+'</p></div><div class="stub"><span class="n">'+Q.length+'</span><span class="u" lang="ja">問</span></div></div>'+
 '<p>'+esc(T.mockIntro)+'</p><div class="lines">'+Object.keys(by).map(function(s){return '<div class="line r'+CODE[s]+'"><span class="tag s'+CODE[s]+'">'+LET[s]+'</span><span class="grow">'+esc(T.sections[s])+'</span><b class="disp">'+by[s]+'</b></div>'}).join('')+'</div>'+
 '<button class="btn" id="go">'+esc(P.start)+'</button><p class="note">'+esc(P.voice)+'</p>';
 document.getElementById('go').onclick=function(){i=0;picks={};show()}}
function show(){var q=Q[i],ins=I[q.type]||{};var picked=picks[q.id],c=CODE[q.s];
 var html='<div class="top"><span class="c'+c+'" style="font-weight:700">'+esc(T.sections[q.s])+'</span><span class="disp">'+(i+1)+'<span style="color:var(--faint);font-size:15px">/'+Q.length+'</span></span></div><div class="bar"><i class="b'+c+'" style="width:'+Math.round((i+(picked!=null?1:0))/Q.length*100)+'%"></i></div>'+
 '<div class="qhead">'+tag(q.s,String(i+1).padStart(2,'0'))+'<div><div class="type c'+c+'">'+esc(T.types[q.type]||q.type)+'</div><div class="ins" lang="ja">'+(ins.ja||'')+'</div><div class="insl">'+esc(ins[L]||'')+'</div></div></div>'+
 (q.audio?'<button class="play" id="play"><span class="dot">▶</span><span class="l">'+esc(T.play)+'</span></button>':'')+(q.passage?'<div class="passage" lang="ja" style="border-top-color:var(--'+c+')">'+q.passage+'</div>':'')+
 '<div class="q" lang="ja">'+q.prompt+'</div><div class="choices">'+q.choices.map(function(ch,k){var cls=picked==null?'':(k===q.answer?' good':k===picked?' bad':'');return '<button class="choice'+cls+'" data-k="'+k+'"'+(picked!=null?' disabled':'')+'><span class="n">'+(picked!=null&&k===q.answer?'✓':picked===k?'✕':(k+1))+'</span><span class="t" lang="ja">'+ch+'</span></button>'}).join('')+'</div>';
 if(picked!=null){var ok=picked===q.answer;html+='<div class="ex '+(ok?'good':'bad')+'"><h3>'+(ok?'✓ ':'✕ ')+esc(ok?T.correct:T.wrong)+'</h3><div class="in"><p><b>'+esc(T.answerIs.replace('{a}',(q.answer+1)+'.'))+'</b></p><p>'+esc(nob(q.explain[L]))+'</p>'+
  (q.audio?'<p class="script" lang="ja">'+q.audio.map(function(a){return '<b>'+(a.who==='M'?'男':a.who==='F'?'女':'◉')+'</b> '+esc(nob(a.ja))}).join('<br>')+'</p>':'')+'<details><summary>'+esc(T.showJa)+'</summary><p lang="ja">'+esc(nob(q.explain.ja))+'</p></details></div></div><button class="btn" id="next">'+esc(i+1<Q.length?T.next:T.finish)+'</button>'}
 root.innerHTML=html;
 var pb=document.getElementById('play');if(pb)pb.onclick=function(){if(pb.querySelector('.dot').textContent==='■'){speechSynthesis.cancel();pb.querySelector('.dot').textContent='▶';pb.querySelector('.l').textContent=T.play}else speak(q.audio,pb)};
 [].forEach.call(root.querySelectorAll('.choice'),function(b){b.onclick=function(){picks[q.id]=+b.getAttribute('data-k');show()}});
 var nb=document.getElementById('next');if(nb)nb.onclick=function(){if('speechSynthesis' in window)speechSynthesis.cancel();i++;if(i<Q.length){show();window.scrollTo(0,root.offsetTop-8)}else done()}}
function done(){var by={},c=0;Q.forEach(function(q){by[q.s]=by[q.s]||[0,0];by[q.s][1]++;if(picks[q.id]===q.answer){by[q.s][0]++;c++}});
 root.innerHTML='<div class="ticket dark"><div class="body"><p>'+esc(P.score)+'</p><div class="big">'+c+'<small> / '+Q.length+'</small></div></div><div class="stub"><span class="n" style="color:#fff">'+Math.round(c/Q.length*100)+'</span><span class="u">%</span></div></div>'+
 '<div class="lines">'+Object.keys(by).map(function(s){return '<div class="r'+CODE[s]+'"><div class="line"><span class="tag s'+CODE[s]+'">'+LET[s]+'</span><span class="grow">'+esc(T.sections[s])+'</span><b class="disp">'+by[s][0]+'/'+by[s][1]+'</b></div><div class="bar" style="height:6px;margin:6px 0 0"><i class="b'+CODE[s]+'" style="height:6px;width:'+Math.round(by[s][0]/by[s][1]*100)+'%"></i></div></div>'}).join('')+'</div>'+
 (P.appUrl?'<a class="btn" href="'+P.appUrl+'">'+esc(P.app)+'</a>':'<div class="btn dark">'+esc(P.appSoon)+'</div>')+'<p></p><button class="btn ghost" id="again">'+esc(P.again)+'</button>';
 document.getElementById('again').onclick=function(){intro()};window.scrollTo(0,root.offsetTop-8)}
intro()})();