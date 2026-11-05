import test from 'node:test';
import assert from 'node:assert/strict';
import { DeskView } from '../src/office/deskView.js';
import { EventBus } from '../src/core/eventBus.js';
import { GameState } from '../src/core/gameState.js';

test('DeskView toggles zoom without losing state', () => {
  const eventBus = new EventBus();
  let zoomEvent = null;
  eventBus.on('desk:zoom-changed', (data) => { zoomEvent = data; });

  const desk = new DeskView({ eventBus });
  assert.equal(desk.isZoomed, false);

  desk.toggleZoom();
  assert.equal(desk.isZoomed, true);
  assert.equal(zoomEvent.isZoomed, true);

  desk.toggleZoom();
  assert.equal(desk.isZoomed, false);
});

test('DeskView drinkCoffee respects 3 cups daily limit and updates GameState', () => {
  const gameState = new GameState({
    initialState: {
      player: { energy: 50, stress: 30 },
      time: { coffeeCount: 0 }
    }
  });
  const eventBus = new EventBus();
  const desk = new DeskView({ gameState, eventBus });

  // Cup 1
  assert.equal(desk.drinkCoffee(), true);
  assert.equal(gameState.get('player.energy'), 65);
  assert.equal(gameState.get('player.stress'), 25);
  assert.equal(gameState.get('time.coffeeCount'), 1);

  // Cup 2
  assert.equal(desk.drinkCoffee(), true);
  // Cup 3
  assert.equal(desk.drinkCoffee(), true);
  assert.equal(gameState.get('time.coffeeCount'), 3);

  // Cup 4 should fail (Review Focus 2)
  assert.equal(desk.drinkCoffee(), false);
  assert.equal(gameState.get('time.coffeeCount'), 3);
});

test('DeskView phone ringing and answering triggers event', () => {
  const eventBus = new EventBus();
  let callAnswered = false;
  eventBus.on('desk:call-answered', () => { callAnswered = true; });

  const desk = new DeskView({ eventBus });
  assert.equal(desk.isPhoneRinging, false);

  desk.triggerPhoneRing('Khách VIP réo gấp!');
  assert.equal(desk.isPhoneRinging, true);

  const answered = desk.answerPhone();
  assert.equal(answered, true);
  assert.equal(desk.isPhoneRinging, false);
  assert.equal(callAnswered, true);
});

test('DeskView duck squeak relieves stress', () => {
  const gameState = new GameState({
    initialState: { player: { stress: 20 } }
  });
  const desk = new DeskView({ gameState });
  desk.squeakDuck();
  assert.equal(gameState.get('player.stress'), 18);
});
