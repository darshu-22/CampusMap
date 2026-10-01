import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Maximize2, Minimize2, Loader2, ImageOff } from 'lucide-react';
import type { RouteStep } from '../data/routes';
import { campusGraphData } from '../data/campusGraph';
import { getPanoramaNode } from '../utils/panorama';
import { PAIR_1_LIFT_EDGES, PAIR_2_LIFT_EDGES } from '../utils/routing';

interface PhotoViewerProps {
  step: RouteStep;
  stepNumber: number;
  totalSteps: number;
  locationName: string;
  onHotspotNavigate?: (targetPanoId: string) => void;
  allowedTargetPanoId?: string | null;
  isRouteGuided?: boolean;
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  step,
  stepNumber,
  totalSteps,
  locationName,
  onHotspotNavigate,
  allowedTargetPanoId,
  isRouteGuided = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Native Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);
  const hotspotsRef = useRef<THREE.Sprite[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Keep onHotspotNavigate ref updated to prevent stale closures in Three.js event handlers
  const onHotspotNavigateRef = useRef(onHotspotNavigate);
  useEffect(() => {
    onHotspotNavigateRef.current = onHotspotNavigate;
  }, [onHotspotNavigate]);

  // ── Helper: create "Click here" text label sprite attached underneath hotspot ──
  function createClickHereLabel(): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      const cornerRadius = 18;
      const rectX = 24;
      const rectY = 12;
      const rectW = 336;
      const rectH = 72;

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(rectX, rectY, rectW, rectH, cornerRadius);
      } else {
        ctx.rect(rectX, rectY, rectW, rectH);
      }
      ctx.fill();

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.font = 'bold 38px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Click here', canvas.width / 2, canvas.height / 2);
    }

    const labelTexture = new THREE.CanvasTexture(canvas);
    labelTexture.minFilter = THREE.LinearFilter;

    const labelMaterial = new THREE.SpriteMaterial({
      map: labelTexture,
      depthTest: false,
      transparent: true,
    });

    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.scale.set(1.65, 0.42, 1);
    labelSprite.position.set(0, -0.75, 0);

    return labelSprite;
  }

// Pair 1 Floor Order & Base Positions for calculating UP/DOWN offsets
const PAIR_1_FLOOR_ORDER: Record<string, number> = {
  'adminblockinside.jpeg': 0,
  'admissions.jpeg': 1,
  '3ndfloorentrance.jpeg': 2,
  '3FentraNCE.jpeg': 3,
  '4thfloorabup.jpeg': 4,
  'MCA5.jpeg': 5,
};

const PAIR_1_BASE_POSITIONS: Record<string, [number, number, number]> = {
  'adminblockinside.jpeg': [380, -100, 0],
  'admissions.jpeg': [0, -100, -380],
  '3ndfloorentrance.jpeg': [-380, -100, 0],
  '3FentraNCE.jpeg': [0, -100, 380],
  '4thfloorabup.jpeg': [0, -100, -380],
  'MCA5.jpeg': [0, -100, -380],
};

// Pair 2 Floor Order & Base Positions for calculating UP/DOWN offsets
const PAIR_2_FLOOR_ORDER: Record<string, number> = {
  'BF2L.jpeg': 0,
  'GF2L.jpeg': 1,
  'FF2L.jpeg': 2,
  '2F2L.jpeg': 3,
  '3F2L.jpeg': 4,
  '4F2L.jpeg': 5,
  '5F2L.jpeg': 6,
};

const PAIR_2_BASE_POSITIONS: Record<string, [number, number, number]> = {
  'BF2L.jpeg': [0, -100, 380],
  'GF2L.jpeg': [0, -100, -380],
  'FF2L.jpeg': [0, -100, -380],
  '2F2L.jpeg': [-380, -100, 0],
  '3F2L.jpeg': [0, -100, -380],
  '4F2L.jpeg': [-380, -100, 0],
  '5F2L.jpeg': [0, -100, -380],
};

  // ── Helper: build 3D Sprite Hotspots matching 3Sixty desktop app ────────
  function buildHotspotsForPano(
    panoId: string,
    scene: THREE.Scene,
    targetPanoIdAllowed?: string | null,
    guidedMode?: boolean
  ) {
    // 1. Remove all existing sprite instances from scene to prevent duplicates
    const existingSprites = scene.children.filter(child => child instanceof THREE.Sprite);
    existingSprites.forEach(child => scene.remove(child));
    hotspotsRef.current = [];

    const baseEdges = campusGraphData.edges[panoId] ?? [];
    let liftEdges: { toId: string; title: string; weight: number; position: string; icon: string }[] = [];

    const isPair1 = PAIR_1_FLOOR_ORDER[panoId] !== undefined;
    const isPair2 = PAIR_2_FLOOR_ORDER[panoId] !== undefined;

    if (isPair1 || isPair2) {
      const floorOrderMap = isPair1 ? PAIR_1_FLOOR_ORDER : PAIR_2_FLOOR_ORDER;
      const basePosMap = isPair1 ? PAIR_1_BASE_POSITIONS : PAIR_2_BASE_POSITIONS;
      const rawLiftEdgesMap = isPair1 ? PAIR_1_LIFT_EDGES : PAIR_2_LIFT_EDGES;

      const currentOrder = floorOrderMap[panoId];
      const [baseX, baseY, baseZ] = basePosMap[panoId];

      if (guidedMode) {
        // In Route-Guided Mode, include all valid LIFT_EDGES so Dijkstra route steps pass through
        const rawEdges = rawLiftEdgesMap[panoId] ?? [];
        liftEdges = rawEdges.map(edge => {
          const targetOrder = floorOrderMap[edge.toId];
          const isUp = targetOrder !== undefined ? targetOrder > currentOrder : true;
          const finalY = isUp ? baseY + 30 : baseY - 30;
          return {
            ...edge,
            position: `${baseX}, ${finalY}, ${baseZ}`
          };
        });
      } else {
        // In Open-World Mode, render adjacent UPWARD and DOWNWARD floor options
        const pair1AdjacentMap: Record<string, { toId: string; title: string; isUp: boolean }[]> = {
          'adminblockinside.jpeg': [{ toId: 'admissions.jpeg', title: 'Take Pair 1 Lift to 1st Floor', isUp: true }],
          'admissions.jpeg': [
            { toId: '3ndfloorentrance.jpeg', title: 'Take Pair 1 Lift to 2nd Floor', isUp: true },
            { toId: 'adminblockinside.jpeg', title: 'Take Pair 1 Lift to Ground Floor', isUp: false }
          ],
          '3ndfloorentrance.jpeg': [
            { toId: '3FentraNCE.jpeg', title: 'Take Pair 1 Lift to 3rd Floor', isUp: true },
            { toId: 'admissions.jpeg', title: 'Take Pair 1 Lift to 1st Floor', isUp: false }
          ],
          '3FentraNCE.jpeg': [
            { toId: '4thfloorabup.jpeg', title: 'Take Pair 1 Lift to 4th Floor', isUp: true },
            { toId: '3ndfloorentrance.jpeg', title: 'Take Pair 1 Lift to 2nd Floor', isUp: false }
          ],
          '4thfloorabup.jpeg': [
            { toId: 'MCA5.jpeg', title: 'Take Pair 1 Lift to 5th Floor', isUp: true },
            { toId: '3FentraNCE.jpeg', title: 'Take Pair 1 Lift to 3rd Floor', isUp: false }
          ],
          'MCA5.jpeg': [{ toId: '4thfloorabup.jpeg', title: 'Take Pair 1 Lift to 4th Floor', isUp: false }]
        };

        const pair2AdjacentMap: Record<string, { toId: string; title: string; isUp: boolean }[]> = {
          'BF2L.jpeg': [{ toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', isUp: true }],
          'GF2L.jpeg': [
            { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', isUp: true },
            { toId: 'BF2L.jpeg', title: 'Take Pair 2 Lift to Basement', isUp: false }
          ],
          'FF2L.jpeg': [
            { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', isUp: true },
            { toId: 'GF2L.jpeg', title: 'Take Pair 2 Lift to Ground Floor', isUp: false }
          ],
          '2F2L.jpeg': [
            { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', isUp: true },
            { toId: 'FF2L.jpeg', title: 'Take Pair 2 Lift to 1st Floor', isUp: false }
          ],
          '3F2L.jpeg': [
            { toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', isUp: true },
            { toId: '2F2L.jpeg', title: 'Take Pair 2 Lift to 2nd Floor', isUp: false }
          ],
          '4F2L.jpeg': [
            { toId: '5F2L.jpeg', title: 'Take Pair 2 Lift to 5th Floor', isUp: true },
            { toId: '3F2L.jpeg', title: 'Take Pair 2 Lift to 3rd Floor', isUp: false }
          ],
          '5F2L.jpeg': [{ toId: '4F2L.jpeg', title: 'Take Pair 2 Lift to 4th Floor', isUp: false }]
        };

        const adjacentList = (isPair1 ? pair1AdjacentMap[panoId] : pair2AdjacentMap[panoId]) ?? [];
        const hasBoth = adjacentList.length > 1;
        liftEdges = adjacentList.map(cfg => {
          let finalY = baseY;
          if (hasBoth) {
            finalY = cfg.isUp ? baseY + 30 : baseY - 30;
          }
          return {
            toId: cfg.toId,
            title: cfg.title,
            weight: 0.5,
            position: `${baseX}, ${finalY}, ${baseZ}`,
            icon: 'chevronforward.png'
          };
        });
      }
    } else {
      liftEdges = [...(PAIR_1_LIFT_EDGES[panoId] ?? []), ...(PAIR_2_LIFT_EDGES[panoId] ?? [])];
    }

    let edges = [...baseEdges, ...liftEdges];

    if (guidedMode) {
      if (targetPanoIdAllowed) {
        edges = edges.filter(e => e.toId === targetPanoIdAllowed);
      } else {
        // At destination or no allowed target in route mode -> 0 hotspots
        edges = [];
      }
    }

    const textureLoader = textureLoaderRef.current || new THREE.TextureLoader();

    edges.forEach((edge) => {
      if (!edge.position) return;
      const parts = edge.position.split(',').map(s => parseFloat(s.trim()));
      if (parts.length !== 3 || parts.some(isNaN)) return;

      const [x, y, z] = parts;
      const iconName = edge.icon || 'chevronforward.png';
      const iconPath = `/images/${iconName}`;

      // Load original 3Sixty PNG icon texture
      textureLoader.load(
        iconPath,
        (texture: THREE.Texture) => {
          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            depthTest: false
          });

          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.scale.set(40, 40, 1);

          // Direct 3D WTM position assignment (identical to 3Sixty desktop)
          sprite.position.set(x, y, z);

          const targetNode = getPanoramaNode(edge.toId);
          const label = edge.title || (targetNode ? `Go to ${targetNode.displayName}` : edge.toId);
          sprite.userData = { targetPanoId: edge.toId, label };

          // Attach "Click here" label directly underneath existing hotspot
          const labelSprite = createClickHereLabel();
          labelSprite.userData = { targetPanoId: edge.toId, label };
          sprite.add(labelSprite);

          scene.add(sprite);
          hotspotsRef.current.push(sprite);
        },
        undefined,
        (err: unknown) => {
          console.error(`[PhotoViewer] Error loading hotspot icon "${iconPath}":`, err);
        }
      );
    });
  }

  // ── Initialize Native Three.js 360 Viewer on Mount ──────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setIsLoading(true);
    setHasError(false);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera (identical to 3Sixty desktop index.html)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1100);
    camera.position.set(0, 0, 0.1);
    scene.add(camera);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Orbit Controls (identical configuration to 3Sixty desktop)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.rotateSpeed = -0.3;
    controls.minDistance = 0.1;
    controls.maxDistance = 100;
    controlsRef.current = controls;

    // 4. Inverted 360 Sphere Geometry (identical to 3Sixty desktop)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    const textureLoader = new THREE.TextureLoader();
    textureLoaderRef.current = textureLoader;

    // 6. Animation Loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 7. Raycaster for Hotspot Clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerClick = (event: MouseEvent) => {
      if (!rendererDom || !cameraRef.current) return;
      const rect = rendererDom.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(hotspotsRef.current, true);

      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        const targetPanoId = (clicked.userData?.targetPanoId || clicked.parent?.userData?.targetPanoId) as string | undefined;
        if (targetPanoId && onHotspotNavigateRef.current) {
          onHotspotNavigateRef.current(targetPanoId);
        }
      }
    };

    const rendererDom = renderer.domElement;
    rendererDom.addEventListener('click', handlePointerClick);

    // 8. Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      rendererDom.removeEventListener('click', handlePointerClick);
      controls.dispose();
      renderer.dispose();
      if (container.contains(rendererDom)) {
        container.removeChild(rendererDom);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      sphereMeshRef.current = null;
      textureLoaderRef.current = null;
      hotspotsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Swap Panorama Texture on Step Change ────────────────────────────────
  useEffect(() => {
    if (!sphereMeshRef.current || !textureLoaderRef.current || !sceneRef.current) return;

    setIsLoading(true);
    setHasError(false);

    const currentPano = step.image.replace('/campus/', '');

    textureLoaderRef.current.load(
      step.image,
      (texture: THREE.Texture) => {
        if (!sphereMeshRef.current || !sceneRef.current) return;
        texture.minFilter = THREE.LinearFilter;
        (sphereMeshRef.current.material as THREE.MeshBasicMaterial).map = texture;
        (sphereMeshRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
        setIsLoading(false);
        setHasError(false);
        buildHotspotsForPano(currentPano, sceneRef.current, allowedTargetPanoId, isRouteGuided);
      },
      undefined,
      (err: unknown) => {
        console.error('[PhotoViewer] Texture swap error:', err);
        setIsLoading(false);
        setHasError(true);
      }
    );
  }, [step.image, allowedTargetPanoId, isRouteGuided]);

  // ── Fullscreen Toggle ───────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && outerRef.current) {
      outerRef.current.requestFullscreen().catch(() => setIsFullscreen(f => !f));
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      setIsFullscreen(f => !f);
    }
  };

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (containerRef.current && cameraRef.current && rendererRef.current) {
        setTimeout(() => {
          const w = containerRef.current?.clientWidth || window.innerWidth;
          const h = containerRef.current?.clientHeight || window.innerHeight;
          cameraRef.current!.aspect = w / h;
          cameraRef.current!.updateProjectionMatrix();
          rendererRef.current!.setSize(w, h);
        }, 50);
      }
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <div
      ref={outerRef}
      className={`relative w-full overflow-hidden bg-slate-900 shadow-md group ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none'
          : 'aspect-[4/3] rounded-2xl md:rounded-3xl'
      }`}
    >
      {/* Native Three.js mount point */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-3" />
          <p className="text-slate-300 text-sm font-medium">Loading 360° panorama…</p>
        </div>
      )}

      {/* Error overlay */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900 p-6">
          <ImageOff className="w-16 h-16 mb-4 text-slate-500 animate-pulse" />
          <h4 className="font-bold text-lg text-slate-300">Panorama unavailable</h4>
          <p className="text-sm text-slate-500 mt-1.5 text-center max-w-xs">
            We couldn't load the 360° view for <em>{locationName}</em>. Please
            follow the written directions.
          </p>
        </div>
      )}

      {/* Top overlay: step badge + location name + fullscreen */}
      <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex justify-between items-start pointer-events-none">
        <div className="text-white">
          {isRouteGuided ? (
            <span className="text-xs bg-purple-600/90 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Step {stepNumber} of {totalSteps}
            </span>
          ) : (
            <span className="text-xs bg-blue-600/90 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              360° View
            </span>
          )}
          <h3 className="font-bold text-lg md:text-xl mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {locationName}
          </h3>
        </div>

        <button
          onClick={toggleFullscreen}
          className="pointer-events-auto p-2 bg-slate-900/60 backdrop-blur-md text-white rounded-xl hover:bg-blue-600/90 hover:scale-105 transition-all shadow-md focus:outline-none"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Bottom overlay: navigation instruction */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
        <p className="text-base md:text-lg font-medium tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center leading-relaxed">
          {step.instruction}
        </p>
        <p className="text-xs text-slate-400 text-center mt-1">
          Drag to look around · Scroll to zoom · Click arrows to navigate
        </p>
      </div>
    </div>
  );
};
