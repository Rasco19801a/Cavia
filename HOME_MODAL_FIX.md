# Home World Modal Fix

## Probleem
De thuis wereld liep vast wanneer je op een cavia klikte om een missie modal te openen. De speler kon niet meer bewegen en de andere werelden waren niet meer toegankelijk.

## Oorzaak
Wanneer een modal (zoals de missie modal) werd geopend in de thuis wereld, bleef de game nog steeds clicks en keyboard input verwerken. Dit zorgde ervoor dat:
1. Clicks op de modal zelf werden doorgegeven aan het spel
2. De speler kon proberen te bewegen terwijl de modal open was
3. Dit leidde tot conflicten en het "vastvriezen" van de wereld

## Oplossing
Een nieuwe methode `isAnyModalOpen()` is toegevoegd aan de Game class die controleert of er een modal open is. Deze methode controleert:
- Mission modal
- Inventory modal  
- Animal challenge modal
- Minigame modal
- Celebration modal

De game input handlers zijn aangepast om input te blokkeren wanneer een modal open is:
1. **handleClick()** - Blokkeert clicks op het canvas
2. **handleMouseDown()** - Blokkeert drag operaties
3. **update()** - Blokkeert keyboard beweging en click-to-move

## Gewijzigde Bestanden
- `/js/game.js` - Toegevoegd: `isAnyModalOpen()` methode en modal checks in input handlers

## Test
Een test bestand is aangemaakt: `test-home-modal-fix.html`

### Test Stappen:
1. Open `test-home-modal-fix.html` in een browser
2. Klik op "Start Game"
3. Klik op "Ga naar Thuis"
4. Klik op een cavia met een geel uitroepteken
5. Probeer te klikken of te bewegen - dit zou geblokkeerd moeten zijn
6. Sluit de modal (X knop of ESC)
7. Beweging zou weer moeten werken

## Resultaat
✅ Modals blokkeren nu correct alle game input
✅ De thuis wereld loopt niet meer vast
✅ Na het sluiten van een modal werkt alles weer normaal
✅ Alle andere werelden blijven toegankelijk