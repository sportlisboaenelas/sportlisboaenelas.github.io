(function () {
  var form = document.getElementById('form-patrocinio');
  if (!form) return;

  var chave = form.getAttribute('data-chave') || '';
  var emailOrg = form.getAttribute('data-email') || '';
  var nomeTorneio = form.getAttribute('data-torneio') || 'Torneio';
  var erro = document.getElementById('p-msg-erro');
  var btn = document.getElementById('p-enviar');
  var sucesso = document.getElementById('p-sucesso');
  var sucessoTexto = document.getElementById('p-sucesso-texto');

  // Os botões dos pacotes pré-selecionam o pacote no formulário
  document.querySelectorAll('[data-pacote]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = document.getElementById('p-pacote');
      if (sel) sel.value = a.getAttribute('data-pacote');
    });
  });

  function mostrarErro(t) {
    erro.textContent = t;
    erro.classList.remove('escondido');
  }

  function texto() {
    var f = form.elements;
    var l = [];
    l.push('PEDIDO DE PATROCÍNIO - ' + nomeTorneio.toUpperCase());
    l.push('');
    l.push('Empresa: ' + f['empresa'].value);
    l.push('Contacto: ' + f['contacto'].value);
    l.push('Email: ' + f['email'].value);
    if (f['telefone'].value) l.push('Telemóvel: ' + f['telefone'].value);
    l.push('Pacote de interesse: ' + (f['pacote'].value || 'Ainda não sabe'));
    if (f['orcamento'].value) l.push('Orçamento aproximado: ' + f['orcamento'].value);
    if (f['mensagem'].value) l.push('');
    if (f['mensagem'].value) l.push('Mensagem: ' + f['mensagem'].value);
    return l.join('\n');
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    erro.classList.add('escondido');
    if (!form.reportValidity()) {
      mostrarErro('Preencha os campos obrigatórios (marcados com *).');
      return;
    }
    var corpo = texto();
    var empresa = form.elements['empresa'].value;
    var chaveValida = chave && chave.indexOf('COLOCAR') !== 0;

    if (!chaveValida) {
      var assunto = encodeURIComponent('Patrocínio ' + nomeTorneio + ' - ' + empresa);
      window.location.href = 'mailto:' + emailOrg + '?subject=' + assunto + '&body=' + encodeURIComponent(corpo);
      form.classList.add('escondido');
      sucessoTexto.textContent = 'O seu programa de email abriu com o pedido preparado. Carregue em Enviar para concluir.';
      sucesso.classList.remove('escondido');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'A enviar...';
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: chave,
        subject: 'Patrocínio ' + nomeTorneio + ' - ' + empresa,
        from_name: empresa,
        email: form.elements['email'].value,
        message: corpo,
        botcheck: form.elements['botcheck'].value
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r && r.success) {
          form.classList.add('escondido');
          sucesso.classList.remove('escondido');
        } else {
          throw new Error('falhou');
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = 'Enviar pedido';
        mostrarErro('Não foi possível enviar agora. Tente novamente ou escreva para ' + emailOrg + '.');
      });
  });
})();
