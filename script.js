const url = "https://opensheet.elk.sh/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/Respostas ao formulário 1"; // seu opensheet

let dados = [];
let grafico = null;

async function carregarDados() {
  const res = await fetch(url);
  dados = await res.json();

  preencherSelect();
}

function limparTexto(valor) {
  return valor ? valor.trim() : "";
}

function preencherSelect() {
  const select = document.getElementById("placaSelect");
  const placas = [...new Set(dados.map(d => limparTexto(d["Placa"])))];

  placas.forEach(p => {
    if (p) {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      select.appendChild(opt);
    }
  });

  select.addEventListener("change", () => atualizarDados(select.value));
}

function atualizarDados(placa) {
  const filtrados = dados.filter(d => limparTexto(d["Placa"]) === placa);

  if (filtrados.length === 0) return;

  // pegar último registro
  const ultimo = filtrados[filtrados.length - 1];

  document.getElementById("motorista").textContent = limparTexto(ultimo["Motorista "]);
  document.getElementById("km").textContent = limparTexto(ultimo["Km atual "]);
  document.getElementById("jornada").textContent = limparTexto(ultimo["Jornada "]);
  document.getElementById("veiculo").textContent = limparTexto(ultimo["Veículo "]);

  // histórico
  const historico = document.getElementById("historico");
  historico.innerHTML = "";

  filtrados.slice(-5).reverse().forEach(d => {
    const li = document.createElement("li");
    li.textContent = `${d["Data"]} - ${limparTexto(d["Motorista "])} - KM: ${limparTexto(d["Km atual "])}`;
    historico.appendChild(li);
  });

  gerarGrafico(filtrados);
}

function gerarGrafico(lista) {
  const ctx = document.getElementById("graficoKm").getContext("2d");

  const labels = lista.map(d => d["Data"]);
  const kms = lista.map(d => Number(limparTexto(d["Km atual "])));

  // destruir gráfico antigo
  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "KM",
        data: kms,
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
}

carregarDados();
console.log("Script carregado");
console.log(typeof Chart);
