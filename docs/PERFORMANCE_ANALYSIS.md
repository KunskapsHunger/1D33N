# Performance Analysis Report

## Executive Summary

The 1D33N website has several performance concerns, primarily around **large video files** and **CSS animation overhead**. Audio files are reasonably sized, but videos are the biggest data transfer concern.

---

## 1. Data Transfer Analysis

### Audio Files (Total: ~16.6 MB)

| File | Size | Bitrate | Assessment |
|------|------|---------|------------|
| Förnekad.mp3 | 5.1 MB | ~192 kbps | OK |
| Sisyfos bror.mp3 | 4.9 MB | ~175 kbps | OK |
| Medierad.mp3 | 5.3 MB | ~185 kbps | OK |
| Propaganda.mp3 | 1.3 MB | ~165 kbps | Good |

**Assessment:** Audio files are acceptably sized at 128-192 kbps equivalent. No action needed.

### Video Files (Total: ~153 MB) - CRITICAL

| File | Size | Duration | Assessment |
|------|------|----------|------------|
| Sisyfos bror.mp4 | **70 MB** | ~10s loop | VERY LARGE |
| Förnekad.mp4 | **45 MB** | ~10s loop | LARGE |
| Medierad.mp4 | **38 MB** | ~10s loop | LARGE |

**Assessment:** Videos are the primary data concern. A user playing all tracks with videos downloads ~153 MB just for background loops.

**Recommendations:**
- Compress videos to 2-5 MB each (target: 1-2 Mbps bitrate for 720p)
- Use WebM format with VP9 codec (30-50% smaller than H.264)
- Consider lower resolution (540p is sufficient for background)
- Add lazy loading - only load video when track is selected

### JavaScript Bundle

| Asset | Size | Gzipped |
|-------|------|---------|
| index.js | 206 KB | 66 KB |
| index.css | 51 KB | 9 KB |

**Assessment:** Bundle sizes are excellent. React + all components in 66 KB gzipped is very good.

---

## 2. Rendering Performance Analysis

### High-Cost CSS Effects

#### Critical: `filter: blur()` (GPU-intensive)

Found in 4 locations:
```
src/components/UpcomingRelease.css:37  - blur(20px) on blurred cover
src/components/UpcomingRelease.css:60  - blur(30px) on glow effect
src/components/LyricsPlayer.css:684    - blur(30px) on fog particles (x20)
src/components/CustomCursor.css:35     - blur(2px) on cursor trail
```

**Impact:**
- Fog particles: 20 elements each with `blur(30px)` = **heavy GPU load**
- Each blur filter creates a separate compositing layer
- On lower-end devices, this causes frame drops

#### Critical: `backdrop-filter: blur()` (Very GPU-intensive)

```
src/components/Header.css:13 - backdrop-filter: blur(10px)
```

**Impact:** `backdrop-filter` is one of the most expensive CSS properties. It's applied to the header which is always visible.

### Animation Count

| File | Animation/Keyframe Count |
|------|--------------------------|
| LyricsPlayer.css | 31 |
| LoadingScreen.css | 25 |
| LyricsReader.css | 9 |
| Countdown.css | 8 |
| App.css | 8 |
| Hero.css | 7 |
| Other files | ~21 |
| **Total** | **~109** |

### Always-Running Animations in LyricsPlayer

When playing a track, these run continuously:

1. **VHS noise** (`vhs-noise-move`) - 0.2s, steps(10), infinite
   - Transforms a large SVG noise texture
   - Runs at ~50 FPS equivalent

2. **VHS static burst** (`vhs-static-burst`) - 8s, infinite
   - Full-screen gradient animation

3. **VHS flicker** (`vhs-flicker`) - 10s, infinite
   - Color overlay flashes

4. **Fog particles** (`fog-rise`) - 15-35s each, infinite, **x20 elements**
   - Each particle: translateY + translateX + scale + opacity
   - All with `filter: blur(30px)`

5. **Debris particles** (`debris-fall`) - 8-20s each, infinite, **x30 elements**
   - Each particle: translateY + translateX + rotate + opacity

6. **Scanlines** - Static but full-screen repeating gradient

### JavaScript Animation Loops

```typescript
// useAudioAnalyser.ts - Line 99
requestAnimationFrame(updateFrequencies)
```

This runs every frame (~60 FPS) when playing:
- Reads frequency data from Web Audio API
- Updates 12 frequency values (setState x12 bars)
- Calculates bass level (setState)
- Checks glitch trigger threshold

**Impact:** Triggers React re-renders every frame for visualizer bars.

---

## 3. Frame Drop Risk Assessment

### HIGH Risk Areas

| Component | Issue | Expected Impact |
|-----------|-------|-----------------|
| Fog particles | 20x blur(30px) + animation | 10-20 FPS drop on mobile |
| VHS noise | Continuous transform on large element | 5-10 FPS drop |
| Audio visualizer | 60 FPS setState updates | Potential jank |
| Background video | Full-screen video decode + render | GPU memory pressure |

### MEDIUM Risk Areas

| Component | Issue | Expected Impact |
|-----------|-------|-----------------|
| Header backdrop-filter | Always visible blur | 2-5 FPS drop |
| Debris particles | 30x animations | 3-5 FPS drop |
| Custom cursor trail | blur(2px) on mouse move | Minor impact |

### LOW Risk Areas

| Component | Issue |
|-----------|-------|
| Glitch text effects | Only triggers on hover/bass hit |
| Loading screen effects | Only visible for 2.5s on load |
| Page transitions | Brief 300ms duration |

---

## 4. Specific Performance Bottlenecks

### Bottleneck 1: Fog Particle Blur
```css
.fog-particle {
  filter: blur(30px);  /* EXPENSIVE */
  animation: fog-rise linear infinite;
}
```
20 of these = 20 separate GPU blur operations per frame.

### Bottleneck 2: Audio Visualizer Re-renders
```typescript
setFrequencies(newFreqs);  // Triggers re-render
setBassLevel(bassSum);     // Triggers re-render
```
This runs every animation frame, causing ~60 state updates/second.

### Bottleneck 3: VHS Noise Animation
```css
.vhs-noise {
  animation: vhs-noise-move 0.2s steps(10) infinite;
}
```
Full-screen element transforming 50 times per second.

### Bottleneck 4: Video + Effects Layer Stack
When playing with video:
1. Video decode (GPU)
2. Video overlay gradient
3. Fog particles x20 with blur
4. Debris particles x30
5. VHS scanlines
6. VHS noise
7. VHS static burst
8. VHS flicker
9. Pulsing vignette (opacity animation)
10. Audio visualizer bars

= **10 compositing layers minimum**, several with blur filters.

---

## 5. Recommendations Summary

### Must Fix (High Impact)

1. **Compress videos** to 2-5 MB each
2. **Reduce fog particle count** from 20 to 8-10
3. **Remove blur from fog particles** or reduce to blur(10px)
4. **Throttle audio visualizer updates** to 30 FPS instead of 60

### Should Fix (Medium Impact)

5. **Use `will-change`** on animated elements to hint GPU compositing
6. **Add `content-visibility: auto`** to off-screen sections
7. **Lazy load videos** - only fetch when track is selected
8. **Reduce VHS noise animation** frequency (0.5s instead of 0.2s)

### Nice to Have (Low Impact)

9. Add WebM video alternatives with `<source>` fallback
10. Consider `prefers-reduced-motion` media query for accessibility
11. Add performance mode toggle for low-end devices

---

## 6. Testing Recommendations

To measure actual performance:

1. **Chrome DevTools > Performance tab**
   - Record while playing a track with video
   - Check for frames exceeding 16ms (60 FPS target)

2. **Chrome DevTools > Rendering > Frame Rendering Stats**
   - Shows real-time FPS counter

3. **Lighthouse Performance Audit**
   - Run on both desktop and mobile simulated throttling

4. **Test on actual mobile device**
   - The effects are designed for desktop
   - Mobile GPUs will struggle significantly

---

## 7. Quick Wins (No Visual Change)

These optimizations maintain aesthetics while improving performance:

```css
/* Add to animated elements */
.fog-particle,
.debris-particle,
.vhs-noise {
  will-change: transform, opacity;
}

/* Reduce blur radius */
.fog-particle {
  filter: blur(15px); /* was 30px */
}
```

```typescript
// Throttle visualizer to 30 FPS
let lastUpdate = 0;
const updateFrequencies = (timestamp: number) => {
  if (timestamp - lastUpdate < 33) { // 30 FPS
    animationRef.current = requestAnimationFrame(updateFrequencies);
    return;
  }
  lastUpdate = timestamp;
  // ... rest of update logic
};
```

---

## Conclusion

The site's aesthetic relies heavily on GPU-intensive effects. The main concerns are:

1. **Video files** - 153 MB total is excessive for looping backgrounds
2. **Blur filters** - 20+ blur operations running simultaneously
3. **Animation density** - Too many concurrent CSS animations

On a modern desktop with a dedicated GPU, performance is likely acceptable. On mobile or integrated graphics, users will experience significant frame drops during music playback with video backgrounds.

Priority should be given to video compression and reducing the fog particle blur effect, as these provide the most performance gain with minimal visual impact.
