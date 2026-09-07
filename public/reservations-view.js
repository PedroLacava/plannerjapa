(function(){"use strict";
var KEY="japan-trip-planner-reservations-v1",DEFAULTS={
checklist:["Passaportes válidos e cópias digitais","Seguro viagem contratado","eSIM ou internet móvel definida","Cartões, ienes e aviso de viagem organizados","Decisão final sobre passes de transporte","Google Maps, Translate, Disney e Suica/PASMO configurados","Plano de malas e envio entre hotéis","Reservas e endereços dos hotéis salvos offline"].map(function(x,i){return{id:"c"+i,label:x,done:false};}),
reservations:[
 ["09/11","Shinkansen Shinagawa → Shin-Osaka","Reservar assentos juntos e espaço para malas."],
 ["12/11","Cerimônia do chá em Kyoto","Fornecedor ainda não definido."],
 ["17/11","Gora Kadan","Confirmar jantar, quartos e política para tatuagem."],
 ["20/11","teamLab Planets","Ingresso com horário marcado."],
 ["21/11","Shibuya Sky","Priorizar horário de fim de tarde."],
 ["25/11","Tokyo DisneySea","Venda abre mais perto da data."],
 ["27/11","Transporte para Narita","Escolher transporte público, transfer, Uber ou táxi."]
].map(function(x,i){return{id:"r"+i,date:x[0],label:x[1],note:x[2],status:i===2?"Reservado":"Pendente",code:""};}),
accommodations:[
 ["Henn na Hotel Tokyo Haneda","08/11","09/11",1],
 ["Comfort Hotel Shin-Osaka","09/11","17/11",8],
 ["Gora Kadan","17/11","18/11",1],
 ["Hotel Sunroute Asakusa","18/11","27/11",9]
].map(function(x,i){return{id:"h"+i,name:x[0],checkin:x[1],checkout:x[2],nights:x[3],currency:"BRL",amount:"",status:"Pendente"};}),
bookings:{}};

var GROUPS=[
 {id:"now",title:"Reservar agora",hint:"Disponibilidade limitada — quanto antes, melhor."},
 {id:"open",title:"Comprar quando abrir",hint:"A venda ainda não abriu para a data."},
 {id:"near",title:"Comprar perto da viagem",hint:"Pode ser resolvido nas semanas finais."},
 {id:"transport",title:"Transporte",hint:"Bilhetes e reserva de assento."},
 {id:"none",title:"Não precisa reservar",hint:"Entrada livre ou compra no local."}
];
var URGENCY={alta:"Alta",media:"Média",baixa:"Baixa"};
var STATUSES=["Pendente","Comprado","Reservado","Não se aplica"];
var JR_BUY="https://www.jreast.co.jp/multi/en/ticket/";

function T(id,date,name,place,tour,when){return{id:id,group:"transport",urgency:"media",date:date,name:name,place:place,tour:tour,url:JR_BUY,info:"https://japanrailpass.net/en/",window:when||"Reservar assento quando abrir, normalmente 1 mês antes.",tip:"Comparar bilhetes avulsos e passes regionais antes da compra."};}

var ITEMS=[
 {id:"b-ryokan-hakone",group:"now",urgency:"alta",date:"17–18/11/2026",name:"Ryokan em Hakone",place:"Hakone",tour:null,url:"https://hakone-japan.com/plan-your-trip/accommodations/historic-ryokan/",window:"Reservar agora — ryokans com jantar esgotam com meses de antecedência.",tip:"Confirmar jantar para 4, configuração de quartos, onsen privativo e política de tatuagem."},
 {id:"b-tea-camellia",group:"now",urgency:"alta",date:"12/11/2026",name:"Cerimônia do chá Camellia Flower",place:"Kyoto",tour:"gion-tea",url:"https://tea-kyoto.com/reservation/flower",window:"Reservar agora — poucas vagas por horário.",tip:"Escolher horário compatível com o restante do dia em Kyoto."},
 {id:"b-disneysea",group:"open",urgency:"alta",date:"25/11/2026",name:"Tokyo DisneySea",place:"Tóquio (Urayasu)",tour:"disney",url:"https://www.tokyodisneyresort.jp/en/ticket/index.html",window:"Normalmente 2 meses antes da data.",tip:"Ingresso com data marcada; conferir a abertura oficial de vendas."},
 {id:"b-teamlab",group:"open",urgency:"alta",date:"19/11/2026",name:"teamLab Planets",place:"Toyosu, Tóquio",tour:"teamlab-planets",url:"https://teamlabplanets.dmm.com/en",window:"Comprar quando novembro abrir.",tip:"Ingresso com horário marcado."},
 {id:"b-shibuya-sky",group:"open",urgency:"alta",date:"21/11/2026",name:"Shibuya Sky",place:"Shibuya, Tóquio",tour:"shibuya-harajuku",url:"https://www.shibuya-scramble-square.com/sky/ticket/",window:"Normalmente 14 dias antes.",tip:"Preferência por 15h30–16h."},
 {id:"b-hiroshima-museu",group:"open",urgency:"media",date:"16/11/2026",name:"Museu Memorial da Paz de Hiroshima",place:"Hiroshima",tour:"peace-memorial",url:"https://hpmmuseum.jp/?lang=eng",window:"Comprar quando a data estiver disponível.",tip:"Conferir horário de entrada no site oficial."},
 {id:"b-himeji",group:"open",urgency:"media",date:"14/11/2026",name:"Castelo de Himeji",place:"Himeji",tour:"kobe-himeji",url:"https://www.himejicastle.jp/en/",window:"Conferir abertura oficial de vendas.",tip:"Chegar cedo reduz fila na torre principal."},
 {id:"b-gotemba-bus",group:"near",urgency:"media",date:"24/11/2026",name:"Ônibus para Gotemba Premium Outlets",place:"Tóquio → Gotemba",tour:"outlet",url:"https://www.premiumoutlets.co.jp/en/gotemba/access/",window:"Conferir cerca de 1 mês antes.",tip:"Verificar horários de ida e volta no dia escolhido."},
 {id:"b-hakone-freepass",group:"near",urgency:"media",date:"17–18/11/2026",name:"Hakone Freepass 2 dias (início em Odawara)",place:"Odawara / Hakone",tour:"hakone-museum-onsen",url:"https://www.hakonenavi.jp/international/en/discount_passes/free_pass",window:"Comprar perto da viagem.",tip:"Cobre trem, ropeway, ônibus e barco na área de Hakone."},
 {id:"b-hakone-oam",group:"near",urgency:"baixa",date:"17/11/2026",name:"Hakone Open-Air Museum",place:"Hakone",tour:"hakone-museum-onsen",url:"https://www.hakone-oam.or.jp/en/webticket/",window:"Comprar perto da viagem — não costuma esgotar.",tip:"Bilhete online evita fila na bilheteria."},
 {id:"b-hakone-ropeway",group:"none",urgency:"baixa",date:"17–18/11/2026",name:"Hakone Ropeway e cruzeiro do Lago Ashi",place:"Hakone",tour:"hakone-ropeway",url:"https://www.hakonenavi.jp/international/en/transportation/hakone-ropeway",window:"Não precisa reservar.",tip:"Pode haver interrupção por clima ou manutenção; o Freepass costuma cobrir o trecho."},
 T("b-rail-tokyo-osaka","09/11/2026","Trem Tóquio → Shin-Osaka","Shinagawa → Shin-Osaka","transport-tokyo-osaka"),
 T("b-rail-himeji","14/11/2026","Trem Shin-Osaka ↔ Himeji","Shin-Osaka ↔ Himeji","transport-osaka-himeji-kobe"),
 T("b-rail-hiroshima","16/11/2026","Trem Shin-Osaka ↔ Hiroshima","Shin-Osaka ↔ Hiroshima","transport-osaka-hiroshima"),
 T("b-rail-odawara","17/11/2026","Trem Shin-Osaka → Odawara","Shin-Osaka → Odawara","transport-osaka-hakone"),
 T("b-rail-tokyo-back","18/11/2026","Trem Odawara → Tóquio/Shinagawa","Odawara → Shinagawa","transport-hakone-tokyo"),
 T("b-rail-narita","27/11/2026","Trem Tóquio → Narita","Tóquio → Aeroporto de Narita","transport-tokyo-narita")
];

function clone(x){return JSON.parse(JSON.stringify(x));}
function load(){var s=null;try{s=JSON.parse(localStorage.getItem(KEY));}catch(e){}if(!s||!s.checklist||!s.reservations||!s.accommodations)s=clone(DEFAULTS);if(!s.bookings||typeof s.bookings!=="object")s.bookings={};return s;}
function save(s){if(window.JaplannerSharedStore)window.JaplannerSharedStore.set(KEY,JSON.stringify(s));else localStorage.setItem(KEY,JSON.stringify(s));}
function esc(x){return String(x==null?"":x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function yen(n){return"¥"+Math.round(n).toLocaleString("pt-BR");}
function brl(n){return"R$ "+Number(n).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});}
function totals(s,rate){return s.accommodations.reduce(function(t,a){var v=Number(a.amount)||0;if(a.currency==="JPY"){t.jpy+=v;t.brl+=v/rate;}else{t.brl+=v;t.jpy+=v*rate;}return t;},{jpy:0,brl:0});}
function domain(u){try{return new URL(u).hostname.replace(/^www\./,"");}catch(e){return u;}}
function entryOf(s,id){var b=s.bookings[id];return{status:b&&b.status?b.status:"Pendente",note:b&&b.note?b.note:""};}
function setEntry(s,id,patch){var cur=entryOf(s,id);s.bookings[id]={status:patch.status!=null?patch.status:cur.status,note:patch.note!=null?patch.note:cur.note};}
function isDone(st){return st==="Comprado"||st==="Reservado"||st==="Não se aplica";}

window.JaplannerReservations={getState:load,getAccommodationTotals:function(rate){return totals(load(),rate||29);}};
window.JaplannerBookings={
 items:ITEMS,
 forTour:function(tourId){if(!tourId)return[];var s=load();return ITEMS.filter(function(i){return i.tour===tourId;}).map(function(i){var e=entryOf(s,i.id);return{id:i.id,name:i.name,url:i.url,status:e.status,note:e.note};});}
};

var filters={status:"all",urgency:"all"};

function itemHtml(item,st){
 var badge=isDone(st.status)?"done":(item.group==="none"?"na":"pending");
 return'<article class="bk-row '+badge+'"><div class="bk-top"><div class="bk-when">'+esc(item.date)+'</div><div class="bk-main"><b>'+esc(item.name)+'</b><small>'+esc(item.place)+'</small></div><span class="bk-urg u-'+item.urgency+'">Urgência '+URGENCY[item.urgency]+'</span></div>'+
 '<p class="bk-window"><b>Janela recomendada:</b> '+esc(item.window)+(item.tip?' <span>'+esc(item.tip)+'</span>':'')+'</p>'+
 '<div class="bk-controls"><label class="bk-field"><span>Status</span><select data-bk-status="'+item.id+'">'+STATUSES.map(function(o){return'<option '+(st.status===o?'selected':'')+'>'+o+'</option>';}).join("")+'</select></label>'+
 '<label class="bk-field bk-note"><span>Observação (opcional)</span><input type="text" data-bk-note="'+item.id+'" value="'+esc(st.note)+'" placeholder="Ex.: horário preferido, código da reserva"></label>'+
 '<a class="bk-link" href="'+esc(item.url)+'" target="_blank" rel="noopener noreferrer" aria-label="Abrir site oficial de '+esc(item.name)+' em nova aba">Site oficial <small>'+esc(domain(item.url))+'</small></a>'+
 (item.info?'<a class="bk-link ghost" href="'+esc(item.info)+'" target="_blank" rel="noopener noreferrer" aria-label="Informações oficiais do JR Pass em nova aba">Info JR Pass <small>'+esc(domain(item.info))+'</small></a>':'')+
 '</div></article>';
}

function renderBookings(state){
 var pending=0,done=0;
 ITEMS.forEach(function(i){var e=entryOf(state,i.id);if(isDone(e.status))done++;else pending++;});
 var body=GROUPS.map(function(g){
  var list=ITEMS.filter(function(i){
   if(i.group!==g.id)return false;
   var e=entryOf(state,i.id);
   if(filters.status!=="all"&&e.status!==filters.status)return false;
   if(filters.urgency!=="all"&&i.urgency!==filters.urgency)return false;
   return true;});
  if(!list.length)return"";
  return'<section class="bk-group"><header><h3>'+g.title+' <b>'+list.length+'</b></h3><p>'+g.hint+'</p></header>'+list.map(function(i){return itemHtml(i,entryOf(state,i.id));}).join("")+'</section>';
 }).join("");
 if(!body)body='<p class="bk-empty">Nenhum item com esses filtros.</p>';
 return'<section class="reservation-card bookings-card"><div class="reservation-heading"><div><span>Central</span><h3>Reservas e ingressos</h3></div><div class="bk-counters"><b>'+pending+' pendentes</b><small>'+done+' concluídos</small></div></div>'+
 '<p class="bk-warning">Prefira o site oficial. Confirme data, horário e política de cancelamento antes do pagamento.</p>'+
 '<div class="bk-filters"><label>Status <select data-bk-filter="status"><option value="all">Todos</option>'+STATUSES.map(function(o){return'<option value="'+o+'" '+(filters.status===o?'selected':'')+'>'+o+'</option>';}).join("")+'</select></label>'+
 '<label>Urgência <select data-bk-filter="urgency"><option value="all">Todas</option>'+Object.keys(URGENCY).map(function(k){return'<option value="'+k+'" '+(filters.urgency===k?'selected':'')+'>'+URGENCY[k]+'</option>';}).join("")+'</select></label></div>'+
 '<div class="bk-list">'+body+'</div></section>';
}

function render(){var host=document.getElementById("reservations-view");if(!host)return;var state=load();
host.innerHTML='<div class="reservation-shell"><div class="transport-hero"><div><div class="today-eyebrow">Antes da viagem</div><h2>Reservas e ingressos</h2><p>Compras, confirmações, checklist e hospedagens em um só lugar.</p></div><button type="button" data-close-reservations>Voltar ao calendário</button></div>'+renderBookings(state)+'<div class="reservation-grid"><section class="reservation-card"><div class="reservation-heading"><div><span>Preparação</span><h3>Checklist geral</h3></div><b data-check-progress></b></div><div class="checklist-list">'+state.checklist.map(function(x){return'<label class="check-row"><input type="checkbox" data-check="'+x.id+'" '+(x.done?'checked':'')+'><span>'+esc(x.label)+'</span></label>';}).join("")+'</div></section></div><section class="reservation-card accommodation-card"><div class="reservation-heading"><div><span>Orçamento</span><h3>Acomodações</h3></div><div class="accommodation-total"><b data-stay-jpy></b><small data-stay-brl></small></div></div><div class="accommodation-rate"><label>¥ por R$ 1 <input id="stay-rate" type="number" min="1" step="0.1" value="29"></label><span>Campos vazios não entram no total.</span></div><div class="accommodation-list">'+state.accommodations.map(function(a){return'<article class="stay-row"><div class="stay-main"><b>'+esc(a.name)+'</b><span>'+a.checkin+' → '+a.checkout+' · '+a.nights+' noite'+(a.nights>1?'s':'')+'</span></div><select data-stay-currency="'+a.id+'"><option value="BRL" '+(a.currency==='BRL'?'selected':'')+'>R$</option><option value="JPY" '+(a.currency==='JPY'?'selected':'')+'>¥</option></select><input type="number" min="0" step="0.01" data-stay-amount="'+a.id+'" value="'+esc(a.amount)+'" placeholder="A preencher"><select data-stay-status="'+a.id+'"><option '+(a.status==='Pendente'?'selected':'')+'>Pendente</option><option '+(a.status==='Reservado'?'selected':'')+'>Reservado</option><option '+(a.status==='Pago'?'selected':'')+'>Pago</option></select></article>';}).join("")+'</div></section></div>';
function summary(){var rate=Math.max(1,Number(document.getElementById("stay-rate").value)||29),t=totals(state,rate),done=state.checklist.filter(function(x){return x.done;}).length;host.querySelector("[data-check-progress]").textContent=done+" / "+state.checklist.length;host.querySelector("[data-stay-jpy]").textContent=yen(t.jpy);host.querySelector("[data-stay-brl]").textContent=brl(t.brl);}
function find(list,id){return list.find(function(x){return x.id===id;});}
function refreshBookings(){var el=host.querySelector(".bookings-card");if(!el)return;var wrap=document.createElement("div");wrap.innerHTML=renderBookings(state);el.replaceWith(wrap.firstChild);if(window.plannerRefreshDetail)window.plannerRefreshDetail();}
host.addEventListener("change",function(e){var el=e.target,x,rerender=false;
 if(el.dataset.bkFilter){filters[el.dataset.bkFilter]=el.value;refreshBookings();return;}
 if(el.dataset.bkStatus){setEntry(state,el.dataset.bkStatus,{status:el.value});rerender=true;}
 if(el.dataset.bkNote){setEntry(state,el.dataset.bkNote,{note:el.value});}
 if(el.dataset.check){x=find(state.checklist,el.dataset.check);if(x)x.done=el.checked;}
 if(el.dataset.stayCurrency){x=find(state.accommodations,el.dataset.stayCurrency);if(x)x.currency=el.value;}
 if(el.dataset.stayAmount){x=find(state.accommodations,el.dataset.stayAmount);if(x)x.amount=el.value;}
 if(el.dataset.stayStatus){x=find(state.accommodations,el.dataset.stayStatus);if(x)x.status=el.value;}
 save(state);summary();if(rerender)refreshBookings();else if(el.dataset.bkNote&&window.plannerRefreshDetail)window.plannerRefreshDetail();});
host.addEventListener("input",function(e){if(e.target.id==="stay-rate")summary();if(e.target.dataset.stayAmount)e.target.dispatchEvent(new Event("change",{bubbles:true}));});
host.addEventListener("blur",function(e){if(e.target.dataset&&e.target.dataset.bkNote){setEntry(state,e.target.dataset.bkNote,{note:e.target.value});save(state);}},true);
host.querySelector("[data-close-reservations]").addEventListener("click",function(){window.plannerShowReservations(false);});summary();}
window.plannerShowReservations=function(show){document.body.classList.toggle("reservations-open",show!==false);if(show!==false)render();window.scrollTo(0,0);};
document.addEventListener("DOMContentLoaded",function(){var b=document.getElementById("open-reservations-view");if(b)b.addEventListener("click",function(){window.plannerShowReservations(true);});});})();
