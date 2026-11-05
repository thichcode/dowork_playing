import { test } from 'node:test';
import assert from 'node:assert/strict';
import { OfficeBuilder3D } from '../src/office3d/officeBuilder3D.js';

// Polyfill minimal Three.js in Node.js test environment if needed
let THREE;
try {
  THREE = await import('three');
} catch (e) {
  // If three is not directly importable as bare module, use window/global shim
  THREE = globalThis.THREE;
}

test('OfficeBuilder3D creates detailed desk with laptop, ergonomic chair, and mouse', () => {
  const builder = new OfficeBuilder3D(THREE);
  const desk = builder.createDetailedDeskMesh();

  assert.ok(desk, 'Desk mesh group should be created');
  assert.equal(desk.isGroup, true);

  // Check laptop
  const laptop = desk.getObjectByName('laptop');
  assert.ok(laptop, 'Detailed desk should contain a laptop');
  const laptopScreen = desk.getObjectByName('laptop_screen');
  assert.ok(laptopScreen, 'Laptop should have an open display screen');
  assert.ok(laptopScreen.material.emissive, 'Screen should have emissive code glow');

  // Check ergonomic mesh chair
  const chair = desk.getObjectByName('chair');
  assert.ok(chair, 'Desk should have an ergonomic chair');
  const chairSeat = desk.getObjectByName('chair_seat');
  const chairBack = desk.getObjectByName('chair_back');
  assert.ok(chairSeat && chairBack, 'Chair should have seat and backrest');

  // Check mouse & mousepad
  const mousepad = desk.getObjectByName('mousepad');
  const mouse = desk.getObjectByName('mouse');
  assert.ok(mousepad, 'Desk should have mousepad');
  assert.ok(mouse, 'Desk should have optical mouse');
});

test('OfficeBuilder3D creates water cooler dispenser with inverted blue bottle and levers', () => {
  const builder = new OfficeBuilder3D(THREE);
  const cooler = builder.createWaterCoolerMesh();

  assert.ok(cooler, 'Water cooler mesh group should be created');
  assert.equal(cooler.isGroup, true);

  const bottle = cooler.getObjectByName('water_bottle');
  assert.ok(bottle, 'Water cooler should have a water bottle');
  assert.equal(bottle.material.transparent, true, 'Bottle should be transparent blue');

  const coldTap = cooler.getObjectByName('tap_cold');
  const hotTap = cooler.getObjectByName('tap_hot');
  assert.ok(coldTap && hotTap, 'Water cooler should have hot and cold dispensing taps');

  const dripTray = cooler.getObjectByName('drip_tray');
  assert.ok(dripTray, 'Water cooler should have a drip tray');
});

test('OfficeBuilder3D creates whiteboard with colorful Post-it sticky notes and marker tray', () => {
  const builder = new OfficeBuilder3D(THREE);
  const whiteboard = builder.createWhiteboardMesh();

  assert.ok(whiteboard, 'Whiteboard mesh group should be created');
  assert.equal(whiteboard.isGroup, true);

  const surface = whiteboard.getObjectByName('whiteboard_surface');
  assert.ok(surface, 'Whiteboard should have dry-erase writing surface');

  const markerTray = whiteboard.getObjectByName('marker_tray');
  assert.ok(markerTray, 'Whiteboard should have a marker tray');

  // Check Post-it notes
  const postits = whiteboard.children.filter(c => c.name && c.name.startsWith('postit_'));
  assert.ok(postits.length >= 3, `Expected at least 3 Post-it notes, found ${postits.length}`);
});
