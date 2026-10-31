import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import catalog from '../src/lib/calendar-catalog.ts';
import { buildEvents, toIcs } from '../src/lib/trip-calendar.ts';
const itinerary = {"2026-11-08": {"tours": ["transport-haneda-tokyo"]}, "2026-11-09": {"tours": ["dotonbori"]}, "2026-11-10": {"tours": ["kuromon", "pokemon-osaka"]}, "2026-11-11": {"tours": ["transport-osaka-kyoto-out", "kyoto-guided-higashiyama", "pokemon-kyoto", "transport-kyoto-osaka-return"]}, "2026-11-12": {"tours": ["transport-osaka-kyoto-out", "kyoto-west-saihoji", "transport-kyoto-osaka-return"]}, "2026-11-13": {"tours": ["transport-osaka-nara-out", "nara-uji", "transport-nara-uji", "transport-uji-osaka-return"]}, "2026-11-14": {"tours": ["kobe-himeji"]}, "2026-11-15": {"tours": ["transport-osaka-hiroshima-out", "peace-memorial", "okonomimura", "pokemon-hiroshima", "transport-hiroshima-osaka-return"]}, "2026-11-16": {"tours": ["pokemon-osaka-umeda"]}, "2026-11-17": {"tours": ["transport-osaka-hakone", "hakone-museum-onsen"]}, "2026-11-18": {"tours": ["hakone-ropeway", "transport-hakone-tokyo"]}, "2026-11-19": {"tours": ["imperial-palace", "ginza-nihonbashi", "pokemon-tokyo-station", "pokemon-tokyo-dx"]}, "2026-11-20": {"tours": ["teamlab-planets", "hamarikyu-tsukiji"]}, "2026-11-21": {"tours": ["shibuya-harajuku", "pokemon-shibuya"]}, "2026-11-22": {"tours": ["asakusa-ueno", "akihabara-kanda", "pokemon-skytree"]}, "2026-11-23": {"tours": ["shinjuku", "pokemon-mega-tokyo"]}, "2026-11-24": {"tours": ["outlet", "pokemon-kisarazu"]}, "2026-11-25": {"tours": ["disney"]}, "2026-11-26": {"tours": ["nakameguro-daikanyama"]}, "2026-11-27": {"tours": ["transport-tokyo-narita"]}};
const events = () => buildEvents({ 'japan-trip-planner-v3': itinerary }, catalog);
test('reviewed reference trip has no overlaps, preserves all 20 days and includes explicit transfers', () => {
 const all = events();
 assert.equal(new Set(all.map(e => e.date)).size, 20);
 assert.deepEqual(all.filter(e => e.conflict).map(e => [e.date,e.title]), []);
 for (const d of ['09','11','12','13','14','15','17','18','24','25','27']) assert.ok(all.filter(e => e.date === '2026-11-'+d).some(e => /→|Margem|embarque|Retorno/i.test(e.title)),d);
 const early = all.filter(e => e.start !== null && e.start < 360);
 assert.ok(early.every(e => e.date === '2026-11-11'), JSON.stringify(early));
});
test('purchased reservation starts and airport margin are protected', () => {
 const all = events();
 const saihoji = all.find(e => e.date === '2026-11-12' && e.title === 'Saihō-ji (Kokedera)');
 assert.equal(saihoji.start, 690); assert.equal(saihoji.confirmed, true);
 const teamlab = all.find(e => e.date === '2026-11-20' && e.title === 'teamLab Planets');
 assert.equal(teamlab.start, 540); assert.equal(teamlab.confirmed, true);
 assert.ok(all.some(e => e.date === '2026-11-27' && e.title.includes('terminal') && e.end === 835));
 assert.match(toIcs([saihoji,teamlab]), /STATUS:CONFIRMED/);
});
test('arrival crosses midnight; Hakone uses the booked ryokan and leaves time for baggage', () => {
 const all = events();
 const arrival = all.find(e => e.date === '2026-11-08');
 assert.equal(arrival.start, 1435);assert.equal(arrival.end, 1530);
 assert.match(toIcs([arrival]), /DTEND;TZID=Asia\/Tokyo:20261109T013000/);
 assert.ok(!all.filter(e => e.date === '2026-11-17').some(e => /Yuryo/.test(e.title)));
 assert.ok(all.some(e => e.date === '2026-11-18' && /Retirada de malas/.test(e.title)));
});
test('missing Osaka transfer repair is additive, idempotent, and respects a subsequent manual deletion', () => {
 const html = readFileSync('public/planner.html','utf8');
 const start = html.indexOf('function applyMissingOsakaTransferV1');
 const end = html.indexOf('function loadPlan()',start);
 const context = {};vm.createContext(context);vm.runInContext(html.slice(start,end),context);
 const plan = { extra:{saved:true}, '2026-11-09':{base:'osaka',tours:['user-extra','dotonbori'],note:'preserve'} };
 assert.equal(context.applyMissingOsakaTransferV1(plan),true);
 assert.deepEqual(plan['2026-11-09'].tours,['transport-haneda-hotel-osaka','user-extra','dotonbori']);
 const once=JSON.stringify(plan);assert.equal(context.applyMissingOsakaTransferV1(plan),false);assert.equal(JSON.stringify(plan),once);
 plan['2026-11-09'].tours.shift();
 assert.ok(!buildEvents({'japan-trip-planner-v3':plan},catalog).some(e=>e.title.includes('Shinkansen Shinagawa')));
 assert.equal(plan['2026-11-09'].note,'preserve');assert.equal(plan.extra.saved,true);
});
