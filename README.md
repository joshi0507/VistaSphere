# VistaSphere — 360° Virtual Tour Platform

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/vistasphere
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Start MongoDB
```bash
mongod
```

### 4. Run dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── upload/route.ts       # GLB upload, slug gen, QR gen
│   │   └── tours/[slug]/route.ts # GET tour, PATCH analytics
│   ├── tour/[slug]/
│   │   ├── page.tsx              # SSR tour page + metadata
│   │   └── TourPageClient.tsx    # Fullscreen viewer UI
│   ├── globals.css               # Design system tokens
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx                  # Homepage
├── components/
│   ├── TourViewer.tsx            # Three.js R3F immersive viewer
│   └── UploadSection.tsx         # Drag-drop upload with states
├── lib/
│   ├── mongodb.ts                # Connection pooling
│   ├── slug.ts                   # URL slug generation
│   └── storage.ts                # Local file storage
└── models/
    └── Tour.ts                   # Mongoose Tour model
```

## Tour Viewer Controls

| Input | Action |
|-------|--------|
| Mouse drag | Look around |
| WASD / Arrow keys | Walk forward/back/strafe |
| Scroll wheel | Zoom in/out |
| Touch drag | Mobile look around |
| Pinch | Mobile zoom |
| Device rotation | Gyroscope look (mobile) |
| Fullscreen button | Enter/exit fullscreen |

## Production Deployment

### Environment Variables
```env
MONGODB_URI=mongodb+srv://...    # MongoDB Atlas URI
NEXT_PUBLIC_BASE_URL=https://... # Your domain
```

### Cloud Storage Migration
Replace `src/lib/storage.ts` for production:
- **Cloudflare R2**: Use `@aws-sdk/client-s3` with R2 endpoint
- **AWS S3**: Use `@aws-sdk/client-s3`
- **Supabase Storage**: Use `@supabase/supabase-js`

## Future Expansion

- **360 Panoramas** (`.jpg`, `.png`): Equirectangular sphere renderer
- **Gaussian Splats** (`.splat`, `.ksplat`): `@mkkellogg/gaussian-splats-3d`
- **Multi-Room Tours**: Hotspot navigation system
- **VR/WebXR**: `@react-three/xr` for Meta Quest / Vision Pro
- **Voice Guide**: Web Audio API narration
- **Information Hotspots**: 3D HTML labels on click
