import test from 'node:test';
import assert from 'node:assert/strict';

import { EndingSystem } from '../src/story/endingSystem.js';

test('EndingSystem evaluates 5 different endings correctly', () => {
  const endingSystem = new EndingSystem();

  // 1. Burnout condition (Review Focus 1)
  const burnout = endingSystem.evaluate({ kpi: 90, reputation: 90, stress: 96 });
  assert.equal(burnout.id, 'burnout');

  // 2. Superstar (Ngôi Sao Mới)
  const superstar = endingSystem.evaluate({ kpi: 85, reputation: 75, stress: 30 });
  assert.equal(superstar.id, 'superstar');

  // 3. Passed (Đủ Điểm Đậu)
  const passed = endingSystem.evaluate({ kpi: 65, reputation: 55, stress: 40 });
  assert.equal(passed.id, 'passed');

  // 4. Extended (Gia Hạn Thêm)
  const extended = endingSystem.evaluate({ kpi: 45, reputation: 50, stress: 40 });
  assert.equal(extended.id, 'extended');

  // 5. Failed (Không Phù Hợp)
  const failed = endingSystem.evaluate({ kpi: 25, reputation: 20, stress: 60 });
  assert.equal(failed.id, 'failed');
});
