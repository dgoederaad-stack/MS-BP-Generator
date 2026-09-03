let MODEL=null;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
async function loadModel(){
  MODEL=await fetch("model.json?v=05").then(r=>r.json());
  renderAll();
}
function renderAll(){renderStations();renderFields();renderConnections();renderTrafos();renderModel();renderDiagram()}
function esc(s){return String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]))}
function statusBadge(s){const uncertain=/waarschijnlijk|onbekend|controleren/i.test(s);return `<span class="status ${uncertain?"warn":"ok"}">${esc(s)}</span>`}
function renderStations(){
  $("#stationCards").innerHTML=MODEL.installations.map(i=>`
  <div class="stationcard"><h3>${esc(i.name)}</h3><div class="small">${esc(i.type)} · ${esc(i.voltage)}</div>
  <p><b>MS-velden</b></p>${i.fields.map(f=>`<div><span class="badge">veld ${esc(f.field)}</span> ${esc(f.role)} → <b>${esc(f.connection)}</b></div>`).join("")}
  ${i.ls_fields?.length?`<p><b>LS</b></p>${i.ls_fields.map(f=>`<div><span class="badge">${esc(f.field)}</span> ${esc(f.role)} → <b>${esc(f.connection)}</b></div>`).join("")}`:""}
  </div>`).join("");
}
function allFields(){
  let arr=[];
  MODEL.installations.forEach(i=>{
    i.fields.forEach(f=>arr.push({installation:i.name,level:"MS",...f}));
    (i.ls_fields||[]).forEach(f=>arr.push({installation:i.name,level:"LS",state:"Gesloten",earthing:"Niet geaard",...f}));
  }); return arr;
}
function renderFields(filter=""){
  const rows=allFields().filter(x=>JSON.stringify(x).toLowerCase().includes(filter.toLowerCase()));
  $("#fieldTable tbody").innerHTML=rows.map(f=>{
    const check=/onbekend/i.test(f.connection)?"Controleren":"Voorlopig gekoppeld";
    return `<tr><td>${esc(f.installation)}</td><td>${esc(f.level)}</td><td>${esc(f.field)}</td><td>${esc(f.role)}</td><td>${esc((f.components||[]).join(" → "))}</td><td>${esc(f.state||"—")}</td><td>${esc(f.earthing||"—")}</td><td>${esc(f.connection)}</td><td>${statusBadge(check)}</td></tr>`
  }).join("");
}
function renderConnections(){
  const cs=MODEL.connections.filter(c=>c.kind==="MS-kabel");
  $("#cableTable tbody").innerHTML=cs.map(c=>`<tr><td>${esc(c.kind)}</td><td>${esc(c.from_installation)}</td><td>${esc(c.from_field)}</td><td>${esc(c.to_installation)}</td><td>${esc(c.to_field)}</td><td>${statusBadge(c.status)}</td></tr>`).join("");
}
function renderTrafos(){
  $("#trafoTable tbody").innerHTML=MODEL.transformers.map(t=>`<tr><td>${esc(t.name)}</td><td>${esc(t.installation)}</td><td>${esc(t.ratio)}</td><td>${esc(t.rating)}</td><td>${esc(t.ms_from)}</td><td>${esc(t.ls_to)}</td></tr>`).join("");
  const cs=MODEL.connections.filter(c=>c.kind.startsWith("Trafoverbinding"));
  $("#trafoConnTable tbody").innerHTML=cs.map(c=>`<tr><td>${esc(c.kind)}</td><td>${esc(c.from_installation)}</td><td>${esc(c.from_field)}</td><td>${esc(c.to_installation)}</td><td>${esc(c.to_field)}</td><td>${statusBadge(c.status)}</td></tr>`).join("");
}
function renderModel(){$("#modelText").textContent=JSON.stringify(MODEL,null,2)}
function symbolHtml(c){
  if(/Vermogensschakelaar/.test(c)) return `<div class="symbolbox" title="${esc(c)}"></div>`;
  if(/Aardingsschakelaar/.test(c)) return `<div class="earthsymbol" title="${esc(c)}">⏚</div>`;
  if(/Schakelaar|Scheider/.test(c)) return `<div class="switchsymbol" title="${esc(c)}"></div>`;
  if(/Zekeringen/.test(c)) return `<div class="symbolbox" title="${esc(c)}"></div>`;
  if(/Meettrafo/.test(c)) return `<div class="componentlist">◯◯◯<br>meettrafo</div>`;
  return `<div class="componentlist">${esc(c)}</div>`;
}
function stationBox(i){
  const n=i.fields.length;
  const fields=i.fields.map(f=>`<div class="field"><div class="fieldlabel">${esc(f.field)}</div><div class="vline"></div>${(f.components||[]).map(symbolHtml).join("")}<div class="componentlist labels">${esc((f.components||[]).join(" / "))}</div><div class="conn labels">→ ${esc(f.connection)}</div></div>`).join("");
  const trafos=MODEL.transformers.filter(t=>t.installation===i.id).map(t=>`<div class="trafo"></div><div class="componentlist labels" style="text-align:center">${esc(t.name)} · ${esc(t.ratio)} · ${esc(t.rating)}</div><div class="lsbus"></div>`).join("");
  return `<div class="stationbox"><div class="stationtitle">${esc(i.name)}</div><div class="small labels">${esc(i.voltage)} · ${esc(i.type)}</div><div class="bus"></div><div class="fieldrow" style="--n:${n}">${fields}</div>${trafos}</div>`;
}
function renderDiagram(){
  $("#diagram").innerHTML=`<div class="network">${MODEL.installations.map(stationBox).join("")}</div>`;
  toggleLabels();
}
function toggleLabels(){
  const show=$("#showLabels").checked;
  $$("#diagram .labels").forEach(x=>x.style.display=show?"block":"none");
}
$$(".tabs button").forEach(b=>b.onclick=()=>{$$(".tabs button").forEach(x=>x.classList.remove("active"));$$(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.tab).classList.add("active")});
$("#showLabels").onchange=toggleLabels;
$("#fieldSearch").oninput=e=>renderFields(e.target.value);
const file=$("#file"),original=$("#original"),pdf=$("#pdfPlaceholder"),msg=$("#filemsg");
file.onchange=()=>{
 const f=file.files[0];if(!f)return;msg.textContent=`Geselecteerd: ${f.name}`;
 if(f.type.startsWith("image/")){original.src=URL.createObjectURL(f);original.classList.remove("hidden");pdf.classList.add("hidden")}
 else{original.classList.add("hidden");pdf.classList.remove("hidden");msg.textContent+=` — PDF-parser nog niet gekoppeld`}
};
$("#demo").onclick=()=>{original.src="assets/voorbeeld_single_line.png";original.classList.remove("hidden");pdf.classList.add("hidden");msg.textContent="Voorbeeld geladen."};
loadModel();
