"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Terminal, X } from "lucide-react";

export function WebGLShader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const framesRenderedRef = useRef<number>(0);
  const lastFpsCalculateTimeRef = useRef<number>(0);
  const totalFramesRef = useRef<number>(0);
  const degradationEventsRef = useRef<number>(0);
  const shaderStartTimeRef = useRef<number>(0);
  const peakFpsRef = useRef<number>(0);
  const minFpsRef = useRef<number>(Infinity);

  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [forceStaticFallback, setForceStaticFallback] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    // -- Performance --
    fps: 0,
    peakFps: 0,
    minFps: 0,
    targetFps: "Uncapped (Native)",
    frameTimeMs: 0,
    totalFrames: 0,
    uptime: "0s",
    // -- Rendering --
    dprMultiplier: 1.5,
    actualDpr: 1,
    nativeDpr: 1,
    logicalWidth: 0,
    logicalHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    // -- Hardware --
    concurrency: 4,
    memory: 4,
    renderer: "Unknown",
    vendor: "Unknown",
    platform: "Unknown",
    touchPoints: 0,
    colorDepth: 24,
    hdrSupported: false,
    colorGamut: "sRGB",
    renderingGamut: "sRGB",
    // -- WebGL --
    webglVersion: "WebGL 1.0",
    maxTextureSize: 0,
    maxViewportDims: "0x0",
    shaderPrecision: "Unknown",
    extensionsCount: 0,
    // -- Network --
    connectionType: "Unknown",
    downlinkMbps: "N/A",
    rttMs: "N/A",
    // -- State --
    degraded: false,
    degradationEvents: 0,
    reducedMotion: false,
  });

  const fpsRef = useRef<number>(0); // 0 means uncapped
  const frameDropsRef = useRef<number>(0);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Intersection observer to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (forceStaticFallback) return;
    if (!canvasRef.current) return;

    // --- Hardware Feature Detection ---
    let dprMultiplier = 1.5;
    let concurrency = 4;
    let memory = 4;

    if (typeof navigator !== "undefined") {
      concurrency = navigator.hardwareConcurrency || 4;
      // @ts-expect-error deviceMemory is non-standard but widely supported in Chromium
      memory = navigator.deviceMemory || 4;

      if (concurrency <= 2 || memory <= 2) {
        // Extremely low end device, skip WebGL entirely to save battery and avoid panics
        setForceStaticFallback(true);
        return;
      } else if (concurrency <= 4 || memory <= 4) {
        // Lower end device, start with conservative defaults
        dprMultiplier = 1.0;
      }
    }

    const canvas = canvasRef.current;
    const ctxOptions = {
      alpha: true,
      antialias: false,
      powerPreference: "default" as const,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      depth: false,
      stencil: false,
    };

    // Try WebGL 2 first, fall back to WebGL 1
    let gl: WebGLRenderingContext | null = canvas.getContext("webgl2", ctxOptions) as WebGLRenderingContext | null;
    let webglVersion = "WebGL 2.0";
    if (!gl) {
      gl = canvas.getContext("webgl", ctxOptions) as WebGLRenderingContext | null;
      webglVersion = "WebGL 1.0";
    }

    if (!gl) {
      console.warn("WebGL not supported, falling back to static background");
      return;
    }

    // --- Auto-upgrade color gamut ---
    // Attempt to render in widest gamut display supports
    let renderingGamut = "sRGB";
    if (webglVersion === "WebGL 2.0") {
      const gl2 = gl as WebGL2RenderingContext;
      try {
        // Try P3 first (widest commonly supported)
        if (typeof window !== "undefined" && window.matchMedia("(color-gamut: p3)").matches) {
          gl2.drawingBufferColorSpace = "display-p3";
          renderingGamut = "Display P3";
        }
      } catch {
        // drawingBufferColorSpace not supported in this browser, stay sRGB
        renderingGamut = "sRGB";
      }
    }

    // --- Collect GPU & WebGL stats ---
    const rendererDebugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = rendererDebugInfo ? gl.getParameter(rendererDebugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    const vendor = rendererDebugInfo ? gl.getParameter(rendererDebugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
    const extensionsCount = (gl.getSupportedExtensions() || []).length;

    // Shader precision
    let shaderPrecision = "Unknown";
    try {
      const hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      const mp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT);
      if (hp && hp.precision > 0) shaderPrecision = `highp (${hp.precision}-bit)`;
      else if (mp && mp.precision > 0) shaderPrecision = `mediump (${mp.precision}-bit)`;
      else shaderPrecision = "lowp";
    } catch { shaderPrecision = "N/A"; }

    // Platform info
    const platform = typeof navigator !== "undefined" ? (navigator.platform || "Unknown") : "Unknown";
    const touchPoints = typeof navigator !== "undefined" ? (navigator.maxTouchPoints || 0) : 0;
    const colorDepth = typeof screen !== "undefined" ? screen.colorDepth : 24;
    const nativeDpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

    // HDR & color gamut detection
    let hdrSupported = false;
    let colorGamut = "sRGB";
    if (typeof window !== "undefined") {
      hdrSupported = window.matchMedia("(dynamic-range: high)").matches;
      if (window.matchMedia("(color-gamut: rec2020)").matches) colorGamut = "Rec. 2020";
      else if (window.matchMedia("(color-gamut: p3)").matches) colorGamut = "Display P3";
      else colorGamut = "sRGB";
    }

    // Connection info
    let connectionType = "Unknown";
    let downlinkMbps = "N/A";
    let rttMs = "N/A";
    if (typeof navigator !== "undefined") {
      // @ts-expect-error connection is non-standard
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        connectionType = conn.effectiveType || conn.type || "Unknown";
        if (conn.downlink != null) downlinkMbps = `${conn.downlink} Mbps`;
        if (conn.rtt != null) rttMs = `${conn.rtt}ms`;
      }
    }

    shaderStartTimeRef.current = performance.now();
    peakFpsRef.current = 0;
    minFpsRef.current = Infinity;

    let currentPixelRatio = Math.min(window.devicePixelRatio, dprMultiplier);

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        uniform vec2 resolution;
        uniform float time;

        void main() {
          vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
          float gx = p.x;
          float gy = p.y;

          // Sangam-inspired colors: deep water blue, teal, saffron
          vec3 deepBlue = vec3(0.04, 0.09, 0.16);
          vec3 waterBlue = vec3(0.10, 0.23, 0.36);
          vec3 teal = vec3(0.05, 0.58, 0.53);
          vec3 cyan = vec3(0.13, 0.83, 0.93);
          vec3 saffron = vec3(0.96, 0.62, 0.04);
          vec3 amber = vec3(0.98, 0.75, 0.14);

          // Create flowing river confluence effect
          float river1 = 0.012 / abs(gy + sin(gx * 0.8 + time * 0.6) * 0.3);
          float river2 = 0.012 / abs(gy + cos(gx * 0.6 - time * 0.5) * 0.35);
          float river3 = 0.008 / abs(gx + sin(gy * 0.7 + time * 0.4) * 0.25);
          
          // Combine rivers at confluence
          float waves = (river1 + river2 + river3) / 3.0;
          waves = clamp(waves, 0.0, 1.0);

          // Create depth with layered colors
          vec3 baseColor = mix(deepBlue, waterBlue, waves * 0.4);
          baseColor = mix(baseColor, teal, waves * 0.3 * (0.5 + 0.5 * sin(time * 0.3)));
          baseColor = mix(baseColor, cyan, waves * 0.15 * sin(time * 0.7 + gx));
          
          // Add saffron/amber highlights for "confluence" sparkle
          float sparkle = sin(time * 1.2 + gx * 2.0 + gy * 2.0) * 0.5 + 0.5;
          baseColor = mix(baseColor, saffron, waves * 0.08 * sparkle);
          baseColor = mix(baseColor, amber, waves * 0.05 * sparkle * sparkle);

          // Add subtle ripple effect
          float ripple = sin(gx * 10.0 + time * 0.8) * sin(gy * 10.0 + time * 0.6);
          baseColor += vec3(0.02, 0.05, 0.04) * waves * ripple * 0.3;

          gl_FragColor = vec4(baseColor, waves * 0.7);
        }
      `;

    // Compile shaders
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);

      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(
      fragmentShaderSource,
      gl.FRAGMENT_SHADER,
    );

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Create buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, "resolution");
    const timeLocation = gl.getUniformLocation(program, "time");

    let time = 0;

    // Format uptime
    const formatUptime = () => {
      const elapsed = Math.floor((performance.now() - shaderStartTimeRef.current) / 1000);
      const m = Math.floor(elapsed / 60);
      const s = elapsed % 60;
      return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    // Stats update helper
    const updateStats = (w: number, h: number, lw: number, lh: number, isDegraded = false) => {
      setStats((s) => ({
        ...s,
        canvasWidth: w,
        canvasHeight: h,
        logicalWidth: lw,
        logicalHeight: lh,
        concurrency,
        memory,
        renderer,
        vendor,
        platform,
        touchPoints,
        colorDepth,
        hdrSupported,
        colorGamut,
        renderingGamut,
        nativeDpr,
        dprMultiplier,
        actualDpr: currentPixelRatio,
        webglVersion,
        maxTextureSize,
        maxViewportDims: `${maxViewportDims[0]}x${maxViewportDims[1]}`,
        shaderPrecision,
        extensionsCount,
        connectionType,
        downlinkMbps,
        rttMs,
        degraded: s.degraded || isDegraded,
        degradationEvents: degradationEventsRef.current,
        totalFrames: totalFramesRef.current,
        uptime: formatUptime(),
        reducedMotion: prefersReducedMotion,
        targetFps: fpsRef.current === 0 ? "Uncapped (Native)" : fpsRef.current.toString()
      }));
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * currentPixelRatio;
      canvas.height = height * currentPixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      updateStats(canvas.width, canvas.height, width, height);
    };

    resize();
    lastFpsCalculateTimeRef.current = performance.now();

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate);

      if (!isVisible || prefersReducedMotion) return;

      const elapsed = currentTime - lastFrameTimeRef.current;

      // If we have a target FPS (e.g. from downscaling), throttle it
      if (fpsRef.current > 0) {
        const currentFrameInterval = 1000 / fpsRef.current;
        if (elapsed < currentFrameInterval) return;
        lastFrameTimeRef.current = currentTime - (elapsed % currentFrameInterval);
      } else {
        lastFrameTimeRef.current = currentTime;
      }

      // Track actual FPS
      framesRenderedRef.current++;
      totalFramesRef.current++;
      if (currentTime - lastFpsCalculateTimeRef.current >= 1000) {
        const actualFps = framesRenderedRef.current;
        if (actualFps > peakFpsRef.current) peakFpsRef.current = actualFps;
        if (actualFps < minFpsRef.current && actualFps > 0) minFpsRef.current = actualFps;
        setStats((s) => ({
          ...s,
          fps: actualFps,
          peakFps: peakFpsRef.current,
          minFps: minFpsRef.current === Infinity ? 0 : minFpsRef.current,
          frameTimeMs: Number((1000 / Math.max(actualFps, 1)).toFixed(2)),
          totalFrames: totalFramesRef.current,
          uptime: formatUptime(),
          degradationEvents: degradationEventsRef.current,
        }));
        framesRenderedRef.current = 0;
        lastFpsCalculateTimeRef.current = currentTime;

        // Frame degradation logic
        if (fpsRef.current === 0 && actualFps < 45 && actualFps > 0) {
          frameDropsRef.current++;
          if (frameDropsRef.current > 3 && currentPixelRatio > 0.5) {
            currentPixelRatio = Math.max(0.5, currentPixelRatio - 0.5);
            degradationEventsRef.current++;
            resize();
            updateStats(canvas.width, canvas.height, window.innerWidth, window.innerHeight, true);
            frameDropsRef.current = 0;
            console.warn("WebGL Shader: Performance degraded, dropping pixel multiplier to", currentPixelRatio);
          }
        } else if (actualFps >= 50) {
          frameDropsRef.current = Math.max(0, frameDropsRef.current - 1);
        }
      }

      // Slower time progression
      time += 0.01;
      gl.uniform1f(timeLocation, time);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);

      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [isVisible, prefersReducedMotion, forceStaticFallback]);

  // If reduced motion is preferred or hardware is too weak, show a static gradient instead
  if (prefersReducedMotion || forceStaticFallback) {
    return (
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, #0A1628 0%, #0d9488 50%, #f59e0b 100%)",
          opacity: 0.6,
        }}
      />
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 z-0 pointer-events-none"
        style={{
          width: "100vw",
          height: "100vh",
          willChange: "auto",
        }}
      />

      {/* Stats for nerds toggle & panel */}
      {mounted && typeof document !== "undefined" && document.body && createPortal(
        <div className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 flex flex-col items-start gap-2 pointer-events-none">
          {showStats && (
            <div
              className="pointer-events-auto w-full sm:w-80 max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 dark:border-white/[0.06] shadow-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(15, 5, 28, 0.92) 0%, rgba(10, 22, 40, 0.85) 100%)",
                boxShadow: "0 25px 70px rgba(1, 0, 8, 0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {/* Sticky header */}
              <div
                className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-white/[0.06] rounded-t-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(15, 5, 28, 0.97) 0%, rgba(10, 22, 40, 0.92) 100%)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <span className="text-xs font-semibold tracking-widest uppercase text-[#0d9488]">
                  Stats for Nerds
                </span>
                <button
                  onClick={() => setShowStats(false)}
                  className="p-1 -mr-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-4 py-3 space-y-4 text-[11px] sm:text-xs">

                {/* Performance */}
                <section>
                  <h4 className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0d9488] mb-1.5">Performance</h4>
                  <div className="space-y-0.5 text-white/70">
                    <div className="flex justify-between gap-4"><span>Current FPS</span><span className="text-white font-medium tabular-nums">{stats.fps} <span className="text-white/30">({stats.frameTimeMs}ms)</span></span></div>
                    <div className="flex justify-between gap-4"><span>Peak / Min FPS</span><span className="text-white font-medium tabular-nums">{stats.peakFps} / {stats.minFps}</span></div>
                    <div className="flex justify-between gap-4"><span>Target FPS</span><span className="text-white font-medium">{stats.targetFps}</span></div>
                    <div className="flex justify-between gap-4"><span>Total Frames</span><span className="text-white font-medium tabular-nums">{stats.totalFrames.toLocaleString()}</span></div>
                    <div className="flex justify-between gap-4"><span>Uptime</span><span className="text-white font-medium tabular-nums">{stats.uptime}</span></div>
                  </div>
                </section>

                {/* Health */}
                <section>
                  <h4 className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0d9488] mb-1.5">Health</h4>
                  <div className="space-y-0.5 text-white/70">
                    <div className="flex justify-between gap-4"><span>Degraded Mode</span><span className={stats.degraded ? "text-red-400 font-bold" : "text-emerald-400 font-medium"}>{stats.degraded ? "CRITICAL" : "OK"}</span></div>
                    <div className="flex justify-between gap-4"><span>Degradation Events</span><span className={`font-medium ${stats.degradationEvents > 0 ? "text-amber-400" : "text-white"}`}>{stats.degradationEvents}</span></div>
                    <div className="flex justify-between gap-4"><span>Reduced Motion</span><span className="text-white font-medium">{stats.reducedMotion ? "ON" : "OFF"}</span></div>
                  </div>
                </section>

                {/* Rendering */}
                <section>
                  <h4 className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0d9488] mb-1.5">Rendering</h4>
                  <div className="space-y-0.5 text-white/70">
                    <div className="flex justify-between gap-4"><span>Native DPR</span><span className="text-white font-medium tabular-nums">{stats.nativeDpr.toFixed(2)}x</span></div>
                    <div className="flex justify-between gap-4"><span>DPR Multiplier</span><span className="text-white font-medium tabular-nums">{stats.dprMultiplier}x</span></div>
                    <div className="flex justify-between gap-4"><span>Actual DPR</span><span className="text-white font-medium tabular-nums">{stats.actualDpr.toFixed(2)}x</span></div>
                    <div className="flex justify-between gap-4"><span>Logical Res</span><span className="text-white font-medium tabular-nums">{stats.logicalWidth}&times;{stats.logicalHeight}</span></div>
                    <div className="flex justify-between gap-4"><span>Render Res</span><span className="text-white font-medium tabular-nums">{Math.round(stats.canvasWidth)}&times;{Math.round(stats.canvasHeight)}</span></div>
                    <div className="flex justify-between gap-4 text-[10px] text-white/40"><span>Pixels/Frame</span><span className="tabular-nums">~{(stats.canvasWidth * stats.canvasHeight).toLocaleString()}</span></div>
                    <div className="flex justify-between gap-4"><span>Color Depth</span><span className="text-white font-medium">{stats.colorDepth}-bit</span></div>
                    <div className="flex justify-between gap-4"><span>Color Gamut</span><span className={`font-medium ${stats.colorGamut !== "sRGB" ? "text-emerald-400" : "text-white"}`}>{stats.colorGamut}</span></div>
                    <div className="flex justify-between gap-4"><span>HDR Display</span><span className={`font-medium ${stats.hdrSupported ? "text-emerald-400" : "text-white/50"}`}>{stats.hdrSupported ? "Supported" : "Standard (SDR)"}</span></div>
                    <div className="flex justify-between gap-4"><span>Rendering In</span><span className={`font-medium ${stats.renderingGamut !== "sRGB" ? "text-emerald-400" : "text-white"}`}>{stats.renderingGamut}</span></div>
                  </div>
                </section>

                {/* Hardware */}
                <section>
                  <h4 className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0d9488] mb-1.5">Hardware</h4>
                  <div className="space-y-0.5 text-white/70">
                    <div className="flex justify-between gap-4"><span>CPU Threads</span><span className="text-white font-medium tabular-nums">{stats.concurrency}</span></div>
                    <div className="flex justify-between gap-4"><span>Device RAM</span><span className="text-white font-medium">~{stats.memory} GB</span></div>
                    <div className="flex justify-between gap-4"><span>Platform</span><span className="text-white font-medium">{stats.platform}</span></div>
                    <div className="flex justify-between gap-4"><span>Touch Points</span><span className="text-white font-medium tabular-nums">{stats.touchPoints}</span></div>
                    <div className="mt-1.5 space-y-1">
                      <div>
                        <span className="text-white/40 text-[10px]">GPU Vendor</span>
                        <p className="text-white/80 leading-snug break-words text-[10px] sm:text-[11px]">{stats.vendor}</p>
                      </div>
                      <div>
                        <span className="text-white/40 text-[10px]">GPU Renderer</span>
                        <p className="text-white/80 leading-snug break-words text-[10px] sm:text-[11px]">{stats.renderer}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* WebGL Context */}
                <section>
                  <h4 className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0d9488] mb-1.5">WebGL Context</h4>
                  <div className="space-y-0.5 text-white/70">
                    <div className="flex justify-between gap-4"><span>Version</span><span className="text-white font-medium">{stats.webglVersion}</span></div>
                    <div className="flex justify-between gap-4"><span>Max Texture</span><span className="text-white font-medium tabular-nums">{stats.maxTextureSize.toLocaleString()}px</span></div>
                    <div className="flex justify-between gap-4"><span>Max Viewport</span><span className="text-white font-medium tabular-nums">{stats.maxViewportDims}</span></div>
                    <div className="flex justify-between gap-4"><span>Shader Precision</span><span className="text-white font-medium">{stats.shaderPrecision}</span></div>
                    <div className="flex justify-between gap-4"><span>Extensions</span><span className="text-white font-medium tabular-nums">{stats.extensionsCount}</span></div>
                  </div>
                </section>

                {/* Network */}
                <section>
                  <h4 className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0d9488] mb-1.5">Network</h4>
                  <div className="space-y-0.5 text-white/70">
                    <div className="flex justify-between gap-4"><span>Effective Type</span><span className="text-white font-medium">{stats.connectionType}</span></div>
                    <div className="flex justify-between gap-4"><span>Downlink</span><span className="text-white font-medium tabular-nums">{stats.downlinkMbps}</span></div>
                    <div className="flex justify-between gap-4"><span>RTT Latency</span><span className="text-white font-medium tabular-nums">{stats.rttMs}</span></div>
                  </div>
                </section>

                {/* Build & Source */}
                <section>
                  <h4 className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0d9488] mb-1.5">{"Build & Source"}</h4>
                  <div className="space-y-0.5 text-white/70">
                    <div className="flex justify-between gap-4"><span>Branch</span><span className="text-white font-medium">{process.env.NEXT_PUBLIC_GIT_BRANCH || "unknown"}</span></div>
                    <div className="flex justify-between gap-4 items-center">
                      <span>Commit</span>
                      <a
                        href={`${process.env.NEXT_PUBLIC_REPO_URL || "#"}/commit/${process.env.NEXT_PUBLIC_GIT_COMMIT_HASH || ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f59e0b] hover:text-white underline underline-offset-2 decoration-[#f59e0b]/40 hover:decoration-white/60 transition-colors font-medium"
                      >
                        {process.env.NEXT_PUBLIC_GIT_COMMIT_SHORT || "unknown"}
                      </a>
                    </div>
                    <div className="mt-1">
                      <span className="text-white/40 text-[10px]">Message</span>
                      <p className="text-white/80 leading-snug break-words text-[10px] sm:text-[11px]">{process.env.NEXT_PUBLIC_GIT_COMMIT_MESSAGE || "N/A"}</p>
                    </div>
                    <div className="flex justify-between gap-4 mt-0.5"><span>Commit Date</span><span className="text-white/80 text-[10px] tabular-nums">{process.env.NEXT_PUBLIC_GIT_COMMIT_DATE || "N/A"}</span></div>
                    <div className="flex justify-between gap-4"><span>Build Time</span><span className="text-white/80 text-[10px] tabular-nums">{process.env.NEXT_PUBLIC_BUILD_TIME || "N/A"}</span></div>
                    <div className="flex justify-between gap-4 items-center mt-1">
                      <span>Source Code</span>
                      <a
                        href={process.env.NEXT_PUBLIC_REPO_URL || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f59e0b] hover:text-white underline underline-offset-2 decoration-[#f59e0b]/40 hover:decoration-white/60 transition-colors font-medium"
                      >
                        {"GitHub ↗"}
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowStats(!showStats)}
            className="pointer-events-auto p-2 sm:p-2.5 rounded-full border border-white/[0.08] hover:border-[#0d9488]/30 transition-all text-white/20 hover:text-[#f59e0b] z-50"
            style={{
              background: "linear-gradient(135deg, rgba(15, 5, 28, 0.5) 0%, rgba(10, 22, 40, 0.3) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            title="Stats for nerds"
            aria-label="Toggle performance stats"
          >
            <Terminal className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>,
        document.body
      )}
    </>
  );
}