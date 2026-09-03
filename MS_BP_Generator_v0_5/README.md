# MS BP Generator v0.5

Deze versie verandert de architectuur:

## Eén elektrisch model als bron
`model.json` bevat:
- installaties/stations;
- MS-velden;
- LS-velden;
- componentvolgorde per veld;
- uitgangsstand;
- aarding;
- kabelverbindingen installatie ↔ installatie;
- verbindingen installatie → trafo;
- verbindingen trafo → LS-installatie.

Alle schermen worden uit dat ene model opgebouwd:
- Digitale reconstructie
- Stationsoverzicht
- Veldenoverzicht
- Kabelverbindingen
- Trafoverbindingen
- Modelweergave

## Belangrijk
Het model voor het meegeleverde voorbeeld is nog handmatig geïnterpreteerd en bevat bewust labels zoals
'waarschijnlijk', 'onbekend' en 'controleren' waar de bron niet met voldoende zekerheid kan worden gelezen.

De volgende technische stap is een Vision/PDF-parser die exact dit JSON-model automatisch opbouwt.
