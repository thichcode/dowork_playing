import test from 'node:test';
import assert from 'node:assert/strict';

import { WindowManager } from '../src/workstation/windowManager.js';

test('WindowManager creates and tracks windows', () => {
  const container = {
    appendChild: () => {},
    removeChild: () => {}
  };
  const wm = new WindowManager({ container });

  const win = wm.createWindow({
    id: 'test_app',
    title: 'Test App',
    width: 400,
    height: 300
  });

  assert.equal(win.id, 'test_app');
  assert.equal(win.title, 'Test App');
  assert.equal(wm.hasWindow('test_app'), true);
});

test('WindowManager focus increases z-index of window', () => {
  const container = { appendChild: () => {}, removeChild: () => {} };
  const wm = new WindowManager({ container });

  const win1 = wm.createWindow({ id: 'win1', title: 'Win 1' });
  const win2 = wm.createWindow({ id: 'win2', title: 'Win 2' });

  assert.ok(win2.zIndex >= win1.zIndex);

  wm.focusWindow('win1');
  assert.ok(win1.zIndex > win2.zIndex, 'win1 should now have higher z-index than win2');
});

test('WindowManager close removes window from registry', () => {
  const container = { appendChild: () => {}, removeChild: () => {} };
  const wm = new WindowManager({ container });

  const win = wm.createWindow({ id: 'win_close', title: 'Close Me' });
  assert.equal(wm.hasWindow('win_close'), true);

  wm.closeWindow('win_close');
  assert.equal(wm.hasWindow('win_close'), false);
});
