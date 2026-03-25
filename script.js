const URL = "https://opensheet.elk.sh/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/Respostas ao formulário 1"; // 🔥 COLOCA SUA URL JSON AQUI

let grafico;

// 🔧 LIMPA CHAVES (remove espaços bugados)
function limparObjeto(obj) {
  let novo = {};
  for (let chave in obj) {
    novo[chave.trim()] = obj[chave];
  }
  return novo;
}

// 🚀 CARREGAR DADOS
async function carregarDados() {
  try {
    const res = await fetch(URL + "?nocache=" + Date.now());
    let dados = await res.json();

    // 🔥 LIMPAR E FILTRAR
    dados = dados.map(limparObjeto);
    dados = dados.filter(item => item.Placa);

    console.log("Dados carregados:", dados);

    // 🎯 PEGAR PLACA SELECIONADA
    const placa = document.getElementById("placaSelect").value;

    if (!placa) return;

    let filtrados = dados.filter(item => item.Placa === placa);

    if (filtrados.length === 0) return;

    // 🧠 ORDENAR POR DATA
    filtrados.sort((a, b) => {
      return new Date(b.Data) - new Date(a.Data);
    });

    // 📌 ÚLTIMO REGISTRO
    let ultimo = filtrados[0];

    document.getElementById("motorista").innerText = ultimo.Motorista || "-";
    document.getElementById("km").innerText = ultimo["Km atual"] || "-";
    document.getElementById("jornada").innerText = ultimo.Jornada || "-";
    document.getElementById("veiculo").innerText = ultimo.Veículo || "-";

    // 📜 HISTÓRICO
    let lista = document.getElementById("historico");
    lista.innerHTML = "";

    filtrados.slice(0, 10).forEach(item => {
      let li = document.createElement("li");

      let data = item.Data || "-";
      let motorista = item.Motorista || "-";
      let km = item["Km atual"] || "-";

      li.textContent = `${data} - ${motorista} - KM: ${km}`;
      lista.appendChild(li);
    });

    // 📊 GRÁFICO
    let labels = filtrados.map(item => item.Data).reverse();
    let kms = filtrados.map(item => Number(item["Km atual"]) || 0).reverse();

    desenharGrafico(labels, kms);

  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

// 📊 FUNÇÃO DO GRÁFICO
function desenharGrafico(labels, dados) {
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
        data: dados,
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

// 🔄 AO TROCAR PLACA
document.getElementById("placaSelect").addEventListener("change", carregarDados);

// 🚀 INICIALIZAR
carregarDados();
console.log("Script funcionando 🔥");
