"use client";

import { useEffect, useRef, useState } from "react";

// Detect Safari/Firefox for performance adjustments
const isSafari =
  typeof navigator !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isFirefox =
  typeof navigator !== "undefined" &&
  navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
const isLowPerfBrowser = isSafari || isFirefox;

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Frame rate limiting - lower for Safari/Firefox
  const targetFPS = isLowPerfBrowser ? 30 : 60;
  const frameInterval = 1000 / targetFPS;

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
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: isLowPerfBrowser ? "low-power" : "default",
      preserveDrawingBuffer: false,
      depth: false,
      stencil: false,
    });

    if (!gl) {
      console.warn("WebGL not supported, falling back to static background");
      return;
    }

    // Reduced pixel ratio for performance
    const pixelRatio = isLowPerfBrowser
      ? Math.min(window.devicePixelRatio, 1)
      : Math.min(window.devicePixelRatio, 1.5);

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Simplified fragment shader for better performance
    const fragmentShaderSource = isLowPerfBrowser
      ? `
        precision mediump float;
        uniform vec2 resolution;
        uniform float time;

        void main() {
          vec2 uv = gl_FragCoord.xy / resolution;

          // Simplified wave calculation
          float wave = sin(uv.x * 3.0 + time * 0.5) * 0.5 + 0.5;
          wave *= sin(uv.y * 2.0 - time * 0.3) * 0.5 + 0.5;

          // Brand colors
          vec3 purple = vec3(0.243, 0.118, 0.408);
          vec3 pink = vec3(0.894, 0.353, 0.573);

          vec3 color = mix(purple, pink, wave * 0.6);
          float alpha = 0.4 + wave * 0.3;

          gl_FragColor = vec4(color * alpha, alpha);
        }
      `
      : `
        precision mediump float;
        uniform vec2 resolution;
        uniform float time;

        void main() {
          vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

          float d = length(p) * 0.05;
          float gx = p.x;

          vec3 deepPurple = vec3(0.243, 0.118, 0.408);
          vec3 vibrantPink = vec3(0.894, 0.353, 0.573);
          vec3 softCoral = vec3(1.0, 0.675, 0.675);

          float wave = 0.05 / abs(p.y + sin((gx + time) * 1.0) * 0.5);
          wave = clamp(wave, 0.0, 1.0);

          vec3 color1 = mix(deepPurple, vibrantPink, wave * 0.5);
          vec3 color2 = mix(vibrantPink, softCoral, wave * 0.3);
          vec3 finalColor = mix(color1, color2, sin(time * 0.5) * 0.5 + 0.5);

          gl_FragColor = vec4(finalColor * wave, 1.0);
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

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };

    resize();

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate);

      // Skip if not visible or reduced motion is preferred
      if (!isVisible || prefersReducedMotion) return;

      // Frame rate limiting
      const elapsed = currentTime - lastFrameTimeRef.current;
      if (elapsed < frameInterval) return;

      lastFrameTimeRef.current = currentTime - (elapsed % frameInterval);

      // Slower time progression for Safari/Firefox
      time += isLowPerfBrowser ? 0.005 : 0.01;
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
  }, [isVisible, prefersReducedMotion, frameInterval]);

  // If reduced motion is preferred, show a static gradient instead
  if (prefersReducedMotion) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #3E1E68 0%, #E45A92 50%, #FFACAC 100%)",
          opacity: 0.6,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        willChange: "auto",
        contain: "strict",
      }}
    />
  );
}
