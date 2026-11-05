export class SpriteGenerator {
  static drawTile(ctx, x, y, tileType, size = 32) {
    switch (tileType) {
      case 0: // Floor (office carpet)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, size, size);
        break;

      case 1: // Wall
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y, size, 4); // Wall trim
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y + 4, size, size - 4);
        break;

      case 2: // Desk with dual monitors
        ctx.fillStyle = '#1e293b'; // floor underneath
        ctx.fillRect(x, y, size, size);
        // Desk surface
        ctx.fillStyle = '#b45309'; // wood
        ctx.fillRect(x + 2, y + 6, size - 4, size - 10);
        // Monitor
        ctx.fillStyle = '#0284c7'; // screen glow
        ctx.fillRect(x + 6, y + 8, 10, 8);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 9, y + 16, 4, 3);
        // Keyboard
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 18, y + 10, 8, 5);
        break;

      case 4: // Server Rack
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#1e1e24';
        ctx.fillRect(x + 3, y + 2, size - 6, size - 4);
        ctx.fillStyle = '#38bdf8';
        // Blinking LEDs
        const isBlink = Math.floor(Date.now() / 300) % 2 === 0;
        ctx.fillStyle = isBlink ? '#22c55e' : '#15803d';
        ctx.fillRect(x + 6, y + 6, 4, 3);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x + 14, y + 6, 4, 3);
        ctx.fillStyle = isBlink ? '#eab308' : '#854d0e';
        ctx.fillRect(x + 22, y + 6, 4, 3);
        break;

      case 5: // Coffee Machine
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#475569';
        ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
        ctx.fillStyle = '#ea580c'; // Coffee button
        ctx.fillRect(x + 10, y + 8, 4, 4);
        ctx.fillStyle = '#78350f'; // Coffee spout/cup
        ctx.fillRect(x + 13, y + 16, 6, 6);
        break;

      case 6: // Sofa
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#065f46'; // emerald couch
        ctx.fillRect(x + 2, y + 4, size - 4, size - 8);
        ctx.fillStyle = '#047857';
        ctx.fillRect(x + 4, y + 8, size - 8, size - 14);
        break;

      case 7: // Scrum board
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#f8fafc'; // white board
        ctx.fillRect(x + 3, y + 4, size - 6, size - 8);
        // Post-it notes
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x + 6, y + 7, 5, 5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 14, y + 7, 5, 5);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(x + 21, y + 7, 5, 5);
        break;

      case 8: // Fridge
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#cbd5e1'; // metallic fridge
        ctx.fillRect(x + 4, y + 2, size - 8, size - 4);
        ctx.fillStyle = '#64748b'; // handle
        ctx.fillRect(x + 22, y + 8, 2, 8);
        break;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 13, y + 7, 5, 5);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(x + 20, y + 7, 5, 5);
        break;

      default:
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, size, size);
        break;
    }
  }

  static drawCharacter(ctx, x, y, direction = 0, frame = 0, palette = {}) {
    // direction: 0=down, 1=up, 2=right, 3=left
    // frame: 0=idle, 1=walk1, 2=walk2
    const hair = palette.hair || '#475569';
    const shirt = palette.shirt || '#6366f1';
    const pants = palette.pants || '#1e293b';
    const skin = palette.skin || '#fed7aa';

    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 26, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walking leg offset
    const legOffset = frame === 1 ? -2 : frame === 2 ? 2 : 0;

    // Body & Shirt
    ctx.fillStyle = shirt;
    ctx.fillRect(x + 10, y + 12, 12, 10);

    // Head
    ctx.fillStyle = skin;
    ctx.fillRect(x + 11, y + 4, 10, 8);

    // Hair
    ctx.fillStyle = hair;
    ctx.fillRect(x + 10, y + 2, 12, 4);

    // Eyes (based on direction)
    if (direction === 0) { // Down
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 13, y + 7, 2, 2);
      ctx.fillRect(x + 17, y + 7, 2, 2);
    } else if (direction === 2) { // Right
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 17, y + 7, 2, 2);
    } else if (direction === 3) { // Left
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 13, y + 7, 2, 2);
    }

    // Legs / Pants
    ctx.fillStyle = pants;
    ctx.fillRect(x + 11, y + 22, 4, 6 + legOffset);
    ctx.fillRect(x + 17, y + 22, 4, 6 - legOffset);

    ctx.restore();
  }
}
