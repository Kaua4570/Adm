const url = "https://script.google.com/macros/s/AKfycbwjZubw3RuIdjemAxw7xINiJmv9zuRGy_u0XAqC-C24AYHw4yoVaOU2SxLvSY3zt75a/exec";

let dados = [];

// 🔥 Busca os dados
fetch(url)
  .then(res => res.json())
  .then(res => {
    dados = res.data || res;
    console.log("DADOS:", dados);
    carregarPlacas();
  });

// 🔥 Corrige nome das colunas automaticamente
function pegar(item, campo) {
  const chave = Object.keys(item).find(k =>
    k.toLowerCase().trim() === campo.toLowerCase().trim()
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

  filtrados.sort((a, b) =>
    new Date(pegar(b, "Carimbo de data/hora")) - new Date(pegar(a, "Carimbo de data/hora"))
  );

  const ultimo = filtrados[0];

  document.getElementById("motorista").textContent = pegar(ultimo, "Motorista");
  document.getElementById("km").textContent = pegar(ultimo, "Km atual");
  document.getElementById("jornada").textContent = pegar(ultimo, "Jornada");
  document.getElementById("veiculo").textContent = pegar(ultimo, "Veículo");

  const historico = document.getElementById("historico");

  historico.innerHTML = filtrados.slice(0, 10).map(item => `
    <li>
      ${pegar(item, "Data")} - ${pegar(item, "Motorista")} - KM: ${pegar(item, "Km atual")}
    </li>
  `).join("");
}

// 🔥 ATIVA o select (ESSENCIAL)
document.getElementById("placaSelect").addEventListener("change", selecionarPlaca);
