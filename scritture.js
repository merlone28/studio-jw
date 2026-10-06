// Riconoscitore di scritture e costruttori di link verso jw.org / wol.jw.org.
// Formati degli URL verificati: vedi docs/url-patterns.md
(function (root) {
  // [nome, numero di capitoli, abbreviazioni]. Per i libri numerati ("1 Pietro") le
  // abbreviazioni sono senza numero: il numero viene aggiunto da solo.
  const DATI = [
    ['Genesi', 50, 'gen ge'], ['Esodo', 40, 'eso es'], ['Levitico', 27, 'lev le lv'],
    ['Numeri', 36, 'num nu nm'], ['Deuteronomio', 34, 'deu de dt'], ['Giosuè', 24, 'gs gios'],
    ['Giudici', 21, 'gdc gdi giud'], ['Rut', 4, 'ru'],
    ['1 Samuele', 31, 'sa sam sm'], ['2 Samuele', 24, 'sa sam sm'],
    ['1 Re', 22, 're r'], ['2 Re', 25, 're r'],
    ['1 Cronache', 29, 'cr cron'], ['2 Cronache', 36, 'cr cron'],
    ['Esdra', 10, 'esd'], ['Neemia', 13, 'nee ne'], ['Ester', 10, 'est'], ['Giobbe', 42, 'gb giob'],
    ['Salmi', 150, 'sl sal salmo'], ['Proverbi', 31, 'pro pr prov'],
    ['Ecclesiaste', 12, 'ecc eccl ec qo qoelet'],
    ['Cantico dei Cantici', 8, 'can cant ct cantico canticodisalomone'],
    ['Isaia', 66, 'isa is'], ['Geremia', 52, 'ger gr'], ['Lamentazioni', 5, 'lam la'],
    ['Ezechiele', 48, 'ez eze ezec'], ['Daniele', 12, 'dan da dn'], ['Osea', 14, 'os'],
    ['Gioele', 3, 'gl'], ['Amos', 9, 'am'], ['Abdia', 1, 'abd'], ['Giona', 4, 'gna gion'],
    ['Michea', 7, 'mic mi'], ['Naum', 3, 'na nah'], ['Abacuc', 3, 'abc abac'],
    ['Sofonia', 3, 'sof'], ['Aggeo', 2, 'agg ag'], ['Zaccaria', 14, 'zac zc'], ['Malachia', 4, 'mal ml'],
    ['Matteo', 28, 'mt mat matt'], ['Marco', 16, 'mr mc mar'], ['Luca', 24, 'lu lc luc'],
    ['Giovanni', 21, 'gv gio giov'], ['Atti', 28, 'at'], ['Romani', 16, 'rom rm ro'],
    ['1 Corinti', 16, 'co cor corinzi'], ['2 Corinti', 13, 'co cor corinzi'],
    ['Galati', 6, 'gal ga'], ['Efesini', 6, 'ef efes'], ['Filippesi', 4, 'flp fil filip'],
    ['Colossesi', 4, 'col'],
    ['1 Tessalonicesi', 5, 'ts tes tess'], ['2 Tessalonicesi', 3, 'ts tes tess'],
    ['1 Timoteo', 6, 'tm ti tim'], ['2 Timoteo', 4, 'tm ti tim'],
    ['Tito', 3, 'tit'], ['Filemone', 1, 'flm filem'], ['Ebrei', 13, 'eb ebr'], ['Giacomo', 5, 'gc giac'],
    ['1 Pietro', 5, 'pt pi pie'], ['2 Pietro', 3, 'pt pi pie'],
    ['1 Giovanni', 5, 'gv gio giov'], ['2 Giovanni', 1, 'gv gio giov'], ['3 Giovanni', 1, 'gv gio giov'],
    ['Giuda', 1, 'gda gd'], ['Rivelazione', 22, 'ap apoc apocalisse ri'],
  ];

  // minuscolo, senza accenti; i punti dopo una lettera (abbreviazioni) diventano spazi
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/([a-z])\./g, '$1 ').replace(/\s+/g, ' ').trim();
  const chiave = s => norm(s).replace(/ /g, '');

  const LIBRI = DATI.map(([nome, cap, ab], i) => ({ num: i + 1, nome, cap, ab: ab.split(' ') }));
  const INDICE = Object.create(null);
  for (const l of LIBRI) {
    const n = /^\d/.test(l.nome) ? l.nome[0] : '';
    INDICE[chiave(l.nome)] = l;
    for (const a of l.ab) INDICE[n + a] = l;
  }

  const ROMANI = { i: '1', ii: '2', iii: '3' };

  function riconosci(testo) {
    const orig = String(testo == null ? '' : testo).trim().replace(/\s+/g, ' ');
    if (!orig) return { tipo: 'vuoto' };
    const argomento = nota => ({ tipo: 'argomento', testo: orig, nota });

    let s = norm(orig).replace(/[:,.;\s]+$/, '');
    s = s.replace(/^(i{1,3}) (?=[a-z])/, (_, r) => ROMANI[r]); // "I Pietro" -> "1 pietro" (solo con spazio: "isaia" resta tale)
    const m = s.match(/^(.*?[a-z])\s*(\d.*)?$/);
    const libro = m && INDICE[m[1].replace(/ /g, '')];
    if (!libro) return argomento(/\d/.test(orig) ? `Non ho riconosciuto una scrittura in «${orig}»: l'ho cercato come argomento.` : undefined);

    const num = m[2];
    if (!num) return argomento(`Manca il capitolo (es. «${libro.nome} 1»): l'ho cercato come argomento.`);

    let cap, v1, v2, p;
    if ((p = num.match(/^(\d+)\s*[:,.]\s*(\d+)(?:\s*[-–—]\s*(\d+))?$/))) [, cap, v1, v2] = p;
    else if ((p = num.match(/^(\d+)$/))) {
      if (libro.cap === 1) [cap, v1] = [1, p[1]]; // "Giuda 3" = versetto 3
      else cap = p[1];
    } else if ((p = num.match(/^(\d+)\s*[-–—]\s*(\d+)$/)) && libro.cap === 1) [cap, v1, v2] = [1, p[1], p[2]];
    else return argomento(`Non ho capito il riferimento «${orig}»: l'ho cercato come argomento.`);

    cap = +cap; v1 = v1 ? +v1 : 0; v2 = v2 ? +v2 : 0;
    if (cap < 1 || cap > libro.cap || (v1 && v1 < 1)) {
      return argomento(`${libro.nome} ha ${libro.cap} ${libro.cap === 1 ? 'capitolo' : 'capitoli'}, non ${cap}: l'ho cercato come argomento.`);
    }
    if (v2 <= v1) v2 = 0;
    const etichetta = `${libro.nome} ${libro.cap === 1 ? '' : cap + (v1 ? ':' : '')}${v1 || ''}${v2 ? '-' + v2 : ''}`.replace(/ $/, '');
    return { tipo: 'scrittura', libro, cap, v1, v2, etichetta };
  }

  // ---- link (formati verificati in docs/url-patterns.md) ----
  const WOL = 'https://wol.jw.org/it/wol';
  const JW = 'https://www.jw.org/it/cerca/';
  const q = encodeURIComponent;
  const wolCerca = (t, fc) => `${WOL}/s/r6/lp-i?q=${q(t)}${fc ? '&fc%5B%5D=' + fc : ''}`;
  const jwCerca = (t, tipo) => `${JW}?q=${q(t)}${tipo ? '&link=' + q(`/results/I/${tipo}?q=`) : ''}`;
  const L = (testo, url, desc) => ({ testo, url, desc });

  function linkScrittura(r) {
    const { libro: b, cap, v1, v2, etichetta: e } = r;
    const base = `${WOL}/b/r6/lp-i/nwtsty/${b.num}/${cap}`;
    const ancora = v1 ? `#v=${b.num}:${cap}:${v1}` + (v2 ? `-${b.num}:${cap}:${v2}` : '') : '';
    const testo = [L(`Leggi ${e}`, base + ancora, 'Traduzione del Nuovo Mondo (edizione per lo studio)')];
    if (v1 && b.cap > 1) testo.push(L(`Capitolo intero: ${b.nome} ${cap}`, base, 'Tutto il capitolo'));
    return [
      { titolo: 'Testo biblico', link: testo },
      { titolo: 'Approfondisci su wol.jw.org', link: [
        L('Indice delle pubblicazioni', wolCerca(e, 'dx'), 'Voci dell’indice che citano questo testo'),
        L('Perspicacia nello studio delle Scritture', wolCerca(e, 'it')),
        L('La Torre di Guardia', wolCerca(e, 'w')),
        L('Svegliatevi!', wolCerca(e, 'g')),
        L('Tutte le pubblicazioni', wolCerca(e)),
      ] },
      { titolo: 'Su jw.org', link: [
        L('Cerca il riferimento su jw.org', jwCerca(e)),
        L('Solo Bibbia', jwCerca(e, 'bible')),
      ] },
    ];
  }

  function linkArgomento(r) {
    const t = r.testo;
    return [
      { titolo: 'Cerca su jw.org', link: [
        L('Tutto', jwCerca(t), 'Ricerca nel sito'),
        L('Articoli e pubblicazioni', jwCerca(t, 'publications')),
        L('Video', jwCerca(t, 'videos')),
        L('Audio', jwCerca(t, 'audio')),
      ] },
      { titolo: 'Biblioteca online (wol.jw.org)', link: [
        L('Cerca in tutta la Biblioteca', wolCerca(t)),
        L('Indice delle pubblicazioni', wolCerca(t, 'dx'), 'Voci dell’indice sul tema'),
        L('Perspicacia nello studio delle Scritture', wolCerca(t, 'it')),
      ] },
      { titolo: 'Per tipo di materiale', link: [
        L('La Torre di Guardia', wolCerca(t, 'w')),
        L('Svegliatevi!', wolCerca(t, 'g')),
        L('Libri', wolCerca(t, 'bk')),
      ] },
    ];
  }

  const api = { riconosci, linkScrittura, linkArgomento, LIBRI };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Scritture = api;
})(typeof self !== 'undefined' ? self : this);
