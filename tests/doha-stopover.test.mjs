import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import catalog from '../src/lib/calendar-catalog.ts';
import {buildEvents,toIcs} from '../src/lib/trip-calendar.ts';
const html=readFileSync('public/planner.html','utf8');
const context={emptyDay:()=>({base:null,tours:[],note:''})};vm.createContext(context);
vm.runInContext(html.slice(html.indexOf('function applyDohaStopoverV1'),html.indexOf('function loadPlan()')),context);
test('Doha update preserves other days and custom stops, backs up affected days, and runs once',()=>{
 const p={'2026-11-08':{base:'henn-haneda',tours:['transport-haneda-tokyo']},'2026-11-09':{base:'osaka',tours:['transport-haneda-hotel-osaka','dotonbori','custom-stop']},'2026-11-11':{note:'guide noon',tours:['saved']}};
 const untouched=JSON.stringify(p['2026-11-11']);assert.equal(context.applyDohaStopoverV1(p),true);
 assert.equal(p['2026-11-08'].base,'doha-hotel-pending');assert.ok(p['2026-11-09'].tours.includes('custom-stop'));
 assert.ok(!p['2026-11-09'].tours.includes('transport-haneda-hotel-osaka'));
 assert.equal(JSON.stringify(p['2026-11-11']),untouched);assert.equal(p._updates.beforeDohaStopoverV1.day8.base,'henn-haneda');
 const once=JSON.stringify(p);assert.equal(context.applyDohaStopoverV1(p),false);assert.equal(JSON.stringify(p),once);
});
test('Doha times remain local UTC+3 and Osaka arrival remains flexible without invented landing time',()=>{
 const p={};context.applyDohaStopoverV1(p);const e=buildEvents({'japan-trip-planner-v3':p},catalog);
 const day=e.filter(x=>x.date==='2026-11-08');assert.equal(day[0].start,600);assert.ok(day.every(x=>x.timezone==='Asia/Qatar' && !x.conflict));
 assert.match(day[0].location,/Qatar/);assert.ok(!day[0].location.includes('Japan'));
 const ics=toIcs(e);assert.match(ics,/DTSTART;TZID=Asia\/Qatar:20261108T100000/);assert.match(ics,/TZOFFSETTO:\+0300/);
 assert.ok(e.filter(x=>x.date==='2026-11-09').every(x=>x.start===null));
});
