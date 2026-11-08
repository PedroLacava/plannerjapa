(function () {
  'use strict';
  var FIRST = '2026-11-08', LAST = '2026-11-27', SCALE = 64 / 60;
  function addDays(iso, n) { var d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function weekStart(iso) { return addDays(iso, -(new Date(iso + 'T00:00:00Z').getUTCDay() + 6) % 7); }
  function splitEvents(events) {
    var out = [];
    events.forEach(function (e, index) {
      if (e.start === null) { out.push({ date:e.date, start:null, end:null, event:e, index:index }); return; }
      var start = e.start, end = e.end, date = e.date;
      while (end > 0) {
        if (start < 1440) out.push({date:date,start:Math.max(0,start),end:Math.min(1440,end),event:e,index:index});
        start = 0; end -= 1440; date = addDays(date, 1);
      }
    });
    return out;
  }
  function layout(items) {
    var sorted = items.slice().sort(function (a,b) {return a.start-b.start || b.end-a.end;});
    var groups = [], group = [], end = -1;
    sorted.forEach(function (item) {
      if (group.length && item.start >= end) { groups.push(group); group=[]; end=-1; }
      group.push(Object.assign({},item)); end=Math.max(end,item.end);
    });
    if(group.length)groups.push(group);
    return groups.flatMap(function (list) {
      var lanes=[];
      list.forEach(function (item) { var lane=lanes.findIndex(function (end) {return end<=item.start;});if(lane<0)lane=lanes.length;lanes[lane]=item.end;item.lane=lane; });
      return list.map(function (item) {item.lanes=lanes.length;return item;});
    });
  }
  var math={addDays:addDays,weekStart:weekStart,splitEvents:splitEvents,layout:layout};
  if(typeof window!=='undefined')window.PlannerWeekMath=math;
  if(typeof document==='undefined')return;
  var api=null, mounted=false, mode='trip', selected='2026-11-09', events=[], host, grid, dialog, loading=null, painted='', requestSerial=0;
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function store(k,v){try{localStorage.setItem(k,v);}catch(e){}}
  function read(k){try{return localStorage.getItem(k);}catch(e){return null;}}
  function clamp(d){return /^2026-11-\d{2}$/.test(d||'') ? d<FIRST?FIRST:d>LAST?LAST:d : '2026-11-09';}
  function time(n){return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
  function dateLabel(iso,long){return new Intl.DateTimeFormat('pt-BR',{day:'numeric',month:long?'long':'short',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));}
  function span(e){if(e.start===null)return 'Horário flexível';return dateLabel(e.date)+' · '+time(e.start)+'–'+time(e.end%1440)+(e.end>=1440?' do dia '+dateLabel(addDays(e.date,1)):'')+(e.timezone==='Asia/Qatar'?' · Doha (UTC+3)':' · Japão');}
  function color(e){var allowed=['tokyo','kyoto','osaka','hakone','hiro','far','koyasan'];var region=e.kind==='transport'?'transport':allowed.indexOf(e.region)>=0?e.region:'free';if(e.kind==='meal')region='free';return '--event-color:var(--'+region+');--event-bg:var(--'+region+'-bg)';}
  function dates(){return mode==='day'?[selected]:Array.from({length:7},function(_,i){return addDays(weekStart(selected),i);});}
  function baseLabel(date){if(!api||!api.getPlan)return '';var day=api.getPlan()[date];var base=day&&api.baseDefs[day.base];return base&&(base.sleepCity||base.label)||'';}
  function buttons(){document.querySelectorAll('[data-planner-view]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.plannerView===mode));});}
  function setMode(next,date){
    if(mode==='trip'&&next!=='trip'&&!date&&api&&api.getSelectedDate)selected=clamp(api.getSelectedDate()||selected);
    if(date)selected=clamp(date);
    mode=next;store('japlanner-calendar-view-v1',mode);store('japlanner-calendar-date-v1',selected);
    document.body.classList.toggle('week-open',mode!=='trip');host.hidden=mode==='trip';buttons();
    if(mode!=='trip'){render();refresh();}
  }
  function showDialog(title){dialog.querySelector('[data-wk-title]').textContent=title;dialog.querySelector('[data-wk-content]').replaceChildren();if(!dialog.open)dialog.showModal();}
  function originalDay(date){dialog.close();setMode('trip',date);if(api&&api.selectDate)api.selectDate(date);if(innerWidth<=760&&window.plannerSetMobileView)window.plannerSetMobileView('detail');}
  function eventDetails(index){
    var e=events[index];if(!e)return;
    showDialog(e.title.replace(/^\[Flexível\]\s*/,''));
    var body=dialog.querySelector('[data-wk-content]');
    var when=document.createElement('p');when.textContent=span(e);body.appendChild(when);
    var tag=document.createElement('b');tag.textContent=e.confirmed?'Início confirmado na reserva salva':e.start===null?'Visita flexível':'Horário sugerido';body.appendChild(tag);
    var desc=document.createElement('p');desc.className='wk-modal-notes';desc.textContent=e.description;body.appendChild(desc);
    var actions=document.createElement('div');actions.className='wk-modal-actions';
    var map=document.createElement('a');map.className='wk-link';map.textContent='Abrir no mapa';map.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(e.location);map.target='_blank';map.rel='noopener noreferrer';actions.appendChild(map);
    var day=document.createElement('button');day.type='button';day.textContent='Ver dia no roteiro completo';day.onclick=function(){originalDay(e.date);};actions.appendChild(day);body.appendChild(actions);
  }
  function dayDetails(date){
    showDialog('Atividades de '+dateLabel(date,true));var body=dialog.querySelector('[data-wk-content]');
    var segments=splitEvents(events).filter(function(s){return s.date===date;});
    if(!segments.length){var empty=document.createElement('p');empty.textContent='Sem atividades com horário neste dia.';body.appendChild(empty);}
    segments.forEach(function(s){var b=document.createElement('button');b.type='button';b.className='wk-day-event';b.textContent=(s.start===null?'Flexível':time(s.start)+'–'+time(s.end))+' · '+s.event.title.replace(/^\[Flexível\]\s*/,'');b.onclick=function(){eventDetails(s.index);};body.appendChild(b);});
  }
  function card(s){
    var e=s.event,duration=s.end-s.start,klass=(duration<15?' tiny':duration<35?' compact':'')+(e.confirmed?' reserved':'')+(e.conflict?' conflict':'');
    var title=e.title.replace(/^\[Flexível\]\s*/,'');
    return '<button type="button" class="wk-event'+klass+'" data-wk-event="'+s.index+'" style="'+color(e)+';top:'+(s.start*SCALE)+'px;height:'+Math.max(7,duration*SCALE-2)+'px;left:calc('+(s.lane/s.lanes*100)+'% + 2px);width:calc('+(100/s.lanes)+'% - 4px)" title="'+esc(time(s.start)+'–'+time(s.end)+' · '+title)+'" aria-label="'+esc(dateLabel(s.date)+' '+time(s.start)+' a '+time(s.end)+' '+title+(e.confirmed?', início confirmado':''))+'"><span class="wk-event-time">'+time(s.start)+'–'+time(s.end)+'</span><span class="wk-event-title">'+(e.kind==='pokemon'?'<span class="pokeball" aria-hidden="true"></span>':'')+esc(title)+'</span><span class="wk-event-tag">'+(e.confirmed?'Reserva':e.kind==='transport'?'Deslocamento':e.kind==='meal'?'Pausa':'Sugestão')+'</span></button>';
  }
  function render(){
    if(mode==='trip'||!mounted)return;
    var ds=dates(),segments=splitEvents(events),scroll=host.querySelector('.wk-scroll'),same=painted===mode+'|'+ds[0],top=scroll.scrollTop,left=scroll.scrollLeft;
    host.querySelector('[data-wk-heading]').textContent=mode==='day'?dateLabel(selected,true):dateLabel(ds[0])+' a '+dateLabel(ds[6],true);
    host.querySelector('[data-wk-subtitle]').textContent=(mode==='day'?'Agenda do dia':'Agenda semanal')+' · novembro de 2026 · '+(ds.indexOf('2026-11-08')>=0?'horário local: Doha UTC+3; Japão UTC+9':'horário do Japão');
    host.querySelector('[data-wk-week]').hidden=mode==='day';host.querySelector('[data-wk-date]').hidden=mode!=='day';
    host.querySelector('[data-wk-week]').value=weekStart(selected);host.querySelector('[data-wk-date]').value=selected;
    host.querySelector('[data-wk-prev]').disabled=mode==='day'?selected<=FIRST:ds[0]<=weekStart(FIRST);
    host.querySelector('[data-wk-next]').disabled=mode==='day'?selected>=LAST:ds[0]>=weekStart(LAST);
    host.querySelector('[data-wk-prev]').setAttribute('aria-label',mode==='day'?'Dia anterior':'Semana anterior');host.querySelector('[data-wk-next]').setAttribute('aria-label',mode==='day'?'Próximo dia':'Próxima semana');
    grid.className='wk-grid'+(mode==='day'?' daily':'');
    var html='<div class="wk-corner">'+(ds.indexOf('2026-11-08')>=0?'Local<br>UTC+3/+9':'JST<br>GMT+9')+'</div>';
    ds.forEach(function(date){var outside=date<FIRST||date>LAST;var dow=new Intl.DateTimeFormat('pt-BR',{weekday:'short',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));html+='<div class="wk-head'+(date===selected?' selected':'')+(outside?' outside':'')+'"><button type="button" data-wk-day="'+date+'" '+(outside?'disabled':'')+' aria-label="'+esc('Abrir visão diária de '+dateLabel(date,true))+'"><span class="wk-dow">'+esc(dow)+'</span><span class="wk-num">'+date.slice(8)+'</span><span class="wk-base">'+esc(baseLabel(date))+'</span></button></div>';});
    html+='<div class="wk-flex-label">Sem<br>horário</div>';
    ds.forEach(function(date){html+='<div class="wk-flex">'+segments.filter(function(s){return s.date===date&&s.start===null;}).map(function(s){return '<button type="button" data-wk-event="'+s.index+'">'+esc(s.event.title.replace(/^\[Flexível\]\s*/,''))+'</button>';}).join('')+'</div>';});
    html+='<div class="wk-hours">'+Array.from({length:24},function(_,h){return '<div class="wk-hour" style="top:'+(h*64)+'px">'+String(h).padStart(2,'0')+':00</div>';}).join('')+'</div>';
    ds.forEach(function(date){html+='<div class="wk-day'+(date<FIRST||date>LAST?' outside':'')+'" aria-label="'+esc('Atividades de '+dateLabel(date,true))+'">'+layout(segments.filter(function(s){return s.date===date&&s.start!==null;})).map(card).join('')+'</div>';});
    grid.innerHTML=html;
    var list=host.querySelector('[data-wk-day-list]');list.hidden=mode!=='day';
    if(mode==='day'){var day=segments.filter(function(s){return s.date===selected;});list.innerHTML='<summary>Lista completa do dia · '+day.length+' atividades</summary>'+day.map(function(s){return '<button type="button" class="wk-agenda-card" data-wk-event="'+s.index+'" style="'+color(s.event)+'"><small>'+(s.start===null?'Flexível':time(s.start)+'–'+time(s.end))+'</small><span>'+esc(s.event.title.replace(/^\[Flexível\]\s*/,''))+'</span></button>';}).join('');}
    if(same){scroll.scrollTop=top;scroll.scrollLeft=left;}else{
      var starts=segments.filter(function(s){return ds.indexOf(s.date)>=0&&s.start!==null&&s.start>=180;}).map(function(s){return s.start;});
      var first=starts.length?Math.min.apply(null,starts):420;
      scroll.scrollTop=Math.max(0,Math.min(21*64,(first/60-1)*64));scroll.scrollLeft=0;
      if(mode==='week'&&innerWidth<760){var ix=ds.indexOf(selected);scroll.scrollLeft=Math.max(0,ix*144);}
    }
    painted=events.length?mode+'|'+ds[0]:'';
  }
  async function refresh(){
    if(loading)return loading;
    var serial=++requestSerial,status=host.querySelector('[data-wk-status]');
    status.textContent='Atualizando atividades…';
    loading=(async function(){
      try{
        if(window.JaplannerSharedStore&&window.JaplannerSharedStore.flush)await window.JaplannerSharedStore.flush();
        var response=await fetch('/api/public/calendar?format=json',{cache:'no-store'});if(!response.ok)throw new Error('Sem conexão');
        var data=await response.json();if(!Array.isArray(data.events))throw new Error('Dados indisponíveis');
        if(serial!==requestSerial)return;events=data.events;
        store('japlanner-agenda-cache-v1',JSON.stringify({events:events,savedAt:new Date().toISOString()}));
        status.textContent='';render();
      }catch(e){
        try{var cached=JSON.parse(read('japlanner-agenda-cache-v1')||'null');if(cached&&Array.isArray(cached.events)){events=cached.events;status.textContent='Sem conexão · mostrando a última agenda salva neste aparelho.';render();}else status.textContent='Não foi possível carregar as atividades. Toque em Atualizar para tentar novamente.';}catch(ignore){status.textContent='Não foi possível carregar as atividades. Tente atualizar.';}
      }finally{loading=null;}
    })();return loading;
  }
  function mount(){
    if(mounted)return;
    var panel=document.querySelector('.calendar-panel');if(!panel)return;mounted=true;
    var bar=document.createElement('div');bar.className='planner-view-switch';bar.innerHTML='<span class="planner-view-label">VISUALIZAÇÃO DO ROTEIRO</span><div class="planner-view-buttons" role="group" aria-label="Visualização do roteiro"><button type="button" data-planner-view="trip" aria-pressed="true">Toda a viagem</button><button type="button" data-planner-view="week" aria-pressed="false">Semana</button><button type="button" data-planner-view="day" aria-pressed="false">Dia</button></div>';panel.prepend(bar);
    host=document.createElement('section');host.id='week-calendar';host.hidden=true;host.setAttribute('aria-label','Agenda de atividades');
    host.innerHTML='<div class="wk-toolbar"><div><h2 data-wk-heading>Agenda</h2><p data-wk-subtitle>Horário do Japão</p></div><div class="wk-controls"><button type="button" data-wk-prev aria-label="Semana anterior">‹</button><button type="button" data-wk-next aria-label="Próxima semana">›</button><select data-wk-week aria-label="Escolher semana"><option value="2026-11-02">2–8 nov · chegada</option><option value="2026-11-09">9–15 nov</option><option value="2026-11-16">16–22 nov</option><option value="2026-11-23">23–29 nov</option></select><input type="date" data-wk-date min="'+FIRST+'" max="'+LAST+'" aria-label="Escolher dia" hidden><button type="button" data-wk-start>Início</button><button type="button" data-wk-refresh>Atualizar</button></div></div><div class="wk-legend"><span><i class="wk-dot"></i>Cores das cidades</span><span><i class="wk-dot transit"></i>Deslocamentos</span><span><i class="wk-dot reserved"></i>Inícios confirmados</span></div><p class="wk-status" role="status" data-wk-status></p><p class="wk-hint">Na semana, deslize para os lados. Toque no dia para ampliar.</p><div class="wk-scroll" tabindex="0" aria-label="Agenda com horários; role para navegar"><div class="wk-grid"></div></div><details class="wk-day-agenda" data-wk-day-list hidden></details><p class="wk-footer">Toque em uma atividade para ver detalhes, mapa e indicação de reserva. Horários sugeridos e duração dos deslocamentos podem mudar.</p>';
    panel.appendChild(host);grid=host.querySelector('.wk-grid');
    dialog=document.createElement('dialog');dialog.id='week-event-dialog';dialog.setAttribute('aria-labelledby','week-event-title');dialog.innerHTML='<div class="wk-modal-top"><h2 id="week-event-title" data-wk-title>Atividade</h2><button type="button" data-wk-close aria-label="Fechar detalhes">Fechar</button></div><div data-wk-content></div>';document.body.appendChild(dialog);dialog.querySelector('[data-wk-close]').onclick=function(){dialog.close();};
    bar.onclick=function(e){var b=e.target.closest('[data-planner-view]');if(b)setMode(b.dataset.plannerView);};
    host.addEventListener('click',function(e){
      var target=e.target.closest('button');if(!target)return;
      if(target.hasAttribute('data-wk-event'))eventDetails(Number(target.dataset.wkEvent));
      else if(target.dataset.wkDay){if(mode==='week')setMode('day',target.dataset.wkDay);else dayDetails(target.dataset.wkDay);}
      else if(target.hasAttribute('data-wk-prev')){selected=clamp(addDays(mode==='day'?selected:weekStart(selected),mode==='day'?-1:-7));store('japlanner-calendar-date-v1',selected);render();}
      else if(target.hasAttribute('data-wk-next')){selected=clamp(addDays(mode==='day'?selected:weekStart(selected),mode==='day'?1:7));store('japlanner-calendar-date-v1',selected);render();}
      else if(target.hasAttribute('data-wk-start')){selected='2026-11-09';render();}
      else if(target.hasAttribute('data-wk-refresh'))refresh();
    });
    host.querySelector('[data-wk-week]').onchange=function(){selected=clamp(this.value);store('japlanner-calendar-date-v1',selected);render();};host.querySelector('[data-wk-date]').onchange=function(){selected=clamp(this.value);store('japlanner-calendar-date-v1',selected);render();};
    selected=clamp(read('japlanner-calendar-date-v1'));
    var saved=read('japlanner-calendar-view-v1');if(saved==='week'||saved==='day')setMode(saved);else buttons();
  }
  window.JaplannerWeek={init:function(config){api=config;mount();if(mode!=='trip')render();},refresh:function(){if(mounted&&mode!=='trip')refresh();}};
  document.addEventListener('DOMContentLoaded',mount);
})();
