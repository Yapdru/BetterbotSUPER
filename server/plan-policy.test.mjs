import test from 'node:test';
import assert from 'node:assert/strict';
import { teamPriceInr, allowanceFor, quotaKey, canReserve } from './plan-policy.mjs';

test('team billing switches after ten members and rejects unsupported seats', () => {
  assert.equal(teamPriceInr(5), 5000);
  assert.equal(teamPriceInr(10), 5000);
  assert.equal(teamPriceInr(11), 7000);
  assert.equal(teamPriceInr(100), 7000);
  for (const seats of [0, 101, 5.5, NaN, '10']) assert.throws(() => teamPriceInr(seats));
});
test('Max and team members have the same individual allowance', () => {
  assert.equal(allowanceFor('max'), 25000);
  assert.equal(allowanceFor('teams'), 25000);
  assert.equal(allowanceFor('pro'), 25000);
  assert.equal(allowanceFor('basic'), 15000);
  assert.equal(allowanceFor('free'), 5000);
  assert.equal(allowanceFor('unknown'), 0);
});
test('quota identities isolate users and reset at midnight UTC', () => {
  const before = new Date('2026-11-02T23:59:59Z');
  const after = new Date('2026-11-03T00:00:00Z');
  assert.notEqual(quotaKey('alice', before), quotaKey('bob', before));
  assert.notEqual(quotaKey('alice', before), quotaKey('alice', after));
});
test('outstanding reservations count against the daily limit', () => {
  assert.equal(canReserve({plan:'max',used:15000,reserved:9000,requested:1000}), true);
  assert.equal(canReserve({plan:'max',used:15000,reserved:9000,requested:1001}), false);
  assert.equal(canReserve({plan:'free',used:5000,reserved:0,requested:1}), false);
  assert.throws(() => canReserve({plan:'max',used:0,reserved:0,requested:-1}));
});
