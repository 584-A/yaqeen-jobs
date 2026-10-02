// ===== إعدادات: عدّلها قبل النشر =====
const CONTACT={telegram:'',whatsapp:''}; // telegram: لينك القناة https://t.me/... | whatsapp: رقم دولي بدون + مثل 2010xxxxxxxx
const SITE_NOTE='موقع مستقل بيجمّع إعلانات قناة يقين وبيرتبها. مش الموقع الرسمي للشركة، والمرجع النهائي هو القناة.';
const TRANSITION_MS=1250; // مدة شاشة الانتقال قبل صفحة التفاصيل (0 = إلغاء)
// =====================================
const D=(window.JOBS||[]).filter(j=>!j.closed);
const CN={f:'مصانع',s:'أمن',g:'محطات بنزين'},DOCS={f:['البطاقة الشخصية (تكفي في أغلب المصانع)'],s:['البطاقة الشخصية','شهادة الميلاد','شهادة الجيش','المؤهل الدراسي','فيش جنائي ساري'],g:['البطاقة الشخصية','شهادة الميلاد','شهادة الجيش','المؤهل','فيش جنائي ساري','جزمة سيفتي','برنت تأمين','كعب عمل','نموذج 111']};
const HS={1:'يوجد',0:'لا يوجد',2:'غير مذكور'};
const S={tab:'jobs',c:'all',q:'',p:'',h:false,k:'r',d:-1},$=s=>document.querySelector(s),app=$('#app');
const fmt=n=>n.toLocaleString('en'),hs=j=>j.h?j.h+' ساعة':'غير مذكور';
const norm=s=>String(s).replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/[ىئ]/g,'ي').replace(/ؤ/g,'و').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).toLowerCase();
const rate=j=>j.h?Math.round(j.m/(30*j.h)*10)/10:null; // أعلى عرض ÷ (30 يوم × ساعات اليوم)
const hc=j=>j.s==1?'ok':j.s==0?'no':'un';
const fl=j=>{const r=[];
 if(j.a<18)r.push(`بيقبل سن ${j.a} سنة: تشغيل الأقل من 18 مقيّد قانونًا (ساعات أقل، ولا ورديات ليلية ولا أعمال خطرة). اطلب موافقة ولي الأمر`);
 if(j.h>=16)r.push('16 ساعة عمل: أطول بكثير من حد الـ8 ساعات يوميًا المعروف في قانون العمل المصري (راجع النص الساري)، وإرهاقها عالي');
 if(/أصول/.test(j.x))r.push('بيطلب أصول الأوراق مش صور: ما تسلّمش أصل أي ورقة بدون إيصال استلام وعقد واضح');
 if(/فيش باسم/.test(j.x))r.push('الفيش الجنائي لازم يكون باسم شركة معينة: اتأكد من اسم الشركة وتكلفة الفيش وإن حد مش بيطلب منك فلوس قبل التعيين');
 return r};
const list=()=>{const t=norm(S.q).split(/\s+/).filter(Boolean);
 let L=D.filter(j=>(S.c=='all'||j.c==S.c)&&(!S.p||j.p==S.p)&&(!S.h||j.s==1)&&(h=>t.every(w=>h.includes(w)))(norm(j.t+' '+j.p+' '+j.x+' '+CN[j.c])));
 if(S.tab!='cmp')return L;
 const v=j=>S.k=='r'?rate(j):S.k=='a'?j.a:(j.h||null);
 return L.sort((a,b)=>{const x=v(a),y=v(b);return x==null?(y==null?0:1):y==null?-1:S.d*(x-y)})};
const tabs=[['jobs','الوظائف'],['cmp','جدول المقارنة'],['warn','تنبيهات'],['docs','الأوراق والعنوان']];
const nav=()=>$('#nav').innerHTML=tabs.map(t=>`<a href="#/${t[0]=='jobs'?'':t[0]}" class="${S.tab==t[0]?'on':''}" ${S.tab==t[0]?'aria-current="page"':''}>${t[1]}</a>`).join('');
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),3500)}
function bar(){const ps=[...new Set(D.map(j=>j.p))].sort();return`<div class="bar">${[['all','الكل'],['f','مصانع'],['s','أمن'],['g','محطات بنزين']].map(c=>`<button class="chip ${S.c==c[0]?'on':''}" data-c="${c[0]}">${c[1]}</button>`).join('')}<input id="q" type="search" aria-label="بحث" placeholder="ابحث باسم الوظيفة أو المكان" value="${S.q}"><select id="p" aria-label="المكان"><option value="">كل الأماكن</option>${ps.map(p=>`<option ${S.p==p?'selected':''}>${p}</option>`).join('')}</select><button class="chip ${S.h?'on':''}" id="hh" aria-pressed="${S.h}">فيه سكن فقط</button></div>`}
function bind(){app.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{S.c=b.dataset.c;render()});
 const q=$('#q');if(q)q.oninput=()=>{S.q=q.value;const x=q.selectionStart;render();$('#q').focus();$('#q').setSelectionRange(x,x)};
 const p=$('#p');if(p)p.onchange=()=>{S.p=p.value;render()};
 const h=$('#hh');if(h)h.onclick=()=>{S.h=!S.h;render()};
 app.querySelectorAll('[data-i]').forEach(e=>{const o=()=>{location.hash='#/job/'+e.dataset.i};e.onclick=o;e.onkeydown=k=>{if(k.key=='Enter'||k.key==' '){k.preventDefault();o()}}});
 app.querySelectorAll('[data-k]').forEach(t=>t.onclick=()=>{const k=t.dataset.k;S.d=S.k==k?-S.d:(k=='r'?-1:1);S.k=k;render()})}
const dated=()=>`<p class="note">آخر تحديث للبيانات: ${DATA_UPDATED}. الإعلانات بتتقفل بسرعة، فتأكد من القناة قبل ما تروح. ${SITE_NOTE}</p>`;
function render(){nav();const L=list(),n=c=>D.filter(j=>j.c==c).length;let h='';
 if(S.tab=='jobs'||S.tab=='cmp')h+=`<div class="hero"><div class="w"><h1>${S.tab=='jobs'?'وظيفتك الجاية بتبدأ من هنا':'قارن الأجر والساعات قبل ما تقدّم'}</h1><p>إعلانات قناة يقين في مكان واحد، مرتبة وواضحة، ومعلّم عليها اللي محتاج حذر.</p><div class="sb"><div><b>${D.length}</b><span>وظيفة</span></div><div><b>${n('f')}</b><span>مصانع</span></div><div><b>${n('s')}</b><span>أمن</span></div><div><b>${n('g')}</b><span>بنزين</span></div></div></div></div>`;
 h+='<main><div class="w">';
 if(S.tab=='jobs')h+=dated()+bar()+`<p aria-live="polite" style="margin-bottom:12px;color:var(--mut)">${L.length} وظيفة</p><div class="grid">${L.map(j=>`<article class="card ${j.c}" tabindex="0" role="link" data-i="${j.id}">${fl(j).length?'<span class="warn">تحذير</span>':''}${j.img.length?`<img class="th" src="images/${j.img[0]}" width="900" height="490" loading="lazy" decoding="async" alt="">`:''}<span class="tag">${CN[j.c]}</span><h3>${j.t}</h3><div class="pl">${j.p}</div><div class="pay">${j.pay}</div><div class="chips"><span>${hs(j)}</span><span>سكن: ${HS[j.s]}</span><span>${j.a}–${j.b} سنة</span></div></article>`).join('')||'<p>مفيش نتائج. جرّب تشيل فلتر.</p>'}</div>`;
 if(S.tab=='cmp')h+=dated()+bar()+`<div class="tw"><table><tr><th>الوظيفة</th><th>المكان</th><th>الأجر في الإعلان</th><th data-k="r" tabindex="0">ج/ساعة تقريبي ⇅</th><th data-k="h">الساعات ⇅</th><th>السكن</th><th data-k="a">السن ⇅</th><th>الأوراق</th><th>تحذير</th></tr>${L.map(j=>`<tr class="r" tabindex="0" role="link" data-i="${j.id}"><td><b>${j.t}</b></td><td>${j.p}</td><td>${j.pay}</td><td>${rate(j)==null?'<span class="un">—</span>':rate(j)}</td><td class="${j.h>=16?'no':''}">${hs(j)}</td><td class="${hc(j)}">${HS[j.s]}</td><td class="${j.a<18?'no':''}">${j.a}–${j.b}</td><td>${j.c=='f'&&!/فيش|ملف/.test(j.x)?'بطاقة':j.c=='f'?'ملف كامل':j.c=='s'?'ملف كامل + فيش':'ملف كامل + 9 أوراق'}</td><td class="no">${fl(j).length?'⚠':''}</td></tr>`).join('')}</table></div><p style="color:var(--mut);margin-top:8px;font-size:13px">ج/ساعة = أعلى أجر في الإعلان ÷ (30 يوم × ساعات اليوم)، وبيفترض شغل كل الأيام بدون إجازة. تقدير للمقارنة بس، والمرجع هو نص الإعلان. اضغط أي صف للتفاصيل.</p>`;
 if(S.tab=='warn'){const w=D.filter(j=>fl(j).length);h+=`<h1 style="margin:10px 0 16px">تنبيهات قبل ما تقدّم</h1>${dated()}<div class="box red"><h2>مصانع مكتملة: ممنوع الإرسال عليها</h2><ul><li>كرتون العبور، فراولة العاشر من رمضان، التكييفات</li><li>جهينة وبيبسي وآيس كريم في 6 أكتوبر (إعلان جهينة موجود في آخر القناة، فاسأل القناة الأول)</li></ul></div><div class="box red"><h2>${w.length} إعلان فيهم مخاطر</h2><ul>${w.map(j=>`<li><a href="#/job/${j.id}"><b>${j.t} (${j.p}):</b></a> ${fl(j).join('، ')}</li>`).join('')}</ul></div><div class="box"><h2>قواعد عامة للأمان</h2><ul><li>ما تدفعش أي فلوس مقابل التقديم أو "حجز مكان".</li><li>الإعلانات من شركة توريد عمالة، فاسأل مين صاحب العمل الفعلي (المصنع ولا الشركة الوسيطة) واطلب عقد وتأمينات قبل الاستلام.</li><li>أرقام التواصل في الإعلانات الأصلية فاضية، فاتأكد من الرقم أو الرابط من القناة نفسها.</li><li>لو أقل من 18، اطلب موافقة ولي الأمر وارفض الورديات الطويلة أو الليلية.</li></ul></div>`}
 if(S.tab=='docs')h+=`<h1 style="margin:10px 0 16px">الأوراق وعنوان الشركة</h1>${['f','s','g'].map(c=>`<div class="box"><h2>${CN[c]}</h2><ul>${DOCS[c].map(d=>`<li>${d}</li>`).join('')}</ul>${c=='s'?'<p>الطلبة: بطاقة + ميلاد + كارنيه/إثبات قيد + فيش. أقل مؤهل: الإعدادية حسب الملخص، لكن إعلان مدينة نصر بيقول ابتدائية، فاسأل القناة.</p>':''}${c=='g'?'<p><b>لا استلام عمل بدون الملف كاملًا.</b> الطالب يقدم إثبات قيد بدل المؤهل والجيش.</p>':''}${c=='f'?'<p>مصنع شيبسي يشترط ملفًا كاملًا (بطاقة، ميلاد، جيش، مؤهل) ولا يقبل الطلبة.</p>':''}</div>`).join('')}<div class="box"><h2>الوصول لمقر الشركة</h2><ul><li>مترو اتجاه حلوان، النزول في محطة المعادي.</li><li>ركوب "فايدة كامل" لآخر الخط.</li><li>اسأل عن شركة الزهور للمنظفات سابقًا (كافيه العتاولة) أو توكيل WE، ثم شارع الجمهورية، ثالث شارع يمين.</li><li>عمارة 12، مجدي شمس المحامي، الدور الأول علوي.</li><li><b>المواعيد:</b> السبت إلى الأربعاء 11:00 – 2:30 (حد أقصى 3:00). الخميس والجمعة إجازة.</li></ul></div>`;
 app.innerHTML=h+'</div></main>';bind()}
function applyTo(j){const m=`السلام عليكم، عايز أقدّم على وظيفة: ${j.t} – ${j.p}. ممكن تفاصيل التقديم؟`;
 try{navigator.clipboard&&navigator.clipboard.writeText(m)}catch(e){}
 const u=CONTACT.whatsapp?`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(m)}`:CONTACT.telegram;
 if(u)window.open(u,'_blank','noopener');else toast('اتنسخت رسالة التقديم، ابعتها في قناة يقين.')}
function detail(j){S.tab='';nav();const f=fl(j),d=DOCS[j.c],r=rate(j);
 app.innerHTML=`<main><div class="w"><button class="back" id="bk">رجوع للوظائف</button><div class="dh ${j.c}"><span>${CN[j.c]}</span><h1>${j.t}</h1><div>${j.p}</div><div class="pay">${j.pay}</div></div><div class="facts"><div><small>ج/ساعة تقريبي (أعلى أجر)</small><b>${r==null?'غير مذكور':r}</b></div><div><small>ساعات العمل</small><b>${hs(j)}</b></div><div><small>السكن</small><b>${HS[j.s]}</b></div><div><small>السن</small><b>${j.a} – ${j.b}</b></div>${j.d?`<div><small>تاريخ الإعلان</small><b>${j.d}</b></div>`:''}</div>${f.map(x=>`<div class="fl">⚠ ${x}</div>`).join('')}${j.x?`<div class="box"><h2>تفاصيل إضافية</h2><p>${j.x}</p></div>`:''}<div class="box"><h2>الأوراق المطلوبة</h2><ul>${d.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="box"><h2>قبل ما تقدّم</h2><p>الإعلان ما بيذكرش صاحب العمل الفعلي. اسأل: مين الشركة المتعاقدة؟ فيه عقد وتأمينات؟ وماتدفعش أي فلوس مقدمًا.</p></div>${j.img.length?`<div class="gal">${j.img.map(i=>`<a href="images/${i}" target="_blank" rel="noopener"><img src="images/${i}" loading="lazy" alt="صورة الإعلان: ${j.t} – ${j.p} – ${j.pay}"></a>`).join('')}</div>`:''}<button class="cta" id="ap">طريقة التقديم</button><button class="sec" id="sh">شارك على واتساب</button></div></main>`;
 $('#bk').onclick=()=>location.hash='#/';$('#ap').onclick=()=>applyTo(j);
 $('#sh').onclick=()=>window.open('https://wa.me/?text='+encodeURIComponent(`${j.t} – ${j.p} – ${j.pay}\n${location.href}`),'_blank','noopener')}
let trT=null,pend=null,first=true;
function trHide(){clearTimeout(trT);trT=null;pend=null;const e=$('#tr');if(e)e.classList.remove('on')}
function trShow(j){const e=$('#tr');pend=j;e.classList.remove('on');
 e.innerHTML=`<div class="logo">يقين<i>وظائف</i></div><div>جاري فتح: ${j.t}</div><div class="pb"><i></i></div><small>اضغط في أي مكان أو Esc للتخطي</small>`;
 void e.offsetWidth;e.classList.add('on');trT=setTimeout(trSkip,TRANSITION_MS)}
function trSkip(){const j=pend;if(!j)return;trHide();detail(j);scrollTo(0,0)}
function route(){const h=location.hash.replace(/^#\/?/,''),m=h.match(/^job\/(\d+)/),j=m&&D.find(x=>x.id==m[1]);
 trHide();
 if(j&&!first&&TRANSITION_MS&&!matchMedia('(prefers-reduced-motion:reduce)').matches){first=false;trShow(j);return}
 first=false;
 if(j)detail(j);else{S.tab=['cmp','warn','docs'].includes(h)?h:'jobs';render()}scrollTo(0,0)}
$('#tr').onclick=trSkip;addEventListener('keydown',e=>{if(e.key=='Escape')trSkip()});
$('#ft').innerHTML=SITE_NOTE+'<br>مصدر الإعلانات: قناة يقين للتوريدات العمومية والعمالة الداخلية. الأرقام تقريبية وقد تتغير؛ تأكد من القناة قبل التقديم.';
addEventListener('hashchange',route);route();
