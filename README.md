# Schakelbrief Generator v0.1

Dit is een werkend UI-prototype als PWA/web-app.

## Wat werkt
- Foto kiezen of camera openen op telefoon
- Meegeleverd single-line voorbeeld laden
- Demo-herkenning met controlelijst
- Projectgegevens en doel invoeren
- Concept-bedieningsplan genereren
- Regels direct aanpassen/verwijderen/toevoegen
- Printen of via de browser opslaan als PDF
- PWA-basis aanwezig (manifest + service worker)

## Belangrijk
De analyse is in deze v0.1 bewust een DEMO. Er zit nog geen echte AI/Vision-backend in.
Voor productie moet de foto naar een beveiligde backend/API worden gestuurd die:
1. componenten en verbindingen detecteert;
2. een installatiemodel (nodes/edges) terugstuurt;
3. zekerheidsscores meegeeft;
4. géén definitieve schakelhandeling vrijgeeft zonder menselijke controle.

## Starten
Open `index.html` in een browser. Voor camera/PWA-installatie werkt hosten via HTTPS het beste
(bijvoorbeeld GitHub Pages, Netlify of een eigen server).

## Veiligheidsprincipe
AI-output is uitsluitend concept. WV/IV controle en formele vrijgave blijven verplicht.
