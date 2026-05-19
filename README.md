# ZIAN AI CONCEPTS 3D Experience

Minimal Next.js experience for the ZIAN AI CONCEPTS 3D signet.

## Commands

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

## Stack

- Next.js App Router
- React
- Three.js with React Three Fiber and Drei
- Tailwind CSS

## Notes

- `three` is intentionally pinned to `0.182.0` because the current React Three Fiber release still uses `THREE.Clock` internally, which emits deprecation warnings with newer Three.js versions.
- The experience respects reduced-motion preferences by disabling scroll rotation, idle floating, sparkle movement, and CSS transition timing.
