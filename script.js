const url = "https://script.google.com/macros/s/AKfycbwjZubw3RuIdjemAxw7xINiJmv9zuRGy_u0XAqC-C24AYHw4yoVaOU2SxLvSY3zt75a/exec";

let dados = [];

// 🔥 Busca os dados da planilha
fetch(url)
  .then(res => res.json())
  .then(res => {
    dados = res.data || res;
    console.log("DADOS:", dados); // debug
    carregarPlacas();
  });

// 🔥 Função inteligente (corrige nome de coluna automaticamente)
function pegar(item, campo) {
  const chave = Object.keys(item).find(k =>
    k.toLowerCase().trim() === campo.toLowerCase().trim()
  );
  return chave ? item[chave] : "-";
}

// 🔥 Normaliza texto (remove erro de maiúsculo/espaço)
function normalizar(texto) {
  return texto ? texto.toString().trim().toLowerCase() : "";
}

// 🔥 Carrega placas no select
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

// 🔥 Quando seleciona placa
function selecionarPlaca() {
  const placaSelecionada = normalizar(
    document.getElementById("placaSelect").value
  );

  const filtrados = dados.filter(item =>
    normalizar(pegar(item, "Placa")) === placaSelecionada
  );

  if (filtrados.length === 0) return;

  // 🔥 Ordena pelo mais recente (data + hora)
  filtrados.sort((a, b) => {
    return new Date(pegar(b, "Carimbo de data/hora")) - new Date(pegar(a, "Carimbo de data/hora"));
  });

  const ultimo = filtrados[0];

  // 🔥 Preenche os dados principais
  document.getElementById("motorista").textContent = pegar(ultimo, "Motorista");
  document.getElementById("km").textContent = pegar(ultimo, "Km atual");
  document.getElementById("jornada").textContent = pegar(ultimo, "Jornada");
  document.getElementById("veiculo").textContent = pegar(ultimo, "Veículo");

  // 🔥 Histórico (sem undefined)
  const historico = document.getElementById("historico");

  historico.innerHTML = filtrados.map(item => `
    <li>
      ${pegar(item, "Data")} - ${pegar(item, "Motorista")} - KM: ${pegar(item, "Km atual")}
    </li>
  `).join("");
}
