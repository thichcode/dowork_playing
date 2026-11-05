import { globalEventBus } from '../core/eventBus.js';

export const ROOMS_CONFIG = [
  {
    id: 'it_room',
    name: 'Phòng Kỹ Thuật IT',
    badge: '💻 IT Department',
    bounds: { minX: 16, maxX: 31, minY: 10, maxY: 19 }
  },
  {
    id: 'pantry',
    name: 'Quầy Pantry & Lounge',
    badge: '☕ Quầy Pantry',
    bounds: { minX: 16, maxX: 31, minY: 0, maxY: 9 }
  },
  {
    id: 'meeting',
    name: 'Phòng Họp Alpha',
    badge: '📊 Phòng Họp Alpha',
    bounds: { minX: 0, maxX: 15, minY: 10, maxY: 19 }
  },
  {
    id: 'server',
    name: 'Phòng Server Datacenter',
    badge: '🖥️ Phòng Server',
    bounds: { minX: 0, maxX: 15, minY: 0, maxY: 9 }
  }
];

export const HALLWAY_ROOM = {
  id: 'hallway',
  name: 'Hành Lang Trung Tâm',
  badge: '🚪 Hành Lang'
};

export class RoomTracker {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.currentRoom = null;
  }

  getRoomAt(tileX, tileY) {
    for (const room of ROOMS_CONFIG) {
      const b = room.bounds;
      if (tileX >= b.minX && tileX <= b.maxX && tileY >= b.minY && tileY <= b.maxY) {
        return room;
      }
    }
    return HALLWAY_ROOM;
  }

  update(tileX, tileY) {
    const room = this.getRoomAt(tileX, tileY);
    if (!this.currentRoom || this.currentRoom.id !== room.id) {
      this.currentRoom = room;
      this.eventBus.emit('room:changed', room);
    }
    return room;
  }
}

export const globalRoomTracker = new RoomTracker();
