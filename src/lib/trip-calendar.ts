type Step = { time?: string; place?: string; note?: string; dayOffset?: number; confirmed?: boolean };
type Tour = { label?: string; hours?: number; region?: string; bullets?: string[]; suggested?: string[]; travel?: string | null; guide?: { city?: string; timeMode?: string; smartRoute?: Step[]; dateRoutes?: Record<string, Step[]> } };
type Day = { tours?: string[]; base?: string; note?: string };
export type CalendarEvent = { uid: string; date: string; title: string; location: string; description: string; start: number | null; end: number | null; conflict: boolean; confirmed?: boolean };
function parse(value: unknown): any {
  if (typeof value !== 'string') return value || {};
  try { return JSON.parse(value); } catch { return {}; }
}
function hash(s: string) { let n = 2166136261; for (const c of s) n = Math.imul(n ^ c.charCodeAt(0), 16777619); return (n >>> 0).toString(16); }
function clock(s: string) {
  const m = /(?:^|[~\s])(\d{1,2}):(\d{2})/.exec(s);
  if (!m || +m[1] > 23 || +m[2] > 59) return null;
  return +m[1] * 60 + +m[2];
}
function duration(s: string) {
  const m = /(\d+)(?:\s*[–-]\s*(\d+))?\s*min\b/.exec(s);
  return m ? Math.max(5, Math.min(240, +(m[2] || m[1]))) : null;
}
export function buildEvents(shared: Record<string, unknown>, catalog: Record<string, Tour>): CalendarEvent[] {
  const plan = parse(shared['japan-trip-planner-v3']);
  const custom = parse(shared['japan-trip-planner-custom-v1']);
  const defs = { ...catalog, ...(custom.tours || {}) } as Record<string, Tour>;
  const events: CalendarEvent[] = [];
  for (const date of Object.keys(plan).filter(d => /^2026-11-\d{2}$/.test(d)).sort()) {
    const day = plan[date] as Day;
    if (!Array.isArray(day?.tours)) continue;
    const seen = new Set<string>();
    const tourIds = day.tours.slice();
    // Same additive repair as the planner, also before a client has opened the new version.
    if (date === '2026-11-09' && !plan._updates?.osakaTransferCalendarV1 && tourIds.includes('dotonbori') && !tourIds.some(id => id === 'transport-haneda-hotel-osaka' || id === 'transport-tokyo-osaka')) tourIds.unshift('transport-haneda-hotel-osaka');
    for (const id of tourIds) {
      const def = defs[id] || { label: id };
      const route = def.guide?.dateRoutes?.[date] || def.guide?.smartRoute;
      const steps: Step[] = route?.length ? route : [{ place: def.label, note: [...(def.bullets || []), ...(def.suggested || []), def.travel || ''].join('\n') }];
      steps.forEach((step, index) => {
        const title = String(step.place || def.label || id).trim();
        const identity = id + '|' + title;
        if (seen.has(identity)) return;
        seen.add(identity);
        const relative = def.guide?.timeMode === 'relative';
        const start = relative ? null : clock(step.time || '');
        const range = /[–-]\s*(\d{1,2}):(\d{2})/.exec(step.time || '');
        const explicitEnd = range && +range[1] < 24 && +range[2] < 60 ? +range[1] * 60 + +range[2] : null;
        const nextStart = index + 1 < steps.length ? clock(steps[index + 1].time || '') : null;
        const estimate = duration(step.note || '') || (steps.length === 1 && def.hours ? Math.min(240, Math.round(def.hours * 60)) : 60);
        const end = start === null ? null : explicitEnd !== null ? explicitEnd + (explicitEnd <= start ? 1440 : 0) : start + Math.min(estimate, nextStart !== null && nextStart > start ? nextStart - start : estimate);
        const city = def.guide?.city || ({ tokyo: 'Tokyo', kyoto: 'Kyoto', osaka: 'Osaka', hiro: 'Hiroshima', hakone: 'Hakone' } as Record<string, string>)[def.region || ''] || 'Japan';
        const location = title + ', ' + city + ', Japan';
        const timing = start === null ? 'Atividade flexível: sem horário definido. O evento de dia inteiro não significa que a visita dure o dia todo.' : step.confirmed ? 'Início confirmado na reserva salva. Fuso Asia/Tokyo. Término e duração estimados.' : 'Horário sugerido do roteiro, no fuso Asia/Tokyo. Não representa uma reserva confirmada. A duração é estimada quando não informada.';
        const actualDate = step.dayOffset ? new Date(new Date(date + 'T00:00:00Z').getTime() + step.dayOffset * 86400000).toISOString().slice(0, 10) : date;
        events.push({ uid: actualDate + '-' + hash(identity) + '@plannerjapa.lovable.app', date: actualDate, title: (start === null ? '[Flexível] ' : '') + title, location, start, end, conflict: false, confirmed: !!step.confirmed, description: [timing, step.time ? (relative ? 'Tempo decorrido desde o início da atividade (não é hora do relógio): ' : 'Janela original: ') + step.time : '', step.note || '', 'Atividade: ' + (def.label || id), 'Mapa: https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(location), 'Roteiro: https://plannerjapa.lovable.app'].filter(Boolean).join('\n\n') });
      });
    }
  }
  // A stop can appear both inside a day's guide and in its own activity card.
  const unique = events.filter((event, index) => events.findIndex(other => other.date === event.date && other.start === event.start && other.title.normalize('NFKC').toLocaleLowerCase() === event.title.normalize('NFKC').toLocaleLowerCase()) === index);
  for (const event of unique) {
    event.conflict = event.start !== null && unique.some(other => other !== event && other.date === event.date && other.start !== null && event.start! < other.end! && other.start < event.end!);
    if (event.conflict) event.description = 'Atenção: sobreposição com outra atividade sugerida no roteiro. Ajuste os horários antes da visita.\n\n' + event.description;
  }
  return unique.sort((a, b) => a.date.localeCompare(b.date) || (a.start ?? -1) - (b.start ?? -1));
}
function escapeText(value: string) { return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,'); }
function fold(line: string) {
  let out = '', chunk = '', size = 0;
  for (const char of line) { const bytes = new TextEncoder().encode(char).length; if (size + bytes > 75) { out += chunk + '\r\n'; chunk = ' '; size = 1; } chunk += char; size += bytes; }
  return out + chunk;
}
function dateTime(date: string, minutes: number) {
  const stamp = new Date(date + 'T00:00:00Z'); stamp.setUTCMinutes(minutes);
  return stamp.toISOString().slice(0, 19).replace(/[-:]/g, '');
}
export function toIcs(events: CalendarEvent[], stamp = new Date().toISOString()) {
  const dtstamp = stamp.slice(0, 19).replace(/[-:]/g, '') + 'Z';
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PlannerJapa//Japao 2026//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Japão 2026', 'X-WR-TIMEZONE:Asia/Tokyo', 'REFRESH-INTERVAL;VALUE=DURATION:PT1H', 'BEGIN:VTIMEZONE', 'TZID:Asia/Tokyo', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0900', 'TZOFFSETTO:+0900', 'TZNAME:JST', 'END:STANDARD', 'END:VTIMEZONE'];
  for (const event of events) {
    lines.push('BEGIN:VEVENT', 'UID:' + event.uid, 'DTSTAMP:' + dtstamp);
    if (event.start === null) lines.push('DTSTART;VALUE=DATE:' + event.date.replace(/-/g, ''), 'DTEND;VALUE=DATE:' + dateTime(event.date, 1440).slice(0, 8));
    else lines.push('DTSTART;TZID=Asia/Tokyo:' + dateTime(event.date, event.start), 'DTEND;TZID=Asia/Tokyo:' + dateTime(event.date, event.end!));
    lines.push('SUMMARY:' + escapeText(event.title), 'DESCRIPTION:' + escapeText(event.description), 'LOCATION:' + escapeText(event.location), event.confirmed ? 'STATUS:CONFIRMED' : 'STATUS:TENTATIVE', 'TRANSP:TRANSPARENT', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
