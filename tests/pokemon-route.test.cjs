const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const context = { window: {}, document: { addEventListener() {} } };
vm.runInNewContext(readFileSync('public/pokemon-view.js', 'utf8'), context);
const api = context.window.JaplannerPokemon;
const clone = value => JSON.parse(JSON.stringify(value));

test('exactly eight Centers and two Stores on the nine requested dates', () => {
  assert.equal(api.stops.filter(s => s.kind === 'Center').length, 8);
  assert.equal(api.stops.filter(s => s.kind === 'Store').length, 2);
  assert.deepEqual(clone([...new Set(api.stops.map(s => s.date.slice(8)))]), ['10','11','15','16','19','21','22','23','24']);
  assert.equal(api.forDate('2026-11-19').length, 2);
});

test('additive migration preserves all original days, cards, hotels, comments and arbitrary fields', () => {
  const plan = { _updates: { existingRule: true }, otherMetadata: { comments: ['preservar'] } };
  for (let day = 8; day <= 27; day++) plan[`2026-11-${String(day).padStart(2,'0')}`] = { base: 'custom-hotel', tours: ['user-extra-a','kuromon','user-extra-b'], note: 'Meu comentário', bookings: { code: 'saved-code' }, expenses: [123] };
  const before = clone(plan);
  assert.equal(api.migrate(plan), true);
  const ids = new Set(api.stops.map(s => s.id));
  for (const date of Object.keys(before).filter(k => k.startsWith('2026-'))) {
    const migrated = clone(plan[date]);
    migrated.tours = migrated.tours.filter(id => !ids.has(id));
    assert.deepEqual(migrated, before[date]);
  }
  assert.deepEqual(plan.otherMetadata, before.otherMetadata);
  const once = clone(plan);
  assert.equal(api.migrate(plan), false);
  assert.deepEqual(plan, once);
});

test('an existing Osaka card is not duplicated, moved or deleted', () => {
  const plan = { '2026-11-10': { tours: ['extra-a','pokemon-osaka','extra-b'], note: 'keep' } };
  api.migrate(plan);
  assert.deepEqual(plan['2026-11-10'].tours, ['extra-a','pokemon-osaka','extra-b']);
});

test('Kyoto protects the noon guide meeting and Hiroshima return has the 19:30 cutoff', () => {
  assert.match(api.forDate('2026-11-11')[0].window, /10:45–11:20/);
  assert.match(api.forDate('2026-11-11')[0].window, /Nishiki ~11:45/);
  assert.match(api.forDate('2026-11-11')[0].why, /12:00/);
  assert.match(api.forDate('2026-11-15')[0].window, /19:30/);
  assert.match(api.forDate('2026-11-16')[0].window, /Flexível/);
});

test('map inserts correct Shinsaibashi DX and keeps every other original pin in order', () => {
  const pins = [{name:'Hotel',lat:0,lng:0},{name:'Mercado Kuromon',lat:1,lng:1},{name:'User extra',lat:2,lng:2},{name:'Pokémon Center Osaka',lat:3,lng:3},{name:'Hotel retorno',lat:0,lng:0}];
  const out = api.route('2026-11-10', pins);
  assert.equal(out[2].name, 'Pokémon Center OSAKA DX');
  assert.match(out[2].address, /Shinsaibashi/);
  assert.deepEqual(clone(out.filter(p => !p.pokemon)), pins.filter(p => p.name !== 'Pokémon Center Osaka'));
  assert.deepEqual(clone(api.route('2026-11-13', pins)), pins);
});

test('all official store links use the official shop domain', () => {
  for (const stop of api.stops) assert.equal(new URL(stop.url).hostname, 'shop.pokemon.co.jp');
});