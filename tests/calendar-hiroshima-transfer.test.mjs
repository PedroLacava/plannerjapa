import { test } from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../src/lib/calendar-catalog.ts';
import { buildEvents } from '../src/lib/trip-calendar.ts';
test('Hiroshima includes hotel walk, boarding buffer, train and final transfer before 9am', () => {
  const events = buildEvents({ 'japan-trip-planner-v3': { '2026-11-15': { tours: ['transport-osaka-hiroshima-out','peace-memorial','okonomimura','pokemon-hiroshima','transport-hiroshima-osaka-return'] } } }, catalog);
  const transfer = events.filter(e => e.start !== null && e.start < 540);
  assert.equal(transfer.length, 5);
  assert.deepEqual(transfer.map(e => [e.start,e.end]), [[375,385],[385,410],[410,498],[498,510],[510,540]]);
  assert.equal(events.filter(e => e.title === 'Almoço em Okonomi-mura').length, 1);
  assert.ok(!events.some(e => /Ajinoya|Namba|Hozenji|Glico/.test(e.title)));
  assert.equal(catalog.okonomimura.guide.city, 'Hiroshima');
  assert.match(transfer[2].description, /Confirmar operação em 15\/11/);
});
