(function () {
  "use strict";

  var LEGS = [
    ["08/11", "Haneda Airport", "Henn na Hotel Haneda", "Shuttle do hotel", "Hotel", 0, "no", "Confirmar o último shuttle após o pouso às 23h55"],
    ["09/11", "Henn na Hotel", "Estação Otorii", "Caminhada", "—", 0, "no", "Cerca de 7 minutos"],
    ["09/11", "Otorii", "Shinagawa", "Keikyu Airport Line", "Keikyu", 330, "no", "Usar Suica/PASMO"],
    ["09/11", "Shinagawa", "Shin-Osaka", "Shinkansen Hikari", "JR", 14520, "yes", "Reservar assento; Nozomi exige adicional no JR Pass nacional"],
    ["09/11", "Shin-Osaka", "Comfort Hotel", "Caminhada", "—", 0, "no", "Cerca de 5 a 8 minutos"],
    ["09/11", "Shin-Osaka", "Namba", "Midosuji Line", "Osaka Metro", 290, "no", "Dotonbori à noite"],
    ["09/11", "Namba", "Shin-Osaka", "Midosuji Line", "Osaka Metro", 290, "no", "Retorno ao hotel"],

    ["10/11", "Shin-Osaka", "Nippombashi", "Midosuji + Sennichimae", "Osaka Metro", 290, "no", "Kuromon"],
    ["10/11", "Kuromon", "Denden Town", "Caminhada", "—", 0, "no", "Trecho curto"],
    ["10/11", "Denden Town", "Shinsekai", "Caminhada", "—", 0, "no", "Trecho curto"],
    ["10/11", "Ebisucho", "Tanimachi 4-chome", "Sakaisuji + Chuo", "Osaka Metro", 240, "no", "Castelo de Osaka"],
    ["10/11", "Morinomiya", "Osaka", "Osaka Loop Line", "JR", 190, "yes", "Umeda"],
    ["10/11", "Osaka", "Shin-Osaka", "JR Kyoto Line", "JR", 180, "yes", "Retorno ao hotel"],

    ["11/11", "Shin-Osaka", "Kyoto", "JR Special Rapid", "JR", 580, "yes", "Evitar Shinkansen neste trecho"],
    ["11/11", "Kyoto", "Inari", "JR Nara Line", "JR", 150, "yes", "Fushimi Inari"],
    ["11/11", "Inari", "Kyoto", "JR Nara Line", "JR", 150, "yes", "Conexão"],
    ["11/11", "Kyoto", "Saga-Arashiyama", "JR Sagano Line", "JR", 240, "yes", "Arashiyama"],
    ["11/11", "Saga-Arashiyama", "Kyoto", "JR Sagano Line", "JR", 240, "yes", "Retorno"],
    ["11/11", "Kyoto", "Shin-Osaka", "JR Special Rapid", "JR", 580, "yes", "Retorno ao hotel"],

    ["12/11", "Shin-Osaka", "Kyoto", "JR Special Rapid", "JR", 580, "yes", "Gion e Nishiki"],
    ["12/11", "Kyoto Station", "Gion-Shijo", "Ônibus ou metrô + Keihan", "Kyoto/Keihan", 460, "no", "Estimativa com uma conexão"],
    ["12/11", "Gion", "Nishiki Market", "Caminhada", "—", 0, "no", "Cerca de 15 a 20 minutos"],
    ["12/11", "Karasuma", "Kyoto Station", "Karasuma Line", "Kyoto Subway", 220, "no", "Conexão de retorno"],
    ["12/11", "Kyoto", "Shin-Osaka", "JR Special Rapid", "JR", 580, "yes", "Retorno ao hotel"],

    ["13/11", "Shin-Osaka", "JR Nara", "JR Kyoto/Nara Line", "JR", 950, "yes", "Pode exigir conexão em Osaka ou Kyoto"],
    ["13/11", "JR Nara", "Nara Park", "Ônibus urbano", "Nara Kotsu", 250, "no", "Também é possível caminhar"],
    ["13/11", "Nara Park", "JR Nara", "Ônibus urbano", "Nara Kotsu", 250, "no", "Retorno à estação"],
    ["13/11", "JR Nara", "Uji", "JR Nara Line", "JR", 510, "yes", "Byodoin"],
    ["13/11", "Uji", "Shin-Osaka", "JR Nara/Kyoto Line", "JR", 990, "yes", "Conexão em Kyoto"],

    ["14/11", "Shin-Osaka", "Himeji", "Sanyo Shinkansen", "JR", 3280, "yes", "Reservar assento se não usar passe regional"],
    ["14/11", "Himeji", "Castelo de Himeji", "Ônibus urbano", "Shinki Bus", 210, "no", "Também é possível caminhar"],
    ["14/11", "Castelo de Himeji", "Himeji", "Ônibus urbano", "Shinki Bus", 210, "no", "Retorno à estação"],
    ["14/11", "Himeji", "Sannomiya", "JR Special Rapid", "JR", 990, "yes", "Kobe"],
    ["14/11", "Kobe", "Shin-Osaka", "JR Special Rapid", "JR", 460, "yes", "Retorno ao hotel"],

    ["15/11", "Dia livre em Osaka", "Deslocamentos não definidos", "Reserva para transporte local", "Osaka Metro/JR", 820, "partial", "Estimativa conservadora de um passe diário"],

    ["16/11", "Shin-Osaka", "Hiroshima", "Sanyo Shinkansen", "JR", 10640, "yes", "Coberto pelo Kansai-Hiroshima Area Pass"],
    ["16/11", "Hiroshima Station", "Peace Memorial Park", "Hiroshima Electric Railway", "Hiroden", 240, "no", "Bonde"],
    ["16/11", "Peace Park", "Okonomimura", "Bonde", "Hiroden", 240, "no", "Ou caminhada"],
    ["16/11", "Okonomimura", "Hiroshima Station", "Bonde", "Hiroden", 240, "no", "Retorno"],
    ["16/11", "Hiroshima", "Shin-Osaka", "Sanyo Shinkansen", "JR", 10640, "yes", "Coberto pelo Kansai-Hiroshima Area Pass"],

    ["17/11", "Shin-Osaka", "Odawara", "Shinkansen Hikari", "JR", 12300, "yes", "Tokaido Shinkansen; não coberto pelo passe regional"],
    ["17/11", "Odawara", "Hakone-Yumoto", "Hakone Tozan Railway", "Odakyu Hakone", 360, "no", "Fora do JR Pass"],
    ["17/11", "Hakone-Yumoto", "Chokoku-no-Mori", "Hakone Tozan Railway", "Odakyu Hakone", 460, "no", "Museu ao Ar Livre"],
    ["17/11", "Chokoku-no-Mori", "Gora", "Hakone Tozan Railway", "Odakyu Hakone", 160, "no", "Trecho curto"],
    ["17/11", "Gora", "Gora Kadan", "Shuttle do ryokan", "Gora Kadan", 0, "no", "Solicitar ao chegar"],

    ["18/11", "Gora Kadan", "Gora", "Shuttle do ryokan", "Gora Kadan", 0, "no", "Após o check-out"],
    ["18/11", "Gora", "Sounzan", "Cable Car", "Odakyu Hakone", 430, "no", "Circuito de Hakone"],
    ["18/11", "Sounzan", "Owakudani", "Hakone Ropeway", "Odakyu Hakone", 1250, "no", "Tarifa estimada por trecho"],
    ["18/11", "Owakudani", "Togendai", "Hakone Ropeway", "Odakyu Hakone", 1500, "no", "Lago Ashi"],
    ["18/11", "Togendai", "Hakone-Yumoto", "Hakone Tozan Bus", "Odakyu Hakone", 1600, "no", "Rota-base sem Gotemba"],
    ["18/11", "Hakone-Yumoto", "Odawara", "Hakone Tozan Railway", "Odakyu Hakone", 360, "no", "Conexão"],
    ["18/11", "Odawara", "Tokyo", "Shinkansen Kodama/Hikari", "JR", 3810, "yes", "Reservar assento"],
    ["18/11", "Tokyo", "Tawaramachi", "Metro Marunouchi + Ginza", "Tokyo Metro", 210, "no", "Hotel Sunroute Asakusa"],

    ["19/11", "Tawaramachi", "Otemachi", "Ginza + Marunouchi Line", "Tokyo Metro", 210, "no", "Palácio Imperial"],
    ["19/11", "Nihombashi", "Tawaramachi", "Ginza Line", "Tokyo Metro", 180, "no", "Retorno ao hotel"],
    ["20/11", "Tawaramachi", "Shimbashi", "Ginza Line", "Tokyo Metro", 210, "no", "teamLab"],
    ["20/11", "Shimbashi", "Shin-Toyosu", "Yurikamome", "Yurikamome", 390, "no", "teamLab Planets"],
    ["20/11", "Toyosu", "Tsukiji", "Ônibus ou metrô", "Toei/Metro", 210, "no", "Estimativa"],
    ["20/11", "Shimbashi", "Tawaramachi", "Ginza Line", "Tokyo Metro", 210, "no", "Retorno"],
    ["21/11", "Tawaramachi", "Omotesando", "Ginza Line", "Tokyo Metro", 260, "no", "Harajuku e Shibuya"],
    ["21/11", "Shibuya", "Tawaramachi", "Ginza Line", "Tokyo Metro", 260, "no", "Retorno direto"],
    ["22/11", "Tawaramachi", "Asakusa", "Ginza Line", "Tokyo Metro", 180, "no", "Senso-ji"],
    ["22/11", "Asakusa", "Ueno", "Ginza Line", "Tokyo Metro", 180, "no", "Ueno"],
    ["22/11", "Ueno", "Akihabara", "JR Yamanote/Keihin-Tohoku", "JR", 150, "yes", "Após Kanda Myojin"],
    ["22/11", "Akihabara", "Tawaramachi", "JR + Ginza Line", "JR/Metro", 330, "partial", "Conexão em Ueno"],
    ["23/11", "Tawaramachi", "Shinjuku-gyoemmae", "Ginza + Marunouchi Line", "Tokyo Metro", 260, "no", "Shinjuku"],
    ["23/11", "Shinjuku-sanchome", "Tawaramachi", "Marunouchi + Ginza Line", "Tokyo Metro", 260, "no", "Retorno"],
    ["24/11", "Tawaramachi", "Tokyo Station", "Ginza + Marunouchi Line", "Tokyo Metro", 210, "no", "Saída Yaesu"],
    ["24/11", "Tokyo Station", "Kisarazu Outlet", "Ônibus rodoviário", "Keisei/Kominato", 1400, "no", "Tarifa estimada; confirmar próximo da viagem"],
    ["24/11", "Kisarazu Outlet", "Tokyo Station", "Ônibus rodoviário", "Keisei/Kominato", 1400, "no", "Retorno"],
    ["24/11", "Tokyo Station", "Tawaramachi", "Tokyo Metro", "Tokyo Metro", 210, "no", "Retorno ao hotel"],
    ["25/11", "Tawaramachi", "Ueno", "Ginza Line", "Tokyo Metro", 180, "no", "DisneySea"],
    ["25/11", "Ueno", "Tokyo", "JR", "JR", 180, "yes", "Conexão"],
    ["25/11", "Tokyo", "Maihama", "JR Keiyo Line", "JR", 230, "yes", "Disney Resort"],
    ["25/11", "Maihama", "DisneySea", "Disney Resort Line", "Maihama Resort Line", 300, "no", "Monotrilho"],
    ["25/11", "DisneySea", "Maihama", "Disney Resort Line", "Maihama Resort Line", 300, "no", "Retorno"],
    ["25/11", "Maihama", "Tokyo", "JR Keiyo Line", "JR", 230, "yes", "Retorno"],
    ["25/11", "Tokyo", "Ueno", "JR", "JR", 180, "yes", "Conexão"],
    ["25/11", "Ueno", "Tawaramachi", "Ginza Line", "Tokyo Metro", 180, "no", "Hotel"],
    ["26/11", "Tawaramachi", "Shibuya", "Ginza Line", "Tokyo Metro", 260, "no", "Nakameguro/Daikanyama"],
    ["26/11", "Shibuya", "Nakameguro", "Tokyu Toyoko Line", "Tokyu", 140, "no", "Trecho curto"],
    ["26/11", "Ebisu", "Ueno", "JR Yamanote Line", "JR", 210, "yes", "Retorno"],
    ["26/11", "Ueno", "Tawaramachi", "Ginza Line", "Tokyo Metro", 180, "no", "Hotel"],
    ["27/11", "Tawaramachi", "Ueno", "Ginza Line", "Tokyo Metro", 180, "no", "Com malas"],
    ["27/11", "Keisei Ueno", "Narita Airport", "Keisei Skyliner", "Keisei", 2580, "no", "Assento reservado"],
  ];

  var GOTEMBA = [
    ["18/11", "Togendai", "Gotemba Premium Outlets", "Ônibus via Sengoku/Gotemba", "Hakone Tozan/Odakyu", 1500, "no", "Alternativa ao retorno por Hakone-Yumoto"],
    ["18/11", "Gotemba Premium Outlets", "Tokyo", "Ônibus rodoviário direto", "JR Bus/operadora parceira", 2000, "no", "Confirmar horário e reservar quando abrir"],
  ];

  function yen(n) {
    return "¥" + Math.round(n).toLocaleString("pt-BR");
  }
  function esc(x) {
    return String(x == null ? "" : x)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function total(list) {
    return list.reduce(function (sum, x) { return sum + x[5]; }, 0);
  }
  function jrTotal(list) {
    return list.reduce(function (sum, x) { return sum + (x[6] === "yes" ? x[5] : 0); }, 0);
  }
  function row(x) {
    var badge = x[6] === "yes" ? "Coberto" : x[6] === "partial" ? "Parcial" : "Não coberto";
    return '<tr><td data-label="Data">' + esc(x[0]) + '</td><td data-label="Trecho"><b>' + esc(x[1]) + '</b><span>→ ' + esc(x[2]) + '</span></td><td data-label="Transporte">' + esc(x[3]) + '<span>' + esc(x[4]) + '</span></td><td data-label="Custo"><b>' + yen(x[5]) + '</b><span data-transport-brl data-yen="' + x[5] + '"></span></td><td data-label="JR Pass"><span class="jr-badge jr-' + x[6] + '">' + badge + '</span></td><td data-label="Observação">' + esc(x[7]) + '</td></tr>';
  }
  function render() {
    var host = document.getElementById("transport-view");
    if (!host) return;
    var baseTotal = total(LEGS);
    var eligible = jrTotal(LEGS);
    host.innerHTML =
      '<div class="transport-shell"><div class="transport-hero"><div><div class="today-eyebrow">Planejamento financeiro</div><h2>Transportes e JR Pass</h2><p>Todos os embarques previstos no roteiro atual, incluindo metrô, trem, Shinkansen, ônibus, monotrilho e shuttles.</p></div><button type="button" data-close-transport>Voltar ao calendário</button></div>' +
      '<div class="transport-controls"><label>Pessoas <input id="transport-people" type="number" min="1" max="12" value="4"></label><label>¥ por R$ 1 <input id="transport-rate" type="number" min="1" step="0.1" value="29"></label><label class="transport-check"><input id="transport-gotemba" type="checkbox"> Simular Gotemba em 18/11</label></div>' +
      '<div class="transport-summary"><div><span>Bilhetes avulsos por pessoa</span><b data-single>' + yen(baseTotal) + '</b><small data-single-brl></small></div><div><span>Grupo completo</span><b data-group></b><small data-group-brl></small></div><div><span>Trechos integralmente JR</span><b>' + yen(eligible) + '</b><small>O restante não seria pago pelo JR Pass nacional</small></div></div>' +
      '<div class="pass-grid"><article><span class="pass-status pass-no">Não recomendado</span><h3>JR Pass nacional</h3><p>7 dias: <b>¥50.000</b><br>14 dias: <b>¥80.000</b><br>21 dias: <b>¥100.000</b></p><small>Mesmo concentrando as viagens caras, a economia estimada não supera o preço do passe.</small></article><article><span class="pass-status pass-yes">Melhor candidato</span><h3>Kansai-Hiroshima Area Pass</h3><p>5 dias consecutivos: <b>¥17.000</b></p><small>Simular ativação entre 12 e 16/11. Cobre o Sanyo Shinkansen Shin-Osaka ↔ Hiroshima e linhas JR da região, mas não o Tokaido Shinkansen para Odawara.</small></article><article><span class="pass-status pass-maybe">Avaliar por blocos</span><h3>Tokyo Subway Ticket</h3><p>24h ¥1.000 · 48h ¥1.500 · 72h ¥2.000</p><small>Vale apenas em dias consecutivos com bastante Tokyo Metro/Toei. Não cobre JR, Yurikamome, Tokyu ou ônibus rodoviários.</small></article></div>' +
      '<div class="transport-note"><b>Importante:</b> valores são estimativas por adulto, com tarifas consultadas em agosto de 2026. A tabela é exaustiva para o roteiro atualmente publicado, mas o dia livre de 15/11 permanece como provisão porque os destinos ainda não foram escolhidos.</div>' +
      '<div class="transport-table-wrap"><table class="transport-table"><thead><tr><th>Data</th><th>Trecho</th><th>Transporte</th><th>Custo</th><th>JR Pass</th><th>Observação</th></tr></thead><tbody>' + LEGS.map(row).join("") + '</tbody></table></div>' +
      '<section class="gotemba-scenario" hidden><h3>Cenário alternativo: Gotemba em 18/11</h3><p>Substitui Togendai → Hakone-Yumoto → Odawara → Tokyo. Também permite retirar o outlet de Kisarazu de 24/11, mas essa segunda alteração ainda não está aplicada.</p><table class="transport-table"><tbody>' + GOTEMBA.map(row).join("") + '</tbody></table></section>' +
      '<div class="transport-sources"><h3>Fontes e premissas</h3><a target="_blank" rel="noopener" href="https://japanrailpass.net/en/purchase/price/">JR Pass nacional</a><a target="_blank" rel="noopener" href="https://www.westjr.co.jp/travel-information/en/tickets-passes/jrwest-rail-pass/kansai_hiroshima/">JR West Kansai-Hiroshima Pass</a><a target="_blank" rel="noopener" href="https://www.tokyometro.jp/en/ticket/travel/index.html">Tokyo Subway Ticket</a><a target="_blank" rel="noopener" href="https://www.keisei.co.jp/keisei/tetudou/skyliner/us/traffic/skyliner_fares.php">Keisei Skyliner</a><a target="_blank" rel="noopener" href="https://www.hakonenavi.jp/international/en/transportation/hakone-tozanbus">Transportes de Hakone</a></div></div>';

    function update() {
      var people = Math.max(1, Number(document.getElementById("transport-people").value) || 1);
      var rate = Math.max(1, Number(document.getElementById("transport-rate").value) || 29);
      var gotemba = document.getElementById("transport-gotemba").checked;
      var adjusted = baseTotal;
      if (gotemba) adjusted = baseTotal - (1600 + 360 + 3810) + total(GOTEMBA);
      host.querySelector("[data-single]").textContent = yen(adjusted);
      host.querySelector("[data-group]").textContent = yen(adjusted * people);
      host.querySelector("[data-single-brl]").textContent = "≈ R$ " + Math.round(adjusted / rate).toLocaleString("pt-BR");
      host.querySelector("[data-group-brl]").textContent = "≈ R$ " + Math.round(adjusted * people / rate).toLocaleString("pt-BR");
      host.querySelectorAll("[data-transport-brl]").forEach(function (el) {
        var value = Number(el.getAttribute("data-yen")) || 0;
        el.textContent = value ? "≈ R$ " + (value / rate).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "R$ 0,00";
      });
      host.querySelector(".gotemba-scenario").hidden = !gotemba;
    }
    host.querySelectorAll("input").forEach(function (input) { input.addEventListener("input", update); input.addEventListener("change", update); });
    host.querySelector("[data-close-transport]").addEventListener("click", function () { window.plannerShowTransport(false); });
    update();
  }

  window.plannerShowTransport = function (show) {
    document.body.classList.toggle("transport-open", show !== false);
    if (show !== false) render();
    window.scrollTo(0, 0);
  };
  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("open-transport-view");
    if (button) button.addEventListener("click", function () { window.plannerShowTransport(true); });
  });
})();
