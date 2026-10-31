import { test } from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../src/lib/calendar-catalog.ts';
import { buildEvents, toIcs } from '../src/lib/trip-calendar.ts';
test('9 November Dotonbori is an evening walk, not midnight offsets', () => {
  const events = buildEvents({ 'japan-trip-planner-v3': { '2026-11-09': { tours: ['dotonbori'] } } }, catalog);
  const stops = ['Ponte Ebisubashi','Kukuru Takoyaki','Caminhada pelo Tombori River Walk','Hozenji Yokocho','Jantar de Kushikatsu','Don Quijote Dotonbori'];
  const evening = events.filter(e => stops.includes(e.title));
  assert.equal(evening.length, 6);
  assert.deepEqual(evening.map(e => e.start), [1080,1100,1120,1140,1170,1200]);
  assert.equal(evening.at(-1).end, 1230);
  assert.match(toIcs(events), /DTSTART;TZID=Asia\/Tokyo:20261109T180000/);
  assert.doesNotMatch(toIcs(events), /DTSTART;TZID=Asia\/Tokyo:20261109T0[0-5]/);
});
test('relative itineraries stay flexible until a departure time is chosen', () => {
  for (const id of ['nishiki-market','kyoto-cooking','sake-tasting']) {
    const events = buildEvents({ 'japan-trip-planner-v3': { '2026-11-12': { tours: [id] } } }, catalog);
    assert.ok(events.length > 1);
    assert.ok(events.every(e => e.start === null));
    assert.match(events[0].description, /Tempo decorrido/);
    assert.doesNotMatch(toIcs(events), /DTSTART;TZID/);
  }
});
