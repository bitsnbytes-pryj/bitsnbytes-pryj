"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, X } from "lucide-react";

export function WebGLShader() {
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
    // -- WebGL --
    webglVersion: "WebGL 1.0",
    maxTextureSize: 0,
    maxViewportDims: "0x0",
    shaderPrecision: "Unknown",
    extensionsCount: 0,
    // -- Network --
    connectionType: "Unknown",
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
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "default",
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      depth: false,
      stencil: false,
    });

    if (!gl) {
      console.warn("WebGL not supported, falling back to static background");
      return;
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

    // Connection info
    let connectionType = "Unknown";
    if (typeof navigator !== "undefined") {
      // @ts-expect-error connection is non-standard
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        connectionType = conn.effectiveType || conn.type || "Unknown";
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

          vec3 deepPurple = vec3(0.24, 0.12, 0.41);
          vec3 vibrantPink = vec3(0.89, 0.35, 0.57);
          vec3 softCoral = vec3(1.0, 0.68, 0.68);

          // The "line" effect comes from this 1.0/abs() logic
          float wave = 0.015 / abs(p.y + sin(gx + time * 0.8) * 0.4);
          wave = clamp(wave, 0.0, 1.0);

          vec3 color = mix(deepPurple, vibrantPink, wave * 0.5);
          color = mix(color, softCoral, wave * 0.2 * sin(time * 0.5));

          gl_FragColor = vec4(color, wave * 0.8);
        }
      `;

    // Compile shaders
    const compileShader = (
      source: string,
      type: number,
    ): WebGLShader | null => {
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
      setStats(s => ({
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
        nativeDpr,
        dprMultiplier,
        actualDpr: currentPixelRatio,
        webglVersion: "WebGL 1.0",
        maxTextureSize,
        maxViewportDims: `${maxViewportDims[0]}x${maxViewportDims[1]}`,
        shaderPrecision,
        extensionsCount,
        connectionType,
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
        setStats(s => ({
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
            "linear-gradient(135deg, #3E1E68 0%, #E45A92 50%, #FFACAC 100%)",
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
      <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2 max-w-[calc(100vw-2rem)] pointer-events-none">
        {showStats && (
          <div className="bg-black/80 backdrop-blur-md rounded-xl p-3 sm:p-4 text-[10px] sm:text-xs font-mono text-green-400 border border-green-500/30 w-[85vw] sm:w-80 shadow-2xl animate-fade-in shadow-black/50 pointer-events-auto max-h-[75vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-green-500/20 sticky top-0 bg-black/80 backdrop-blur-md -mx-3 sm:-mx-4 px-3 sm:px-4 -mt-3 sm:-mt-4 pt-3 sm:pt-4 z-10">
              <span className="font-bold text-green-300 tracking-wider">STATS FOR NERDS</span>
              <button onClick={() => setShowStats(false)} className="text-green-500 hover:text-green-300 transition-colors p-1 -mr-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Performance Section */}
            <div className="space-y-1 mb-2">
              <div className="text-green-300/60 uppercase tracking-widest text-[8px] sm:text-[9px] mb-1">Performance</div>
              <div className="flex justify-between"><span>Current FPS:</span><span className="text-white">{stats.fps} <span className="text-green-500/50">({stats.frameTimeMs}ms)</span></span></div>
              <div className="flex justify-between"><span>Peak FPS:</span><span className="text-white">{stats.peakFps}</span></div>
              <div className="flex justify-between"><span>Min FPS:</span><span className="text-white">{stats.minFps}</span></div>
              <div className="flex justify-between"><span>Target FPS:</span><span className="text-white">{stats.targetFps}</span></div>
              <div className="flex justify-between"><span>Total Frames:</span><span className="text-white">{stats.totalFrames.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Uptime:</span><span className="text-white">{stats.uptime}</span></div>
            </div>

            {/* Degradation Section */}
            <div className="space-y-1 mb-2 pt-2 border-t border-green-500/20">
              <div className="text-green-300/60 uppercase tracking-widest text-[8px] sm:text-[9px] mb-1">Health</div>
              <div className="flex justify-between"><span>Degraded Mode:</span><span className={stats.degraded ? "text-red-400 font-bold" : "text-white"}>{stats.degraded ? "CRITICAL" : "OK"}</span></div>
              <div className="flex justify-between"><span>Degradation Events:</span><span className={stats.degradationEvents > 0 ? "text-yellow-400" : "text-white"}>{stats.degradationEvents}</span></div>
              <div className="flex justify-between"><span>Reduced Motion:</span><span className="text-white">{stats.reducedMotion ? "ON" : "OFF"}</span></div>
            </div>

            {/* Rendering Section */}
            <div className="space-y-1 mb-2 pt-2 border-t border-green-500/20">
              <div className="text-green-300/60 uppercase tracking-widest text-[8px] sm:text-[9px] mb-1">Rendering</div>
              <div className="flex justify-between"><span>Native DPR:</span><span className="text-white">{stats.nativeDpr.toFixed(2)}x</span></div>
              <div className="flex justify-between"><span>DPR Multiplier:</span><span className="text-white">{stats.dprMultiplier}x</span></div>
              <div className="flex justify-between"><span>Actual DPR:</span><span className="text-white">{stats.actualDpr.toFixed(2)}x</span></div>
              <div className="flex justify-between"><span>Logical Res:</span><span className="text-white">{stats.logicalWidth}x{stats.logicalHeight}</span></div>
              <div className="flex justify-between"><span>Render Res:</span><span className="text-white">{Math.round(stats.canvasWidth)}x{Math.round(stats.canvasHeight)}</span></div>
              <div className="flex justify-between text-[9px] text-green-500/60"><span className="mr-4 whitespace-nowrap">Pixels/Frame:</span><span className="text-right">~{(stats.canvasWidth * stats.canvasHeight).toLocaleString()} px</span></div>
              <div className="flex justify-between"><span>Color Depth:</span><span className="text-white">{stats.colorDepth}-bit</span></div>
            </div>

            {/* Hardware Section */}
            <div className="space-y-1 mb-2 pt-2 border-t border-green-500/20">
              <div className="text-green-300/60 uppercase tracking-widest text-[8px] sm:text-[9px] mb-1">Hardware</div>
              <div className="flex justify-between"><span>CPU Threads:</span><span className="text-white">{stats.concurrency}</span></div>
              <div className="flex justify-between"><span>Device RAM:</span><span className="text-white">~{stats.memory} GB</span></div>
              <div className="flex justify-between"><span>Platform:</span><span className="text-white">{stats.platform}</span></div>
              <div className="flex justify-between"><span>Touch Points:</span><span className="text-white">{stats.touchPoints}</span></div>
              <div className="flex flex-col mt-1">
                <span className="mb-0.5">GPU Vendor:</span>
                <span className="text-white opacity-80 leading-tight break-words text-[9px] sm:text-[10px]">{stats.vendor}</span>
              </div>
              <div className="flex flex-col mt-1">
                <span className="mb-0.5">GPU Renderer:</span>
                <span className="text-white opacity-80 leading-tight break-words text-[9px] sm:text-[10px]" title={stats.renderer}>{stats.renderer}</span>
              </div>
            </div>

            {/* WebGL Section */}
            <div className="space-y-1 mb-2 pt-2 border-t border-green-500/20">
              <div className="text-green-300/60 uppercase tracking-widest text-[8px] sm:text-[9px] mb-1">WebGL Context</div>
              <div className="flex justify-between"><span>Version:</span><span className="text-white">{stats.webglVersion}</span></div>
              <div className="flex justify-between"><span>Max Tex Size:</span><span className="text-white">{stats.maxTextureSize.toLocaleString()}px</span></div>
              <div className="flex justify-between"><span>Max Viewport:</span><span className="text-white">{stats.maxViewportDims}</span></div>
              <div className="flex justify-between"><span>Shader Precision:</span><span className="text-white">{stats.shaderPrecision}</span></div>
              <div className="flex justify-between"><span>Extensions:</span><span className="text-white">{stats.extensionsCount}</span></div>
            </div>

            {/* Network Section */}
            <div className="space-y-1 mb-2 pt-2 border-t border-green-500/20">
              <div className="text-green-300/60 uppercase tracking-widest text-[8px] sm:text-[9px] mb-1">Network</div>
              <div className="flex justify-between"><span>Connection:</span><span className="text-white">{stats.connectionType}</span></div>
            </div>

            {/* Build & Source Section */}
            <div className="space-y-1 pt-2 border-t border-green-500/20">
              <div className="text-green-300/60 uppercase tracking-widest text-[8px] sm:text-[9px] mb-1">Build & Source</div>
              <div className="flex justify-between"><span>Branch:</span><span className="text-white">{process.env.NEXT_PUBLIC_GIT_BRANCH || "unknown"}</span></div>
              <div className="flex justify-between items-center">
                <span>Commit:</span>
                <a
                  href={`${process.env.NEXT_PUBLIC_REPO_URL || "#"}/commit/${process.env.NEXT_PUBLIC_GIT_COMMIT_HASH || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                >
                  {process.env.NEXT_PUBLIC_GIT_COMMIT_SHORT || "unknown"}
                </a>
              </div>
              <div className="flex flex-col mt-1">
                <span className="mb-0.5">Message:</span>
                <span className="text-white opacity-80 leading-tight break-words text-[9px] sm:text-[10px]">{process.env.NEXT_PUBLIC_GIT_COMMIT_MESSAGE || "N/A"}</span>
              </div>
              <div className="flex justify-between"><span>Commit Date:</span><span className="text-white text-[9px]">{process.env.NEXT_PUBLIC_GIT_COMMIT_DATE || "N/A"}</span></div>
              <div className="flex justify-between"><span>Build Time:</span><span className="text-white text-[9px]">{process.env.NEXT_PUBLIC_BUILD_TIME || "N/A"}</span></div>
              <div className="flex justify-between items-center mt-1">
                <span>Source Code:</span>
                <a
                  href={process.env.NEXT_PUBLIC_REPO_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowStats(!showStats)}
          className="group p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 hover:border-green-500/30 transition-all text-white/30 hover:text-green-400 z-50 pointer-events-auto"
          title="Toggle performance stats"
        >
          <Terminal className="w-5 h-5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </>
  );
}
