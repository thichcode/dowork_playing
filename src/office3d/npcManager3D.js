import * as THREE_DEFAULT from 'three';
import { Character3D } from './character3D.js';
import { tileTo3D } from './coord3D.js';
import { NPCS_DATA } from '../data/npcs.js';

export class NPCManager3D {
  constructor(options = {}) {
    this.THREE = options.THREE || THREE_DEFAULT;
    const THREE = this.THREE;

    this.npcs = options.npcs || NPCS_DATA;
    this.group = new THREE.Group();
    this.group.name = 'npcs_3d_group';

    this.npcMeshes = new Map();
    this.npcCharacters = new Map();
    this.nearbyNpc = null;

    this.initNPCs();
  }

  initNPCs() {
    const THREE = this.THREE;

    for (const npc of this.npcs) {
      const char = new Character3D({
        THREE,
        name: `npc_${npc.id}`,
        palette: npc.palette || {}
      });

      const pos3d = tileTo3D(npc.tileX, npc.tileY, 1.5);
      char.setPosition(pos3d.x, 0, pos3d.z);

      // Face toward center/camera
      char.setFacing(Math.PI / 4, false);

      // Marker sprite/mesh above head
      const markerGeo = new THREE.SphereGeometry(0.14, 8, 8);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.y = 1.85;
      marker.name = 'nearby_marker';
      marker.visible = false;
      char.mesh.add(marker);

      this.npcCharacters.set(npc.id, char);
      this.npcMeshes.set(npc.id, char.mesh);
      this.group.add(char.mesh);
    }
  }

  getNpcMesh(id) {
    return this.npcMeshes.get(id) || null;
  }

  checkProximity(playerX, playerZ, threshold = 3.2) {
    let closest = null;
    let minDistance = Infinity;

    for (const npc of this.npcs) {
      const mesh = this.npcMeshes.get(npc.id);
      if (!mesh) continue;

      const dx = mesh.position.x - playerX;
      const dz = mesh.position.z - playerZ;
      const dist = Math.sqrt(dx * dx + dz * dz);

      const marker = mesh.getObjectByName('nearby_marker');

      if (dist <= threshold && dist < minDistance) {
        minDistance = dist;
        closest = npc;
      }

      if (marker) {
        marker.visible = dist <= threshold;
      }
    }

    this.nearbyNpc = closest;
    return closest;
  }

  update(deltaTime) {
    // Subtle idle animation for NPCs
    const t = Date.now() * 0.003;
    for (const [id, char] of this.npcCharacters.entries()) {
      const marker = char.mesh.getObjectByName('nearby_marker');
      if (marker && marker.visible) {
        marker.position.y = 1.85 + Math.sin(t * 2) * 0.06;
      }
    }
  }
}
