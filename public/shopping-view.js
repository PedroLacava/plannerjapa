(function () {
  "use strict";

  var KEY = "japan-trip-planner-shopping-v1";
  var STATUSES = ["Desejado", "Pesquisando", "Encontrado", "Comprado", "Desistiu"];
  var PRIORITIES = ["Quero muito", "Quero", "Se estiver barato"];
  var IMPORTED = [
    [2,"7 eleven","água que emagrece"],[3,"","Kit kat de sabores"],[4,"","sanduiche de ovo"],[5,"","Shoyu trufado"],
    [7,"ReFa","Escova de cabelo"],[8,"","pente"],[9,"","shampoo honey queen"],[10,"","condicionador honey queen"],
    [12,"THE ANSWER","Shampoo e condicionador"],[13,"FINO","Shampoo, condicionador, mascara e oleo"],
    [14,"Honey","Shampoo e condicionador"],[15,"Tsubaki","Shampoo, condicionador, mascara e oleo"],
    [16,"Orbis","Orbis Essence in hair milk"],[21,"DHC","Capsula para soltar pum cheiroso"],
    [22,"","lipcream MEGA hidratante"],[26,"","Escova de dente de 16 mil cerdas"],
    [27,"","Enxaguante bucal que sai preto"],[28,"","Balinha para halito bom"],
    [32,"TIR TIR","Tirtir mask fit red cushion"],[33,"Laneige","Pó ultrafino"],
    [35,"CHPT 9","Pore clear serum"],[36,"Senka","Senka Perfect Whip (saboniete de rosto) e cleasing oil"],
    [37,"Suisai","sabonete facial em po individual"],[38,"Allershut","spray antipoluição"],
    [43,"Medicube","Zero pore pad milk ou zero por pad"],[44,"","Collagen Jelly Cream"],[45,"","mascaras"],
    [46,"Aqalaber","creme"],[50,"","Kyusoku Jikan (salompas gela pé)"],
    [51,"","Salompas de pé de panturrilha"],[52,"","Roihi Tsuboko (adesivo para dor)"],
    [57,"Biore","Bioré UV Watery Essence"],[58,"","Bioré UV Aqua Protect Mist"],
    [59,"","Toalha refrescante e spray para diminuir calor"],[62,"Cicibella","Mascara Exome VC200"],
    [63,"menina koreana","Keana Nadeshiko Rice Mask"],[65,"Rimel Kissme","Rimel Kissme"],
    [71,"onitsuka tiger","Tenis"],[72,"Secound hand","Bolsa"],[73,"Muji","Papelaria"],
    [74,"Uniqlo","Uniqlo"],[75,"Adidas","Adidas"]
  ];

  var STORE_GUIDE = {
    "Beleza e cabelo": { store:"Matsumoto Kiyoshi", area:"Ginza", day:"19/11", query:"Matsumoto Kiyoshi Ginza Tokyo", source:"https://www.matsukiyococokara-online.com/" },
    "Cuidados com a pele": { store:"Matsumoto Kiyoshi", area:"Ginza", day:"19/11", query:"Matsumoto Kiyoshi Ginza Tokyo", source:"https://www.matsukiyococokara-online.com/" },
    "Saúde e cuidados": { store:"Matsumoto Kiyoshi", area:"Ginza", day:"19/11", query:"Matsumoto Kiyoshi Ginza Tokyo", source:"https://www.matsukiyococokara-online.com/" },
    "Alimentos": { store:"Don Quijote Ginza", area:"Ginza", day:"19/11", query:"Don Quijote Ginza Honkan", source:"https://www.donki.com/en/store/shop_detail.php?shop_id=421" },
    "Moda e calçados": { store:"Kisarazu Outlet", area:"Kisarazu", day:"24/11", query:"Mitsui Outlet Park Kisarazu", source:"https://mitsui-shopping-park.com/mop/kisarazu/english/" },
    "Segunda mão": { store:"2nd STREET", area:"Shinjuku", day:"23/11", query:"2nd Street Shinjuku Tokyo", source:"https://www.2ndstreet.jp/shop/search" },
    "Papelaria": { store:"MUJI Ginza", area:"Ginza", day:"19/11", query:"MUJI Ginza", source:"https://www.muji.com/jp/ja/shop/detail/046604" },
    "Outros": { store:"Don Quijote Ginza", area:"Ginza", day:"19/11", query:"Don Quijote Ginza Honkan", source:"https://www.donki.com/en/store/shop_detail.php?shop_id=421" }
  };

  function plain(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  function categoryFor(name, brand) {
    var t = plain(name + " " + brand);
    if (/kit kat|sanduiche|shoyu|\bagua\b/.test(t)) return "Alimentos";
    if (/tenis|adidas|uniqlo|onitsuka/.test(t)) return "Moda e calçados";
    if (/second|secound|bolsa/.test(t)) return "Segunda mão";
    if (/papelaria|muji/.test(t)) return "Papelaria";
    if (/shampoo|condicionador|mascara|oleo|escova|pente|hair/.test(t)) return "Beleza e cabelo";
    if (/serum|cushion|cream|creme|sabonete|cleasing|pore|collagen|biore|laneige|senka|suisai/.test(t)) return "Cuidados com a pele";
    if (/capsula|lipcream|enxaguante|halito|salompas|roihi|dor|antipoluicao|refrescante/.test(t)) return "Saúde e cuidados";
    return "Outros";
  }
  function needsDetail(name, brand) {
    var t = plain(name);
    return !brand || /^(creme|mascaras|tenis|bolsa|papelaria|uniqlo|adidas|pente)$/.test(t) || /agua que emagrece|menina koreana|ou zero/.test(plain(name + " " + brand));
  }
  function seedItem(row) {
    var category = categoryFor(row[2], row[1]);
    return {
      id:"f-" + row[0], owner:"Fernanda", brand:row[1], name:row[2], variant:"", category:category,
      quantity:1, priority:"Quero", status:"Desejado", maxPrice:"", foundPrice:"", foundStore:"",
      sourceUrl:"", checkedAt:"", note:"Importado da planilha da Fernanda, linha " + row[0] + ".",
      needsDetail:needsDetail(row[2], row[1]), createdAt:"2026-09-08"
    };
  }
  var DEFAULTS = { rate:29, items:IMPORTED.map(seedItem) };

  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function load() {
    var state = null;
    try { state = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!state || !Array.isArray(state.items)) state = clone(DEFAULTS);
    if (!state.rate) state.rate = 29;
    return state;
  }
  function save(state) {
    var value = JSON.stringify(state);
    if (window.JaplannerSharedStore) window.JaplannerSharedStore.set(KEY, value);
    else localStorage.setItem(KEY, value);
  }
  function esc(x) { return String(x == null ? "" : x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function safeUrl(x) { try { var u = new URL(x); return /^https?:$/.test(u.protocol) ? u.href : ""; } catch (e) { return ""; } }
  function yen(n) { return "¥" + Math.round(Number(n) || 0).toLocaleString("pt-BR"); }
  function brl(n) { return "R$ " + Number(n || 0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function mapUrl(query) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query); }
  function unique(list) { return list.filter(function(x,i){ return x && list.indexOf(x) === i; }); }
  function optionList(values, selected) { return values.map(function(x){ return '<option '+(x===selected?'selected':'')+'>'+esc(x)+'</option>'; }).join(""); }

  var filters = { search:"", owner:"Todos", status:"Todos", category:"Todas", detail:false };
  function visible(item) {
    var hay = plain([item.name,item.brand,item.owner,item.category,item.note].join(" "));
    return (!filters.search || hay.indexOf(plain(filters.search)) >= 0) &&
      (filters.owner === "Todos" || item.owner === filters.owner) &&
      (filters.status === "Todos" || item.status === filters.status) &&
      (filters.category === "Todas" || item.category === filters.category) &&
      (!filters.detail || item.needsDetail);
  }
  function suggestion(item) { return STORE_GUIDE[item.category] || STORE_GUIDE.Outros; }
  function itemCard(item, rate) {
    var guide = suggestion(item), price = Number(item.foundPrice)||0, max = Number(item.maxPrice)||0;
    var store = item.foundStore || guide.store, source = safeUrl(item.sourceUrl) || guide.source;
    var priceMeta = price ? yen(price)+" · "+brl(price/rate) : "Preço não pesquisado";
    var compare = price && max ? (price <= max ? "Dentro do limite" : "Acima do limite") : "";
    return '<article class="shop-item '+(item.status==="Comprado"?'bought':'')+'" data-shop-card="'+esc(item.id)+'">'+
      '<div class="shop-item-head"><div><small>'+esc(item.category)+'</small><h3>'+esc(item.name)+'</h3><p>'+esc(item.brand || "Marca não informada")+(item.variant?' · '+esc(item.variant):'')+'</p></div>'+
      (item.needsDetail?'<span class="shop-detail-flag">Precisa detalhar</span>':'')+'</div>'+
      '<div class="shop-chips"><span>'+esc(item.owner || "Sem responsável")+'</span><span>'+esc(item.priority)+'</span><span>Qtd. '+esc(item.quantity)+'</span></div>'+
      '<div class="shop-price"><div><small>Preço encontrado</small><b>'+priceMeta+'</b><span>'+esc(compare)+'</span></div><div><small>Onde procurar primeiro</small><b>'+esc(store)+'</b><span>'+esc(guide.area)+' · roteiro de '+esc(guide.day)+'</span></div></div>'+
      '<div class="shop-actions"><select data-shop-status="'+esc(item.id)+'">'+optionList(STATUSES,item.status)+'</select><button type="button" data-shop-edit="'+esc(item.id)+'">Editar</button><a href="'+esc(mapUrl(store+' '+guide.area+' Japan'))+'" target="_blank" rel="noopener noreferrer">Mapa</a><a href="'+esc(source)+'" target="_blank" rel="noopener noreferrer">Fonte</a></div>'+
      '<div class="shop-editor" data-shop-editor="'+esc(item.id)+'" hidden>'+editorFields(item)+'</div></article>';
  }
  function editorFields(item) {
    return '<div class="shop-form-grid">'+
      '<label>Produto<input data-shop-field="name" value="'+esc(item.name)+'"></label><label>Marca<input data-shop-field="brand" value="'+esc(item.brand)+'"></label>'+
      '<label>Variante, tamanho ou cor<input data-shop-field="variant" value="'+esc(item.variant)+'"></label><label>Responsável<input data-shop-field="owner" value="'+esc(item.owner)+'"></label>'+
      '<label>Categoria<select data-shop-field="category">'+optionList(Object.keys(STORE_GUIDE),item.category)+'</select></label><label>Prioridade<select data-shop-field="priority">'+optionList(PRIORITIES,item.priority)+'</select></label>'+
      '<label>Quantidade<input type="number" min="1" step="1" data-shop-field="quantity" value="'+esc(item.quantity)+'"></label><label>Preço máximo (¥)<input type="number" min="0" step="1" data-shop-field="maxPrice" value="'+esc(item.maxPrice)+'"></label>'+
      '<label>Preço encontrado (¥)<input type="number" min="0" step="1" data-shop-field="foundPrice" value="'+esc(item.foundPrice)+'"></label><label>Loja encontrada<input data-shop-field="foundStore" value="'+esc(item.foundStore)+'"></label>'+
      '<label class="wide">Link da pesquisa ou produto<input type="url" data-shop-field="sourceUrl" value="'+esc(item.sourceUrl)+'"></label><label class="wide">Observações<textarea data-shop-field="note">'+esc(item.note)+'</textarea></label>'+
      '<label class="shop-check"><input type="checkbox" data-shop-field="needsDetail" '+(item.needsDetail?'checked':'')+'> Ainda precisa detalhar</label></div>'+
      '<div class="shop-edit-actions"><button type="button" data-shop-save="'+esc(item.id)+'">Salvar</button><button type="button" class="danger" data-shop-delete="'+esc(item.id)+'">Excluir</button></div>';
  }

  function render() {
    var host = document.getElementById("shopping-view"); if (!host) return;
    var state = load(), items = state.items.filter(visible), rate = Math.max(1,Number(state.rate)||29);
    var owners = ["Todos"].concat(unique(state.items.map(function(x){return x.owner;})).sort());
    var categories = ["Todas"].concat(Object.keys(STORE_GUIDE));
    var bought = state.items.filter(function(x){return x.status==="Comprado";}).length;
    var foundTotal = state.items.reduce(function(s,x){return s+(Number(x.foundPrice)||0)*(Number(x.quantity)||1);},0);
    var need = state.items.filter(function(x){return x.needsDetail;}).length;
    host.innerHTML = '<div class="shopping-shell"><div class="transport-hero shopping-hero"><div><div class="today-eyebrow">Lista colaborativa</div><h2>Compras no Japão</h2><p>Produtos, responsáveis, limites de preço e lojas encaixadas no roteiro.</p></div><button type="button" data-close-shopping>Voltar ao calendário</button></div>'+
      '<section class="shop-summary"><div><small>Itens</small><b>'+state.items.length+'</b></div><div><small>Comprados</small><b>'+bought+'</b></div><div><small>Precisam detalhar</small><b>'+need+'</b></div><div><small>Preço pesquisado</small><b>'+yen(foundTotal)+'</b><span>'+brl(foundTotal/rate)+'</span></div></section>'+
      '<section class="shop-add"><div><h3>Adicionar item</h3><p>Digite o que procura. Categoria e loja inicial serão sugeridas automaticamente.</p></div><div class="shop-add-grid"><input data-new-shop="name" placeholder="Produto"><input data-new-shop="brand" placeholder="Marca, se souber"><input data-new-shop="owner" placeholder="Responsável"><select data-new-shop="priority">'+optionList(PRIORITIES,"Quero")+'</select><button type="button" data-shop-add>Adicionar</button></div><p class="shop-add-message" data-shop-message></p></section>'+
      '<section class="shop-filter"><input type="search" data-shop-filter="search" value="'+esc(filters.search)+'" placeholder="Buscar produto, marca ou pessoa"><select data-shop-filter="owner">'+owners.map(function(x){return '<option '+(x===filters.owner?'selected':'')+'>'+esc(x)+'</option>';}).join('')+'</select><select data-shop-filter="status">'+["Todos"].concat(STATUSES).map(function(x){return '<option '+(x===filters.status?'selected':'')+'>'+esc(x)+'</option>';}).join('')+'</select><select data-shop-filter="category">'+categories.map(function(x){return '<option '+(x===filters.category?'selected':'')+'>'+esc(x)+'</option>';}).join('')+'</select><label><input type="checkbox" data-shop-filter="detail" '+(filters.detail?'checked':'')+'> Precisa detalhar</label><label class="shop-rate">¥ por R$ 1<input type="number" min="1" step=".1" data-shop-rate value="'+esc(rate)+'"></label></section>'+
      '<div class="shop-list">'+(items.length?items.map(function(x){return itemCard(x,rate);}).join(''):'<p class="bk-empty">Nenhum item com esses filtros.</p>')+'</div></div>';
    bind(host,state);
  }
  function bind(host,state) {
    host.querySelector("[data-close-shopping]").addEventListener("click",function(){ window.plannerShowShopping(false); });
    host.addEventListener("click",function(e){
      var id, item, card;
      if (e.target.closest("[data-shop-add]")) {
        var name=host.querySelector('[data-new-shop="name"]').value.trim(), brand=host.querySelector('[data-new-shop="brand"]').value.trim(), owner=host.querySelector('[data-new-shop="owner"]').value.trim();
        var msg=host.querySelector('[data-shop-message]');
        if (!name || !owner) { msg.textContent="Informe o produto e o responsável."; return; }
        var duplicate=state.items.find(function(x){return plain(x.name)===plain(name)&&plain(x.owner)===plain(owner);});
        if (duplicate) { msg.textContent="Este item já está na lista de "+owner+"."; return; }
        var cat=categoryFor(name,brand);
        state.items.unshift({id:"s-"+Date.now(),owner:owner,brand:brand,name:name,variant:"",category:cat,quantity:1,priority:host.querySelector('[data-new-shop="priority"]').value,status:"Desejado",maxPrice:"",foundPrice:"",foundStore:"",sourceUrl:"",checkedAt:"",note:"",needsDetail:needsDetail(name,brand),createdAt:new Date().toISOString().slice(0,10)});
        save(state); render(); return;
      }
      var edit=e.target.closest("[data-shop-edit]");
      if(edit){id=edit.dataset.shopEdit;card=host.querySelector('[data-shop-card="'+id+'"]');var panel=card.querySelector('[data-shop-editor]');panel.hidden=!panel.hidden;edit.textContent=panel.hidden?"Editar":"Fechar";return;}
      var saveBtn=e.target.closest("[data-shop-save]");
      if(saveBtn){id=saveBtn.dataset.shopSave;item=state.items.find(function(x){return x.id===id;});card=host.querySelector('[data-shop-card="'+id+'"]');if(item&&card){card.querySelectorAll('[data-shop-field]').forEach(function(f){var v=f.type==="checkbox"?f.checked:f.value;item[f.dataset.shopField]=f.type==="number"?(v===""?"":Number(v)):v;});item.checkedAt=item.foundPrice?new Date().toISOString().slice(0,10):item.checkedAt;save(state);render();}return;}
      var del=e.target.closest("[data-shop-delete]");
      if(del&&confirm("Excluir este item da lista compartilhada?")){state.items=state.items.filter(function(x){return x.id!==del.dataset.shopDelete;});save(state);render();}
    });
    host.addEventListener("change",function(e){
      if(e.target.dataset.shopStatus){var item=state.items.find(function(x){return x.id===e.target.dataset.shopStatus;});if(item){item.status=e.target.value;save(state);render();}return;}
      if(e.target.dataset.shopFilter){filters[e.target.dataset.shopFilter]=e.target.type==="checkbox"?e.target.checked:e.target.value;render();return;}
      if(e.target.dataset.shopRate!==undefined){state.rate=Math.max(1,Number(e.target.value)||29);save(state);render();}
    });
    var search=host.querySelector('[data-shop-filter="search"]');
    search.addEventListener("input",function(){filters.search=search.value;clearTimeout(search._t);search._t=setTimeout(render,180);});
  }

  window.plannerShowShopping=function(show){document.body.classList.toggle("shopping-open",show!==false);if(show!==false)render();window.scrollTo(0,0);};
  document.addEventListener("DOMContentLoaded",function(){var b=document.getElementById("open-shopping-view");if(b)b.addEventListener("click",function(){window.plannerShowShopping(true);});});
})();
