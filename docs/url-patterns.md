# URL verificati (6 ottobre 2026)

Tutti aperti davvero nel browser (o con WebFetch) prima di usarli. `{n}` = numero del libro (Genesi = 1 … Apocalisse = 66).

## wol.jw.org (Biblioteca online, italiano)

| Uso | Formato | Verifica |
|---|---|---|
| Testo capitolo, TNM Bibbia di studio | `https://wol.jw.org/it/wol/b/r6/lp-i/nwtsty/{n}/{cap}` | Giovanni 3 (43/3), Salmo 23 (19/23), Apocalisse 21 (66/21), Romani 8 (45/8) |
| Ancora versetto | `...#v={n}:{cap}:{v}` | Gv 3:16 → la pagina scorre al v. 16 (id `v43-3-16-1`) |
| Ancora intervallo | `...#v={n}:{cap}:{v1}-{n}:{cap}:{v2}` | Rm 8:28-30 → scorre ai vv. 27-28 (nessuna evidenziazione verificata) |
| Ricerca | `https://wol.jw.org/it/wol/s/r6/lp-i?q={testo}` | "perdono" → 2.612 risultati; "Giovanni 3:16" riconosciuto come scrittura |
| Ricerca filtrata | `...?q={testo}&fc%5B%5D={cod}` | pagina mostra "Ricerca limitata a: …" |

Codici filtro `fc[]` verificati sulla pagina dei risultati:
`dx` Indice · `it` Perspicacia · `w` La Torre di Guardia · `g` Svegliatevi! · `bk` Libri · `bi` Bibbie.

"Indice dei testi biblici": non esiste un URL stabile per versetto (i link `/wol/dx/...` e `/wol/bc/...` usano id interni).
Alternativa verificata: ricerca del riferimento col filtro `dx` (Indice delle pubblicazioni), che elenca le voci dell'indice che citano quel testo.

## jw.org (italiano)

| Uso | Formato | Verifica |
|---|---|---|
| Ricerca | `https://www.jw.org/it/cerca/?q={testo}` | "perdono" funziona |
| Ricerca per tipo | `...&link=%2Fresults%2FI%2F{tipo}%3Fq%3D` | `all`, `publications`, `videos`, `audio`, `bible` |

Note:
- `/it/ricerca/` dà **404**: il percorso giusto è `/it/cerca/`.
- Con `link=` la barra di ricerca della pagina resta vuota, ma i risultati e il filtro attivo sono corretti ("perdono" + `videos` → solo video; "Giovanni 3:16" + `bible` → testo del versetto).
- Il testo della Bibbia su jw.org (`/it/biblioteca-digitale/bibbia/bibbia-di-studio/libri/...`) dà **404** con gli slug provati: per il testo si usa wol.jw.org.
