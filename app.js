(function () {
  'use strict';

  var lista = document.getElementById('lista-grupos');
  var params = new URLSearchParams(location.search);
  var nichoUrl = (params.get('nicho') || '').toLowerCase();

  function track(evento, dados) {
    if (typeof window.fbq === 'function') window.fbq('track', evento, dados);
  }

  function esc(texto) {
    var div = document.createElement('div');
    div.textContent = texto == null ? '' : String(texto);
    return div.innerHTML;
  }

  function renderCard(g) {
    var tags = (g.exemplos || []).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('');
    var destaque = g.id === nichoUrl;
    return (
      '<article class="card' + (destaque ? ' card--destaque' : '') + '" id="grupo-' + esc(g.id) + '" data-id="' + esc(g.id) + '" style="--cor:' + esc(g.cor || '') + '">' +
        (destaque ? '<span class="card__badge">Recomendado para você</span>' : '') +
        '<div class="card__emoji" aria-hidden="true">' + esc(g.emoji) + '</div>' +
        '<h3>' + esc(g.nome) + '</h3>' +
        '<p>' + esc(g.descricao) + '</p>' +
        (tags ? '<ul class="card__tags">' + tags + '</ul>' : '') +
        '<a class="btn btn--whats" href="' + esc(g.link) + '" target="_blank" rel="noopener" data-entrar="' + esc(g.id) + '">' +
          'Entrar no grupo' +
        '</a>' +
      '</article>'
    );
  }

  function render(grupos) {
    var ativos = grupos.filter(function (g) { return g.ativo !== false && g.link; });
    if (!ativos.length) {
      lista.innerHTML = '<p class="erro">Nenhum grupo disponível no momento.</p>';
      return;
    }
    // Nicho vindo do anúncio (?nicho=pet) aparece primeiro
    ativos.sort(function (a, b) { return (b.id === nichoUrl) - (a.id === nichoUrl); });
    lista.innerHTML = ativos.map(renderCard).join('');

    var porId = {};
    ativos.forEach(function (g) { porId[g.id] = g; });

    // Lead no clique em "Entrar no grupo"
    lista.addEventListener('click', function (ev) {
      var botao = ev.target.closest('[data-entrar]');
      if (!botao) return;
      var g = porId[botao.getAttribute('data-entrar')];
      track('Lead', { content_name: g.nome, content_category: g.id });
    });

    // ViewContent: uma vez por grupo, quando o card aparece na tela
    if ('IntersectionObserver' in window) {
      var vistos = {};
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          var id = en.target.getAttribute('data-id');
          if (en.isIntersecting && !vistos[id]) {
            vistos[id] = true;
            track('ViewContent', { content_name: porId[id].nome, content_category: id });
            obs.unobserve(en.target);
          }
        });
      }, { threshold: 0.6 });
      lista.querySelectorAll('.card').forEach(function (c) { obs.observe(c); });
    }

    if (nichoUrl && porId[nichoUrl]) {
      setTimeout(function () {
        document.getElementById('grupo-' + nichoUrl).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }

  fetch('grupos.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (dados) { render(dados.grupos || []); })
    .catch(function () {
      lista.innerHTML = '<p class="erro">Não foi possível carregar os grupos. Atualize a página.</p>';
    });

  // Aviso de cookies
  var banner = document.getElementById('cookie-banner');
  var CHAVE = 'bp_cookie_ok';
  var aceito = false;
  try { aceito = localStorage.getItem(CHAVE) === '1'; } catch (e) {}
  if (!aceito && banner) {
    banner.hidden = false;
    document.getElementById('cookie-ok').addEventListener('click', function () {
      banner.hidden = true;
      try { localStorage.setItem(CHAVE, '1'); } catch (e) {}
    });
  }
})();
