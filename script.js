async function carregarDados() {

  const url = "https://docs.google.com/spreadsheets/d/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/export?format=csv";

  const res = await fetch(url);
  const texto = await res.text();

  const linhas = texto.split("\n").slice(1);

  const select = document.getElementById("placaSelect");
  const historico = document.getElementById("historico");

  let dados = [];

  linhas.forEach(linha => {
    const col = linha.split(",");

    if (col.length < 5) return;

    dados.push({
      data: col[0],
      motorista: col[1],
      placa: col[2],
      tipo: col[3],
      km: parseFloat(col[4]),
      jornada: col[5]
    });
  });

  // placas únicas
  const placas = [...new Set(dados.map(d => d.placa))];

  placas.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {

    const placa = select.value;

    const filtrado = dados.filter(d => d.placa === placa);

    if (filtrado.length === 0) return;

    // último registro
    const ultimo = filtrado[filtrado.length - 1];

    document.getElementById("motorista").textContent = ultimo.motorista;
    document.getElementById("km").textContent = ultimo.km;
    document.getElementById("jornada").textContent = ultimo.jornada;
    document.getElementById("veiculo").textContent = ultimo.tipo;

    // histórico
    historico.innerHTML = "";

    filtrado.slice(-5).forEach(d => {
      const li = document.createElement("li");
      li.textContent = `${d.data} - ${d.motorista} - KM: ${d.km}`;
      historico.appendChild(li);
    });

    // gráfico
    const labels = filtrado.map(d => d.data);
    const kms = filtrado.map(d => d.km);

    const ctx = document.getElementById("graficoKm");

    if (window.grafico) {
      window.grafico.destroy();
    }

    window.grafico = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "KM",
          data: kms,
          borderWidth: 2,
          fill: false,
          tension: 0.3
        }]
      }
    });

  });

}

carregarDados();
