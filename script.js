const url = "https://opensheet.elk.sh/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/Respostas ao formulário 1";

let dados = [];

// 🔥 Buscar dados
fetch(url)
  .then(res => res.json())
  .then(res => {

    dados = res.filter(item => Object.keys(item).length > 0);

    console.log("DADOS:", dados);

    carregarPlacas();

    // 🔥 EVENTO DO SELECT (FALTAVA ISSO)
    document.getElementById("placaSelect")
      .addEventListener("change", selecionarPlaca);
  });

// 🔥 Corrige nomes das colunas
function pegar(item, campo) {
  const chave = Object.keys(item).find(k =>
    k.trim().toLowerCase() === campo.trim().toLowerCase()
  );
  return chave ? item[chave] : "-";
}

// 🔥 Normaliza texto
function normalizar(texto) {
  return texto ? texto.toString().trim().toLowerCase() : "";
}

// 🔥 Carrega placas
function carregarPlacas() {
  const select = document.getElementById("placaSelect");

  select.innerHTML = '<option value="">Selecione a placa</option>';

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

  // 🔥 Ordena por data
  filtrados.sort((a, b) =>
    new Date(pegar(b, "Carimbo de data/hora")) -
    new Date(pegar(a, "Carimbo de data/hora"))
  );

  const ultimo = filtrados[0];

  // ✅ DADOS PRINCIPAIS
  document.getElementById("motorista").textContent = pegar(ultimo, "Motorista");
  document.getElementById("km").textContent = pegar(ultimo, "Km atual");
  document.getElementById("jornada").textContent = pegar(ultimo, "Jornada");
  document.getElementById("veiculo").textContent = pegar(ultimo, "Veículo");

  // ✅ HISTÓRICO
  const historico = document.getElementById("historico");

  historico.innerHTML = filtrados.slice(0, 10).map(item => `
    <li>
      ${pegar(item, "Carimbo de data/hora")} - 
      ${pegar(item, "Motorista")} - 
      KM: ${pegar(item, "Km atual")}
    </li>
  `).join("");

  // ✅ GRÁFICO (AGORA FUNCIONA)
  const labels = filtrados.map(item =>
    pegar(item, "Carimbo de data/hora")
  );

  const kms = filtrados.map(item =>
    parseFloat(pegar(item, "Km atual")) || 0
  );

  const ctx = document.getElementById("graficoKm");

  if (window.grafico) window.grafico.destroy();

  window.grafico = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.reverse(),
      datasets: [{
        label: "KM",
        data: kms.reverse(),
        borderWidth: 2,
        tension: 0.3
      }]
    }
  });

}
