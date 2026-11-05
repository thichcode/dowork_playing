import test from 'node:test';
import assert from 'node:assert/strict';

import { ApiPipelineMinigame } from '../src/minigames/backend/apiPipeline.js';
import { LogDetectiveMinigame } from '../src/minigames/backend/logDetective.js';
import { TestCaseBuilderMinigame } from '../src/minigames/qa/testCaseBuilder.js';
import { YamlSurgeonMinigame } from '../src/minigames/devops/yamlSurgeon.js';
import { IncidentCommanderMinigame } from '../src/minigames/devops/incidentCommander.js';

test('ApiPipelineMinigame validates correct sequence of middleware', () => {
  const minigame = new ApiPipelineMinigame();

  const wrongOrder = ['sendResponse', 'validateInput', 'queryDatabase'];
  assert.equal(minigame.validateOrder(wrongOrder).completed, false);

  const correctOrder = ['validateInput', 'authenticateToken', 'queryDatabase', 'sanitizeOutput', 'sendResponse'];
  const res = minigame.validateOrder(correctOrder);
  assert.equal(res.completed, true);
  assert.equal(res.score, 5);
});

test('LogDetectiveMinigame detects target root cause line', () => {
  const minigame = new LogDetectiveMinigame();

  assert.equal(minigame.selectLine(3).isRootCause, false); // Info line
  assert.equal(minigame.selectLine(42).isRootCause, true); // Actual root cause line
  assert.equal(minigame.checkCompletion().completed, true);
});

test('TestCaseBuilderMinigame verifies categorization', () => {
  const minigame = new TestCaseBuilderMinigame();

  // Categorize a negative case correctly
  minigame.placeCase('tc_empty_pass', 'negative');
  // Categorize happy path
  minigame.placeCase('tc_valid_login', 'happy_path');

  const res = minigame.checkCompletion();
  assert.ok(res.score >= 2);
});

test('YamlSurgeonMinigame checks YAML syntax corrections', () => {
  const minigame = new YamlSurgeonMinigame();

  // Bad YAML with tabs
  const badYaml = "steps:\n\t- name: Build\n\t  run: npm run build";
  assert.equal(minigame.validateYaml(badYaml).completed, false);

  // Clean YAML with spaces
  const cleanYaml = "steps:\n  - name: Build\n    run: npm run build\n  - name: Test\n    run: npm test";
  assert.equal(minigame.validateYaml(cleanYaml).completed, true);
});

test('IncidentCommanderMinigame requires 5 steps in correct order', () => {
  const minigame = new IncidentCommanderMinigame();

  // Wrong first step
  assert.equal(minigame.executeStep('rollback').success, false);

  // Correct order: 1. acknowledge -> 2. check_logs -> 3. root_cause -> 4. rollback -> 5. post_mortem
  assert.equal(minigame.executeStep('acknowledge').success, true);
  assert.equal(minigame.executeStep('check_logs').success, true);
  assert.equal(minigame.executeStep('root_cause').success, true);
  assert.equal(minigame.executeStep('rollback').success, true);
  assert.equal(minigame.executeStep('post_mortem').success, true);

  assert.equal(minigame.checkCompletion().completed, true);
});
