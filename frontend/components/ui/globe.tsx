"use client";
import { useEffect, useRef, useMemo, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@public/globe.json";

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

// Detect Safari/Firefox or Mobile for performance adjustments
const isMobile =
  typeof navigator !== "undefined" &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const isSafari =
  typeof navigator !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isFirefox =
  typeof navigator !== "undefined" &&
  navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
const isLowPerfBrowser = isSafari || isFirefox || isMobile;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

export function Globe({ globeConfig, data }: WorldProps) {
  const { scene } = useThree();
  const globeRef = useRef<ThreeGlobe | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameCountRef = useRef(0);

  // Reduce quality on Safari/Firefox
  const defaultProps = useMemo(
    () => ({
      pointSize: isLowPerfBrowser ? 0.5 : 1,
      atmosphereColor: "#ffffff",
      showAtmosphere: !isLowPerfBrowser, // Disable atmosphere on low-perf browsers
      atmosphereAltitude: 0.1,
      polygonColor: "rgba(255,255,255,0.7)",
      globeColor: "#1d072e",
      emissive: "#000000",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      arcTime: isLowPerfBrowser ? 3000 : 2000, // Slower animations
      arcLength: 0.9,
      rings: isLowPerfBrowser ? 0 : 1, // Disable rings on low-perf browsers
      maxRings: isLowPerfBrowser ? 1 : 3,
      ...globeConfig,
    }),
    [globeConfig],
  );

  // Throttle rendering on low-perf browsers
  useFrame(() => {
    if (isLowPerfBrowser) {
      frameCountRef.current++;
      // Skip every other frame on Safari/Firefox
      if (frameCountRef.current % 2 !== 0) return;
    }
  });

  // Initialize globe once
  useEffect(() => {
    if (globeRef.current) return; // Already initialized

    const globe = new ThreeGlobe({
      waitForGlobeReady: true,
      animateIn: true,
    });

    globeRef.current = globe;

    // Set material properties
    const globeMaterial = globe.globeMaterial() as any;
    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;

    scene.add(globe);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (globeRef.current) {
        scene.remove(globeRef.current);
        globeRef.current = null;
      }
    };
  }, [
    scene,
    defaultProps.globeColor,
    defaultProps.emissive,
    defaultProps.emissiveIntensity,
    defaultProps.shininess,
  ]);

  useEffect(() => {
    if (!globeRef.current || !data) return;

    const globe = globeRef.current;

    // Prepare points data
    let points: any[] = [];
    for (let i = 0; i < data.length; i++) {
      const arc = data[i];
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    // Filter duplicate points
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"],
          ),
        ) === i,
    );

    // Configure globe
    globe
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(isLowPerfBrowser ? 1 : 2) // Lower resolution for better performance
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    globe
      .arcsData(data)
      .arcStartLat((d: any) => d.startLat)
      .arcStartLng((d: any) => d.startLng)
      .arcEndLat((d: any) => d.endLat)
      .arcEndLng((d: any) => d.endLng)
      .arcColor((e: any) => e.color)
      .arcAltitude((e: any) => e.arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((e: any) => e.order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globe
      .pointsData(filteredPoints)
      .pointColor((e: any) => e.color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globe
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings,
      );
  }, [data, defaultProps]);

  // Rings animation
  useEffect(() => {
    if (!globeRef.current || !data || data.length === 0) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!globeRef.current || !data) return;

      const newNumbersOfRings = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * 4) / 5),
      );

      const ringsData = data
        .filter((d, i) => newNumbersOfRings.includes(i))
        .map((d) => ({
          lat: d.startLat,
          lng: d.startLng,
          color: d.color,
        }));

      globeRef.current.ringsData(ringsData);
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [data]);

  return null;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    // Reduce pixel ratio on Safari/Firefox for better performance
    const pixelRatio = isLowPerfBrowser
      ? Math.min(window.devicePixelRatio, 1)
      : Math.min(window.devicePixelRatio, 1.5);
    gl.setPixelRatio(pixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, [gl, size]);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer to pause when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scene = useMemo(() => {
    const s = new Scene();
    s.fog = new Fog(0xffffff, 400, 2000);
    return s;
  }, []);

  const camera = useMemo(
    () => new PerspectiveCamera(50, aspect, 180, 1800),
    [],
  );

  // Don't render canvas if not visible (saves resources)
  if (!isVisible) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle, #3E1E68 0%, #1d072e 100%)",
          borderRadius: "inherit",
        }}
      >
        <div className="text-white/50 text-sm">Globe paused</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas
        scene={scene}
        camera={camera}
        gl={{
          antialias: !isLowPerfBrowser, // Disable antialiasing on Safari/Firefox
          alpha: true,
          powerPreference: isLowPerfBrowser ? "low-power" : "default",
        }}
        dpr={isLowPerfBrowser ? [1, 1] : [1, 2]}
        frameloop={isLowPerfBrowser ? "demand" : "always"}
      >
        <WebGLRendererConfig />
        <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
        <directionalLight
          color={globeConfig.directionalLeftLight}
          position={new Vector3(-400, 100, 400)}
        />
        <directionalLight
          color={globeConfig.directionalTopLight}
          position={new Vector3(-200, 500, 200)}
        />
        <pointLight
          color={globeConfig.pointLight}
          position={new Vector3(-200, 500, 200)}
          intensity={0.8}
        />
        <Globe {...props} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minDistance={cameraZ}
          maxDistance={cameraZ}
          autoRotateSpeed={
            globeConfig.autoRotateSpeed ?? (isLowPerfBrowser ? 0.5 : 1)
          }
          autoRotate={globeConfig.autoRotate ?? true}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI - Math.PI / 3}
          target={[0, 0, 0]}
        />
        <InitialRotation
          lat={globeConfig.initialPosition?.lat ?? 26.8467}
          lng={globeConfig.initialPosition?.lng ?? 80.9462}
        />
      </Canvas>
    </div>
  );
}

// Component to set initial globe rotation to focus on a longitude and latitude
function InitialRotation({ lat, lng }: { lat: number; lng: number }) {
  const { camera, scene } = useThree();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Convert lat/lng to radians
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 280) * (Math.PI / 180);
      // 280 degree hardcode to spawn globe directly at lucknow

      // Calculate camera position to face the target (opposite side)
      const radius = cameraZ;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      initialized.current = true;
    }
  }, [camera, scene, lat, lng]);

  return null;
}

export function hexToRgb(hex: string) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
