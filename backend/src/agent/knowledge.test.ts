import assert from 'node:assert/strict';
import test from 'node:test';
import { searchKnowledge } from './knowledge';

test('retrieves pain safety guidance', () => {
  const results = searchKnowledge('sharp pain injury safety');
  assert.equal(results[0]?.id, 'pain-safety');
});

test('retrieves protein guidance', () => {
  const results = searchKnowledge('daily protein for muscle');
  assert.equal(results[0]?.id, 'protein');
});

test('returns no unrelated knowledge', () => {
  assert.deepEqual(searchKnowledge('cryptocurrency exchange'), []);
});
