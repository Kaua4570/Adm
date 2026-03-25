const URL = "https://opensheet.elk.sh/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/Respostas ao formulário 1";

let dados = [];

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
    atualizarTela();
  });

// normalizar texto
function normalizar(txt) {
  return txt ? txt.toString().trim().toLowerCase() : "";
}

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

// eventos
document.getElementById("placaSelect").addEventListener("change", atualizarTela);
document.getElementById("buscaMotorista").addEventListener("input", atualizarTela);
document.getElementById("filtroData").addEventListener("change", atualizarTela);

// atualizar tudo
function atualizarTela() {

  let filtrados = [...dados];

  const placa = normalizar(document.getElementById("placaSelect").value);
  const motoristaBusca = normalizar(document.getElementById("buscaMotorista").value);
  const dataFiltro = document.getElementById("filtroData").value;

  // filtro placa
  if (placa) {
    filtrados = filtrados.filter(d => normalizar(d.Placa) === placa);
  }

  // filtro motorista
  if (motoristaBusca) {
    filtrados = filtrados.filter(d =>
      normalizar(d.Motorista).includes(motoristaBusca)
    );
  }

  // filtro data
  if (dataFiltro) {
    const dataFormatada = dataFiltro.split("-").reverse().join("/");
    filtrados = filtrados.filter(d => d.Data === dataFormatada);
  }

  if (filtrados.length === 0) return;

  // ordenar
  filtrados.sort((a, b) =>
    new Date(b["Carimbo de data/hora"]) -
    new Date(a["Carimbo de data/hora"])
  );

  const ultimo = filtrados[0];

  // destaque
  document.getElementById("motorista").textContent = ultimo.Motorista || "-";
  document.getElementById("km").textContent = ultimo["Km atual"] || "-";
  document.getElementById("jornada").textContent = ultimo.Jornada || "-";
  document.getElementById("veiculo").textContent = ultimo.Veículo || "-";

  // histórico
  document.getElementById("historico").innerHTML =
    filtrados.slice(0, 15).map(item => `
      <li>
        ${item.Data} | ${item.Motorista} | KM: ${item["Km atual"]} | ${item.Jornada}
      </li>
    `).join("");
}
