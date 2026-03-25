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

// 🔥 NORMALIZA TEXTO (remove acento, espaço, etc)
function limparTexto(texto) {
  return texto
    ? texto.toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .trim()
    : "";
}

// 🔥 Função inteligente pra pegar campo (resolve TUDO)
function pegar(item, campo) {
  const campoNormal = limparTexto(campo);

  const chave = Object.keys(item).find(k => {
    return limparTexto(k) === campoNormal;
  });

  return chave ? item[chave] : "-";
}

// 🔥 Carrega placas
function carregarPlacas() {
  const select = document.getElementById("placaSelect");

  const placas = [...new Set(
    dados.map(item => limparTexto(pegar(item, "Placa")))
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
  const placaSelecionada = limparTexto(
    document.getElementById("placaSelect").value
  );

  const filtrados = dados.filter(item =>
    limparTexto(pegar(item, "Placa")) === placaSelecionada
  );

  if (filtrados.length === 0) return;

  // 🔥 Ordena por data mais recente
  filtrados.sort((a, b) =>
    new Date(pegar(b, "Carimbo de data/hora")) - new Date(pegar(a, "Carimbo de data/hora"))
  );

  const ultimo = filtrados[0];

  // 🔥 Preenche dados principais
  document.getElementById("motorista").textContent = pegar(ultimo, "Motorista");
  document.getElementById("km").textContent = pegar(ultimo, "Km atual");
  document.getElementById("jornada").textContent = pegar(ultimo, "Jornada");
  document.getElementById("veiculo").textContent = pegar(ultimo, "Veículo");

  // 🔥 Histórico
  const historico = document.getElementById("historico");

  historico.innerHTML = filtrados.slice(0, 10).map(item => `
    <li>
      ${pegar(item, "Data")} - ${pegar(item, "Motorista")} - KM: ${pegar(item, "Km atual")}
    </li>
  `).join("");
}

// 🔥 Ativa o select
document.getElementById("placaSelect").addEventListener("change", selecionarPlaca);
