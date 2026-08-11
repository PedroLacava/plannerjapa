(function () {
  "use strict";

  var ACTIVITIES = [
    ["09/11", "Dotonbori", "Osaka", 0, "Livre", "Sem ingresso", "no", "https://osaka-info.jp/en/spot/dotonbori/"],
    ["10/11", "Mercado Kuromon", "Osaka", 0, "Livre", "Compras e alimentação à parte", "no", "https://osaka-info.jp/en/spot/kuromon-market/"],
    ["10/11", "Denden Town", "Osaka", 0, "Livre", "Compras à parte", "no", "https://osaka-info.jp/en/spot/nipponbashi-denden-town/"],
    ["10/11", "Shinsekai", "Osaka", 0, "Livre", "Tsutenkaku não incluída", "no", "https://osaka-info.jp/en/spot/shinsekai/"],
    ["10/11", "Museu do Castelo de Osaka", "Osaka", 1200, "Planejado", "Parque externo é gratuito", "yes", "https://www.osakacastle.net/"],
    ["10/11", "Umeda", "Osaka", 0, "Livre", "Bairro e mirantes gratuitos; observatório não incluído", "no", "https://osaka-info.jp/en/areas/umeda/"],
    ["11/11", "Fushimi Inari Taisha", "Kyoto", 0, "Livre", "Templo e trilha gratuitos", "no", "https://inari.jp/en/"],
    ["11/11", "Arashiyama e Bamboo Grove", "Kyoto", 0, "Livre", "Templos pagos não incluídos", "no", "https://kyoto.travel/en/areas/arashiyama.html"],
    ["12/11", "Gion", "Kyoto", 0, "Livre", "Caminhada pelo bairro", "no", "https://kyoto.travel/en/areas/gion-higashiyama.html"],
    ["12/11", "Cerimônia do chá", "Kyoto", 3500, "Estimativa", "Fornecedor ainda não definido", "yes", "https://kyoto.travel/en/see-and-do/tea-ceremony.html"],
    ["12/11", "Mercado Nishiki", "Kyoto", 0, "Livre", "Comidas e compras à parte", "no", "https://kyoto.travel/en/other-attractions/376.html"],
    ["13/11", "Parque de Nara", "Nara", 0, "Livre", "Biscoitos para os cervos à parte", "no", "https://www3.pref.nara.jp/park/"],
    ["13/11", "Tōdai-ji, Grande Salão do Buda", "Nara", 800, "Planejado", "Museu separado não incluído", "no", "https://www.todaiji.or.jp/en/information/haikan/"],
    ["13/11", "Byodoin", "Uji", 700, "Planejado", "Jardim e Museu Hoshokan", "no", "https://www.byodoin.or.jp/en/guide/"],
    ["14/11", "Castelo de Himeji", "Himeji", 2500, "Planejado", "Tarifa para visitante adulto desde março de 2026", "no", "https://www.himejicastle.jp/en/"],
    ["14/11", "Kobe", "Kobe", 0, "Livre", "Passeio urbano; atrações pagas não definidas", "no", "https://www.feel-kobe.jp/en/"],
    ["15/11", "Dia livre", "Osaka", 0, "Pendente", "Nenhum passeio escolhido ainda", "no", ""],
    ["16/11", "Cúpula e Parque Memorial da Paz", "Hiroshima", 0, "Livre", "Área externa gratuita", "no", "https://dive-hiroshima.com/en/explore/2542/"],
    ["16/11", "Museu Memorial da Paz", "Hiroshima", 200, "Planejado", "Compra antecipada recomendada", "yes", "https://hpmmuseum.jp/?lang=eng"],
    ["17/11", "Museu ao Ar Livre de Hakone", "Hakone", 1800, "Planejado", "Preço do ingresso online", "yes", "https://www.hakone-oam.or.jp/en/info/"],
    ["18/11", "Owakudani", "Hakone", 0, "Livre", "Ropeway contabilizado em Transportes", "no", "https://www.hakonenavi.jp/international/en/spot/304"],
    ["18/11", "Lago Ashi", "Hakone", 0, "Livre", "Passeio de barco não incluído", "no", "https://www.hakonenavi.jp/international/en/spot/306"],
    ["19/11", "Palácio Imperial e Jardins Leste", "Tóquio", 0, "Livre", "Sujeito aos dias de fechamento", "no", "https://sankan.kunaicho.go.jp/english/guide/koukyo.html"],
    ["19/11", "Marunouchi e Tokyo Station", "Tóquio", 0, "Livre", "Compras e alimentação à parte", "no", "https://www.gotokyo.org/en/destinations/central-tokyo/tokyo-station-and-marunouchi/index.html"],
    ["19/11", "Ginza e Gentle Monster", "Tóquio", 0, "Livre", "Compras à parte", "no", "https://www.gentlemonster.com/jp/en/stores/tokyo-ginza"],
    ["19/11", "Nihonbashi", "Tóquio", 0, "Livre", "Pokémon Center e lojas sem ingresso", "no", "https://www.gotokyo.org/en/destinations/central-tokyo/nihombashi/index.html"],
    ["20/11", "teamLab Planets", "Tóquio", 5800, "Provisório", "Preço de novembro ainda não liberado; referência de outubro de 2026", "yes", "https://teamlabplanets.dmm.com/en"],
    ["20/11", "Mercado Externo de Tsukiji", "Tóquio", 0, "Livre", "Comidas à parte", "no", "https://www.tsukiji.or.jp/english/"],
    ["20/11", "Jardins Hamarikyu", "Tóquio", 300, "Planejado", "Casa de chá não incluída", "no", "https://www.tokyo-park.or.jp/park/hama-rikyu/"],
    ["21/11", "Meiji Jingu", "Tóquio", 0, "Livre", "Museu e jardim interno não incluídos", "no", "https://www.meijijingu.or.jp/en/"],
    ["21/11", "Harajuku e Takeshita Street", "Tóquio", 0, "Livre", "Compras à parte", "no", "https://www.gotokyo.org/en/destinations/western-tokyo/harajuku/index.html"],
    ["21/11", "Shibuya Crossing", "Tóquio", 0, "Livre", "Travessia e bairro", "no", "https://www.gotokyo.org/en/spot/78/index.html"],
    ["21/11", "Shibuya Sky", "Tóquio", 3400, "Planejado", "Preço online após 15h", "yes", "https://www.shibuya-scramble-square.com/sky/ticket/"],
    ["22/11", "Senso-ji e Asakusa", "Tóquio", 0, "Livre", "Templo e bairro gratuitos", "no", "https://www.senso-ji.jp/english/"],
    ["22/11", "Museu Nacional de Tóquio", "Tóquio", 1000, "Planejado", "Coleção permanente", "no", "https://www.tnm.jp/modules/r_free_page/index.php?id=113&lang=en"],
    ["22/11", "Kanda Myojin e Akihabara", "Tóquio", 0, "Livre", "Compras à parte", "no", "https://www.kandamyoujin.or.jp/english/"],
    ["23/11", "Shinjuku Gyoen", "Tóquio", 500, "Planejado", "Ingresso adulto", "no", "https://fng.or.jp/shinjuku/en/"],
    ["23/11", "Shinjuku, Kabukicho e Golden Gai", "Tóquio", 0, "Livre", "Consumo à parte", "no", "https://www.gotokyo.org/en/destinations/western-tokyo/shinjuku/index.html"],
    ["24/11", "Mitsui Outlet Park Kisarazu", "Kisarazu", 0, "Livre", "Compras à parte", "no", "https://mitsui-shopping-park.com/mop/kisarazu/english/"],
    ["25/11", "Tokyo DisneySea", "Tóquio", 10900, "Provisório", "Preço exato de 25/11 abre cerca de dois meses antes", "yes", "https://www.tokyodisneyresort.jp/en/ticket/index.html"],
    ["26/11", "Nakameguro, Daikanyama e Ebisu", "Tóquio", 0, "Livre", "Compras, cafés e refeições à parte", "no", "https://www.gotokyo.org/en/destinations/southern-tokyo/ebisu-daikanyama-and-meguro/index.html"],
    ["26/11", "Kyu Asakura House", "Tóquio", 100, "Opcional", "Somente se houver tempo no roteiro", "no", "https://www.city.shibuya.tokyo.jp/eng/est/asakura.html"],
  ];
  window.JaplannerActivitiesData = { activities: ACTIVITIES };

  function yen(n) { return "¥" + Math.round(n).toLocaleString("pt-BR"); }
  function esc(x) { return String(x == null ? "" : x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
  function paid(a) { return a[3] > 0 && a[4] !== "Opcional"; }
  function total() { return ACTIVITIES.reduce(function (sum, a) { return sum + (paid(a) ? a[3] : 0); }, 0); }
  function row(a) {
    var price = a[3] ? yen(a[3]) : "Grátis";
    var link = a[7] ? '<a href="' + esc(a[7]) + '" target="_blank" rel="noopener">Fonte oficial</a>' : "—";
    return '<tr><td data-label="Data">' + esc(a[0]) + '</td><td data-label="Passeio"><b>' + esc(a[1]) + '</b><span>' + esc(a[2]) + '</span></td><td data-label="Valor"><b>' + price + '</b><span data-activity-brl data-yen="' + a[3] + '"></span></td><td data-label="Status"><span class="activity-status">' + esc(a[4]) + '</span></td><td data-label="Reserva">' + (a[6] === "yes" ? "Reservar" : "Não obrigatória") + '</td><td data-label="Observação">' + esc(a[5]) + '<span>' + link + '</span></td></tr>';
  }
  function render() {
    var host = document.getElementById("activities-view");
    if (!host) return;
    var base = total();
    var paidCount = ACTIVITIES.filter(paid).length;
    var freeCount = ACTIVITIES.filter(function (a) { return a[3] === 0 && a[4] !== "Pendente"; }).length;
    host.innerHTML = '<div class="transport-shell activity-shell"><div class="transport-hero"><div><div class="today-eyebrow">Planejamento financeiro</div><h2>Passeios e ingressos</h2><p>Todos os passeios do roteiro atual, gratuitos e pagos, com valores por adulto e necessidade de reserva.</p></div><button type="button" data-close-activities>Voltar ao calendário</button></div>' +
      '<div class="transport-controls"><label>Pessoas <input id="activity-people" type="number" min="1" max="12" value="4"></label><label>¥ por R$ 1 <input id="activity-rate" type="number" min="1" step="0.1" value="29"></label></div>' +
      '<div class="transport-summary"><div><span>Ingressos por pessoa</span><b data-activity-single>' + yen(base) + '</b><small data-activity-single-brl></small></div><div><span>Grupo completo</span><b data-activity-group></b><small data-activity-group-brl></small></div><div><span>Composição do roteiro</span><b>' + paidCount + ' pagos · ' + freeCount + ' grátis</b><small>Alimentação, compras, transporte e hospedagem não incluídos</small></div></div>' +
      '<div class="transport-note"><b>Importante:</b> DisneySea e teamLab usam preços variáveis e ainda não liberaram o valor definitivo para as datas da viagem. A cerimônia do chá depende da escolha do fornecedor. Esses itens estão incluídos com estimativas conservadoras.</div>' +
      '<div class="transport-table-wrap"><table class="transport-table activity-table"><thead><tr><th>Data</th><th>Passeio</th><th>Valor</th><th>Status</th><th>Reserva</th><th>Observação</th></tr></thead><tbody>' + ACTIVITIES.map(row).join("") + '</tbody></table></div></div>';
    function update() {
      var people = Math.max(1, Number(document.getElementById("activity-people").value) || 1);
      var rate = Math.max(1, Number(document.getElementById("activity-rate").value) || 29);
      host.querySelector("[data-activity-group]").textContent = yen(base * people);
      host.querySelector("[data-activity-single-brl]").textContent = "≈ R$ " + Math.round(base / rate).toLocaleString("pt-BR");
      host.querySelector("[data-activity-group-brl]").textContent = "≈ R$ " + Math.round(base * people / rate).toLocaleString("pt-BR");
      host.querySelectorAll("[data-activity-brl]").forEach(function (el) {
        var value = Number(el.getAttribute("data-yen")) || 0;
        el.textContent = value ? "≈ R$ " + (value / rate).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "R$ 0,00";
      });
    }
    host.querySelectorAll("input").forEach(function (input) { input.addEventListener("input", update); });
    host.querySelector("[data-close-activities]").addEventListener("click", function () { window.plannerShowActivities(false); });
    update();
  }
  window.plannerShowActivities = function (show) {
    document.body.classList.toggle("activities-open", show !== false);
    if (show !== false) render();
    window.scrollTo(0, 0);
  };
  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("open-activities-view");
    if (button) button.addEventListener("click", function () { window.plannerShowActivities(true); });
  });
})();
