// Menu em telemóvel
(function () {
  var botao = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-nav]');
  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
  }

  // Submenus: o primeiro nível não navega (só abre o submenu)
  document.querySelectorAll('.tem-sub > a').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  // Separadores por dia (programa)
  document.querySelectorAll('[data-tabs]').forEach(function (grupo) {
    var botoes = grupo.querySelectorAll('.dia-btn');
    botoes.forEach(function (b) {
      b.addEventListener('click', function () {
        botoes.forEach(function (x) { x.classList.remove('ativo'); });
        b.classList.add('ativo');
        document.querySelectorAll('.dia-painel').forEach(function (p) { p.classList.remove('ativo'); });
        var alvo = document.getElementById(b.getAttribute('data-alvo'));
        if (alvo) alvo.classList.add('ativo');
      });
    });
  });

  // Filtros por categoria (jogos e equipas)
  document.querySelectorAll('[data-filtro-grupo]').forEach(function (grupo) {
    var botoes = grupo.querySelectorAll('.filtro-btn');
    botoes.forEach(function (b) {
      b.addEventListener('click', function () {
        botoes.forEach(function (x) { x.classList.remove('ativo'); });
        b.classList.add('ativo');
        var f = b.getAttribute('data-filtro');
        document.querySelectorAll('[data-cat]').forEach(function (el) {
          el.classList.toggle('escondido-filtro', f !== 'todas' && el.getAttribute('data-cat') !== f);
        });
      });
    });
  });

  // Animação de entrada ao rolar a página
  var alvos = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('visivel');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    alvos.forEach(function (el) { obs.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add('visivel'); });
  }

  // Contadores animados
  var contadores = document.querySelectorAll('[data-contar]');
  function animar(el) {
    var fim = parseInt(el.getAttribute('data-contar'), 10) || 0;
    var duracao = 1400;
    var inicio = null;
    function passo(t) {
      if (!inicio) inicio = t;
      var p = Math.min((t - inicio) / duracao, 1);
      el.textContent = Math.floor(p * fim);
      if (p < 1) requestAnimationFrame(passo);
      else el.textContent = fim;
    }
    requestAnimationFrame(passo);
  }
  if ('IntersectionObserver' in window) {
    var obs2 = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) {
            animar(e.target);
            obs2.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    contadores.forEach(function (el) { obs2.observe(el); });
  } else {
    contadores.forEach(function (el) { el.textContent = el.getAttribute('data-contar'); });
  }

  // Contagem decrescente
  var conta = document.querySelector('[data-contagem]');
  if (conta) {
    var alvo = new Date(conta.getAttribute('data-contagem') + 'T10:00:00').getTime();
    var d = conta.querySelector('[data-d]');
    var h = conta.querySelector('[data-h]');
    var m = conta.querySelector('[data-m]');
    var s = conta.querySelector('[data-s]');
    function atualizar() {
      var resto = alvo - Date.now();
      if (isNaN(resto) || resto < 0) resto = 0;
      var seg = Math.floor(resto / 1000);
      d.textContent = Math.floor(seg / 86400);
      h.textContent = String(Math.floor((seg % 86400) / 3600)).padStart(2, '0');
      m.textContent = String(Math.floor((seg % 3600) / 60)).padStart(2, '0');
      s.textContent = String(seg % 60).padStart(2, '0');
    }
    atualizar();
    setInterval(atualizar, 1000);
  }
})();
