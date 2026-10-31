import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildEvents, toIcs } from '../src/lib/trip-calendar.ts';
const defs = { city: { label: 'Harajuku', guide: { city: 'Tokyo', smartRoute: [{ time: '11:00 (sugestão)', place: '@cosme TOKYO', note: 'Visita de 45–60 min' }, { time: '12:00', place: 'Almoço' }] } }, flexible: { label: 'Pokémon flexível', hours: 1 } };
const shared = { 'japan-trip-planner-v3': JSON.stringify({ '2026-11-21': { tours: ['city', 'flexible'], note: 'PRIVATE DAY NOTE' } }) };
test('one event per stop; suggested times, flexible visits and estimated duration', () => {
  const events = buildEvents(shared, defs);
  assert.equal(events.length, 3);
  const cosme = events.find(e => e.title === '@cosme TOKYO');
  assert.equal(cosme.start, 660); assert.equal(cosme.end, 720);
  assert.equal(events.find(e => e.title.includes('flexível')).start, null);
  assert.match(cosme.description, /sugerido/);
  assert.doesNotMatch(toIcs(events), /PRIVATE DAY NOTE/);
});
test('UID remains stable when an earlier stop is added or time changes', () => {
  const before = buildEvents(shared, defs).find(e => e.title === '@cosme TOKYO').uid;
  const copy = structuredClone(defs);
  copy.city.guide.smartRoute.unshift({ time: '09:00', place: 'Meiji Jingu' });
  copy.city.guide.smartRoute[1].time = '11:15';
  assert.equal(buildEvents(shared, copy).find(e => e.title === '@cosme TOKYO').uid, before);
});
test('calendar syntax, explicit Japan timezone, escaped text and UTF-8 byte folding', () => {
  const events = buildEvents(shared, defs);
  events[0].title = 'ação'.repeat(60) + ',;\\\nBEGIN:VEVENT';
  const ics = toIcs(events, '2026-10-31T10:00:00Z');
  assert.match(ics, /DTSTART;TZID=Asia\/Tokyo:20261121T110000/);
  assert.match(ics, /DTSTART;VALUE=DATE:20261121/);
  assert.match(ics, /DTEND;VALUE=DATE:20261122/);
  assert.equal((ics.match(/^BEGIN:VEVENT\r$/gm) || []).length, 3);
  assert.ok(ics.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
  assert.equal(ics.split('\r\n').filter(l => l === 'STATUS:TENTATIVE').length, 3);
});
test('midnight rollover and explicit time ranges', () => {
  const events = buildEvents({ 'japan-trip-planner-v3': { '2026-11-08': { tours: ['late'] } } }, { late: { guide: { smartRoute: [{ time: '23:55', place: 'Chegada', note: '15 min' }, { time: '10:45–11:20', place: 'Kyoto' }] } } });
  assert.match(toIcs(events), /DTEND;TZID=Asia\/Tokyo:20261109T001000/);
  assert.equal(events.find(e => e.title === 'Kyoto').end, 680);
});
test('conflicts are disclosed without modifying source data; custom activities included', () => {
  const source = structuredClone(shared), original = JSON.stringify(source);
  source['japan-trip-planner-custom-v1'] = JSON.stringify({ tours: { flexible: { label: 'Minha visita', guide: { smartRoute: [{ time: '11:30', place: 'Parada pessoal' }] } } } });
  const before = JSON.stringify(source), events = buildEvents(source, defs);
  assert.equal(JSON.stringify(source), before);
  assert.ok(events.some(e => e.title === 'Parada pessoal' && e.conflict));
  assert.match(events[0].description, /sobreposição/);
  assert.equal(JSON.stringify(shared), original);
});
