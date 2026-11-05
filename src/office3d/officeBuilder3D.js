import * as THREE_DEFAULT from 'three';
import { tileTo3D } from './coord3D.js';

export const ROOM_PALETTES = {
  it_room: { floor: 0x1e293b, wall: 0x334155, accent: 0x3b82f6 },
  pantry: { floor: 0x78350f, wall: 0x92400e, accent: 0xf59e0b },
  meeting: { floor: 0x0f172a, wall: 0x1e293b, accent: 0x6366f1 },
  server: { floor: 0x090d16, wall: 0x111827, glow: 0x0ea5e9, accent: 0x06b6d4 },
  hallway: { floor: 0x334155, wall: 0x475569, accent: 0x64748b }
};

export class OfficeBuilder3D {
  constructor(options = {}) {
    this.THREE = options.THREE || THREE_DEFAULT;
  }

  buildOffice(mapData) {
    const THREE = this.THREE;
    const officeGroup = new THREE.Group();
    officeGroup.name = 'office_root';

    // 1. Build Floors Group
    const floorGroup = new THREE.Group();
    floorGroup.name = 'floors';

    // 4 Room bounding boxes (in tile units)
    const rooms = [
      { id: 'server', minX: 0, maxX: 15, minY: 0, maxY: 9, theme: ROOM_PALETTES.server },
      { id: 'pantry', minX: 16, maxX: 31, minY: 0, maxY: 9, theme: ROOM_PALETTES.pantry },
      { id: 'meeting', minX: 0, maxX: 15, minY: 10, maxY: 19, theme: ROOM_PALETTES.meeting },
      { id: 'it_room', minX: 16, maxX: 31, minY: 10, maxY: 19, theme: ROOM_PALETTES.it_room }
    ];

    const tileSize = 1.5;

    for (const rm of rooms) {
      const w = (rm.maxX - rm.minX + 1) * tileSize;
      const h = (rm.maxY - rm.minY + 1) * tileSize;
      const midTileX = (rm.minX + rm.maxX) / 2;
      const midTileY = (rm.minY + rm.maxY) / 2;
      const centerPos = tileTo3D(midTileX, midTileY, tileSize);

      const floorGeo = new THREE.BoxGeometry(w, 0.2, h);
      const floorMat = new THREE.MeshLambertMaterial({ color: rm.theme.floor });
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.name = `floor_${rm.id}`;
      floorMesh.position.set(centerPos.x, -0.1, centerPos.z);
      floorMesh.receiveShadow = true;
      floorGroup.add(floorMesh);
    }
    officeGroup.add(floorGroup);

    // 2. Build Low Half-Walls (Sims Cutaway style)
    const wallGroup = new THREE.Group();
    wallGroup.name = 'walls';
    const wallMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const wallHeight = 0.8;
    const wallThick = 0.25;

    // Perimeter half-walls
    const totalW = 32 * tileSize;
    const totalH = 20 * tileSize;

    // North & South outer walls
    const nWallGeo = new THREE.BoxGeometry(totalW, wallHeight, wallThick);
    const nWall = new THREE.Mesh(nWallGeo, wallMat);
    nWall.position.set(0, wallHeight / 2, -(totalH / 2));
    wallGroup.add(nWall);

    const sWall = new THREE.Mesh(nWallGeo, wallMat);
    sWall.position.set(0, wallHeight / 2, (totalH / 2));
    wallGroup.add(sWall);

    // West & East outer walls
    const wWallGeo = new THREE.BoxGeometry(wallThick, wallHeight, totalH);
    const wWall = new THREE.Mesh(wWallGeo, wallMat);
    wWall.position.set(-(totalW / 2), wallHeight / 2, 0);
    wallGroup.add(wWall);

    const eWall = new THREE.Mesh(wWallGeo, wallMat);
    eWall.position.set((totalW / 2), wallHeight / 2, 0);
    wallGroup.add(eWall);

    // Divider walls with doorway cutouts
    const divGeo = new THREE.BoxGeometry(totalW * 0.42, wallHeight, wallThick);
    const div1 = new THREE.Mesh(divGeo, wallMat);
    div1.position.set(-totalW * 0.25, wallHeight / 2, 0);
    wallGroup.add(div1);

    const div2 = new THREE.Mesh(divGeo, wallMat);
    div2.position.set(totalW * 0.25, wallHeight / 2, 0);
    wallGroup.add(div2);

    officeGroup.add(wallGroup);

    // 3. Build Furniture Group based on Map Data & Zones
    const furnitureGroup = new THREE.Group();
    furnitureGroup.name = 'furniture';

    // Player Desk & Tech Lead Desk in IT Room
    const deskPos = tileTo3D(20, 14, tileSize);
    const pDesk = this.createDeskMesh();
    pDesk.position.set(deskPos.x, 0, deskPos.z);
    furnitureGroup.add(pDesk);

    const leadDeskPos = tileTo3D(24, 17, tileSize);
    const lDesk = this.createDeskMesh();
    lDesk.position.set(leadDeskPos.x, 0, leadDeskPos.z);
    furnitureGroup.add(lDesk);

    // Server Racks in Datacenter (cols 2-9, rows 2-7)
    const serverPositions = [
      tileTo3D(3, 2, tileSize),
      tileTo3D(6, 2, tileSize),
      tileTo3D(9, 2, tileSize),
      tileTo3D(3, 6, tileSize),
      tileTo3D(6, 6, tileSize)
    ];
    for (const pos of serverPositions) {
      const rack = this.createServerRackMesh();
      rack.position.set(pos.x, 0, pos.z);
      furnitureGroup.add(rack);
    }

    // Pantry Furniture: Coffee bar, Fridge, Sofa
    const coffeePos = tileTo3D(26, 1, tileSize);
    const coffeeBar = this.createCoffeeBarMesh();
    coffeeBar.position.set(coffeePos.x, 0, coffeePos.z);
    furnitureGroup.add(coffeeBar);

    const fridgePos = tileTo3D(29, 1, tileSize);
    const fridge = this.createFridgeMesh();
    fridge.position.set(fridgePos.x, 0, fridgePos.z);
    furnitureGroup.add(fridge);

    const sofaPos = tileTo3D(25, 5, tileSize);
    const sofa = this.createSofaMesh();
    sofa.position.set(sofaPos.x, 0, sofaPos.z);
    furnitureGroup.add(sofa);

    // Meeting Room Table & Chairs
    const meetingPos = tileTo3D(5, 14, tileSize);
    const mTable = this.createMeetingTableMesh();
    mTable.position.set(meetingPos.x, 0, meetingPos.z);
    furnitureGroup.add(mTable);

    officeGroup.add(furnitureGroup);
    return officeGroup;
  }

  createDeskMesh() {
    const THREE = this.THREE;
    const group = new THREE.Group();

    // Tabletop
    const topGeo = new THREE.BoxGeometry(2.0, 0.1, 1.0);
    const topMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.y = 0.75;
    group.add(top);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.08, 0.75, 0.08);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const legPositions = [
      [-0.9, 0.375, -0.4],
      [0.9, 0.375, -0.4],
      [-0.9, 0.375, 0.4],
      [0.9, 0.375, 0.4]
    ];
    for (const [lx, ly, lz] of legPositions) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      group.add(leg);
    }

    // Monitor
    const monGeo = new THREE.BoxGeometry(0.7, 0.45, 0.05);
    const monMat = new THREE.MeshLambertMaterial({
      color: 0x0f172a,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35
    });
    const mon = new THREE.Mesh(monGeo, monMat);
    mon.position.set(0, 1.05, -0.2);
    group.add(mon);

    return group;
  }

  createServerRackMesh() {
    const THREE = this.THREE;
    const group = new THREE.Group();

    // Rack frame
    const rackGeo = new THREE.BoxGeometry(1.2, 2.2, 0.9);
    const rackMat = new THREE.MeshLambertMaterial({ color: 0x0a0f1d });
    const rack = new THREE.Mesh(rackGeo, rackMat);
    rack.position.y = 1.1;
    group.add(rack);

    // Emissive LED indicator panel
    const ledGeo = new THREE.BoxGeometry(0.9, 1.8, 0.05);
    const ledMat = new THREE.MeshLambertMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8
    });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, 1.1, 0.45);
    group.add(led);

    return group;
  }

  createCoffeeBarMesh() {
    const THREE = this.THREE;
    const group = new THREE.Group();

    // Counter
    const counterGeo = new THREE.BoxGeometry(1.8, 0.85, 0.9);
    const counterMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const counter = new THREE.Mesh(counterGeo, counterMat);
    counter.position.y = 0.425;
    group.add(counter);

    // Coffee machine
    const cmGeo = new THREE.BoxGeometry(0.5, 0.5, 0.4);
    const cmMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const cm = new THREE.Mesh(cmGeo, cmMat);
    cm.position.set(0, 1.1, 0);
    group.add(cm);

    return group;
  }

  createFridgeMesh() {
    const THREE = this.THREE;
    const group = new THREE.Group();

    const fridgeGeo = new THREE.BoxGeometry(1.1, 2.0, 0.9);
    const fridgeMat = new THREE.MeshLambertMaterial({ color: 0xcfd8dc });
    const fridge = new THREE.Mesh(fridgeGeo, fridgeMat);
    fridge.position.y = 1.0;
    group.add(fridge);

    return group;
  }

  createMeetingTableMesh() {
    const THREE = this.THREE;
    const group = new THREE.Group();

    // Oval meeting table
    const tableGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 16);
    tableGeo.scale(2.0, 1.0, 1.0);
    const tableMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = 0.75;
    group.add(table);

    // Central pillar
    const baseGeo = new THREE.CylinderGeometry(0.3, 0.5, 0.75, 12);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.375;
    group.add(base);

    return group;
  }

  createSofaMesh() {
    const THREE = this.THREE;
    const group = new THREE.Group();

    // Seat
    const seatGeo = new THREE.BoxGeometry(2.0, 0.4, 0.9);
    const seatMat = new THREE.MeshLambertMaterial({ color: 0x4338ca });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.y = 0.25;
    group.add(seat);

    // Backrest
    const backGeo = new THREE.BoxGeometry(2.0, 0.6, 0.25);
    const back = new THREE.Mesh(backGeo, seatMat);
    back.position.set(0, 0.55, -0.325);
    group.add(back);

    return group;
  }
}
