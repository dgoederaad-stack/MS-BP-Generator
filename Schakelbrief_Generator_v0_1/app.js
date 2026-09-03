
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let components = [
  {ok:true, name:"Station / veld 35221P v4", kind:"20 kV voeding", conf:"92%"},
  {ok:true, name:"Vermogensschakelaar", kind:"Schakelcomponent", conf:"88%"},
  {ok:true, name:"Scheider", kind:"Schakelcomponent", conf:"86%"},
  {ok:true, name:"Aardingsschakelaar", kind:"Aarding", conf:"84%"},
  {ok:true, name:"T0 - Trafo 2500 kVA", kind:"Transformator", conf:"90%"},
  {ok:true, name:"0,4 kV zijde / verdeler", kind:"LS-installatie", conf:"77%"}
];

function showStep(n){
  $$(".panel").forEach(p=>p.classList.remove("show"));
  $("#step"+n).classList.add("show");
  $$(".step").forEach(b=>b.classList.toggle("active", b.dataset.step==n));
  window.scrollTo({top:0, behavior:"smooth"});
}
$$(".step").forEach(b=>b.onclick=()=>showStep(b.dataset.step));
$$(".back").forEach(b=>b.onclick=()=>showStep(b.dataset.back));

function useImage(src){
  $("#preview").src = src;
  $("#previewWrap").classList.remove("hidden");
}
$("#demoBtn").onclick=()=>useImage("assets/voorbeeld_single_line.png");
$("#fileInput").onchange=e=>{
  const f=e.target.files[0]; if(!f) return;
  useImage(URL.createObjectURL(f));
};

function renderComponents(){
  const box=$("#components"); box.innerHTML="";
  components.forEach((c,i)=>{
    const d=document.createElement("div"); d.className="comp";
    d.innerHTML=`<input type="checkbox" ${c.ok?"checked":""} aria-label="bevestigd">
      <input value="${c.name.replaceAll('"','&quot;')}" data-i="${i}" data-field="name">
      <select class="kind" data-i="${i}" data-field="kind">
        ${["20 kV voeding","Schakelcomponent","Aarding","Transformator","LS-installatie","Onbekend"].map(x=>`<option ${x==c.kind?"selected":""}>${x}</option>`).join("")}
      </select>
      <div class="conf">${c.conf}</div>`;
    box.appendChild(d);
  });
}
$("#analyseBtn").onclick=()=>{renderComponents(); showStep(2)};
$("#confirmComponents").onclick=()=>showStep(3);

function rowsForGoal(){
  const target=$("#target").value;
  const notes=$("#notes").value;
  return [
    {kv:"0,4",van:target,naar:"",test:"SA",borg:"",component:"",gevolg:"Spanning aantonen",bijz:""},
    {kv:"",van:"",naar:"",test:"DM",borg:"",component:"",gevolg:"Draaiveld meten",bijz:""},
    {kv:"20",van:"35221P v4",naar:target,test:"",borg:"",component:"Vermogensschakelaar",gevolg:"Afschakelen",bijz:""},
    {kv:"20",van:"35221P v4",naar:target,test:"",borg:"A",component:"Scheider",gevolg:"Scheiden",bijz:""},
    {kv:"20",van:"35221P v4",naar:target,test:"ABS",borg:"",component:"Aardingsschakelaar",gevolg:"Aarden en kortsluiten",bijz:notes || "Controleer richting/stickers en lokale situatie"},
    {kv:"0,4",van:target,naar:"",test:"ABS",borg:"",component:"Aardingsgarnituur",gevolg:"Vreemaarding aanbrengen",bijz:""}
  ];
}
function esc(s){return String(s??"").replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;")}
function addRow(r={}){
  const tr=document.createElement("tr");
  const idx=$("#planBody").children.length+1;
  const fields=["kv","van","naar","test","borg","component","gevolg","bijz"];
  tr.innerHTML=`<td class="nr">${idx}</td>`+fields.map(f=>`<td><input value="${esc(r[f])}" aria-label="${f}"></td>`).join("")+`<td><button class="del" title="verwijder">×</button></td>`;
  tr.querySelector(".del").onclick=()=>{tr.remove(); renumber()};
  $("#planBody").appendChild(tr);
}
function renumber(){[...$("#planBody").children].forEach((tr,i)=>tr.querySelector(".nr").textContent=i+1)}
function renderMeta(){
  const items=[
    ["Projectnummer",$("#project").value||"—"],["Klantnaam",$("#client").value||"—"],["Adres",$("#address").value||"—"],
    ["Plaats",$("#city").value||"—"],["Opgesteld door",$("#author").value||"—"],["Datum uitvoering",$("#date").value||"—"],
    ["Doel",$("#goal").selectedOptions[0].text],["Object",$("#target").value],["Status","CONCEPT - NIET VRIJGEGEVEN"]
  ];
  $("#meta").innerHTML=items.map(([k,v])=>`<div><b>${esc(k)}</b>${esc(v)}</div>`).join("");
}
$("#generateBtn").onclick=()=>{
  $("#planBody").innerHTML="";
  rowsForGoal().forEach(addRow);
  renderMeta();
  showStep(4);
};
$("#addRow").onclick=()=>addRow({});
$("#printBtn").onclick=()=>window.print();

if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(()=>{})}
