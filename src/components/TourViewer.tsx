'use client';

import { Suspense, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, BakeShadows } from '@react-three/drei';
import * as THREE from 'three';

// --- Room Model Component ---
function RoomModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);

  const { camera } = useThree();
  const initialized = useRef(false);

  useEffect(() => {
    if (!clonedScene || initialized.current) return;
    initialized.current = true;

    console.log("[CAMERA_INIT_EFFECT]", {
      position: camera.position.toArray(),
      rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
    });

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);

    if (maxSize > 0) {
      const scale = 10 / maxSize;
      clonedScene.scale.setScalar(scale);
      clonedScene.updateMatrixWorld();
    }

    const scaledBox = new THREE.Box3().setFromObject(clonedScene);
    const center = scaledBox.getCenter(new THREE.Vector3());
    const scaledSize = scaledBox.getSize(new THREE.Vector3());

    clonedScene.position.sub(center);
    clonedScene.updateMatrixWorld();

    const floorY = -scaledSize.y / 2;
    const eyeLevel = floorY + (scaledSize.y * 0.35);

    camera.position.set(0, eyeLevel, 0);

    (camera as THREE.PerspectiveCamera).near = 0.01;
    (camera as THREE.PerspectiveCamera).far = 1000;
    (camera as THREE.PerspectiveCamera).fov = 80;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

    clonedScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;

        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m: THREE.Material) => {
            m.side = THREE.DoubleSide;
            if ('needsUpdate' in m) (m as THREE.MeshStandardMaterial).needsUpdate = true;
          });
        }
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} />;
}

// --- First Person Camera Controller ---
interface PointerState {
  isDown: boolean;
  lastX: number;
  lastY: number;
}

function FirstPersonController() {
  const { camera, gl } = useThree();
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const velocity = useRef(new THREE.Vector3());
  const pointer = useRef<PointerState>({ isDown: false, lastX: 0, lastY: 0 });
  const keys = useRef<Set<string>>(new Set());
  const touchRef = useRef<{ x: number; y: number; id: number | null }>({ x: 0, y: 0, id: null });
  const gyroRef = useRef({ enabled: false, alpha: 0, beta: 0, gamma: 0 });
  const userHasInteractedRef = useRef(false);
  const pinchRef = useRef<{ dist: number; fov: number } | null>(null);

  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseDown = (e: MouseEvent) => {
      pointer.current = { isDown: true, lastX: e.clientX, lastY: e.clientY };
      userHasInteractedRef.current = true;
      canvas.style.cursor = 'grabbing';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!pointer.current.isDown) return;
      const dx = e.clientX - pointer.current.lastX;
      const dy = e.clientY - pointer.current.lastY;
      euler.current.y -= dx * 0.004;
      euler.current.x -= dy * 0.004;
      euler.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, euler.current.x));
      pointer.current.lastX = e.clientX;
      pointer.current.lastY = e.clientY;
    };
    const onMouseUp = () => {
      pointer.current.isDown = false;
      canvas.style.cursor = 'grab';
      userHasInteractedRef.current = true;
    };

    canvas.style.cursor = 'grab';
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchRef.current = { x: t.clientX, y: t.clientY, id: t.identifier };
      userHasInteractedRef.current = true;
      if (e.touches.length === 2) {
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        pinchRef.current = { dist, fov: (camera as THREE.PerspectiveCamera).fov };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        const t = Array.from(e.touches).find((tt) => tt.identifier === touchRef.current.id);
        if (!t) return;
        const dx = t.clientX - touchRef.current.x;
        const dy = t.clientY - touchRef.current.y;
        euler.current.y -= dx * 0.005;
        euler.current.x -= dy * 0.005;
        euler.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, euler.current.x));
        touchRef.current.x = t.clientX;
        touchRef.current.y = t.clientY;
      } else if (e.touches.length === 2) {
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dx = t0.clientX - t1.clientX;
        const dy = t0.clientY - t1.clientY;
        const dist = Math.hypot(dx, dy);
        if (!pinchRef.current) {
          pinchRef.current = { dist, fov: (camera as THREE.PerspectiveCamera).fov };
        } else {
          const scale = pinchRef.current.dist / dist;
          const fov = Math.max(30, Math.min(100, pinchRef.current.fov * scale));
          (camera as THREE.PerspectiveCamera).fov = fov;
          (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
        }
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      userHasInteractedRef.current = true;
      if (e.touches.length < 2) pinchRef.current = null;
    };
    const onTouchCancel = () => {
      userHasInteractedRef.current = true;
      pinchRef.current = null;
    };
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchcancel', onTouchCancel);

    const onKeyDown = (e: KeyboardEvent) => keys.current.add(e.code);
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.code);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (!gyroRef.current.enabled) {
        gyroRef.current.enabled = true;
      }
      gyroRef.current.alpha = e.alpha ?? 0;
      gyroRef.current.beta = e.beta ?? 0;
      gyroRef.current.gamma = e.gamma ?? 0;
    };
    window.addEventListener('deviceorientation', onOrientation);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const fov = (camera as THREE.PerspectiveCamera).fov;
      (camera as THREE.PerspectiveCamera).fov = Math.max(30, Math.min(100, fov + e.deltaY * 0.05));
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchCancel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('deviceorientation', onOrientation);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [camera, gl]);

  useFrame((_, delta) => {
    console.count("[FRAME]");
    const allowGyro = gyroRef.current.enabled && !userHasInteractedRef.current;

    console.log("[CAMERA_DEBUG]", {
      posX: Number(camera.position.x.toFixed(3)),
      posY: Number(camera.position.y.toFixed(3)),
      posZ: Number(camera.position.z.toFixed(3)),

      rotX: Number(camera.rotation.x.toFixed(3)),
      rotY: Number(camera.rotation.y.toFixed(3)),
      rotZ: Number(camera.rotation.z.toFixed(3)),

      allowGyro,
      gyroEnabled: gyroRef.current?.enabled ?? false,
      userHasInteracted: userHasInteractedRef.current ?? false,
      isDown: pointer.current?.isDown ?? false,
    });

    if (allowGyro) {
      const betaRad = THREE.MathUtils.degToRad(gyroRef.current.beta - 90);
      const gammaRad = THREE.MathUtils.degToRad(gyroRef.current.gamma);
      euler.current.x = THREE.MathUtils.lerp(euler.current.x, -betaRad, 0.1);
      euler.current.y = THREE.MathUtils.lerp(euler.current.y, -gammaRad, 0.1);
    }

    camera.quaternion.setFromEuler(euler.current);

    console.log("[CAMERA_ROTATION_UPDATE]", {
      rotX: camera.rotation.x,
      rotY: camera.rotation.y,
      rotZ: camera.rotation.z
    });

    const speed = 3 * delta;
    const dir = new THREE.Vector3();

    if (keys.current.has('KeyW') || keys.current.has('ArrowUp')) dir.z -= 1;
    if (keys.current.has('KeyS') || keys.current.has('ArrowDown')) dir.z += 1;
    if (keys.current.has('KeyA') || keys.current.has('ArrowLeft')) dir.x -= 1;
    if (keys.current.has('KeyD') || keys.current.has('ArrowRight')) dir.x += 1;

    if (dir.lengthSq() > 0) {
      dir.normalize();
      dir.applyQuaternion(camera.quaternion);
      dir.y = 0;
      dir.normalize();
      console.log("[CAMERA_POSITION_SET]", {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        stack: new Error().stack,
      });

      camera.position.addScaledVector(dir, speed);

      console.log("[CAMERA_POSITION_SET]", {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        stack: new Error().stack,
      });
    }

    velocity.current.multiplyScalar(0.9);
  });

  return null;
}

// --- Loading Fallback ---
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#111111" />
    </mesh>
  );
}

// --- Main Viewer ---
interface TourViewerProps {
  fileUrl: string;
}

export default function TourViewer({ fileUrl }: TourViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#080808',
        overflow: 'hidden',
      }}
      aria-label="360° virtual tour viewer"
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
        }}
        shadows
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
        <hemisphereLight args={['#87ceeb', '#8b7355', 0.4]} />

        <Suspense fallback={null}>
          <Environment preset="apartment" />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <RoomModel url={fileUrl} />
        </Suspense>

        <FirstPersonController />

      </Canvas>

      {showHint && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
            padding: '10px 20px',
            borderRadius: 9999,
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.8)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'fadeInUp 0.4s ease both',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          aria-live="polite"
        >
          Drag to look · WASD to move · Scroll/Pinch to zoom
        </div>
      )}

      <button
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        id="fullscreen-btn"
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 40,
          height: 40,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8,
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 200ms ease',
          zIndex: 10,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.85)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.6)')}
      >
        {isFullscreen ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
      </button>

      {/* Footer Contact */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 20px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>AI-Powered 360° Virtual Tour & QR Sharing Platform</span>
        <div style={{ display: 'flex', gap: 12, pointerEvents: 'auto' }}>
          <a
            href="mailto:tanishqjoshi200507@gmail.com"
            style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/tanishq-joshi-9921b3285/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/tanishq_joshi_05/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
