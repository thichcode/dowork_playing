/**
 * Coordinate Transformation Utilities for 3D Isometric Office
 */

export const MAP_CENTER_X = 16;
export const MAP_CENTER_Y = 10;
export const DEFAULT_TILE_SIZE_3D = 1.5;

/**
 * Converts 2D tile coordinates to 3D world space (X, Y, Z).
 * @param {number} tileX - Column in tilemap (0..31)
 * @param {number} tileY - Row in tilemap (0..19)
 * @param {number} [tileSize=1.5] - Size per tile in 3D world units
 * @returns {{x: number, y: number, z: number}}
 */
export function tileTo3D(tileX, tileY, tileSize = DEFAULT_TILE_SIZE_3D) {
  return {
    x: (tileX - MAP_CENTER_X) * tileSize,
    y: 0,
    z: (tileY - MAP_CENTER_Y) * tileSize
  };
}

/**
 * Converts 3D world space (X, Z) back to 2D tile coordinates (tileX, tileY).
 * @param {number} x - 3D world X
 * @param {number} z - 3D world Z
 * @param {number} [tileSize=1.5] - Size per tile in 3D world units
 * @returns {{tileX: number, tileY: number}}
 */
export function pos3DToTile(x, z, tileSize = DEFAULT_TILE_SIZE_3D) {
  return {
    tileX: Math.round(x / tileSize + MAP_CENTER_X),
    tileY: Math.round(z / tileSize + MAP_CENTER_Y)
  };
}

/**
 * Calculates rotation angle (in radians) facing movement direction.
 * Movement vectors are dx (+X East, -X West), dz (+Z South, -Z North).
 * Facing: South = 0, East = PI/2, North = PI or -PI, West = -PI/2.
 * @param {number} dx
 * @param {number} dz
 * @returns {number}
 */
export function calcFacingAngle(dx, dz) {
  if (dx === 0 && dz === 0) return 0;
  return Math.atan2(dx, dz);
}

/**
 * Linearly interpolates between two angles in radians considering circular wrap-around.
 * @param {number} current
 * @param {number} target
 * @param {number} factor
 * @returns {number}
 */
export function lerpAngle(current, target, factor) {
  let diff = target - current;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  return current + diff * factor;
}
