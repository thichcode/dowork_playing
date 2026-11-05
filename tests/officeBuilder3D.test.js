import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { OfficeBuilder3D, ROOM_PALETTES } from '../src/office3d/officeBuilder3D.js';

test('OfficeBuilder3D defines distinct palettes for all 4 rooms and hallway', () => {
  assert.ok(ROOM_PALETTES.it_room);
  assert.ok(ROOM_PALETTES.pantry);
  assert.ok(ROOM_PALETTES.meeting);
  assert.ok(ROOM_PALETTES.server);
  assert.ok(ROOM_PALETTES.hallway);

  assert.equal(typeof ROOM_PALETTES.it_room.floor, 'number');
  assert.equal(typeof ROOM_PALETTES.server.glow, 'number');
});

test('OfficeBuilder3D builds office structure with floors, walls, and furniture groups', () => {
  const mapData = {
    width: 32,
    height: 20,
    tileSize: 32,
    tiles: Array(20).fill(null).map(() => Array(32).fill(0)),
    collision: Array(20).fill(null).map(() => Array(32).fill(0)),
    zones: [
      { id: 'player_desk', type: 'desk', x: 20, y: 14, label: 'Bàn làm việc' },
      { id: 'pantry_coffee', type: 'coffee', x: 26, y: 1, label: 'Máy pha Cà phê' },
      { id: 'server_rack', type: 'server_rack', x: 5, y: 2, label: 'Cụm Server' }
    ]
  };

  const builder = new OfficeBuilder3D({ THREE });
  const officeGroup = builder.buildOffice(mapData);

  assert.ok(officeGroup instanceof THREE.Group);
  assert.ok(officeGroup.children.length > 0);

  // Verify floor group exists
  const floorGroup = officeGroup.getObjectByName('floors');
  assert.ok(floorGroup);
  assert.ok(floorGroup.children.length >= 4);

  // Verify furniture items were added
  const furnitureGroup = officeGroup.getObjectByName('furniture');
  assert.ok(furnitureGroup);
  assert.ok(furnitureGroup.children.length > 0);
});

test('OfficeBuilder3D creates glowing emissive materials for server racks', () => {
  const builder = new OfficeBuilder3D({ THREE });
  const serverRack = builder.createServerRackMesh();

  assert.ok(serverRack instanceof THREE.Group);
  // Check child meshes have emissive properties
  let hasEmissive = false;
  serverRack.traverse((child) => {
    if (child.isMesh && child.material && child.material.emissive) {
      hasEmissive = true;
    }
  });
  assert.equal(hasEmissive, true);
});
