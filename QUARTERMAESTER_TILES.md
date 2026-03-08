# Quartermaester Tile Integration

## Overview
Successfully reverse-engineered and integrated Quartermaester's proprietary tile encoding system into the GotGuessr game using Leaflet.

## Technical Details

### Encoding Algorithm
Quartermaester uses a **Keyhole Quadtree** encoding scheme (`getTileCode` function):
- Takes tile coordinates `{x, y}` at zoom level `z`
- Outputs a string like `"tqrst"` representing the path through the quadtree
- Unlabeled tiles are accessed via: `https://quartermaester.info/nat/{encoded}.jpg`
- Labeled variant (optional) is: `https://quartermaester.info/fsm/{encoded}.jpg`

**Quadrants:**
- `q` = top-left (x < midpoint, y < midpoint)
- `r` = top-right (x >= midpoint, y < midpoint)
- `t` = bottom-left (x < midpoint, y >= midpoint)
- `s` = bottom-right (x >= midpoint, y >= midpoint)

### Implementation

#### 1. getTileCode Function
```typescript
function getTileCode(x: number, y: number, z: number): string {
  let range = Math.pow(2, z);
  let xx = x, yy = y;
  let code = "t";
  for (let i = 0; i < z; i++) {
    range = range / 2;
    if (yy < range) {
      if (xx < range) code += "q"; 
      else {code += "r"; xx -= range;}
    } else {
      if (xx < range) {code += "t"; yy -= range;}
      else {code += "s"; xx -= range; yy -= range;}
    }
  }
  return code;
}
```

#### 2. Custom Leaflet Tile Layer
```typescript
const QuartermaestrTileLayer = (L.TileLayer as any).extend({
  getTileUrl(coords: any) {
    const z = coords.z;
    const x = coords.x;
    const y = coords.y;
    const code = getTileCode(x, y, z);
    // Use /nat/ for unlabeled base map tiles
    return `https://quartermaester.info/nat/${code}.jpg`;
  },
});

const tileLayer = new QuartermaestrTileLayer('', {
  minZoom: 1,
  maxZoom: 4,
  attribution: '© Quartermaester.info',
});
tileLayer.addTo(map);
```

## Reverse Engineering Source
- **File:** `https://quartermaester.info/ASoIaF-objects.js`
- **Original Code:** Lines containing `getTileCode` function
- **Analysis:** The function encodes z/x/y tile coordinates into a quadtree path string

## Benefits
✓ Quartermaester's high-quality Westeros map tiles (not generic OSM)  
✓ Clean Leaflet API (easy click/drag detection)  
✓ No CORS issues (native Leaflet implementation)  
✓ Smooth panning and zooming  
✓ Custom marker overlay system for gameplay

## Files Modified
- `App.tsx` - WorldMap component now uses FSM tile layer instead of static image

## Testing
To verify tiles are loading:
1. Run: `npm run web`
2. Open http://localhost:8081 in browser
3. Map should display Quartermaester's Westeros tiles
4. Pan/zoom should load new tiles dynamically from https://quartermaester.info/nat/tXXX.jpg URLs
