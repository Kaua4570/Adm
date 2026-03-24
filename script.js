const url = "https://opensheet.elk.sh/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/1";

let dados = [];

async function carregarDados() {
    try {
        const resposta = await fetch(url);
        dados = await resposta.json();

        carregarPlacas();
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

function carregarPlacas() {
    const select = document.getElementById("placa");

    const placas = [...new Set(dados.map(item => item["Placa"]))];

    select.innerHTML = `<option value="">Selecione a placa</option>`;

    placas.forEach(placa => {
        const option = document.createElement("option");
        option.value = placa;
        option.textContent = placa;
        select.appendChild(option);
    });
}

function atualizarDados() {
    const placaSelecionada = document.getElementById("placa").value;

    const filtrados = dados.filter(d => d["Placa"] === placaSelecionada);

    if (filtrados.length === 0) return;

    // ordenar por data mais recente
    filtrados.sort((a, b) => new Date(b["Carimbo de data/hora"]) - new Date(a["Carimbo de data/hora"]));

    const ultimo = filtrados[0];

    document.getElementById("motorista").textContent = ultimo["Motorista"];
    document.getElementById("km").textContent = ultimo["Km atual"];
    document.getElementById("jornada").textContent = ultimo["Jornada"];
    document.getElementById("veiculo").textContent = ultimo["Veículo"];

    // histórico
    const lista = document.getElementById("historico");
    lista.innerHTML = "";

    filtrados.slice(0, 10).forEach(item => {
        const li = document.createElement("li");

        li.textContent = `${item["Data"]} - ${item["Motorista"]} - ${item["Veículo"]} - KM: ${item["Km atual"]}`;

        lista.appendChild(li);
    });
}

carregarDados();
