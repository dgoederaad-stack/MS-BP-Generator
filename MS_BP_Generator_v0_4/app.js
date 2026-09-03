
const viewer=document.getElementById("viewer"), info=document.getElementById("componentInfo");
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); viewer.className="viewer "+b.dataset.view;
});
document.querySelectorAll(".clickable").forEach(g=>g.onclick=()=>{
  document.querySelectorAll(".clickable").forEach(x=>x.classList.remove("selected"));
  g.classList.add("selected");
  const n=g.dataset.name||"Component", t=g.dataset.type||"Onbekend", s=g.dataset.state;
  info.innerHTML=`<b>${n}</b><br>Type: ${t}${s?`<br>Uitgangsstand: <b>${s}</b>`:""}`;
});
const f=document.getElementById("file"), selected=document.getElementById("selected"), original=document.getElementById("original");
f.onchange=()=>{
  const file=f.files[0]; if(!file)return;
  selected.textContent=`Geselecteerd: ${file.name}`;
  if(file.type.startsWith("image/")) original.src=URL.createObjectURL(file);
  else selected.textContent+=` — PDF-invoer is geaccepteerd; paginarendering/AI-parser volgt.`;
};
document.getElementById("demo").onclick=()=>{
  original.src="assets/voorbeeld_single_line.png";
  selected.textContent="Voorbeeld single-line geladen.";
};
