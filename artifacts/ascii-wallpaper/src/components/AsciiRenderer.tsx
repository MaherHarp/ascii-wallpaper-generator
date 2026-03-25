import React, { useEffect, useRef, useState } from "react";
import { useWallpaperStore } from "@/hooks/use-wallpaper-store";
import { ASCII_CHARSETS, COLOR_MODES, convertImageToAsciiGrid } from "@/lib/ascii-core";
import { debounce } from "@/lib/utils";

export const AsciiRenderer = () => {
  const config = useWallpaperStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  
  // Mouse position for parallax
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const currentParallax = useRef({ x: 0, y: 0 });

  // Resolve colors based on mode
  const currentColors = config.colorMode === "Custom" 
    ? { bg: config.customBg, fg: config.customFg }
    : COLOR_MODES[config.colorMode] || COLOR_MODES.Terminal;

  // 1. Core Conversion (Image -> Grid)
  useEffect(() => {
    if (!config.imageElement) return;

    // Debounce conversion to avoid locking UI while sliding resolution
    const processImage = debounce(() => {
      const charSet = config.charSetType === "Custom" 
        ? config.customCharSet 
        : ASCII_CHARSETS[config.charSetType] || ASCII_CHARSETS.Standard;
      
      const newGrid = convertImageToAsciiGrid(
        config.imageElement!, 
        config.resolution, 
        charSet, 
        config.invert
      );
      
      setGrid(newGrid);
      config.setAsciiGrid(newGrid);
    }, 150);

    processImage();
  }, [
    config.imageElement, 
    config.resolution, 
    config.charSetType, 
    config.customCharSet, 
    config.invert
  ]);

  // Track mouse for parallax globally
  useEffect(() => {
    if (!config.liveMode || config.animationMode !== "Parallax") return;
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [config.liveMode, config.animationMode]);

  // 2. Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || grid.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = performance.now();

    const render = (time: number) => {
      // Resize canvas to match container exactly to stay sharp
      const rect = container.getBoundingClientRect();
      // Use devicePixelRatio for crisp text on retina displays
      const dpr = window.devicePixelRatio || 1;
      
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear bg
      ctx.fillStyle = currentColors.bg;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = currentColors.fg;
      ctx.font = `${config.fontSize}px 'Fira Code', monospace`;
      ctx.textBaseline = "top";

      // Calculate layout metrics
      const cols = grid[0].length;
      const rows = grid.length;
      
      // We want to center the ascii art in the canvas if it doesn't fill it
      // Monospace fonts usually have width ~ 0.6 * height
      ctx.font = `${config.fontSize}px monospace`;
      const charMetrics = ctx.measureText("M");
      const charWidth = charMetrics.width;
      const charHeight = config.fontSize; // rough approx for linespacing

      const totalWidth = cols * charWidth;
      const totalHeight = rows * charHeight;

      const startX = (rect.width - totalWidth) / 2;
      const startY = (rect.height - totalHeight) / 2;

      const elapsedSec = (time - startTime) / 1000;

      // Draw Grid
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const char = grid[y][x];
          if (char === " ") continue;

          let drawX = startX + x * charWidth;
          let drawY = startY + y * charHeight;

          // Apply Live Effects
          if (config.liveMode) {
            // Define a normalized center bounds (0 to 1)
            const nx = x / cols;
            const ny = y / rows;
            
            // "Subject" is roughly center 50%
            const isCenter = nx > 0.25 && nx < 0.75 && ny > 0.25 && ny < 0.75;
            // Create a soft falloff for the effect based on distance to center
            const distFromCenter = Math.sqrt(Math.pow(nx - 0.5, 2) + Math.pow(ny - 0.5, 2));
            const effectWeight = Math.max(0, 1 - distFromCenter * 2.5); // 0 at edges, 1 at center

            if (effectWeight > 0) {
              if (config.animationMode === "Float") {
                const speed = config.animationSpeed;
                drawX += Math.sin(elapsedSec * speed + ny * 2) * 20 * effectWeight;
                drawY += Math.cos(elapsedSec * speed + nx * 2) * 20 * effectWeight;
              } 
              else if (config.animationMode === "Parallax") {
                // Lerp towards target for smoothness
                currentParallax.current.x += ((mousePos.current.x - 0.5) * 100 - currentParallax.current.x) * 0.1;
                currentParallax.current.y += ((mousePos.current.y - 0.5) * 100 - currentParallax.current.y) * 0.1;
                
                drawX += currentParallax.current.x * effectWeight * config.animationSpeed;
                drawY += currentParallax.current.y * effectWeight * config.animationSpeed;
              }
              else if (config.animationMode === "Rotate") {
                const speed = config.animationSpeed * 0.5;
                const angle = elapsedSec * speed * effectWeight;
                // Complex to rotate individual chars around center without transforming context
                // Let's do a simple swirl effect
                const cx = startX + (cols/2) * charWidth;
                const cy = startY + (rows/2) * charHeight;
                const dx = drawX - cx;
                const dy = drawY - cy;
                drawX = cx + dx * Math.cos(angle) - dy * Math.sin(angle);
                drawY = cy + dx * Math.sin(angle) + dy * Math.cos(angle);
              }
            } else if (config.animationMode === "Parallax") {
              // Background moves slightly in opposite direction
              drawX -= currentParallax.current.x * 0.2;
              drawY -= currentParallax.current.y * 0.2;
            }
          }

          ctx.fillText(char, drawX, drawY);
        }
      }

      ctx.restore();

      if (config.liveMode) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Initial render or start loop
    if (config.liveMode) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      render(performance.now());
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [grid, config, currentColors]);

  // 3. Handle Export Events
  useEffect(() => {
    const handleExport = (e: CustomEvent) => {
      if (grid.length === 0) return;
      const { type, preset } = e.detail;
      
      if (type === 'txt') {
        const text = grid.map(row => row.join('')).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wallpaper-${config.resolution}x.txt`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      if (type === 'png') {
        let exportW = 1920;
        let exportH = 1080;
        
        if (preset === '2560x1440') { exportW = 2560; exportH = 1440; }
        if (preset === '3840x2160') { exportW = 3840; exportH = 2160; }
        if (preset === 'viewport' && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          exportW = Math.floor(rect.width);
          exportH = Math.floor(rect.height);
        }

        const expCanvas = document.createElement("canvas");
        expCanvas.width = exportW;
        expCanvas.height = exportH;
        const ctx = expCanvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = currentColors.bg;
        ctx.fillRect(0, 0, exportW, exportH);

        const cols = grid[0].length;
        const rows = grid.length;
        
        // Fit text to canvas
        const charWidth = exportW / cols;
        // Adjust aspect ratio for monospace font
        const fontSize = charWidth / 0.6; 
        const charHeight = fontSize;
        
        const totalHeight = rows * charHeight;
        const startY = (exportH - totalHeight) / 2;

        ctx.fillStyle = currentColors.fg;
        ctx.font = `${fontSize}px monospace`;
        ctx.textBaseline = "top";

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
             if(grid[y][x] !== " ") {
               ctx.fillText(grid[y][x], x * charWidth, startY + y * charHeight);
             }
          }
        }

        const a = document.createElement("a");
        a.href = expCanvas.toDataURL("image/png", 1.0);
        a.download = `ascii-wallpaper-${preset}.png`;
        a.click();
      }
    };

    window.addEventListener('export-ascii', handleExport as EventListener);
    return () => window.removeEventListener('export-ascii', handleExport as EventListener);
  }, [grid, config.resolution, currentColors]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center cursor-crosshair"
      style={{ backgroundColor: currentColors.bg }}
    >
      <canvas 
        ref={canvasRef}
        className="block w-full h-full"
        style={{
          // Adding a tiny bit of blur/contrast trick to make it look like a glowing monitor
          filter: config.colorMode !== "Paper" ? "contrast(1.2) brightness(1.1)" : "none"
        }}
      />
    </div>
  );
};
