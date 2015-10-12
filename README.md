# På langs

En webapp for å tracke hva forskjellige teams går. Etter at vi gikk Norge på langs prøver vi oss nå med Russland på tvers.

## Bidra

Stacken er node+express+postgres backend og angularjs frontend.

* Trenger node og postgres installert.
* Databasebeskrivelse ligger i server/tabledefs.db.
* `npm install` henter dependencies og bygger frontend
* `npm start` starter backend
* `gulp watch` for å bygge frontend kontinuerlig

## TODO

- [ ] Ikke vise dagens resultater før et visst klokkeslett (13:57 har vi hatt før)
- [ ] Kartet skal vise hvor lagene er
 - [ ] På sikt animert fremgang per dag?
 - [X] Fikse slik at det er responsivt
- [ ] Grafer over hvor langt lag/deltakere har gått
- [ ] Kompetansebygge ved å migrere til Angular 2.0
- [ ] Sikkert mer

