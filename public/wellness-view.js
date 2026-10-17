(function () {
  "use strict";

  var KEY = "japan-trip-planner-jetlag-v1";
  var DEFAULTS = {
    profiles: [
      { id: "pedro", name: "Pedro", bedtime: "22:30", sleepHours: 8, energy: "" },
      { id: "jessica", name: "Jéssica", bedtime: "22:30", sleepHours: 8, energy: "" },
      { id: "friend-1", name: "Amiga 1", bedtime: "22:30", sleepHours: 8, energy: "" },
      { id: "friend-2", name: "Amiga 2", bedtime: "22:30", sleepHours: 8, energy: "" },
    ],
    checklist: [
      { id: "mask", label: "Máscara de dormir e protetor auricular separados", done: false },
      { id: "water", label: "Garrafa vazia na bagagem de mão para encher após a segurança", done: false },
      { id: "clock", label: "Celular e relógio configurados no horário do destino ao embarcar", done: false },
      { id: "caffeine", label: "Plano de cafeína combinado com o grupo", done: false },
      { id: "meds", label: "Uso de melatonina ou remédio confirmado individualmente com profissional", done: false },
    ],
    checkins: {},
  };

  var FLIGHTS = [
    { direction: "Ida", date: "07/11", from: "São Paulo", to: "Doha", depart: "11:20", arrive: "07:00 (+1)", duration: "13h40" },
    { direction: "Ida", date: "08/11", from: "Doha", to: "Haneda", depart: "07:45", arrive: "23:55", duration: "10h10" },
    { direction: "Volta", date: "27/11", from: "Narita", to: "Doha", depart: "16:55", arrive: "23:05", duration: "12h10" },
    { direction: "Volta", date: "28/11", from: "Doha", to: "São Paulo", depart: "01:35", arrive: "10:40", duration: "15h05" },
  ];

  var MOMENTS = [
    { at: "2026-11-04T00:00:00-03:00", until: "2026-11-05T00:00:00-03:00", title: "Começar a antecipar o sono", detail: "Dormir 45 minutos antes do horário habitual e buscar luz logo ao acordar." },
    { at: "2026-11-05T00:00:00-03:00", until: "2026-11-06T00:00:00-03:00", title: "Segundo ajuste de sono", detail: "Dormir mais 45 minutos cedo; jantar e reduzir luz também mais cedo." },
    { at: "2026-11-06T00:00:00-03:00", until: "2026-11-07T05:30:00-03:00", title: "Última noite antes do voo", detail: "Meta de Pedro: deitar entre 20h30 e 21h e deixar a mala pronta." },
    { at: "2026-11-07T05:30:00-03:00", until: "2026-11-07T11:20:00-03:00", title: "Manhã do embarque", detail: "Acordar entre 5h30 e 6h, hidratar e evitar cafeína para facilitar o sono no avião." },
    { at: "2026-11-07T11:20:00-03:00", until: "2026-11-07T13:00:00-03:00", title: "Decolagem e refeição leve", detail: "Ajustar relógios para o Japão e preparar máscara e protetor auricular." },
    { at: "2026-11-07T13:00:00-03:00", until: "2026-11-07T20:00:00-03:00", title: "Janela principal de sono da ida", detail: "Tentar dormir. Esta janela corresponde aproximadamente a 1h–8h no Japão." },
    { at: "2026-11-07T20:00:00-03:00", until: "2026-11-08T11:55:00-03:00", title: "Permanecer acordado", detail: "Luz, hidratação e movimento. No segundo voo, cochilo de emergência limitado a 20 minutos." },
    { at: "2026-11-08T11:55:00-03:00", until: "2026-11-08T13:30:00-03:00", title: "Chegada a Haneda", detail: "No Japão são 23h55. Ir direto ao hotel, usar pouca luz e dormir assim que possível." },
    { at: "2026-11-09T08:30:00+09:00", until: "2026-11-09T15:00:00+09:00", title: "Primeira manhã no Japão", detail: "Acordar entre 8h30 e 9h30, caminhar ao ar livre e evitar cochilo longo." },
    { at: "2026-11-24T00:00:00+09:00", until: "2026-11-25T00:00:00+09:00", title: "Preparar a volta", detail: "Dormir perto das 23h, cerca de 30 minutos mais tarde que o habitual." },
    { at: "2026-11-25T00:00:00+09:00", until: "2026-11-26T00:00:00+09:00", title: "Segundo ajuste da volta", detail: "Dormir perto das 23h30, sem reduzir a duração total do sono." },
    { at: "2026-11-26T00:00:00+09:00", until: "2026-11-27T08:00:00+09:00", title: "Última noite no Japão", detail: "Dormir perto de meia-noite e acordar entre 8h e 9h." },
    { at: "2026-11-27T16:55:00+09:00", until: "2026-11-28T01:35:00+03:00", title: "Primeiro voo da volta", detail: "Permanecer acordado. No horário de São Paulo, este trecho corresponde ao dia." },
    { at: "2026-11-28T01:35:00+03:00", until: "2026-11-28T21:30:00-03:00", title: "Segundo voo e chegada ao Brasil", detail: "Dormir aproximadamente de 21h30 a 5h30 no horário de São Paulo; depois permanecer acordado até a noite." },
  ];

  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function esc(x) { return String(x == null ? "" : x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
  function load() {
    var state = null;
    try { state = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!state || !Array.isArray(state.profiles)) state = clone(DEFAULTS);
    if (!Array.isArray(state.checklist)) state.checklist = clone(DEFAULTS.checklist);
    if (!state.checkins || typeof state.checkins !== "object") state.checkins = {};
    return state;
  }
  function save(state) {
    var value = JSON.stringify(state);
    if (window.JaplannerSharedStore) window.JaplannerSharedStore.set(KEY, value);
    else localStorage.setItem(KEY, value);
  }
  function addMinutes(time, delta) {
    var parts = String(time || "22:30").split(":");
    var total = Number(parts[0]) * 60 + Number(parts[1]) + delta;
    while (total < 0) total += 1440;
    total %= 1440;
    return String(Math.floor(total / 60)).padStart(2, "0") + ":" + String(total % 60).padStart(2, "0");
  }
  function currentMoment() {
    var now = Date.now();
    var active = MOMENTS.filter(function (m) { return now >= Date.parse(m.at) && now < Date.parse(m.until); })[0];
    if (active) return { label: "Agora", item: active };
    var next = MOMENTS.filter(function (m) { return Date.parse(m.at) > now; })[0];
    if (next) return { label: "Próxima orientação", item: next };
    return { label: "Plano concluído", item: { title: "Rotina local", detail: "Mantenha sono, luz e refeições no horário de São Paulo." } };
  }
  function groupStatus(state) {
    var values = state.profiles.map(function (p) { return state.checkins[p.id] || {}; });
    var filled = values.filter(function (x) { return x.energy || x.slept; });
    if (!filled.length) return { tone: "neutral", title: "Check-in ainda não preenchido", detail: "Cada pessoa registra sono e energia antes de decidir o ritmo do dia." };
    var low = filled.filter(function (x) {
      return (x.energy !== "" && x.energy != null && Number(x.energy) <= 2) ||
        (x.slept !== "" && x.slept != null && Number(x.slept) < 5);
    }).length;
    if (low >= 2) return { tone: "slow", title: "Reduzir o ritmo do grupo", detail: "Duas ou mais pessoas estão com energia baixa ou dormiram menos de 5 horas." };
    if (low === 1) return { tone: "care", title: "Manter o primeiro bloco leve", detail: "Uma pessoa precisa de recuperação; reavaliem após o almoço." };
    return { tone: "good", title: "Grupo em condição normal", detail: "Os registros atuais não indicam necessidade de cortar o roteiro." };
  }
  function profileSchedule(profile) {
    return [
      ["04/11", addMinutes(profile.bedtime, -45)],
      ["05/11", addMinutes(profile.bedtime, -90)],
      ["06/11", addMinutes(profile.bedtime, -120)],
      ["24/11", addMinutes(profile.bedtime, 30)],
      ["25/11", addMinutes(profile.bedtime, 60)],
      ["26/11", addMinutes(profile.bedtime, 90)],
    ];
  }
  function flightRows() {
    return FLIGHTS.map(function (f) {
      return '<article class="jl-flight"><span>' + esc(f.direction + " · " + f.date) + '</span><div><b>' + esc(f.depart) + '</b><small>' + esc(f.from) + '</small></div><i></i><div><b>' + esc(f.arrive) + '</b><small>' + esc(f.to) + '</small></div><em>' + esc(f.duration) + '</em></article>';
    }).join("");
  }
  function timelineRows() {
    return [
      ["Ida", "07/11 · 13h–20h (Brasil)", "Dormir", "Corresponde aproximadamente a 1h–8h no Japão."],
      ["Ida", "Após 20h (Brasil)", "Ficar acordado", "No segundo voo, cochilo emergencial de até 20 minutos."],
      ["Chegada", "08/11 · 23h55 (Japão)", "Hotel e cama", "Pouca luz; sem passeio ou refeição pesada."],
      ["Japão", "09/11 · 8h30–9h30", "Luz natural", "Trem ao meio-dia; Dotonbori permanece opcional."],
      ["Volta", "27/11 · NRT → DOH", "Ficar acordado", "Esse trecho coincide com o dia em São Paulo."],
      ["Volta", "21h30–5h30 (Brasil)", "Dormir", "Principal janela no voo Doha → São Paulo."],
      ["Brasil", "28/11 · após 10h40", "Ficar acordado", "Cochilo de 20–30 minutos apenas se indispensável."],
    ].map(function (x) { return '<div class="jl-timeline-row"><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b><strong>' + esc(x[2]) + '</strong><small>' + esc(x[3]) + '</small></div>'; }).join("");
  }
  function render() {
    var host = document.getElementById("jetlag-view");
    if (!host) return;
    var state = load();
    var now = currentMoment();
    var status = groupStatus(state);
    host.innerHTML = '<div class="jl-shell"><div class="transport-hero jl-hero"><div><div class="today-eyebrow">Sono e adaptação ao fuso</div><h2>Plano de jet lag do grupo</h2><p>São Paulo, Doha e Japão organizados em uma única linha do tempo.</p></div><button type="button" data-close-jetlag>Voltar ao calendário</button></div>' +
      '<section class="jl-now"><div><span>' + esc(now.label) + '</span><h3>' + esc(now.item.title) + '</h3><p>' + esc(now.item.detail) + '</p></div><button type="button" data-jl-refresh>Atualizar orientação</button></section>' +
      '<section class="jl-grid"><article class="jl-card"><div class="jl-heading"><div><span>Voos confirmados</span><h3>Linha do tempo</h3></div></div><div class="jl-flights">' + flightRows() + '</div></article>' +
      '<article class="jl-card"><div class="jl-heading"><div><span>Decisão diária</span><h3>Estado do grupo</h3></div></div><div class="jl-group-status ' + status.tone + '"><b>' + esc(status.title) + '</b><p>' + esc(status.detail) + '</p></div><div class="jl-checkins">' + state.profiles.map(function (p) { var c = state.checkins[p.id] || {}; return '<div><b>' + esc(p.name) + '</b><label>Horas dormidas<input type="number" min="0" max="14" step="0.5" data-jl-slept="' + esc(p.id) + '" value="' + esc(c.slept || "") + '" placeholder="8"></label><label>Energia<select data-jl-energy="' + esc(p.id) + '"><option value="">Selecionar</option>' + [1,2,3,4,5].map(function (n) { return '<option value="' + n + '" ' + (String(c.energy) === String(n) ? "selected" : "") + '>' + n + '/5</option>'; }).join("") + '</select></label></div>'; }).join("") + '</div></article></section>' +
      '<section class="jl-card"><div class="jl-heading"><div><span>Durante a viagem</span><h3>O que fazer em cada etapa</h3></div></div><div class="jl-timeline">' + timelineRows() + '</div></section>' +
      '<section class="jl-card"><div class="jl-heading"><div><span>Personalização</span><h3>Horário habitual de cada pessoa</h3></div><small>O cronograma individual é salvo para todo o grupo.</small></div><div class="jl-profiles">' + state.profiles.map(function (p) { var rows = profileSchedule(p); return '<article><label>Nome<input type="text" data-jl-name="' + esc(p.id) + '" value="' + esc(p.name) + '"></label><label>Hora normal de dormir<input type="time" data-jl-bedtime="' + esc(p.id) + '" value="' + esc(p.bedtime) + '"></label><div class="jl-mini-schedule"><b>Ida</b><span>04/11 · ' + rows[0][1] + '</span><span>05/11 · ' + rows[1][1] + '</span><span>06/11 · ' + rows[2][1] + '</span><b>Volta</b><span>24/11 · ' + rows[3][1] + '</span><span>25/11 · ' + rows[4][1] + '</span><span>26/11 · ' + rows[5][1] + '</span></div></article>'; }).join("") + '</div><p class="jl-medical-note">Melatonina e medicamentos não são marcados automaticamente. Cada pessoa deve confirmar individualmente com médico ou farmacêutico.</p></section>' +
      '<section class="jl-card"><div class="jl-heading"><div><span>Bagagem de mão</span><h3>Checklist compartilhado</h3></div><b>' + state.checklist.filter(function (x) { return x.done; }).length + '/' + state.checklist.length + '</b></div><div class="jl-checklist">' + state.checklist.map(function (x) { return '<label><input type="checkbox" data-jl-check="' + esc(x.id) + '" ' + (x.done ? "checked" : "") + '><span>' + esc(x.label) + '</span></label>'; }).join("") + '</div></section>' +
      '<section class="jl-card jl-reference"><b>Referência clínica</b><p>O plano usa mudança gradual de horário, sono alinhado ao destino, luz natural, hidratação e cochilos curtos. Ajustes médicos permanecem individuais.</p><a href="https://www.cdc.gov/yellow-book/hcp/travel-air-sea/jet-lag-disorder.html" target="_blank" rel="noopener">CDC Yellow Book 2026</a></section></div>';
    host.querySelector("[data-close-jetlag]").addEventListener("click", function () { window.plannerShowJetlag(false); });
    host.querySelector("[data-jl-refresh]").addEventListener("click", render);
    host.querySelectorAll("[data-jl-name]").forEach(function (input) { input.addEventListener("change", function () { var p = state.profiles.filter(function (x) { return x.id === input.dataset.jlName; })[0]; if (p) p.name = input.value.trim() || p.name; save(state); render(); }); });
    host.querySelectorAll("[data-jl-bedtime]").forEach(function (input) { input.addEventListener("change", function () { var p = state.profiles.filter(function (x) { return x.id === input.dataset.jlBedtime; })[0]; if (p) p.bedtime = input.value || "22:30"; save(state); render(); }); });
    host.querySelectorAll("[data-jl-slept]").forEach(function (input) { input.addEventListener("change", function () { var id = input.dataset.jlSlept; state.checkins[id] = state.checkins[id] || {}; state.checkins[id].slept = input.value; save(state); render(); }); });
    host.querySelectorAll("[data-jl-energy]").forEach(function (input) { input.addEventListener("change", function () { var id = input.dataset.jlEnergy; state.checkins[id] = state.checkins[id] || {}; state.checkins[id].energy = input.value; save(state); render(); }); });
    host.querySelectorAll("[data-jl-check]").forEach(function (input) { input.addEventListener("change", function () { var item = state.checklist.filter(function (x) { return x.id === input.dataset.jlCheck; })[0]; if (item) item.done = input.checked; save(state); render(); }); });
  }

  function todayCard() {
    var m = currentMoment();
    return '<div class="today-card jl-today-card"><h3>Jet lag</h3><span>' + esc(m.label) + '</span><b>' + esc(m.item.title) + '</b><p>' + esc(m.item.detail) + '</p><button type="button" onclick="window.plannerShowJetlag(true)">Abrir plano do grupo</button></div>';
  }

  window.JaplannerJetlag = { todayCard: todayCard, getState: load };
  window.plannerShowJetlag = function (show) {
    document.body.classList.toggle("jetlag-open", show !== false);
    if (show !== false) render();
    window.scrollTo(0, 0);
  };
  function bindButton() {
    var button = document.getElementById("open-jetlag-view");
    if (button) button.addEventListener("click", function () { window.plannerShowJetlag(true); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindButton);
  else bindButton();
})();
