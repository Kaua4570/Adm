const url = "https://opensheet.elk.sh/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/Respostas ao formulário 1";

let dados = [];
let grafico = null;

// 🔥 Buscar dados
fetch(url)
  .then(res => res.json())
  .then(res => {
    dados = res.filter(item => Object.keys(item).length > 0);
    carregarPlacas();
  });

// 🔥 Corrige nomes das colunas
function pegar(item, campo) {
  const chave = Object.keys(item).find(k =>
    k.trim().toLowerCase() === campo.trim().toLowerCase()
  );
  return chave ? item[chave] : "";
}

// 🔥 Normaliza texto
function normalizar(texto) {
  return texto ? texto.toString().trim().toLowerCase() : "";
}

// 🔥 Converte KM para número
function numero(valor) {
  let n = parseFloat(valor);
  return isNaN(n) ? 0 : n;
}

// 🔥 Carrega placas
function carregarPlacas() {
  const select = document.getElementById("placaSelect");

  const placas = [...new Set(
    dados.map(item => normalizar(pegar(item, "Placa")))
  )];

  placas.forEach(p => {
    if (!p) return;

    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p.toUpperCase();
    select.appendChild(opt);
  });
}

// 🔥 Selecionar placa
function selecionarPlaca() {
  const placaSelecionada = normalizar(
    document.getElementById("placaSelect").value
  );

  const filtrados = dados.filter(item =>
    normalizar(pegar(item, "Placa")) === placaSelecionada
  );

  if (filtrados.length === 0) return;

  // 🔥 Ordena por data (mais recente primeiro)
  filtrados.sort((a, b) =>
    new Date(pegar(b, "Carimbo de data/hora")) -
    new Date(pegar(a, "Carimbo de data/hora"))
  );

  const ultimo = filtrados[0];

  // 🔥 Dados principais
  document.getElementById("motorista").textContent = pegar(ultimo, "Motorista");
  document.getElementById("km").textContent = pegar(ultimo, "Km atual") || "0";
  document.getElementById("jornada").textContent = pegar(ultimo, "Jornada");
  document.getElementById("veiculo").textContent = pegar(ultimo, "Veículo");

  // 🔥 Histórico
  const historico = document.getElementById("historico");

  historico.innerHTML = filtrados.slice(0, 10).map(item => `
    <li>
      ${pegar(item, "Data")} - ${pegar(item, "Motorista")} - KM: ${pegar(item, "Km atual")}
    </li>
  `).join("");

  // 🔥 GRÁFICO (ordem correta agora)
  const dadosGrafico = filtrados
    .slice()
    .reverse(); // antigo → novo

  const labels = dadosGrafico.map(item =>
    pegar(item, "Data")
  );

  const kms = dadosGrafico.map(item =>
    numero(pegar(item, "Km atual"))
  );

  atualizarGrafico(labels, kms);
}

// 🔥 Atualiza gráfico
function atualizarGrafico(labels, dadosKM) {
  const ctx = document.getElementById("graficoKm").getContext("2d");

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "KM",
        data: dadosKM,
        borderColor: "#25D366",
        backgroundColor: "rgba(37,211,102,0.2)",
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#fff"
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#ccc" },
          grid: { color: "#333" }
        },
        y: {
          ticks: { color: "#ccc" },
          grid: { color: "#333" }
        }
      }
    }
  });
}
