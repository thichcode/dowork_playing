import test from 'node:test';
import assert from 'node:assert/strict';
import { PlotTwistEngine } from '../src/minigames/plotTwistEngine.js';

test('PlotTwistEngine provides role-specific plot twists with tech dilemmas', () => {
  const engine = new PlotTwistEngine();

  const feTwist = engine.getPlotTwistForRole('frontend');
  assert.ok(feTwist, 'Should have frontend twist');
  assert.ok(feTwist.title);
  assert.ok(feTwist.dilemma);

  const beTwist = engine.getPlotTwistForRole('backend');
  assert.ok(beTwist, 'Should have backend twist');
  assert.ok(beTwist.options && beTwist.options.length >= 2);

  const qaTwist = engine.getPlotTwistForRole('qa');
  assert.ok(qaTwist, 'Should have QA twist');

  const deTwist = engine.getPlotTwistForRole('devops');
  assert.ok(deTwist, 'Should have DevOps twist');
});

test('PlotTwistEngine provides real-world Tech Insights after ticket completion', () => {
  const engine = new PlotTwistEngine();

  const insightFE = engine.getTechInsight('cssLayoutFix');
  assert.ok(insightFE);
  assert.ok(insightFE.includes('Flexbox') || insightFE.includes('CSS') || insightFE.includes('Layout'));

  const insightBE = engine.getTechInsight('apiPipeline');
  assert.ok(insightBE);
  assert.ok(insightBE.includes('Middleware') || insightBE.includes('Pipeline') || insightBE.includes('Auth'));
});
