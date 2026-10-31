(function () {
  'use strict';
  var feed = location.origin + '/api/public/calendar';
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('open-calendar-export');
    if (!button) return;
    var style = document.createElement('style');
    style.textContent = '#trip-calendar-dialog [hidden]{display:none!important}#trip-calendar-dialog{box-sizing:border-box;width:min(720px,94vw);max-height:88dvh;border:1px solid #ddd4c4;border-radius:12px;padding:24px;color:#2b2620;background:#fffdf8;font:14px/1.5 system-ui}#trip-calendar-dialog::backdrop{background:#0007}#trip-calendar-dialog h2{margin:0}#trip-calendar-dialog .cal-head{display:flex;justify-content:space-between;gap:12px;align-items:start}#trip-calendar-dialog button,#trip-calendar-dialog .cal-link{display:inline-block;padding:10px 14px;border:1px solid #bcb3a3;border-radius:6px;background:white;color:#2b2620;font:inherit;cursor:pointer;text-decoration:none}#trip-calendar-dialog .cal-actions{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}#trip-calendar-dialog .cal-primary{background:#16344d;color:white}#trip-calendar-dialog input{box-sizing:border-box;width:100%;padding:10px;font:inherit;border:1px solid #bcb3a3;border-radius:6px}#trip-calendar-dialog .cal-notice{border-left:3px solid #b97829;padding:8px 12px;background:#fff2dc}#trip-calendar-dialog .cal-events{max-height:260px;overflow:auto}#trip-calendar-dialog .cal-event{padding:8px 0;border-bottom:1px solid #e7e0d3}#trip-calendar-dialog :focus-visible{outline:3px solid #3974a3;outline-offset:2px}';
    document.head.appendChild(style);
    var dialog = document.createElement('dialog');
    dialog.id = 'trip-calendar-dialog';
    dialog.setAttribute('aria-labelledby', 'trip-calendar-title');
    dialog.innerHTML = '<div class="cal-head"><h2 id="trip-calendar-title">Japão 2026 no Google Calendar</h2><button type="button" data-cal-close aria-label="Fechar">Fechar</button></div><p>Um evento por atividade, com horários no fuso do Japão (Asia/Tokyo). Visitas sem horário aparecem como flexíveis no topo do dia.</p><p class="cal-notice">Inícios confirmados nas reservas salvas são identificados nos eventos; os demais horários, durações e transportes são sugestões. Conflitos são sinalizados. Atividades flexíveis não ocupam o dia inteiro.</p><p data-cal-status role="status">Carregando roteiro…</p><div class="cal-actions"><a class="cal-link cal-primary" data-cal-subscribe target="_blank" rel="noopener noreferrer">Adicionar ao Google Calendar</a><a class="cal-link" data-cal-download>Baixar arquivo .ics</a><button type="button" data-cal-copy>Copiar link de assinatura</button></div><label for="trip-calendar-url">Endereço do calendário</label><input id="trip-calendar-url" readonly><details><summary>Como adicionar e atualizar</summary><ol><li>No Google Calendar pelo computador, abra Outros calendários → + → Do URL.</li><li>Cole o endereço acima e confirme.</li><li>Depois ele aparecerá também no celular, na mesma conta Google.</li></ol><p>A assinatura acompanha o roteiro salvo; o Google controla quando busca as alterações. Editar no Google não altera o planner. O arquivo .ics é uma cópia e não se atualiza. Use somente uma opção para evitar calendários duplicados.</p><p>O calendário segue o mesmo acesso público do planner. Inclui atividades e locais, sem códigos de reserva, comentários do dia ou gastos.</p><p>Para enxergar as horas locais antes da viagem, selecione Asia/Tokyo como fuso no Google Calendar.</p></details><details><summary>Conferir eventos por dia</summary><div class="cal-events" data-cal-events></div></details><p><a href="https://support.google.com/calendar/answer/37100?hl=pt-BR" target="_blank" rel="noopener noreferrer">Ajuda oficial do Google Calendar</a></p>';
    document.body.appendChild(dialog);
    dialog.querySelector('[data-cal-close]').onclick = function () { dialog.close(); };
    dialog.querySelector('#trip-calendar-url').value = feed;
    var subscribe = dialog.querySelector('[data-cal-subscribe]');
    subscribe.href = 'https://calendar.google.com/calendar/u/0/r?cid=' + encodeURIComponent(feed.replace(/^https?:/, 'webcal:'));
    var download = dialog.querySelector('[data-cal-download]');
    download.href = feed + '?download=1';
    download.setAttribute('download', 'japao-2026.ics');
    dialog.querySelector('[data-cal-copy]').onclick = async function () {
      try { await navigator.clipboard.writeText(feed); this.textContent = 'Link copiado'; }
      catch (e) { var input = dialog.querySelector('input'); input.focus(); input.select(); }
    };
    button.onclick = async function () {
      dialog.showModal();
      var status = dialog.querySelector('[data-cal-status]');
      status.textContent = 'Salvando e carregando roteiro…';
      download.hidden = true; subscribe.hidden = true;
      try {
        if (window.JaplannerSharedStore.flush) await window.JaplannerSharedStore.flush();
        var response = await fetch(feed + '?format=json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Não foi possível carregar os eventos. Tente novamente.');
        var data = await response.json(), events = data.events;
        status.textContent = events.length + ' eventos em ' + new Set(events.map(function (e) { return e.date; })).size + ' dias · ' + events.filter(function (e) { return e.confirmed; }).length + ' inícios confirmados · ' + events.filter(function (e) { return e.start === null; }).length + ' flexíveis · ' + events.filter(function (e) { return e.conflict; }).length + ' com sobreposição a revisar';
        download.hidden = false; subscribe.hidden = false;
        dialog.querySelector('[data-cal-events]').innerHTML = events.map(function (e) {
          function time(n) { return String(Math.floor(n / 60) % 24).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0'); }
          return '<div class="cal-event"><b>' + esc(e.date.slice(8) + '/11 · ' + (e.start === null ? 'Flexível' : time(e.start) + '–' + time(e.end))) + '</b><br>' + esc(e.title) + (e.confirmed ? '<br><small>Início confirmado na reserva salva</small>' : '') + (e.conflict ? '<br><small>Sobreposição de horários sugeridos</small>' : '') + '</div>';
        }).join('');
      } catch (e) { status.textContent = e.message || 'Não foi possível carregar os eventos. Tente novamente.'; }
    };
  });
})();
