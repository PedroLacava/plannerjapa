const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const context = { window: {} };
vm.runInNewContext(readFileSync('public/week-calendar.js','utf8'),context);
const math = context.window.PlannerWeekMath;
const clone = value => JSON.parse(JSON.stringify(value));
test('weeks start Monday and date arithmetic does not depend on the device timezone', () => {
 assert.equal(math.weekStart('2026-11-08'),'2026-11-02');
 assert.equal(math.weekStart('2026-11-09'),'2026-11-09');
 assert.equal(math.weekStart('2026-11-15'),'2026-11-09');
 assert.equal(math.addDays('2026-11-30',1),'2026-12-01');
});
test('overnight arrival is shown on both dates without changing its true duration', () => {
 const event={date:'2026-11-08',start:1435,end:1530,uid:'arrival'};
 const before=clone(event),segments=math.splitEvents([event]);
 assert.deepEqual(clone(segments.map(s=>[s.date,s.start,s.end])),[['2026-11-08',1435,1440],['2026-11-09',0,90]]);
 assert.equal(segments.reduce((sum,s)=>sum+s.end-s.start,0),95);
 assert.deepEqual(event,before);
});
test('overlapping blocks get separate lanes while adjacent activities keep full width', () => {
 const items=[{start:540,end:720,index:0},{start:570,end:600,index:1},{start:600,end:660,index:2},{start:720,end:780,index:3}];
 const before=clone(items),placed=math.layout(items);
 assert.equal(placed[0].lanes,2);assert.equal(placed[0].lane,0);
 assert.equal(placed[1].lane,1);assert.equal(placed[2].lane,1);
 assert.equal(placed[3].lanes,1);
 assert.deepEqual(items,before);
});
test('flexible activities remain outside the hourly grid', () => {
 const items=math.splitEvents([{date:'2026-11-16',start:null,end:null,uid:'free'}]);
 assert.equal(items.length,1);assert.equal(items[0].start,null);assert.equal(items[0].date,'2026-11-16');
});
