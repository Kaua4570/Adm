<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Painel ADM</title>
<style>
body {
  background:#111;
  color:#fff;
  font-family:Arial;
  padding:20px;
}
select {
  width:100%;
  padding:15px;
  font-size:16px;
  margin-bottom:20px;
  background:#222;
  color:#fff;
  border:1px solid #555;
  border-radius:10px;
}
.box {
  background:#1c1c1c;
  padding:15px;
  border-radius:15px;
  margin-top:10px;
}
</style>
</head>
<body>

<h1>Painel ADM</h1>

<select id="placas">
  <option>Carregando placas...</option>
</select>

<div class="box">
<p>Último motorista: <span id="motorista">-</span></p>
<p>KM atual: <span id="km">-</span></p>
<p>Jornada: <span id="jornada">-</span></p>
</div>

<div class="box">
<p>Histórico:</p>
<ul id="historico"></ul>
</div>

<script>

const URL = "https://opensheet.elk.sh/1Li9vCzsQploeT-CaCgKTx_Q3Kk5pj2v8MH6H94ZmmNw/1";

fetch(URL)
.then(res => res.json())
.then(dados => {

  const select = document.getElementById("placas");

  // pega placas únicas
  const placas = [...new Set(dados.map(l => l.placa).filter(Boolean))];

  select.innerHTML = '<option>Selecione a placa</option>';

  placas.forEach(p => {
    let opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });

  select.onchange = () => {
    const placa = select.value;

    const registros = dados.filter(l => l.placa === placa);

    if (registros.length === 0) return;

    const ultimo = registros[registros.length - 1];

    document.getElementById("motorista").textContent = ultimo.motorista || "-";
    document.getElementById("km").textContent = ultimo.km || "-";
    document.getElementById("jornada").textContent = ultimo.jornada || "-";

    const lista = document.getElementById("historico");
    lista.innerHTML = "";

    registros.reverse().forEach(r => {
      const li = document.createElement("li");
      li.textContent = `${r.data || ""} - ${r.motorista || ""} - ${r.km || ""}`;
      lista.appendChild(li);
    });
  };

})
.catch(err => {
  alert("Erro ao conectar com a planilha");
  console.error(err);
});

</script>

</body>
</html>
