const $=id=>document.getElementById(id);
let count=0;const box=$("functions");
function addFunction(expr="sin(x)"){count++;const r=document.createElement("div");r.className="fnrow";r.innerHTML='<span class="dot"></span><input class="fn"><button class="del">×</button>';r.querySelector(".fn").value=expr;r.querySelector(".del").onclick=()=>r.remove();box.appendChild(r)}
addFunction("sin(x)");addFunction("x^2/10");
function val(s,scope={}){return Number(math.evaluate(s,scope))}
function seq(a,b,n){const h=(b-a)/n;return Array.from({length:n+1},(_,i)=>a+i*h)}
function layout(x,y,title=""){return{margin:{l:55,r:25,t:40,b:50},title,xaxis:{title:x,zeroline:true,gridcolor:"#e1e6ee"},yaxis:{title:y,zeroline:true,gridcolor:"#e1e6ee"},hovermode:"x unified"}}

/* Complex arithmetic + eta/zeta approximation. */
function cadd(a,b){return math.add(a,b)} function csub(a,b){return math.subtract(a,b)}
function cmul(a,b){return math.multiply(a,b)} function cdiv(a,b){return math.divide(a,b)}
function cpow2(a){return cmul(a,a)}
function cexp(a){return math.exp(a)}
function clog(a){return math.log(a)}
function cpow(a,b){return cexp(cmul(b,clog(a)))}
function zetaApprox(s,N=900){
  const one=math.complex(1,0), two=math.complex(2,0);
  let eta=math.complex(0,0);
  for(let n=1;n<=N;n++){
    const term=cpow(math.complex(n,0),math.multiply(-1,s));
    eta=math.add(eta,(n%2?term:math.multiply(-1,term)));
  }
  const den=csub(one,cpow(two,csub(one,s)));
  if(Math.abs(math.abs(den))<1e-10)return math.complex(NaN,NaN);
  return cdiv(eta,den);
}
function evalComplex(expr,z){
  if(expr.trim().toLowerCase()==="zeta"||expr.trim()==="ζ(z)")return zetaApprox(z);
  return math.evaluate(expr,{z});
}
function scalar(w,mode){
  const a=math.re(w),b=math.im(w);
  if(mode==="magnitude")return Math.log1p(Math.min(1e8,Math.hypot(a,b)));
  if(mode==="phase")return Math.atan2(b,a);
  return mode==="real"?a:b;
}
function drawCartesian(){const a=val($("xmin").value),b=val($("xmax").value),n=Math.min(10000,Math.max(100,+$("samples").value||1600)),xs=seq(a,b,n),tr=[];document.querySelectorAll(".fn").forEach(e=>{const ys=xs.map(x=>{try{const y=Number(math.evaluate(e.value,{x}));return Number.isFinite(y)?y:null}catch{return null}});tr.push({x:xs,y:ys,mode:"lines",name:e.value,line:{width:2}})});Plotly.newPlot("plot",tr,layout("x","y"),{responsive:true})}
function drawParam(){const ts=seq(val($("tmin").value),val($("tmax").value),1800),x=[],y=[];ts.forEach(t=>{try{x.push(val($("px").value,{t}));y.push(val($("py").value,{t}))}catch{x.push(null);y.push(null)}});Plotly.newPlot("plot",[{x,y,mode:"lines",name:"parametric"}],layout("x(t)","y(t)"),{responsive:true})}
function drawPolar(){const ts=seq(val($("thmin").value),val($("thmax").value),1800),x=[],y=[];ts.forEach(theta=>{try{const r=val($("polar").value,{theta});x.push(r*Math.cos(theta));y.push(r*Math.sin(theta))}catch{x.push(null);y.push(null)}});Plotly.newPlot("plot",[{x,y,mode:"lines",name:"r(θ)"}],layout("x","y"),{responsive:true})}
function drawComplex(){const xa=val($("xminC").value),xb=val($("xmaxC").value),ya=val($("yminC").value),yb=val($("ymaxC").value),N=80,x=seq(xa,xb,N),y=seq(ya,yb,N),z=[];for(let j=0;j<=N;j++){const row=[];for(let i=0;i<=N;i++){try{row.push(scalar(evalComplex($("complexFn").value,math.complex(x[i],y[j])),$("complexView").value))}catch{row.push(null)}}z.push(row)}Plotly.newPlot("plot",[{x,y,z,type:"heatmap",colorbar:{title:$("complexView").value}}],{margin:{l:55,r:25,t:40,b:50},title:"複素平面: "+$("complexFn").value,xaxis:{title:"Re(z)"},yaxis:{title:"Im(z)",scaleanchor:"x"}},{responsive:true})}
function drawCritical(){const a=val($("cmin").value),b=val($("cmax").value),n=Math.min(3000,+$("csamples").value||900),ts=seq(a,b,n),re=[],im=[],ab=[];ts.forEach(t=>{try{const w=zetaApprox(math.complex(.5,t),500);re.push(math.re(w));im.push(math.im(w));ab.push(Math.abs(w))}catch{re.push(null);im.push(null);ab.push(null)}});Plotly.newPlot("plot",[{x:ts,y:ab,mode:"lines",name:"|ζ(1/2+it)|"},{x:ts,y:re,mode:"lines",name:"Re ζ",visible:"legendonly"},{x:ts,y:im,mode:"lines",name:"Im ζ",visible:"legendonly"}],layout("t","value","臨界線 s=1/2+it"),{responsive:true})}
function draw(){const m=$("mode").value;if(m==="cartesian")drawCartesian();else if(m==="parametric")drawParam();else if(m==="polar")drawPolar();else if(m==="complex")drawComplex();else drawCritical()}
$("mode").onchange=()=>{["cartesianBox","paramBox","polarBox","complexBox","criticalBox"].forEach(id=>$(id).classList.add("hidden"));const m=$("mode").value;$(m==="cartesian"?"cartesianBox":m==="parametric"?"paramBox":m==="polar"?"polarBox":m==="complex"?"complexBox":"criticalBox").classList.remove("hidden");$("rangeBox").classList.toggle("hidden",m!=="cartesian");$("analysisBox").classList.toggle("hidden",m!=="cartesian");draw()}
$("addFn").onclick=()=>addFunction("cos(x)");$("plotBtn").onclick=draw;
document.querySelectorAll("[data-zeta]").forEach(b=>b.onclick=()=>{$("complexFn").value=b.dataset.zeta;draw()});
$("complexView").onchange=draw;
$("derivBtn").onclick=()=>{const f=document.querySelector(".fn")?.value;if(!f)return;try{$("analysisResult").textContent="f'(x) = "+math.derivative(f,"x").toString()}catch(e){$("analysisResult").textContent="微分できません: "+e.message}};
function integrate(abs=false){const f=document.querySelector(".fn")?.value;if(!f)return;const a=val($("xmin").value),b=val($("xmax").value),n=4000,h=(b-a)/n;let s=0;for(let i=0;i<=n;i++){const x=a+i*h;let y;try{y=Number(math.evaluate(f,{x}))}catch{$("analysisResult").textContent="式を評価できません。";return}if(!Number.isFinite(y)){$("analysisResult").textContent="積分範囲内に評価できない点があります。";return}if(abs)y=Math.abs(y);s+=((i===0||i===n)?.5:1)*y}$("analysisResult").textContent=`∫[${a}, ${b}] ${abs?"|f(x)|":"f(x)"} dx ≈ ${(s*h).toPrecision(12)}`}
$("intBtn").onclick=()=>integrate(false);$("areaBtn").onclick=()=>integrate(true);
$("rootBtn").onclick=()=>{const f=document.querySelector(".fn")?.value,a=val($("xmin").value),b=val($("xmax").value),n=2500,h=(b-a)/n,roots=[];let px=a,py;try{py=Number(math.evaluate(f,{x:px}))}catch{$("analysisResult").textContent="式を評価できません。";return}for(let i=1;i<=n;i++){const x=a+i*h;let y;try{y=Number(math.evaluate(f,{x}))}catch{px=x;continue}if(Number.isFinite(py)&&Number.isFinite(y)&&py*y<0){let lo=px,hi=x,fl=py;for(let k=0;k<45;k++){const mid=(lo+hi)/2,m=Number(math.evaluate(f,{x:mid}));if(fl*m<=0)hi=mid;else{lo=mid;fl=m}}roots.push((lo+hi)/2)}px=x;py=y}const u=[...new Set(roots.map(x=>x.toFixed(6)))];$("analysisResult").textContent=u.length?"零点候補: "+u.join(", "):"符号変化による実数零点を検出できませんでした。"};
$("themeBtn").onclick=()=>{document.body.classList.toggle("dark");$("themeBtn").textContent=document.body.classList.contains("dark")?"☀️":"🌙";draw()};
$("clearBtn").onclick=()=>{box.innerHTML="";addFunction("sin(x)");draw()};window.addEventListener("load",draw);