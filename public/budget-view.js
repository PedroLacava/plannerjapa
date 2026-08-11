(function () {
  "use strict";

  var DAYS = {
    "08/11": ["Chegada em Haneda e hotel", ["Deslocamento"]],
    "09/11": ["Mudança para Osaka + Dotonbori", ["Deslocamento", "Geral"]],
    "10/11": ["Osaka central: mercados, cultura pop e castelo", ["Geral", "Compras", "História e cultura"]],
    "11/11": ["Fushimi Inari + Arashiyama", ["História e cultura", "Natureza"]],
    "12/11": ["Gion + cerimônia do chá + Nishiki", ["História e cultura", "Alimentação"]],
    "13/11": ["Nara + Uji", ["História e cultura", "Natureza"]],
    "14/11": ["Castelo de Himeji + Kobe", ["História e cultura", "Geral"]],
    "15/11": ["Dia livre em Osaka", ["Geral"]],
    "16/11": ["Hiroshima e Memorial da Paz", ["História e cultura"]],
    "17/11": ["Museu ao Ar Livre + Gora Kadan", ["Arte", "Bem-estar", "Deslocamento"]],
    "18/11": ["Owakudani + Lago Ashi + ida a Tóquio", ["Natureza", "Deslocamento"]],
    "19/11": ["Palácio Imperial + Ginza + Nihonbashi", ["História e cultura", "Compras"]],
    "20/11": ["teamLab + Tsukiji + Hamarikyu", ["Arte", "Alimentação", "Natureza"]],
    "21/11": ["Meiji Jingu + Harajuku + Shibuya", ["História e cultura", "Compras", "Geral"]],
    "22/11": ["Asakusa + Ueno + Akihabara", ["História e cultura", "Cultura pop"]],
    "23/11": ["Shinjuku Gyoen + Shinjuku", ["Natureza", "Geral"]],
    "24/11": ["Outlet de Kisarazu", ["Compras"]],
    "25/11": ["Tokyo DisneySea", ["Entretenimento"]],
    "26/11": ["Nakameguro + Daikanyama + Ebisu", ["Compras", "Alimentação", "Geral"]],
    "27/11": ["Hotel + Aeroporto de Narita", ["Deslocamento"]],
  };
  var CATEGORY_ORDER = ["Todos", "História e cultura", "Compras", "Alimentação", "Natureza", "Arte", "Entretenimento", "Cultura pop", "Bem-estar", "Geral", "Deslocamento"];
  var FINAL_OPTIONS = {
    public: { label:"Transporte público: metrô + Skyliner", mode:"perPerson", cost:2760, note:"Mais econômico; exige levar as malas até Keisei Ueno e fazer baldeação.", source:"https://www.keisei.co.jp/keisei/tetudou/skyliner/us/traffic/skyliner_fares.php" },
    transfer: { label:"Transfer privado: minivan para o grupo", mode:"group", cost:29000, note:"Porta a porta; minivan para até 5 passageiros, pedágios e impostos incluídos.", source:"https://narita.airport-taxi.soushin-ichiba.jp/en/price?town=taito-ku" },
    uber: { label:"Uber: estimativa por veículo", mode:"group", cost:32000, note:"Preço dinâmico. Confirmar no aplicativo e pedir categoria que comporte 4 pessoas e malas.", source:"https://www.uber.com/global/en/r/airports/nrt/" },
    taxi: { label:"Táxi com tarifa fixa", mode:"group", cost:26000, note:"Tarifa-base para Taito; pedágios podem ser adicionais. Táxi comum pode não comportar 4 malas.", source:"https://www.tokyomk.jp/en/airport-rate" },
  };

  function yen(n) { return "¥" + Math.round(n).toLocaleString("pt-BR"); }
  function brl(n, rate) { return "R$ " + (n / rate).toLocaleString("pt-BR", { minimumFractionDigits:2, maximumFractionDigits:2 }); }
  function esc(x) { return String(x == null ? "" : x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;"); }
  function dateKey(d) { var p=d.split("/"); return Number(p[1])*100+Number(p[0]); }
  function tagsHtml(tags) { return tags.map(function(t){ return '<span class="budget-category">'+esc(t)+'</span>'; }).join(""); }

  function render() {
    var host=document.getElementById("budget-view"), transport=window.JaplannerTransportData, activityData=window.JaplannerActivitiesData;
    if(!host||!transport||!activityData) return;
    host.innerHTML='<div class="transport-shell activity-shell"><div class="transport-hero"><div><div class="today-eyebrow">Orçamento completo</div><h2>Transportes e passeios</h2><p>Custos agrupados por roteiro, com todos os transportes e ingressos daquele passeio.</p></div><button type="button" data-close-budget>Voltar ao calendário</button></div>'+
      '<div class="transport-controls"><label>Pessoas <input id="budget-people" type="number" min="1" max="12" value="4"></label><label>¥ por R$ 1 <input id="budget-rate" type="number" min="1" step="0.1" value="29"></label><label class="transport-check"><input id="budget-gotemba" type="checkbox"> Simular Gotemba em 18/11</label><label>Categoria <select id="budget-category">'+CATEGORY_ORDER.map(function(c){return '<option value="'+esc(c)+'">'+esc(c)+'</option>';}).join("")+'</select></label><label class="final-transfer-select">Ida a Narita em 27/11 <select id="budget-final-transfer">'+Object.keys(FINAL_OPTIONS).map(function(k){return '<option value="'+k+'">'+esc(FINAL_OPTIONS[k].label)+'</option>';}).join("")+'</select></label></div>'+
      '<div class="transport-summary"><div><span>Total por pessoa</span><b data-budget-single></b><small data-budget-single-brl></small></div><div><span>Grupo completo</span><b data-budget-group></b><small data-budget-group-brl></small></div><div><span>Composição por pessoa</span><b data-budget-split></b><small data-budget-split-brl></small></div></div>'+
      '<div class="pass-grid"><article><span class="pass-status pass-no">Não recomendado</span><h3>JR Pass nacional</h3><p>7 dias: <b>¥50.000</b><br>14 dias: <b>¥80.000</b><br>21 dias: <b>¥100.000</b></p><small>Os trechos JR previstos continuam abaixo do custo dos passes nacionais.</small></article><article><span class="pass-status pass-yes">Melhor candidato</span><h3>Kansai-Hiroshima Area Pass</h3><p>5 dias: <b>¥17.000</b></p><small>Melhor janela para simulação: 12 a 16/11.</small></article><article><span class="pass-status pass-maybe">Valores provisórios</span><h3>Ingressos variáveis</h3><p>DisneySea, teamLab e cerimônia do chá</p><small>Reconfirmar quando as vendas para novembro abrirem.</small></article></div>'+
      '<div class="transport-note"><b>Como usar:</b> cada linha representa um roteiro completo. Abra “Ver composição” para conferir, sem exceção, os trechos de transporte, ingressos gratuitos e pagos e links oficiais.</div>'+
      '<div class="transport-table-wrap"><table class="transport-table activity-table budget-table"><thead><tr><th>Data</th><th>Roteiro e categorias</th><th>Transporte</th><th>Passeios</th><th>Total</th><th>Detalhamento</th></tr></thead><tbody data-budget-body></tbody></table></div>'+
      '<div class="transport-sources"><h3>Fontes oficiais de transportes e passes</h3><a target="_blank" rel="noopener" href="https://japanrailpass.net/en/purchase/price/">JR Pass nacional</a><a target="_blank" rel="noopener" href="https://www.westjr.co.jp/travel-information/en/tickets-passes/jrwest-rail-pass/kansai_hiroshima/">JR West Kansai-Hiroshima Pass</a><a target="_blank" rel="noopener" href="https://www.tokyometro.jp/en/ticket/travel/index.html">Tokyo Metro</a><a target="_blank" rel="noopener" href="https://www.keisei.co.jp/keisei/tetudou/skyliner/us/traffic/skyliner_fares.php">Keisei Skyliner</a><a target="_blank" rel="noopener" href="https://www.hakonenavi.jp/international/en/transportation/">Transportes de Hakone</a></div></div>';

    function effectiveLegs(gotemba, finalMode, people) {
      var legs=transport.legs.slice();
      if(gotemba) legs=legs.filter(function(x){return !(x[0]==="18/11"&&((x[1]==="Togendai"&&x[2]==="Hakone-Yumoto")||x[1]==="Hakone-Yumoto"||x[1]==="Odawara"));}).concat(transport.gotemba);
      if(finalMode!=="public") {
        var option=FINAL_OPTIONS[finalMode];
        legs=legs.filter(function(x){return x[0]!=="27/11";});
        legs.push(["27/11","Hotel Sunroute Asakusa","Narita Airport",option.label,finalMode==="transfer"?"Transfer reservado":finalMode==="uber"?"Uber":"Táxi",option.cost/Math.max(1,people),"no",option.note,option.source]);
      }
      return legs;
    }
    function groups(gotemba, finalMode, people) {
      var legs=effectiveLegs(gotemba,finalMode,people), acts=activityData.activities;
      return Object.keys(DAYS).map(function(date){
        var dayLegs=legs.filter(function(x){return x[0]===date;}), dayActs=acts.filter(function(a){return a[0]===date;});
        var tc=dayLegs.reduce(function(s,x){return s+x[5];},0), ac=dayActs.reduce(function(s,a){return s+((a[4]==="Opcional"||a[4]==="Pendente")?0:a[3]);},0);
        return {date:date,title:DAYS[date][0],categories:DAYS[date][1],legs:dayLegs,activities:dayActs,transportCost:tc,activityCost:ac,total:tc+ac};
      }).sort(function(a,b){return dateKey(a.date)-dateKey(b.date);});
    }
    function details(g,rate) {
      var lines=[];
      g.legs.forEach(function(x){
        var jr=x[6]==="yes"?" · coberto pelo JR Pass":x[6]==="partial"?" · cobertura parcial":"";
        var source=x[8]?'<a href="'+esc(x[8])+'" target="_blank" rel="noopener">Fonte oficial ou referência</a>':'';
        lines.push('<li><span class="detail-kind">Transporte</span><b>'+esc(x[1])+' → '+esc(x[2])+'</b><span>'+esc(x[3])+' · '+yen(x[5])+' / '+brl(x[5],rate)+jr+'</span>'+source+'</li>');
      });
      g.activities.forEach(function(a){
        var source=a[7]?'<a href="'+esc(a[7])+'" target="_blank" rel="noopener">Fonte oficial</a>':'';
        var counted=(a[4]==="Opcional"||a[4]==="Pendente")?" · fora do total":"";
        lines.push('<li><span class="detail-kind activity">Passeio</span><b>'+esc(a[1])+'</b><span>'+(a[3]?yen(a[3])+' / '+brl(a[3],rate):'Grátis')+counted+'</span>'+source+'</li>');
      });
      return '<details class="budget-details"><summary>Ver composição ('+(g.legs.length+g.activities.length)+')</summary><ul>'+lines.join("")+'</ul></details>';
    }
    function update(){
      var people=Math.max(1,Number(document.getElementById("budget-people").value)||1),rate=Math.max(1,Number(document.getElementById("budget-rate").value)||29),gotemba=document.getElementById("budget-gotemba").checked,category=document.getElementById("budget-category").value,finalMode=document.getElementById("budget-final-transfer").value;
      var all=groups(gotemba,finalMode,people), visible=all.filter(function(g){return category==="Todos"||g.categories.indexOf(category)!==-1;});
      var tt=all.reduce(function(s,g){return s+g.transportCost;},0),at=all.reduce(function(s,g){return s+g.activityCost;},0),total=tt+at;
      host.querySelector("[data-budget-single]").textContent=yen(total);host.querySelector("[data-budget-single-brl]").textContent="≈ "+brl(total,rate);host.querySelector("[data-budget-group]").textContent=yen(total*people);host.querySelector("[data-budget-group-brl]").textContent="≈ "+brl(total*people,rate);host.querySelector("[data-budget-split]").textContent=yen(tt)+" + "+yen(at);host.querySelector("[data-budget-split-brl]").textContent="Transportes "+brl(tt,rate)+" · Passeios "+brl(at,rate);
      host.querySelector("[data-budget-body]").innerHTML=visible.map(function(g){return '<tr><td data-label="Data"><b>'+esc(g.date)+'</b></td><td data-label="Roteiro"><b>'+esc(g.title)+'</b><div class="budget-categories">'+tagsHtml(g.categories)+'</div></td><td data-label="Transporte"><b>'+yen(g.transportCost)+'</b><span>'+brl(g.transportCost,rate)+'</span></td><td data-label="Passeios"><b>'+yen(g.activityCost)+'</b><span>'+brl(g.activityCost,rate)+'</span></td><td data-label="Total"><b>'+yen(g.total)+'</b><span>'+brl(g.total,rate)+'</span></td><td data-label="Detalhamento">'+details(g,rate)+'</td></tr>';}).join("");
    }
    host.querySelectorAll("input,select").forEach(function(el){el.addEventListener("input",update);el.addEventListener("change",update);});
    host.querySelector("[data-close-budget]").addEventListener("click",function(){window.plannerShowBudget(false);});update();
  }
  window.plannerShowBudget=function(show){document.body.classList.toggle("budget-open",show!==false);if(show!==false)render();window.scrollTo(0,0);};
  document.addEventListener("DOMContentLoaded",function(){var b=document.getElementById("open-budget-view");if(b)b.addEventListener("click",function(){window.plannerShowBudget(true);});});
})();
