import test from 'node:test';
import assert from 'node:assert/strict';

import { TerminalApp } from '../src/workstation/apps/terminal.js';

test('Terminal executes standard commands', () => {
  const terminal = new TerminalApp();

  const helpRes = terminal.executeCommand('help');
  assert.ok(helpRes.includes('git'), 'Help output should mention git');
  assert.ok(helpRes.includes('npm'), 'Help output should mention npm');

  const gitRes = terminal.executeCommand('git status');
  assert.ok(gitRes.includes('On branch'), 'Git status should show branch info');

  const unknownRes = terminal.executeCommand('malicious_cmd');
  assert.ok(unknownRes.includes('command not found'), 'Unknown command should report not found');
});

test('Terminal provides command autocomplete for prefixes', () => {
  const terminal = new TerminalApp();

  const matches = terminal.getAutocompleteMatches('gi');
  assert.ok(matches.includes('git status'));
  assert.ok(matches.includes('git log'));

  const dockerMatches = terminal.getAutocompleteMatches('doc');
  assert.ok(dockerMatches.includes('docker ps'));
});
