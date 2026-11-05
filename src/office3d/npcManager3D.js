import * as THREE_DEFAULT from 'three';
import { Character3D } from './character3D.js';
import { tileTo3D } from './coord3D.js';
import { NPCS_DATA } from '../data/npcs.js';

export const NPC_SPEECH_QUOTES = {
  dev_minh: { emote: '☕', quote: 'Merge code cẩn thận, đừng conflict nha em...' },
  lead_duc: { emote: '🔥', quote: 'Hôm nay có kịp release 5h chiều không?!' },
  qa_trang: { emote: '🐞', quote: 'Máy em chạy bình thường hả? Để chị soi bug!' },
  hr_lan: { emote: '🧋', quote: 'Chiều nay ai order trà sữa trân châu không nè~' },
  devops_khoa: { emote: '🚨', quote: 'Ai vừa chọc vào Database Production đấy?!' },
  pm_hung: { emote: '📊', quote: 'Chạy Sprint này nhớ log Jira đầy đủ nhé!' }
};

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

  createSpeechBubble(npc) {
    const THREE = this.THREE;
    const bubbleGroup = new THREE.Group();
    bubbleGroup.name = 'speech_bubble';
    bubbleGroup.position.set(0, 2.15, 0);
    bubbleGroup.scale.set(0, 0, 0);
    bubbleGroup.targetScale = 0;
    bubbleGroup.visible = false;

    const data = NPC_SPEECH_QUOTES[npc.id] || { emote: '💬', quote: 'Chào bạn mới!' };
    bubbleGroup.quote = data.quote;
    bubbleGroup.emote = data.emote;

    // Speech bubble base plane / board
    const bgGeo = new THREE.BoxGeometry(1.6, 0.48, 0.04);
    const bgMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    bg.name = 'bubble_bg';
    bubbleGroup.add(bg);

    // Comic pointer / tail pointing down to NPC head
    const tailGeo = new THREE.ConeGeometry(0.08, 0.16, 4);
    const tail = new THREE.Mesh(tailGeo, bgMat);
    tail.rotation.x = Math.PI;
    tail.position.set(-0.2, -0.28, 0);
    bubbleGroup.add(tail);

    // Dark border for comic feel
    const borderGeo = new THREE.BoxGeometry(1.64, 0.52, 0.02);
    const borderMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.z = -0.015;
    bubbleGroup.add(border);

    // Emote badge on top-left
    const badgeGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 12);
    const badgeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(-0.7, 0.22, 0.03);
    badge.name = 'emote_badge';
    bubbleGroup.add(badge);

    // If browser environment has canvas, draw crisp text texture
    if (typeof document !== 'undefined' && document.createElement) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, 512, 160);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 12;
          ctx.strokeRect(6, 6, 500, 148);

          ctx.font = 'bold 34px sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${data.emote} "${data.quote}"`, 256, 80);

          const texture = new THREE.CanvasTexture(canvas);
          const textMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
          const textPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.44), textMat);
          textPlane.position.z = 0.025;
          bubbleGroup.add(textPlane);
        }
      } catch (e) {
        // Fallback safely in headless test environments
      }
    }

    return bubbleGroup;
  }

  initNPCs() {
    const THREE = this.THREE;

    for (const npc of this.npcs) {
      const char = new Character3D({
        THREE,
        name: `npc_${npc.id}`,
        palette: npc.palette || {},
        hasGlasses: !!npc.hasGlasses,
        hairStyle: npc.hairStyle || 'short'
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

      // Comic Speech Bubble
      const bubble = this.createSpeechBubble(npc);
      char.mesh.add(bubble);

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
      const bubble = mesh.getObjectByName('speech_bubble');

      if (dist <= threshold && dist < minDistance) {
        minDistance = dist;
        closest = npc;
      }

      const isNear = dist <= threshold;
      if (marker) {
        marker.visible = isNear;
      }
      if (bubble) {
        bubble.targetScale = isNear ? 1.0 : 0;
      }
    }

    this.nearbyNpc = closest;
    return closest;
  }

  update(deltaTime = 0.016) {
    // Subtle idle animation for NPCs and speech bubbles
    const t = Date.now() * 0.003;
    for (const [id, char] of this.npcCharacters.entries()) {
      const marker = char.mesh.getObjectByName('nearby_marker');
      if (marker && marker.visible) {
        marker.position.y = 1.85 + Math.sin(t * 2) * 0.06;
      }

      const bubble = char.mesh.getObjectByName('speech_bubble');
      if (bubble) {
        const diff = bubble.targetScale - bubble.scale.x;
        if (Math.abs(diff) > 0.001) {
          const newScale = bubble.scale.x + diff * Math.min(1, deltaTime * 14);
          bubble.scale.set(newScale, newScale, newScale);
          bubble.visible = newScale > 0.02;
        } else {
          bubble.scale.set(bubble.targetScale, bubble.targetScale, bubble.targetScale);
          bubble.visible = bubble.targetScale > 0.02;
        }

        if (bubble.visible) {
          bubble.position.y = 2.15 + Math.sin(t * 3) * 0.04;
        }
      }
    }
  }
}
