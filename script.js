let dados = [];

const url = "https://docs.google.com/spreadsheets/d/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/export?format=csv";

fetch(url)
  .then(res => res.text())
  .then(texto => {

    const linhas = texto.split('\n');
    linhas.shift(); // remove cabeçalho

    dados = linhas.map(linha => {
      const col = linha.split(',');

      return {
        data: col[1],
        motorista: col[2],
        placa: col[3],
        km: col[5],
        jornada: col[6]
      };
    });

    carregarPlacas();
  });

function carregarPlacas() {
  const select = document.getElementById('placaSelect');

  const placas = [...new Set(dados.map(d => d.placa))];

  select.innerHTML = '<option>Selecione a placa</option>';

  placas.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });

  select.addEventListener('change', atualizarPainel);
}

function atualizarPainel() {
  const placa = document.getElementById('placaSelect').value;

  const filtrados = dados.filter(d => d.placa === placa);

  if (filtrados.length === 0) return;

  const ultimo = filtrados[filtrados.length - 1];

  document.getElementById('motorista').textContent = ultimo.motorista || '-';
  document.getElementById('km').textContent = ultimo.km || '-';
  document.getElementById('jornada').textContent = ultimo.jornada || '-';

  const hist = document.getElementById('historico');
  hist.innerHTML = '';

  filtrados.slice(-10).reverse().forEach(d => {
    const li = document.createElement('li');
    li.textContent = `${d.data} - ${d.motorista} - KM: ${d.km}`;
    hist.appendChild(li);
  });
}