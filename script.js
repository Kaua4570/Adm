const url = "https://script.google.com/macros/s/AKfycbwjZubw3RuIdjemAxw7xINiJmv9zuRGy_u0XAqC-C24AYHw4yoVaOU2SxLvSY3zt75a/exec";

let dados = [];

fetch(url)
  .then(res => res.json())
  .then(res => {
    dados = res.data || res;
    console.log(dados); // 👈 IMPORTANTE (debug)

    carregarPlacas();
  });

function pegar(item, campo) {
  return item[campo] || item[campo.toLowerCase()] || item[campo.replace(/ /g, "_")] || "-";
}

function normalizar(texto) {
  return texto?.toString().trim().toLowerCase();
}

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

function selecionarPlaca() {
  const placaSelecionada = normalizar(
    document.getElementById("placaSelect").value
  );

  const filtrados = dados.filter(
    item => normalizar(pegar(item, "Placa")) === placaSelecionada
  );

  if (!filtrados.length) return;

  filtrados.sort((a, b) =>
    new Date(pegar(b, "Carimbo de data/hora")) - new Date(pegar(a, "Carimbo de data/hora"))
  );

  const ultimo = filtrados[0];

  document.getElementById("motorista").textContent = pegar(ultimo, "Motorista");
  document.getElementById("km").textContent = pegar(ultimo, "Km atual");
  document.getElementById("jornada").textContent = pegar(ultimo, "Jornada");
  document.getElementById("veiculo").textContent = pegar(ultimo, "Veículo");

  const historico = document.getElementById("historico");
  historico.innerHTML = "";

  filtrados.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${pegar(item, "Data")} - ${pegar(item, "Motorista")} - KM: ${pegar(item, "Km atual")}`;
    historico.appendChild(li);
  });
}
