# Cavia Avonturen Wereld

## Snel starten

- Open `index.html` in een moderne browser, of draai een simpele static server:
  - Python: `python3 -m http.server 8080` en ga naar `http://localhost:8080`
  - Node (npx): `npx serve .` en open de gelinkte URL

## Testpagina’s

In de root staan meerdere test HTML’s (bijv. `test-horse-missions.html`, `test-modal-debug.html`) om specifieke features te valideren.

## Best practices die in de code zijn toegepast

- Pointer Events: alle input is nu via `pointerdown/move/up/cancel` voor consistente touch/mouse ondersteuning.
- Ingeperkte zoom/scroll-preventie: zoom- en scroll-blokkades zijn alleen op de canvas toegepast, zodat de rest van de pagina normaal werkt.
- Eenduidige modal-events: één modal-systeem via `dom-manager` met `GameEvents` constants (geen dubbele event-emissie).
- Logniveau toggle: stel het logniveau in met query param of localStorage:
  - Query param: `?log=debug` | `info` | `warn` | `error` | `fatal`
  - LocalStorage: `localStorage.setItem('logLevel', 'debug')`

## Ontwikkelrichtlijnen

- Code style: gebruik Prettier/ESLint in je editor voor consistente formatting en basislinting.
- Structuur: JavaScript-modules in `js/`, styles in `css/`. Grote CSS staat voorlopig in `css/styles.css`.

## Bekende werelden

- Wereldknoppen staan in `index.html`. De game ondersteunt o.a. `dierenstad`, `thuis`, `zwembad` en meer. Niet alle werelden hebben eigen gebouwen, maar rendering en navigatie werken.

## Contributie

- Maak kleine, gerichte edits en test met de relevante test-HTML.
- Houd logging op `info` of hoger, tenzij je debugging doet (`?log=debug`).