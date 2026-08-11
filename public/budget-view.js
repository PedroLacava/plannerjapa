(function () {
  "use strict";

  function yen(n) { return "¥" + Math.round(n).toLocaleString("pt-BR"); }
  function brl(n, rate) { return "R$ " + (n / rate).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function esc(x) { return String(x == null ? "" : x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
  function dateKey(d) { var p = d.split("/"); return Number(p[1]) * 100 + Number(p[0]); }

  function render() {
    var host = document.getElementById("budget-view");
    var transport = window.JaplannerTransportData;
    var activityData = window.JaplannerActivitiesData;
    if (!host || !transport || !activityData) return;

    host.innerHTML = '<div class="transport-shell activity-shell"><div class="transport-hero"><div><div class="today-eyebrow">Orçamento completo</div><h2>Transportes e passeios</h2><p>Todos os deslocamentos e atrações do roteiro, organizados por dia em uma única tabela.</p></div><button type="button" data-close-budget>Voltar ao calendário</button></div>' +
      '<div class="transport-controls"><label>Pessoas <input id="budget-people" type="number" min="1" max="12" value="4"></label><label>¥ por R$ 1 <input id="budget-rate" type="number" min="1" step="0.1" value="29"></label><label class="transport-check"><input id="budget-gotemba" type="checkbox"> Simular Gotemba em 18/11</label><label>Mostrar <select id="budget-filter"><option value="all">Tudo</option><option value="transport">Só transportes</option><option value="activity">Só passeios</option></select></label></div>' +
      '<div class="transport-summary"><div><span>Total por pessoa</span><b data-budget-single></b><small data-budget-single-brl></small></div><div><span>Grupo completo</span><b data-budget-group></b><small data-budget-group-brl></small></div><div><span>Composição por pessoa</span><b data-budget-split></b><small>Hospedagem, alimentação e compras não incluídas</small></div></div>' +
      '<div class="pass-grid"><article><span class="pass-status pass-no">Não recomendado</span><h3>JR Pass nacional</h3><p>7 dias: <b>¥50.000</b><br>14 dias: <b>¥80.000</b><br>21 dias: <b>¥100.000</b></p><small>Os trechos JR previstos continuam abaixo do custo dos passes nacionais.</small></article><article><span class="pass-status pass-yes">Melhor candidato</span><h3>Kansai-Hiroshima Area Pass</h3><p>5 dias: <b>¥17.000</b></p><small>Melhor janela para simulação: 12 a 16/11.</small></article><article><span class="pass-status pass-maybe">Valores provisórios</span><h3>Ingressos variáveis</h3><p>DisneySea, teamLab e cerimônia do chá</p><small>Reconfirmar quando as vendas para novembro abrirem.</small></article></div>' +
      '<div class="transport-note"><b>Leitura da tabela:</b> os valores são por adulto. Passeios gratuitos aparecem como ¥0 e R$ 0,00. A conversão de todas as linhas acompanha o câmbio definido acima.</div>' +
      '<div class="transport-table-wrap"><table class="transport-table activity-table budget-table"><thead><tr><th>Data</th><th>Tipo</th><th>Item</th><th>Valor</th><th>Reserva ou passe</th><th>Observação</th></tr></thead><tbody data-budget-body></tbody></table></div>' +
      '<div class="transport-sources"><h3>Fontes oficiais de transportes e passes</h3><a target="_blank" rel="noopener" href="https://japanrailpass.net/en/purchase/price/">JR Pass nacional</a><a target="_blank" rel="noopener" href="https://www.westjr.co.jp/travel-information/en/tickets-passes/jrwest-rail-pass/kansai_hiroshima/">JR West Kansai-Hiroshima Pass</a><a target="_blank" rel="noopener" href="https://www.tokyometro.jp/en/ticket/travel/index.html">Tokyo Metro</a><a target="_blank" rel="noopener" href="https://www.keisei.co.jp/keisei/tetudou/skyliner/us/traffic/skyliner_fares.php">Keisei Skyliner</a><a target="_blank" rel="noopener" href="https://www.hakonenavi.jp/international/en/transportation/">Transportes de Hakone</a></div></div>';

    function buildRows(gotemba) {
      var legs = transport.legs.slice();
      if (gotemba) {
        legs = legs.filter(function (x) {
          return !(x[0] === "18/11" && ((x[1] === "Togendai" && x[2] === "Hakone-Yumoto") || x[1] === "Hakone-Yumoto" || x[1] === "Odawara"));
        }).concat(transport.gotemba);
      }
      var rows = legs.map(function (x) {
        return { date:x[0], type:"transport", title:x[1] + " → " + x[2], subtitle:x[3] + (x[4] !== "—" ? " · " + x[4] : ""), cost:x[5], action:x[6] === "yes" ? "Coberto pelo JR" : x[6] === "partial" ? "Cobertura parcial" : "Fora do JR Pass", note:x[7] };
      });
      activityData.activities.forEach(function (a) {
        rows.push({ date:a[0], type:"activity", title:a[1], subtitle:a[2], cost:a[3], action:a[6] === "yes" ? "Reservar" : "Não obrigatória", note:a[5], source:a[7], optional:a[4] === "Opcional", pending:a[4] === "Pendente" });
      });
      return rows.sort(function (a,b) { return dateKey(a.date) - dateKey(b.date) || (a.type === b.type ? 0 : a.type === "transport" ? -1 : 1); });
    }

    function update() {
      var people = Math.max(1, Number(document.getElementById("budget-people").value) || 1);
      var rate = Math.max(1, Number(document.getElementById("budget-rate").value) || 29);
      var gotemba = document.getElementById("budget-gotemba").checked;
      var filter = document.getElementById("budget-filter").value;
      var allRows = buildRows(gotemba);
      var visible = allRows.filter(function (r) { return filter === "all" || r.type === filter; });
      var transportTotal = allRows.filter(function(r){ return r.type === "transport"; }).reduce(function(s,r){ return s+r.cost; },0);
      var activityTotal = allRows.filter(function(r){ return r.type === "activity" && !r.optional && !r.pending; }).reduce(function(s,r){ return s+r.cost; },0);
      var total = transportTotal + activityTotal;
      host.querySelector("[data-budget-single]").textContent = yen(total);
      host.querySelector("[data-budget-single-brl]").textContent = "≈ " + brl(total, rate);
      host.querySelector("[data-budget-group]").textContent = yen(total * people);
      host.querySelector("[data-budget-group-brl]").textContent = "≈ " + brl(total * people, rate);
      host.querySelector("[data-budget-split]").textContent = yen(transportTotal) + " + " + yen(activityTotal);
      host.querySelector("[data-budget-split]").nextElementSibling.textContent = "Transportes " + brl(transportTotal,rate) + " · Passeios " + brl(activityTotal,rate);
      host.querySelector("[data-budget-body]").innerHTML = visible.map(function (r) {
        var type = r.type === "transport" ? "Transporte" : "Passeio";
        var source = r.source ? '<a class="budget-source" href="' + esc(r.source) + '" target="_blank" rel="noopener">Fonte oficial</a>' : '';
        return '<tr class="budget-' + r.type + '"><td data-label="Data">' + esc(r.date) + '</td><td data-label="Tipo"><span class="budget-type">' + type + '</span></td><td data-label="Item"><b>' + esc(r.title) + '</b><span>' + esc(r.subtitle) + '</span></td><td data-label="Valor"><b>' + yen(r.cost) + '</b><span>' + brl(r.cost,rate) + '</span></td><td data-label="Reserva ou passe">' + esc(r.action) + '</td><td data-label="Observação">' + esc(r.note) + source + '</td></tr>';
      }).join("");
    }
    host.querySelectorAll("input,select").forEach(function(el){ el.addEventListener("input",update); el.addEventListener("change",update); });
    host.querySelector("[data-close-budget]").addEventListener("click",function(){ window.plannerShowBudget(false); });
    update();
  }

  window.plannerShowBudget = function (show) {
    document.body.classList.toggle("budget-open", show !== false);
    if (show !== false) render();
    window.scrollTo(0,0);
  };
  document.addEventListener("DOMContentLoaded",function(){
    var button=document.getElementById("open-budget-view");
    if(button) button.addEventListener("click",function(){ window.plannerShowBudget(true); });
  });
})();
