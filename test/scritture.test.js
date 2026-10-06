// Esegui con: node test/scritture.test.js
const assert = require('assert');
const { riconosci, LIBRI, linkScrittura, linkArgomento } = require('../scritture.js');

let ok = 0, ko = 0;
function t(nome, fn) {
  try { fn(); ok++; console.log('  ok   ' + nome); }
  catch (e) { ko++; console.log('  FAIL ' + nome + '\n       ' + e.message); }
}
// scrittura attesa: [numero libro, capitolo, versetto iniziale, versetto finale]
function scr(input, n, cap, v1, v2) {
  t(`"${input}" -> scrittura ${n}:${cap}${v1 ? ':' + v1 : ''}${v2 ? '-' + v2 : ''}`, () => {
    const r = riconosci(input);
    assert.strictEqual(r.tipo, 'scrittura', JSON.stringify(r));
    assert.deepStrictEqual([r.libro.num, r.cap, r.v1 || 0, r.v2 || 0], [n, cap, v1 || 0, v2 || 0]);
  });
}
function arg(input, conNota) {
  t(`"${input}" -> argomento${conNota ? ' (con nota)' : ''}`, () => {
    const r = riconosci(input);
    assert.strictEqual(r.tipo, 'argomento', JSON.stringify(r));
    assert.strictEqual(!!r.nota, !!conNota, JSON.stringify(r));
  });
}

console.log('Scritture');
scr('Giovanni 3:16', 43, 3, 16);
scr('gv 3:16', 43, 3, 16);
scr('Sal 23', 19, 23);
scr('Romani 8:28-30', 45, 8, 28, 30);
scr('1 Pietro 5:7', 60, 5, 7);
scr('1Pt 5:7', 60, 5, 7);
scr('I Pietro 5:7', 60, 5, 7);
scr('Apocalisse 21:4', 66, 21, 4);
scr('  GIOVANNI   3 : 16  ', 43, 3, 16);
scr('gIoV. 3,16', 43, 3, 16);
scr('Geremìa 29:11', 24, 29, 11);
scr('1 Cor. 13:4', 46, 13, 4);
scr('II Corinti 5:17', 47, 5, 17);
scr('Rivelazione 21:4', 66, 21, 4);
t('"Apocalisse 21:4" mostra l\'etichetta "Rivelazione 21:4"', () => assert.strictEqual(riconosci('Apocalisse 21:4').etichetta, 'Rivelazione 21:4'));
scr('Isaia 41:10', 23, 41, 10);
scr('Giuda 3', 65, 1, 3);
scr('1 Giovanni 4:8', 62, 4, 8);
scr('1Gv 4:8', 62, 4, 8);

console.log('Argomenti');
arg('perdono');
arg('amore di Dio');
arg('Giovanni 99:1', true); // capitolo inesistente
arg('Giovanni', true);      // manca il capitolo
arg('xyz 3:16', true);
arg('Isaia', true);         // "isaia" non è letto come "I saia": è il libro, ma manca il capitolo
arg('constructor 3', true); // nessun accesso alle proprietà di Object
scr('Salmo 3:', 19, 3);     // due punti finale tollerato

console.log('Vuoto');
for (const v of ['', '   ', null, undefined]) {
  t(`${JSON.stringify(v)} -> vuoto`, () => assert.strictEqual(riconosci(v).tipo, 'vuoto'));
}

console.log('Dati');
t('66 libri numerati 1..66', () => {
  assert.strictEqual(LIBRI.length, 66);
  LIBRI.forEach((l, i) => assert.strictEqual(l.num, i + 1));
  assert.strictEqual(LIBRI[0].nome, 'Genesi');
  assert.strictEqual(LIBRI[65].nome, 'Rivelazione'); // nome usato dalla TNM italiana
});
t('1189 capitoli in totale', () => assert.strictEqual(LIBRI.reduce((s, l) => s + l.cap, 0), 1189));

console.log('Link');
const tutti = sezioni => sezioni.flatMap(s => s.link);
t('Gv 3:16 -> testo wol con ancora', () => {
  const l = tutti(linkScrittura(riconosci('Gv 3:16')));
  assert.strictEqual(l[0].url, 'https://wol.jw.org/it/wol/b/r6/lp-i/nwtsty/43/3#v=43:3:16');
});
t('Rm 8:28-30 -> ancora intervallo', () => {
  const l = tutti(linkScrittura(riconosci('Rm 8:28-30')));
  assert.ok(l[0].url.endsWith('/45/8#v=45:8:28-45:8:30'), l[0].url);
});
t('tutti i link solo jw.org / wol.jw.org', () => {
  const all = [...linkScrittura(riconosci('Sal 23')), ...linkArgomento(riconosci('perdono & pace'))];
  tutti(all).forEach(l => assert.ok(/^https:\/\/(www\.jw\.org|wol\.jw\.org)\/it\//.test(l.url), l.url));
});
t('argomento con caratteri speciali è codificato', () => {
  const l = tutti(linkArgomento(riconosci('perdono & pace')));
  assert.ok(l[0].url.includes('q=perdono%20%26%20pace') || l[0].url.includes('q=perdono+%26+pace'), l[0].url);
});

console.log(`\n${ok} ok, ${ko} falliti`);
process.exit(ko ? 1 : 0);
