# Studio JW

App web statica (PWA) per lo studio. Scrivi un **argomento** (es. *perdono*) o una **scrittura** (es. *Gv 3:16*, *Romani 8:28-30*, *1Pt 5:7*) e ottieni collegamenti pronti **solo** a jw.org e wol.jw.org. Nessun server, nessuno scraping: la pagina costruisce link, non copia contenuti.

Strumento non ufficiale. Tutti i contenuti appartengono a jw.org.

## Pubblicare su GitHub Pages

1. Crea un repository su GitHub (es. `studio-jw`) e carica tutti i file di questa cartella nella root del branch `main`.
2. Vai su **Settings → Pages**. In *Build and deployment* scegli **Deploy from a branch**, branch `main`, cartella `/ (root)`, poi **Save**.
3. Dopo un minuto l'app è su `https://TUONOME.github.io/studio-jw/`.

I percorsi sono tutti relativi, quindi funziona anche da sottocartella.

## Installare su Android

1. Apri l'indirizzo dell'app con **Chrome**.
2. Menu ⋮ → **Installa app** (o **Aggiungi a schermata Home**).
3. L'icona "Studio JW" compare tra le app e si apre a schermo intero.

## Sviluppo

- Test del riconoscitore: `node test/scritture.test.js` (nessuna dipendenza).
- Provare in locale: `python -m http.server 8000` e aprire `http://localhost:8000/`.
- Dopo aver modificato un file, cambia `VERSIONE` in `service-worker.js` così i telefoni scaricano la nuova versione.
- Formati degli URL verificati: [docs/url-patterns.md](docs/url-patterns.md).
