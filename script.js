const url = "https://opensheet.elk.sh/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/Respostas%20ao%20formulário%201";

let dados = [];

fetch(url)
  .then(res => res.json())
  .then(json => {

    dados = json.map(item => {
      return {
        data: item["Data"] || "",
        placa: item["Placa"] || "",
        motorista: item["Motorista"] || "",
        veiculo: item["Veículo"] || item["Veiculo"] || "",
        km: item["Km atual"] || item["Km atual "] || item["Km atual "] || "",
        jornada: item["Jornada"] || "",
        carimbo: item["Carimbo de data/hora"] || ""
      };
    });

    carregarPlacas();
  });

function carregarPlacas() {
  const select = document.getElementById("placa");

  let placasUnicas = [...new Set(dados.map(item => item.placa))];

  placasUnicas.forEach(placa => {
    let option = document.createElement("option");
    option.value = placa;
    option.textContent = placa;
    select.appendChild(option);
  });
}

function selecionarPlaca() {
  const placa = document.getElementById("placa").value;

  const filtrados = dados.filter(item => item.placa === placa);

  if (filtrados.length === 0) return;

  // ordenar por data/hora
  filtrados.sort((a, b) => new Date(a.carimbo) - new Date(b.carimbo));

  const ultimo = filtrados[filtrados.length - 1];

  document.getElementById("motorista").textContent =
    "Último motorista: " + (ultimo.motorista || "-");

  document.getElementById("km").textContent =
    "KM atual: " + (ultimo.km || "-");

  document.getElementById("jornada").textContent =
    "Jornada: " + (ultimo.jornada || "-");

  document.getElementById("veiculo").textContent =
    "Veículo: " + (ultimo.veiculo || "-");

  const historico = document.getElementById("historico");
  historico.innerHTML = "";

  filtrados.slice(-5).reverse().forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.data} - ${item.motorista} - KM: ${item.km}`;
    historico.appendChild(li);
  });
}