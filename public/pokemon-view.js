(function () {
  "use strict";
  var KEY = "japan-trip-planner-pokemon-v1";
  var STOPS = [{"id": "pokemon-osaka", "date": "2026-11-10", "city": "Osaka", "name": "Pokémon Center OSAKA DX", "hours": "10:00–20:00", "window": "Após Kuromon, na passagem por Shinsaibashi/Dotonbori", "duration": "45 min", "address": "Daimaru Shinsaibashi Main Building 9F, 1-7-1 Shinsaibashisuji, Chuo-ku, Osaka", "why": "Loja de Shinsaibashi, sem confundir com Umeda.", "feature": "Pokémon Café (reserva separada) e linha histórica dourada de Osaka.", "alert": "Linhas históricas e estoque não garantidos.", "lat": 34.6738, "lng": 135.5001, "anchor": "Kuromon", "url": "https://shop.pokemon.co.jp/ja/shop/pokemoncenter-osakadx/", "kind": "Center"}, {"id": "pokemon-kyoto", "date": "2026-11-11", "city": "Kyoto", "name": "Pokémon Center KYOTO", "hours": "10:00–20:00", "window": "10:45–11:20 · sair até 11:20; Nishiki ~11:45", "duration": "35 min", "address": "SUINA Muromachi 2F, 78 Kankobokocho, Shimogyo-ku, Kyoto", "why": "Parada entre Tofuku-ji e o encontro confirmado às 12:00 no Nishiki.", "feature": "Identidade de quimono/chá e linhas históricas Nishijin-ori.", "alert": "Pular/reduzir se houver fila: o guia às 12:00 tem prioridade. Estoque não garantido.", "lat": 35.0031, "lng": 135.7586, "anchor": "Tofuku", "url": "https://shop.pokemon.co.jp/ja/shop/pokemoncenter-kyoto/", "kind": "Center"}, {"id": "pokemon-hiroshima", "date": "2026-11-15", "city": "Hiroshima", "name": "Pokémon Center HIROSHIMA", "hours": "10:00–20:00", "window": "30 min antes do trem de retorno · chegar até 19:30", "duration": "30 min", "address": "ekie 2F, 1-2 Matsubaracho, Minami-ku, Hiroshima", "why": "Ao lado da catraca do Shinkansen, conveniente antes do retorno.", "feature": "Gyarados vermelho, Kaihara Denim, pincéis Kumano e colaborações Carp/Sanfrecce: melhor aposta regional.", "alert": "Não chegar depois de 19:30; proteger o horário do trem. Linhas e estoque podem mudar.", "lat": 34.398, "lng": 132.4754, "anchor": "Okonomimura", "url": "https://shop.pokemon.co.jp/ja/shop/pokemoncenter-hiroshima/", "kind": "Center"}, {"id": "pokemon-osaka-umeda", "date": "2026-11-16", "city": "Osaka", "name": "Pokémon Center OSAKA · Umeda", "hours": "10:00–20:00", "window": "Flexível na região de Umeda", "duration": "45 min", "address": "LUCUA SOUTH 13F, 3-1-1 Umeda, Kita-ku, Osaka", "why": "Conveniente para o dia livre em Osaka.", "feature": "Card Station; compatível com futura inclusão de Umeda Sky/rally, não incluídos automaticamente.", "alert": "Eventos, limites e estoque podem mudar.", "lat": 34.7026, "lng": 135.4959, "anchor": null, "url": "https://shop.pokemon.co.jp/ja/shop/pokemoncenter-osaka/", "kind": "Center"}, {"id": "pokemon-tokyo-station", "date": "2026-11-19", "city": "Tóquio", "name": "Pokémon Store Tokyo Station", "hours": "10:00–20:30", "window": "Na passagem por Tokyo Station/Marunouchi, antes de Nihombashi", "duration": "20 min", "address": "First Avenue Tokyo Station 1F, 1-9-1 Marunouchi, Chiyoda-ku, Tokyo", "why": "Visita rápida sem grande desvio.", "feature": "Loja compacta de passagem.", "alert": "Seleção compacta; não contar com estoque específico.", "lat": 35.6812, "lng": 139.7678, "anchor": "Estação de Tóquio", "url": "https://shop.pokemon.co.jp/ja/shop/pokemonstore-tokyo-station/", "kind": "Store"}, {"id": "pokemon-tokyo-dx", "date": "2026-11-19", "city": "Tóquio", "name": "Pokémon Center TOKYO DX", "hours": "10:30–21:00", "window": "Depois da Tokyo Station, no trecho de Nihombashi", "duration": "45–60 min", "address": "Nihombashi Takashimaya S.C. East Building 5F, 2-11-2 Nihombashi, Chuo-ku, Tokyo", "why": "Loja ampla no eixo já previsto para Nihombashi.", "feature": "Pokémon Café (reserva separada) e loja ampla.", "alert": "Café, filas e estoque sem garantia; confirmar avisos oficiais.", "lat": 35.6809, "lng": 139.775, "anchor": "Nihonbashi", "url": "https://shop.pokemon.co.jp/ja/shop/pokemoncenter-tokyodx/", "kind": "Center"}, {"id": "pokemon-shibuya", "date": "2026-11-21", "city": "Tóquio", "name": "Pokémon Center SHIBUYA", "hours": "10:00–21:00", "window": "Na passagem por Shibuya PARCO; reservar folga para retirada", "duration": "60–90 min", "address": "Shibuya PARCO 6F, 15-1 Udagawacho, Shibuya-ku, Tokyo", "why": "Experiência de design além das compras.", "feature": "Pokémon Design Lab e camiseta customizada; considerar retirada cerca de 1h depois.", "alert": "Sábado: pode exigir sorteio/controle de acesso. Não há garantia de vaga, camiseta ou estoque.", "lat": 35.6618, "lng": 139.6986, "anchor": "Shibuya Crossing", "url": "https://shop.pokemon.co.jp/ja/shop/pokemoncenter-shibuya/", "kind": "Center"}, {"id": "pokemon-skytree", "date": "2026-11-22", "city": "Tóquio", "name": "Pokémon Center SKYTREE TOWN", "hours": "10:00–21:00", "window": "Opcional/cortável · depois de Senso-ji, antes de Ueno", "duration": "45–60 min", "address": "Tokyo Solamachi East Yard 4F, 1-1-2 Oshiage, Sumida-ku, Tokyo", "why": "Ambientação marcante, se couber no dia já cheio.", "feature": "Skytree/Rayquaza.", "alert": "Cortar se atrasar Ueno; itens regionais e estoque não garantidos.", "lat": 35.7101, "lng": 139.8134, "anchor": "Senso", "url": "https://shop.pokemon.co.jp/ja/shop/pokemoncenter-skytreetown/", "kind": "Center"}, {"id": "pokemon-mega-tokyo", "date": "2026-11-23", "city": "Tóquio", "name": "Pokémon Center MEGA TOKYO", "hours": "10:00–20:00", "window": "Preferencialmente 16:30–18:00 · desvio Shinjuku → Ikebukuro", "duration": "60–90 min", "address": "Sunshine City alpa 2F, 3-1-2 Higashi-Ikebukuro, Toshima-ku, Tokyo", "why": "Complexo com experiências variadas.", "feature": "Pikachu Sweets, Pokémon GO Lab e Card Station.", "alert": "23/11 é feriado: pode haver controle de entrada e filas. Estoque e acesso não garantidos.", "lat": 35.7289, "lng": 139.7196, "anchor": "Omoide", "url": "https://shop.pokemon.co.jp/ja/shop/pokemoncenter-megatokyo/", "kind": "Center"}, {"id": "pokemon-kisarazu", "date": "2026-11-24", "city": "Kisarazu", "name": "Pokémon Store OUTLET Kisarazu", "hours": "10:00–20:00", "window": "Dentro do passeio existente ao Mitsui Outlet Park Kisarazu", "duration": "20–30 min", "address": "Mitsui Outlet Park Kisarazu #2150, 3-1-1 Kaneda-Higashi, Kisarazu, Chiba", "why": "Parada curta dentro do outlet já previsto.", "feature": "Formato outlet.", "alert": "Sem prometer descontos nem estoque específico.", "lat": 35.4379, "lng": 139.9295, "anchor": "Mitsui Outlet", "url": "https://shop.pokemon.co.jp/ja/shop/pokemonstore-outlet-kisarazu/", "kind": "Store"}];
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function forDate(iso) { return STOPS.filter(function (s) { return s.date === iso; }); }
  function mapUrl(s) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(s.name + ", " + s.address); }
  function ball() { return '<span class="pokeball" aria-hidden="true"></span>'; }
  function badge(iso) { var n = forDate(iso).length; return n ? '<span class="pokemon-day-badge" title="Dia com parada Pokémon" aria-label="Dia com parada Pokémon" role="img">' + ball() + (n > 1 ? '<b>' + n + '</b>' : '') + '</span>' : ''; }
  function migrate(p) {
    if (p._updates && p._updates.pokemonRouteV1) return false;
    STOPS.forEach(function (s) {
      var day = p[s.date];
      if (!day || !Array.isArray(day.tours) || day.tours.indexOf(s.id) !== -1) return;
      // Insert only new IDs. All pre-existing IDs retain their relative order and data.
      var anchor = s.id === 'pokemon-osaka' ? day.tours.indexOf('kuromon') : -1;
      if (anchor >= 0) day.tours.splice(anchor + 1, 0, s.id);
      else {
        var ret = day.tours.findIndex(function (id) { return /transport-(hiroshima|kyoto)-osaka-return/.test(id); });
        if (ret >= 0) day.tours.splice(ret, 0, s.id); else day.tours.push(s.id);
      }
    });
    p._updates = p._updates || {}; p._updates.pokemonRouteV1 = true;
    return true;
  }
  function register(defs) {
    STOPS.forEach(function (s) {
      var hours = s.id === 'pokemon-kyoto' ? 35/60 : s.id === 'pokemon-hiroshima' ? .5 : s.kind === 'Store' ? s.id === 'pokemon-kisarazu' ? 25/60 : 1/3 : s.id === 'pokemon-osaka' || s.id === 'pokemon-osaka-umeda' ? .75 : s.id === 'pokemon-tokyo-dx' || s.id === 'pokemon-skytree' ? .75 : 1;
      defs[s.id] = { icon: '◉', label: s.name, hours: Math.round(hours*100)/100, region: s.city === 'Kyoto' ? 'kyoto' : s.city === 'Hiroshima' ? 'hiro' : s.city === 'Osaka' ? 'osaka' : 'tokyo', colorKey: s.city === 'Kyoto' ? 'kyoto' : s.city === 'Hiroshima' ? 'hiro' : s.city === 'Osaka' ? 'osaka' : 'tokyo', travel: 'Transporte local · ' + s.window, environment: 'indoor', bullets: [s.address, 'Funcionamento: ' + s.hours + ' · duração: ' + s.duration, s.window, s.feature, s.alert], guide: { cardTitle:s.name, icon:'◉', city:s.city, hours:hours, intro:s.why + ' ' + s.feature + ' ' + s.alert, images:[], videos:[], hiddenGems:[], overrated:[], mustSee:[{name:s.feature,why:s.why}], smartRoute:[{time:s.id === 'pokemon-kyoto' ? '10:45–11:20' : '',place:s.name,note:s.window + '. ' + s.duration + '. ' + s.alert}] } };
    });
    var g = defs['kyoto-guided-higashiyama'] && defs['kyoto-guided-higashiyama'].guide;
    if (g && g.smartRoute && !g.smartRoute.some(function (x) {return x.place === 'Pokémon Center KYOTO';})) {
      var idx = g.smartRoute.findIndex(function (x) { return x.place === 'Deslocamento para o Nishiki Market'; });
      if (idx >= 0) g.smartRoute.splice(idx, 1, {time:'~10:15',place:'Tofuku-ji → SUINA Muromachi',note:'Transporte local (trem/metrô ou táxi); reduzir/pular Tofuku-ji se houver fila.'}, {time:'10:45–11:20',place:'Pokémon Center KYOTO',note:'SUINA Muromachi 2F. Sair até 11:20, chegar ao Nishiki ~11:45. O guia às 12:00 é prioridade; estoque não garantido.'});
      g.intro += ' Parada Pokémon Center KYOTO 10:45–11:20 antes do encontro; sair até 11:20 para chegar ao Nishiki por volta de 11:45.';
      defs['kyoto-guided-higashiyama'].bullets.push('Pokémon Center KYOTO · SUINA Muromachi 2F · 10:45–11:20; Nishiki ~11:45');
    }
  }
  function route(iso, points) {
    var out = points.slice();
    // Correct the ambiguous old Pokémon pin only, not any other attraction.
    if (iso === '2026-11-10') out = out.filter(function (p) {return !/Pokémon Center Osaka/i.test(p.name);});
    forDate(iso).forEach(function (s) {
      var pin = {name:s.name, lat:s.lat, lng:s.lng, tourId:s.id, pokemon:true, address:s.address};
      var idx = s.anchor ? out.findIndex(function (p) { return p.name.indexOf(s.anchor) !== -1; }) : -1;
      if (idx >= 0) out.splice(idx+1,0,pin);
      else out.splice(Math.max(0,out.length-1),0,pin);
    });
    return out;
  }
  function links(s) { return '<div class="pokemon-links"><a target="_blank" rel="noopener noreferrer" href="' + s.url + '">Site oficial</a><small>shop.pokemon.co.jp</small><a target="_blank" rel="noopener noreferrer" href="' + mapUrl(s) + '">Abrir no mapa</a></div>'; }
  function detail(iso) { var stops=forDate(iso); return stops.length ? '<section class="pokemon-day-detail"><h3>' + ball() + ' Rota Pokémon</h3>' + stops.map(function(s) {return '<p><b>' + esc(s.name) + '</b><br>' + esc(s.window) + ' · ' + esc(s.duration) + '<br>' + esc(s.alert) + '</p>' + links(s);}).join('') + '</section>' : ''; }
  function load() { try { return JSON.parse(window.JaplannerSharedStore.get(KEY) || '{}'); } catch(e) {return {};} }
  function render() {
    var host = document.getElementById('pokemon-view'); if (!host || !window.JaplannerSharedStore) return;
    var state=load(), visited=STOPS.filter(function(s){return state[s.id] && state[s.id].visited;}).length;
    var html='<header class="pokemon-header"><div><h2>' + ball() + ' Rota Pokémon</h2><p>8 Pokémon Centers + 2 Pokémon Stores</p><b>Visitado ' + visited + '/10</b><progress max="10" value="' + visited + '" aria-label="Progresso visitado"></progress></div><button type="button" data-close-pokemon>Voltar ao roteiro</button></header><p class="pokemon-note">O estoque central se repete; itens regionais, limites, filas e sorteios podem mudar. Confirme os avisos oficiais perto da data.</p>';
    var group=''; STOPS.forEach(function(s){
      var heading=s.date+'|'+s.city;
      if(group!==heading){if(group)html+='</div>';html+='<h3 class="pokemon-group">'+esc(s.city)+' · '+s.date.slice(8)+'/11/2026</h3><div class="pokemon-grid">';group=heading;}
      var item=state[s.id] || {};
      html+='<article class="pokemon-card"><h4>'+ball()+' '+esc(s.name)+'</h4><dl><dt>Funcionamento</dt><dd>'+esc(s.hours)+'</dd><dt>Janela planejada</dt><dd>'+esc(s.window)+'</dd><dt>Duração</dt><dd>'+esc(s.duration)+'</dd><dt>Endereço</dt><dd>'+esc(s.address)+'</dd><dt>Por que vale</dt><dd>'+esc(s.why)+'</dd><dt>Diferencial / exclusividade</dt><dd>'+esc(s.feature)+'</dd></dl><p class="pokemon-alert">'+esc(s.alert)+'</p>'+links(s)+'<div class="pokemon-checks"><label><input type="checkbox" data-stop="'+s.id+'" data-field="visited" '+(item.visited?'checked':'')+'> Visitado</label><label><input type="checkbox" data-stop="'+s.id+'" data-field="buy" '+(item.buy?'checked':'')+'> Quero comprar algo aqui</label></div></article>';
    });
    html+='</div><section class="pokemon-outside"><h3>Fora do roteiro</h3><p><a target="_blank" rel="noopener noreferrer" href="https://shop.pokemon.co.jp/ja/shop/pokemonstore-gotemba/">Gotemba</a> — o outlet previsto é Kisarazu; não foi criado outro passeio.</p><p><a target="_blank" rel="noopener noreferrer" href="https://shop.pokemon.co.jp/ja/shop/pokemoncenter-tokyobay/">Tokyo Bay</a> — LaLaport TOKYO-BAY exige outro desvio, não previsto no roteiro.</p><p><a target="_blank" rel="noopener noreferrer" href="https://shop.pokemon.co.jp/ja/shop/pokemonstore-narita-airport/">Narita T1</a> — Terminal 1, ala sul, 4F; terminal e tempo antes do voo não confirmados, sem nova parada.</p><small>shop.pokemon.co.jp · informações apenas, sem adicionar atividades</small></section>';
    host.innerHTML=html;
  }
  window.plannerShowPokemon=function(show){
    if(show!==false && window.plannerSetMobileView)window.plannerSetMobileView('pokemon');
    document.body.classList.toggle('pokemon-open',show!==false);
    if(show!==false)render(); else if(window.plannerSetMobileView)window.plannerSetMobileView('cal');
    window.scrollTo(0,0);
  };
  window.JaplannerPokemon={key:KEY,stops:STOPS,forDate:forDate,migrate:migrate,register:register,route:route,badge:badge,detail:detail,ball:ball,mapUrl:mapUrl,render:render};
  document.addEventListener('DOMContentLoaded',function(){
    var b=document.getElementById('open-pokemon-view');if(b)b.addEventListener('click',function(){window.plannerShowPokemon(true);});
    var host=document.getElementById('pokemon-view');if(!host)return;
    host.addEventListener('click',function(e){if(e.target.closest('[data-close-pokemon]'))window.plannerShowPokemon(false);});
    host.addEventListener('change',function(e){var input=e.target;if(!input.dataset.stop)return;var state=load();state[input.dataset.stop]=state[input.dataset.stop] || {};state[input.dataset.stop][input.dataset.field]=input.checked;window.JaplannerSharedStore.set(KEY,JSON.stringify(state));var focusId=input.dataset.stop, field=input.dataset.field;render();var replacement=host.querySelector('[data-stop="'+focusId+'"][data-field="'+field+'"]');if(replacement)replacement.focus();});
    // Existing desktop module actions close this module without modifying their behavior.
    document.querySelector('.today-toolbar').addEventListener('click',function(e){var button=e.target.closest('button');if(button && button.id!=='open-pokemon-view'){document.body.classList.remove('pokemon-open','m-pokemon');}});
  });
})();
