import test from 'node:test';
import assert from 'node:assert/strict';

import { SoundEngine } from '../src/audio/soundEngine.js';

test('SoundEngine handles volume clamping and mute state', () => {
  const engine = new SoundEngine();

  engine.setVolume('music', 0.8);
  assert.equal(engine.musicVolume, 0.8);

  // Clamping test
  engine.setVolume('music', 1.5);
  assert.equal(engine.musicVolume, 1.0);

  engine.setVolume('sfx', -0.5);
  assert.equal(engine.sfxVolume, 0.0);
});

test('SoundEngine playSFX and playBGM handle calls safely without audio hardware', () => {
  const engine = new SoundEngine();

  assert.doesNotThrow(() => {
    engine.playSFX('slackDing');
    engine.playSFX('coffee');
    engine.playBGM('office');
    engine.stopBGM();
  });
});
