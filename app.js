(function () {
  const { riconosci, linkScrittura, linkArgomento } = Scritture;
  const $ = id => document.getElementById(id);
  const CHIAVE = 'studiojw.cronologia', MAX = 20;

  // localStorage può non esserci (modalità privata, blocchi): la pagina funziona lo stesso
  function leggi() {
    try { const v = JSON.parse(localStorage.getItem(CHIAVE)); return Array.isArray(v) ? v.slice(0, MAX) : []; }
    catch (e) { return []; }
  }
  function scrivi(lista) { try { localStorage.setItem(CHIAVE, JSON.stringify(lista)); } catch (e) {} }

  function el(tag, props, ...figli) {
    const e = Object.assign(document.createElement(tag), props);
    figli.forEach(f => e.append(f));
    return e;
  }

  function disegnaCronologia() {
    const lista = leggi();
    $('cronologia').hidden = !lista.length;
    $('lista').replaceChildren(...lista.map(t => {
      const b = el('button', { type: 'button', textContent: t });
      b.onclick = () => cerca(t);
      return el('li', {}, b);
    }));
  }

  function cerca(testo) {
    const r = riconosci(testo);
    $('q').value = r.tipo === 'vuoto' ? '' : testo.trim();
    const esito = $('esito'), out = $('risultati');
    $('intro').hidden = r.tipo !== 'vuoto';
    esito.hidden = r.tipo === 'vuoto';
    if (r.tipo === 'vuoto') { out.replaceChildren(); $('q').focus(); return; }

    const scrittura = r.tipo === 'scrittura';
    esito.replaceChildren(
      el('span', { className: 'tipo' + (scrittura ? '' : ' argomento'), textContent: scrittura ? 'Scrittura' : 'Argomento' }),
      el('p', { className: 'titolo', textContent: scrittura ? r.etichetta : r.testo }),
      ...(r.nota ? [el('p', { className: 'nota', role: 'status', textContent: r.nota })] : [])
    );
    out.replaceChildren(...(scrittura ? linkScrittura(r) : linkArgomento(r)).map((s, i) => {
      const sez = el('section', { className: 'sezione' },
        el('h2', { textContent: s.titolo }),
        ...s.link.map((l, j) => el('a', { className: 'btn' + (scrittura && !i && !j ? ' primario' : ''), href: l.url, target: '_blank', rel: 'noopener noreferrer' },
          l.testo, ...(l.desc ? [el('small', { textContent: l.desc })] : []))));
      sez.style.setProperty('--i', i + 1); // ritardo a cascata dell'animazione
      return sez;
    }));

    const chiave = (scrittura ? r.etichetta : r.testo);
    scrivi([chiave, ...leggi().filter(t => t.toLowerCase() !== chiave.toLowerCase())].slice(0, MAX));
    disegnaCronologia();
  }

  $('form').onsubmit = e => { e.preventDefault(); cerca($('q').value); };
  $('cancella').onclick = () => { scrivi([]); disegnaCronologia(); };

  disegnaCronologia();
  const iniziale = new URLSearchParams(location.search).get('q');
  if (iniziale) cerca(iniziale);

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => {});
})();
