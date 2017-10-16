/**
 * @Author: mark
 * @Date:   2017-04-20T13:56:23+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: graphUtil.js
 * @Last modified by:   mark
 * @Last modified time: 2017-06-30T14:50:47+08:00
 * @License: MIT
 */

export function interpolate(start, end, steps, count) {
  const s = start;
  const e = end;
  const final = s + (((e - s) / steps) * count);
  return Math.floor(final);
}

export function hitTest(point, vs) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0];
    const yi = vs[i][1];
    const xj = vs[j][0];
    const yj = vs[j][1];

    const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

export function hexToRgb(h) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hex = h.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgbaResult = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : (rgbaResult ? {
    r: parseInt(rgbaResult[1], 10),
    g: parseInt(rgbaResult[2], 10),
    b: parseInt(rgbaResult[3], 10),
  } : null);
}

export default function getDefaultData() {
  let i;
  const N = 1000;
  const E = 1000;
  const g = {
    nodes: [],
    edges: [],
  };

  // Generate a random graph:
  for (i = 0; i < N; i += 1) {
    g.nodes.push({
      id: `n${i}`,
      label: `Node ${i}`,
      x: Math.random(),
      y: Math.random(),
      size: Math.random(),
      color: '#666',
    });
  }

  for (i = 0; i < E; i += 1) {
    g.edges.push({
      id: `e${i}`,
      source: `n${Math.random() * N | 0}`,
      target: `n${Math.random() * N | 0}`,
      size: Math.random(),
      color: '#ccc',
    });
  }
  return g;
}
