import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../public/planner.html', import.meta.url), 'utf8');
const runtime = fs.readFileSync(new URL('../public/trip-runtime.js', import.meta.url), 'utf8');

test('mobile Today loads content on first tap and reopens after the calendar', () => {
  function classes() {
    const values = new Set();
    return {add: (...names) => names.forEach(n => values.add(n)), remove: (...names) => names.forEach(n => values.delete(n)), contains: n => values.has(n)};
  }
  const body = {classList: classes()};
  const today = {classList: classes(), textContent: ''};
  let click, renders = 0;
  const tabs = {querySelectorAll: () => [], addEventListener: (_event, handler) => {click = handler;}};
  const context = {document: {body, getElementById: id => id === 'mobile-tabs' ? tabs : id === 'today-view' ? today : {addEventListener() {}}}, todayISO: null,
    clampDay: iso => iso, tokyoNow: () => ({iso:'2026-11-09'}), renderToday: () => {renders++; today.textContent = 'Roteiro do dia';}};
  context.window = {scrollTo() {}, innerWidth: 390};
  vm.createContext(context);
  vm.runInContext(runtime.slice(runtime.indexOf('  function showToday()'), runtime.indexOf('  function showCalendar()')), context);
  context.window.TripRuntime = {showToday: context.showToday};
  const start = html.indexOf('(function setupMobileTabs()');
  vm.runInContext(html.slice(start, html.indexOf('})();', start) + 5), context);
  const tap = view => click({target: {closest: () => ({getAttribute: () => view})}});
  assert.equal(renders, 0);
  tap('today');
  assert.equal(renders, 1);
  assert.equal(today.textContent, 'Roteiro do dia');
  assert.equal(context.todayISO, '2026-11-09');
  assert.ok(body.classList.contains('m-today'));
  assert.ok(today.classList.contains('active'));
  tap('cal');
  assert.ok(!body.classList.contains('desktop-today'));
  assert.ok(!today.classList.contains('active'));
  tap('today');
  assert.equal(renders, 2);
});
