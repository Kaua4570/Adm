const URL = "https://opensheet.elk.sh/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/Respostas ao formulário 1";

let dados = [];
let grafico;

// carregar dados
fetch(URL)
  .then(res => res.json())
  .then(json => {

    dados = json
      .filter(item => Object.keys(item).length > 0)
      .map(item => {
        let novo = {};
        Object.keys(item).forEach(k => {
          novo[k.trim()] = item[k];
        });
        return novo;
      });

    carregarPlacas();
  });

// carregar placas
function carregarPlacas() {
  const select = document.getElementById("placaSelect");

  const placas = [...new Set(dados.map(d => d.Placa))];

  placas.forEach(p => {
    if (!p) return;
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });
}

// evento
document.getElementById("placaSelect").addEventListener("change", function () {
  const placa = this.value;

  const filtrados = dados.filter(d => d.Placa === placa);

  if (filtrados.length === 0) return;

  // ordenar por data mais recente
  filtrados.sort((a, b) =>
    new Date(b["Carimbo de data/hora"]) -
    new Date(a["Carimbo de data/hora"])
  );

  const ultimo = filtrados[0];

  // dados principais
  document.getElementById("motorista").textContent = ultimo.Motorista || "-";
  document.getElementById("km").textContent = ultimo["Km atual"] || "-";
  document.getElementById("jornada").textContent = ultimo.Jornada || "-";
  document.getElementById("veiculo").textContent = ultimo.Veículo || "-";

  // histórico
  document.getElementById("historico").innerHTML =
    filtrados.slice(0, 5).map(item => `
      <li>
        ${item.Data} - ${item.Motorista} - KM: ${item["Km atual"]}
      </li>
    `).join("");

  gerarGrafico(filtrados);
});

// 🔥 gráfico
function gerarGrafico(lista) {

  const ultimos = lista.slice(0, 7).reverse();

  const labels = ultimos.map(item => item.Data);
  const kms = ultimos.map(item => Number(item["Km atual"]) || 0);

  const ctx = document.getElementById('graficoKm').getContext('2d');

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'KM',
        data: kms
      }]
    },
    options: {
      responsive: true
    }
  });
}
