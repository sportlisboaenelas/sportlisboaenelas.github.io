(function () {
  var form = document.getElementById('form-inscricao');
  if (!form) return;

  var categorias = JSON.parse(form.getAttribute('data-categorias') || '[]');
  var chave = form.getAttribute('data-chave') || '';
  var emailOrg = form.getAttribute('data-email') || '';
  var nomeTorneio = form.getAttribute('data-torneio') || 'Torneio';
  var cont = document.getElementById('equipas');
  var btnAdd = document.getElementById('add-equipa');
  var msg = document.getElementById('msg');
  var btnEnviar = document.getElementById('enviar');
  var CHAVE_RASCUNHO = 'nelascup-inscricao-rascunho';

  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function apagar(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function mostrarErro(texto) {
    msg.textContent = texto;
    msg.classList.remove('escondido');
    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function limparErro() { msg.classList.add('escondido'); msg.textContent = ''; }

  // ---------- Equipas ----------
  function renumerar() {
    var blocos = cont.querySelectorAll('.equipa-bloco');
    blocos.forEach(function (b, i) {
      b.querySelector('[data-titulo]').textContent = 'Equipa ' + (i + 1);
      var rm = b.querySelector('.remover');
      rm.classList.toggle('escondido', blocos.length === 1);
    });
  }

  function campo(rotulo, el, largo, obrig) {
    var d = document.createElement('div');
    d.className = 'campo' + (largo ? ' largo' : '');
    var l = document.createElement('label');
    l.textContent = rotulo + (obrig ? ' *' : '');
    d.appendChild(l);
    d.appendChild(el);
    return d;
  }
  function input(f, tipo, obrig) {
    var i = document.createElement('input');
    i.type = tipo || 'text';
    i.setAttribute('data-f', f);
    if (obrig) i.required = true;
    return i;
  }

  function addEquipa(dados) {
    dados = dados || {};
    var bloco = document.createElement('div');
    bloco.className = 'equipa-bloco';

    var cab = document.createElement('header');
    var h = document.createElement('h3');
    h.setAttribute('data-titulo', '');
    var rm = document.createElement('button');
    rm.type = 'button';
    rm.className = 'remover';
    rm.textContent = 'Remover';
    rm.addEventListener('click', function () {
      bloco.remove();
      renumerar();
      guardarRascunho();
    });
    cab.appendChild(h);
    cab.appendChild(rm);
    bloco.appendChild(cab);

    var grelha = document.createElement('div');
    grelha.className = 'campos';

    var sel = document.createElement('select');
    sel.setAttribute('data-f', 'categoria');
    sel.required = true;
    var vazio = document.createElement('option');
    vazio.value = '';
    vazio.textContent = 'Escolher...';
    sel.appendChild(vazio);
    categorias.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c;
      o.textContent = c;
      sel.appendChild(o);
    });

    var ta = document.createElement('textarea');
    ta.setAttribute('data-f', 'atletas');
    ta.placeholder = 'Um atleta por linha: Nome completo, data de nascimento (opcional)';

    grelha.appendChild(campo('Categoria', sel, false, true));
    grelha.appendChild(campo('Nome da equipa', input('nome', 'text', true), false, true));
    grelha.appendChild(campo('Treinador', input('treinador', 'text', true), false, true));
    grelha.appendChild(campo('Telemóvel do treinador', input('tel_treinador', 'tel', false), false, false));
    var n = input('n_atletas', 'number', false);
    n.min = '0';
    grelha.appendChild(campo('Nº de atletas', n, false, false));
    grelha.appendChild(campo('Lista de atletas (opcional)', ta, true, false));
    bloco.appendChild(grelha);

    cont.appendChild(bloco);

    bloco.querySelectorAll('[data-f]').forEach(function (el) {
      var f = el.getAttribute('data-f');
      if (dados[f] !== undefined) el.value = dados[f];
    });
    // Sugerir o nome do clube como nome da equipa
    var nomeEq = bloco.querySelector('[data-f="nome"]');
    if (!nomeEq.value) {
      var clube = form.elements['clube'] && form.elements['clube'].value;
      if (clube) nomeEq.value = clube;
    }
    renumerar();
  }

  // ---------- Rascunho ----------
  function recolher() {
    var estado = { campos: {}, equipas: [] };
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === 'checkbox' || el.name === 'botcheck') return;
      estado.campos[el.name] = el.value;
    });
    cont.querySelectorAll('.equipa-bloco').forEach(function (b) {
      var e = {};
      b.querySelectorAll('[data-f]').forEach(function (el) { e[el.getAttribute('data-f')] = el.value; });
      estado.equipas.push(e);
    });
    return estado;
  }
  function guardarRascunho() { guardar(CHAVE_RASCUNHO, JSON.stringify(recolher())); }

  function restaurar() {
    var bruto = ler(CHAVE_RASCUNHO);
    if (!bruto) return false;
    try {
      var estado = JSON.parse(bruto);
      Object.keys(estado.campos || {}).forEach(function (k) {
        if (form.elements[k]) form.elements[k].value = estado.campos[k];
      });
      (estado.equipas || []).forEach(function (e) { addEquipa(e); });
      return (estado.equipas || []).length > 0;
    } catch (e) { return false; }
  }

  form.addEventListener('input', guardarRascunho);
  form.addEventListener('change', guardarRascunho);
  btnAdd.addEventListener('click', function () { addEquipa(); guardarRascunho(); });

  if (!restaurar()) addEquipa();

  // ---------- Mensagem ----------
  function construirMensagem() {
    var e = recolher();
    var c = e.campos;
    var linhas = [];
    linhas.push('INSCRIÇÃO - ' + nomeTorneio.toUpperCase());
    linhas.push('');
    linhas.push('CLUBE');
    linhas.push('Nome: ' + c.clube);
    linhas.push('Localidade: ' + c.localidade);
    if (c.site) linhas.push('Site/rede social: ' + c.site);
    linhas.push('Responsável: ' + c.responsavel + (c.cargo ? ' (' + c.cargo + ')' : ''));
    linhas.push('Email: ' + c.email);
    linhas.push('Telemóvel: ' + c.telefone);
    linhas.push('');
    linhas.push('EQUIPAS (' + e.equipas.length + ')');
    e.equipas.forEach(function (t, i) {
      linhas.push((i + 1) + ') ' + t.categoria + ' - ' + t.nome);
      linhas.push('   Treinador: ' + t.treinador + (t.tel_treinador ? ' | Tel.: ' + t.tel_treinador : ''));
      if (t.n_atletas) linhas.push('   Nº de atletas: ' + t.n_atletas);
      if (t.atletas) linhas.push('   Atletas:\n   ' + t.atletas.split('\n').join('\n   '));
    });
    linhas.push('');
    linhas.push('EXTRA');
    linhas.push('Alojamento: ' + (c.alojamento || 'Não'));
    if (c.pessoas) linhas.push('Pessoas na comitiva: ' + c.pessoas);
    if (c.observacoes) linhas.push('Observações: ' + c.observacoes);
    linhas.push('');
    linhas.push('Aceitou o regulamento e o tratamento de dados.');
    return linhas.join('\n');
  }

  function mostrarSucesso(texto, comEnvio) {
    form.classList.add('escondido');
    document.querySelectorAll('.aviso').forEach(function (a) { a.classList.add('escondido'); });
    var s = document.getElementById('sucesso');
    s.classList.remove('escondido');
    document.getElementById('resumo').textContent = texto;
    if (!comEnvio) {
      document.getElementById('sucesso-texto').textContent =
        'O seu programa de email abriu com a inscrição preparada. Carregue em Enviar para concluir.';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------- Enviar ----------
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    limparErro();

    if (!cont.querySelector('.equipa-bloco')) {
      mostrarErro('Adicione pelo menos uma equipa.');
      return;
    }
    if (!form.reportValidity()) {
      mostrarErro('Preencha os campos obrigatórios (marcados com *).');
      return;
    }

    var texto = construirMensagem();
    var c = recolher().campos;
    var chaveValida = chave && chave.indexOf('COLOCAR') !== 0;

    if (!chaveValida) {
      // Sem chave configurada: abre o email já preenchido.
      var assunto = encodeURIComponent('Inscrição ' + nomeTorneio + ' - ' + c.clube);
      var corpo = encodeURIComponent(texto);
      window.location.href = 'mailto:' + emailOrg + '?subject=' + assunto + '&body=' + corpo;
      mostrarSucesso(texto, false);
      return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = 'A enviar...';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: chave,
        subject: 'Inscrição ' + nomeTorneio + ' - ' + c.clube,
        from_name: c.clube,
        email: c.email,
        message: texto,
        botcheck: form.elements['botcheck'].value
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r && r.success) {
          apagar(CHAVE_RASCUNHO);
          mostrarSucesso(texto, true);
        } else {
          throw new Error('falhou');
        }
      })
      .catch(function () {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar inscrição';
        mostrarErro('Não foi possível enviar agora. Tente novamente ou envie para ' + emailOrg + '.');
      });
  });
})();
