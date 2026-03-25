const url = "https://opensheet.elk.sh/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/Respostas ao formulário 1";

let dados = [];

// 🔥 Busca os dados
fetch(url)
  .then(res => res.json())
  .then(res => {
    dados = res;
    carregarPlacas();
  });

// 🔥 Corrige nome das colunas (ignora espaço, maiúscula etc)
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

// 🔥 Seleciona placa
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

  // 🔥 Preenche dados
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
