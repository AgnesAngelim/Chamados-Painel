// =========================
// CONFIGURAÇÃO ÚNICA DO FIREBASE
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyBlbavbldOZuw3_lerPFzP0TDHK9K5Sqeg",
  authDomain: "chamados-7e9e0.firebaseapp.com",
  projectId: "chamados-7e9e0",
  storageBucket: "chamados-7e9e0.firebasestorage.app",
  messagingSenderId: "1018655787755",
  appId: "1:1018655787755:web:8835ed2dcc6460279b0cae"
};

// Inicializa uma única vez
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const atendentes = {
  green: ["Kamilla", "Guilherme"],
  telecom: ["Ana Carolina", "Alana Campos", "Daniel Henrique", "Maria Julia", "Renan Gonçalves"],
  expansao: ["Pedro Lucas", "Ibson Pereira", "Mateus Keveny", "Raissa"]
};

let atendenteAtual = '';
let setorAtual = '';
let demandaAtual = null;
let subAtual = null;
let idClienteSalvo = '';
let idLicenciadoSalvo = '';

// =========================
const demandas = {
  green: [
    {
      nome: "Ajuste de aplicativo",
      subs: [
        {
          sub: "Acesso ao aplicativo",
          partes: [
            {
              t: "O licenciado está enfrentando problema de acesso ou visualização incorreta no aplicativo. As informações exibidas não correspondem ao que está registrado no sistema.",
            },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Ajuste de comissão",
      subs: [
        {
          sub: "Divergência de comissão",
          partes: [
            {
              t: "O licenciado identificou divergência no valor de comissão registrado. O valor exibido no painel não está de acordo com o esperado conforme as vendas realizadas no período.",
            },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Ajuste de KWh",
      subs: [
        {
          sub: "Consumo de KWh",
          partes: [
            {
              t: "O cliente apresenta inconsistência no consumo de KWh registrado no sistema. O valor informado na fatura não corresponde ao consumo real aferido no período.",
            },
          ],
          extras: [],
        },
      ],
    },
  ],
  telecom: [
    {
      nome: "Ajuste de fatura",
      subs: [
        {
          sub: "Data de último pagamento",
          partes: [
            {
              t: "O cliente realizou o pagamento da linha e no aplicativo está como vencido",
            },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Ajuste de portabilidade",
      subs: [
        {
          sub: "Status da portabilidade",
          partes: [
            { t: "O cliente tem uma portabilidade " },
            { f: "status_aprovacao", ph: "ex: aprovada" },
            { t: " e no aplicativo está " },
            { f: "status_portabilidade", ph: "status no app" },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Ajuste de residual",
      subs: [
        {
          sub: "Comissionamento",
          partes: [
            {
              t: "Cliente realizou o pagamento do plano mas o licenciado não recebeu o comissionamento referente ao cliente",
            },
          ],
          extras: [],
        },
        {
          sub: "Royalties",
          partes: [
            {
              t: "O licenciado bateu PRO no mês anterior mas não está recebendo Royalties do cliente",
            },
          ],
          extras: [],
        },
        {
          sub: "Bônus portabilidade turbinada",
          partes: [
            {
              t: "Licenciado alega não ter recebido o bônus da campanha de Portabilidade Turbinada referente ao cliente",
            },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Análise de KWh",
      subs: [
        {
          sub: "KWh do licenciado",
          partes: [
            {
              t: "O cliente realizou o pagamento mas o licenciado alega que não está recebendo os KWh",
            },
          ],
          extras: [],
        },
        {
          sub: "Quantidade de KWh de portabilidade",
          partes: [
            {
              t: "O cliente tem uma portabilidade confirmada paga no cartão de crédito e no aplicativo do licenciado está ",
            },
            { f: "kwh_app", ph: "KWh no app" },
            { t: " KWh" },
          ],
          extras: [],
        },
        {
          sub: "Quantidade de KWh de nova linha",
          partes: [
            {
              t: "O cliente tem uma nova linha paga no cartão de crédito e no aplicativo os KWh estão zerados",
            },
          ],
          extras: [],
        },
        {
          sub: "KWh de voucher",
          partes: [
            {
              t: "O cliente tem uma portabilidade por voucher e no aplicativo está ",
            },
            { f: "kwh_voucher", ph: "KWh no app" },
            { t: " KWh" },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Correção app",
      subs: [
        {
          sub: "Forma de pagamento",
          partes: [
            { t: "O cliente realizou o pagamento da linha via " },
            { f: "via_pagamento", ph: "forma de pagamento" },
            { t: " e no app está como " },
            { f: "app_pagamento", ph: "como aparece no app" },
          ],
          extras: [],
        },
        {
          sub: "Data de último pagamento",
          partes: [
            {
              t: "No aplicativo do licenciado não aparece a data de último pagamento",
            },
          ],
          extras: [],
        },
        {
          sub: "Número de gigas",
          partes: [
            { t: "O cliente tem " },
            { f: "gigas_correto", ph: "gigas correto" },
            { t: " de gigas mas no aplicativo está aparecendo incorreto" },
          ],
          extras: [],
        },
        {
          sub: "Número de origem",
          partes: [
            { t: "O cliente fez uma alteração de número na Contel" },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Correção de cadastro",
      subs: [
        {
          sub: "Data ativo",
          partes: [
            { t: "O cliente fez a ativação no dia " },
            { f: "data_ativacao", ph: "data ativação" },
            { t: " e a data ativo está no dia " },
            { f: "data_ativo", ph: "data ativo" },
          ],
          extras: [],
        },
        {
          sub: "Portabilidade para nova linha",
          partes: [
            {
              t: "O cliente tinha um cadastro de portabilidade mas deseja mudar para nova linha",
            },
          ],
          extras: [],
        },
        {
          sub: "Nova linha para portabilidade",
          partes: [
            {
              t: "O cliente tinha uma nova linha mas deseja mudar para portabilidade",
            },
          ],
          extras: [],
        },
        {
          sub: "Email do cliente",
          partes: [
            {
              t: "O cliente deseja alteração de email e não foi possível alterar pelo BackOffice",
            },
          ],
          extras: [{ id: "email-correto", label: "Email correto" }],
        },
        {
          sub: "Forma de pagamento",
          partes: [
            { t: "O cliente paga via " },
            { f: "forma_atual", ph: "forma atual" },
            { t: " e no aplicativo está " },
            { f: "forma_app", ph: "forma no app" },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Erro de pagamento",
      subs: [
        {
          sub: "Erro no pagamento",
          partes: [
            {
              t: "O cliente está tentando realizar o pagamento da linha e está dando erro",
            },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Exclusão de cadastro",
      subs: [
        {
          sub: "Excluir cadastro",
          partes: [
            {
              t: "O licenciado esta tentando cadastrar o cliente e esta dando o erro que o cliente ja tem um cadastro com outro licenciado, o mesmo não tem cadastro em nenhuma conexão",
            },
          ],
          extras: [{ id: "CPF-do-cliente", label: "CPF do cliente" }],
        },
      ],
    },
    {
      nome: "Falha na ativação",
      subs: [
        {
          sub: "Data ativo",
          partes: [
            {
              t: "O cliente realizou a ativação da linha na contel mas no backoffice está sem data ativo e no aplicativo está inativo",
            },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Instabilidade no iGreen Club",
      subs: [
        {
          sub: "Acesso ao desconto",
          partes: [
            {
              t: "O cliente esta tentando ultilizar o desconto e fica uma tela branca ao clicar no estabelecimento",
            },
          ],
          extras: [],
        },
        {
          sub: "Senha do cliente",
          partes: [
            {
              t: "O cliente esta ultilizando a senha e o email correto mas no aplicativo esta dando erro ao entrar",
            },
          ],
          extras: [
            { id: "senha_do_cliente", label: "Senha do cliente" },
            { id: "email_do_cliente", label: "Email do cliente" },
          ],
        },
      ],
    },
    {
      nome: "Reativação de cadastro",
      subs: [
        {
          sub: "Data cancelado",
          partes: [
            {
              t: "O cliente tinha uma linha cancelada e realizou a reativação na Contel, mas no BackOffice consta data cancelado",
            },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Troca de titularidade",
      subs: [
        {
          sub: "Info do cliente",
          partes: [
            { t: "O cliente realizou uma troca de titularidade na Contel" },
          ],
          extras: [
            { id: "nome-BackOffice", label: "Nome BackOffice" },
            { id: "cpf-BackOffice", label: "CPF BackOffice" },
            { id: "nome-contel", label: "Nome Contel" },
            { id: "cpf-contel", label: "CPF Contel" },
          ],
        },
      ],
    },
  ],
  expansao: [
    {
      nome: "Transferência de convites Expert 4.0",
      subs: [
        {
          sub: "Transferência de convites Expert 4.0",
          partes: [
            { t: "Licenciado " },
            { f: "licenciado_origem", ph: "Ex: 12345 - nome" },
            { t: " deseja realizar transferência de " },
            { f: "qtd_convites", ph: "ex: 1" },
            { t: " convite(s) para o licenciado " },
            { f: "licenciado_destino", ph: "ex: 67890 - nome" },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Analise de KWH",
      subs: [
        {
          sub: "Consumo de KWH",
          partes: [
            {
              t: "O cliente solicita análise detalhada do consumo de KWH registrado. Os dados do período apresentam inconsistência em relação ao padrão esperado para o perfil de consumo.",
            },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Erro ao realizar saque",
      subs: [
        {
          sub: "Erro no saque",
          partes: [
            {
              t: "O licenciado tentou realizar o saque do saldo disponível, porém a operação retornou erro. O valor continua disponível no painel mas a transação não foi processada.",
            },
          ],
          extras: [],
        },
      ],
    },
    {
      nome: "Analise PRO",
      subs: [
        {
          sub: "Plano PRO",
          partes: [
            {
              t: "O licenciado solicita análise do plano PRO vinculado ao seu cadastro. Há divergência entre os benefícios contratados e os recursos disponíveis no sistema.",
            },
          ],
          extras: [],
        },
      ],
    },
  ],
};

// =========================
// SALVAR NO FIREBASE
// =========================
function salvarChamado(chamado) {
  chamado.data = new Date().toLocaleString('pt-BR');
  db.collection('chamados').add(chamado)
    .catch(err => console.error('Erro ao salvar:', err));
}

// =========================
//  SELECIONAR SETOR
// =========================
function selecionarSetor(setor, btn) {
  setorAtual = setor;

  document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const listaAt = document.getElementById('atendente-list');
  listaAt.innerHTML = '';

  atendentes[setor].forEach(nome => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.textContent = nome;

    b.onclick = () => {
      document.querySelectorAll('#atendente-list .chip').forEach(c => c.classList.remove('active'));
      b.classList.add('active');

      atendenteAtual = nome;

      mostrarDemandas();
    };

    listaAt.appendChild(b);
  });

  document.getElementById('passo-atendente').classList.remove('hidden');
}

// =========================
// MOSTRAR DEMANDAS
// =========================
function mostrarDemandas() {
  const lista = document.getElementById('demanda-list');
  lista.innerHTML = '';

  document.getElementById('passo3').classList.add('hidden');
  document.getElementById('output-box').style.display = 'none';

  demandas[setorAtual].forEach(d => {
    const b = document.createElement('button');
    b.className = 'demanda-item';
    b.innerHTML = `<span>${d.nome}</span>`;
    b.onclick = () => selecionarDemanda(d, b);
    lista.appendChild(b);
  });

  document.getElementById('passo2').classList.remove('hidden');
}

// =========================
// SELECIONAR DEMANDA
// =========================
function selecionarDemanda(d, btn) {
  demandaAtual = d;

  document.querySelectorAll('.demanda-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('output-box').style.display = 'none';
  document.getElementById('passo4').classList.add('hidden');
  document.getElementById('id-cliente').value = '';
  document.getElementById('id-licenciado').value = '';
  idClienteSalvo = '';
  idLicenciadoSalvo = '';

  // Esconde/mostra o campo ID cliente e ajusta o label conforme a demanda
  const isTransferencia = d.nome === "Transferência de convites Expert 4.0";
  const campoClienteWrap = document.getElementById('id-cliente').closest('.field-group');
  campoClienteWrap.style.display = isTransferencia ? 'none' : '';

  const lista = document.getElementById('sub-list');
  lista.innerHTML = '';

  d.subs.forEach(s => {
    const b = document.createElement('button');
    b.className = 'sub-item';
    b.textContent = s.sub;
    b.onclick = () => selecionarSub(s, b);
    lista.appendChild(b);
  });

  document.getElementById('passo3').classList.remove('hidden');
}

// =========================
//  SELECIONAR SUB
// =========================
function selecionarSub(s, btn) {
  subAtual = s;

  document.querySelectorAll('.sub-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('titulo-box').textContent = demandaAtual.nome;
  document.getElementById('subtitulo-box').textContent = s.sub;

  const wrap = document.getElementById('modelo-wrap');
  wrap.innerHTML = '';
  s.partes.forEach(p => {
    if (p.t) wrap.appendChild(document.createTextNode(p.t));
    else if (p.f) {
      const input = document.createElement('input');
      input.className = 'inline-field';
      input.id = 'inline_' + p.f;
      input.placeholder = p.ph;
      wrap.appendChild(input);
    }
  });

  const extras = document.getElementById('campos-extras');
  extras.innerHTML = '';
  s.extras.forEach(e => {
    const div = document.createElement('div');
    div.className = 'field-group';
    div.innerHTML = `<label>${e.label}</label><input type="text" id="${e.id}" class="field-input"/>`;
    extras.appendChild(div);
  });

  document.getElementById('passo4').classList.remove('hidden');
  document.getElementById('id-cliente').value    = idClienteSalvo;
  document.getElementById('id-licenciado').value = idLicenciadoSalvo;
}

// =========================
// GERAR TEXTO + ENVIAR
// =========================
function gerarTexto() {
  if (!subAtual) return;

  const isTransferencia = demandaAtual.nome === "Transferência de convites Expert 4.0";
  const idCliente    = document.getElementById('id-cliente').value.trim();
  const idLicenciado = document.getElementById('id-licenciado').value.trim();
  idClienteSalvo    = idCliente;
  idLicenciadoSalvo = idLicenciado;

  if (!atendenteAtual) {
    alert('Selecione o atendente');
    return;
  }

  if (isTransferencia && !idLicenciado) {
    alert('Preencha o ID licenciado');
    return;
  }

  if (!isTransferencia && (!idCliente || !idLicenciado)) {
    alert('Preencha os IDs');
    return;
  }

  let modelo = '';
  subAtual.partes.forEach(p => {
    if (p.t) modelo += p.t;
    else if (p.f) {
      const val = document.getElementById('inline_' + p.f)?.value || '';
      modelo += val;
    }
  });

  let texto;
  if (isTransferencia) {
    texto  = `${demandaAtual.nome} - ID licenciado: ${idLicenciado}\n`;
    texto += `Atendente: ${atendenteAtual}\n`;
    texto += `Corrigir: ${subAtual.sub}\n`;
    texto += `${modelo}\n`;
    texto += `ID licenciado: ${idLicenciado}`;
  } else {
    texto  = `${demandaAtual.nome} - ID cliente: ${idCliente}\n`;
    texto += `Atendente: ${atendenteAtual}\n`;
    texto += `Corrigir: ${subAtual.sub}\n`;
    texto += `${modelo}\n`;
    texto += `ID cliente: ${idCliente}\n`;
    texto += `ID licenciado: ${idLicenciado}`;
  }

  document.getElementById('output-text').textContent = texto;

  salvarChamado({
    setor:    setorAtual,
    atendente: atendenteAtual,
    demanda:  demandaAtual.nome,
    titulo:   demandaAtual.nome,
    subtipo:  subAtual.sub,
    texto:    texto,
  });

  document.getElementById('output-box').style.display = 'block';
}

// =========================
//  COPIAR TEXTO
// =========================
function copiar() {
  const texto = document.getElementById('output-text').textContent;
  const btn = document.getElementById('btn-copy');

  function onCopiado() {
    btn.textContent = 'Copiado!';
    btn.style.borderColor = 'var(--accent)';
    btn.style.color = 'var(--accent)';
    setTimeout(() => {
      btn.textContent = 'Copiar texto';
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2000);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(texto).then(onCopiado);
  } else {
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); onCopiado(); } catch(e) {}
    document.body.removeChild(ta);
  }
}
