"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Letter, LetterCategory } from "../lib/types";

interface ConstellationCanvasProps {
  letters: Letter[];
  selectedCategory: LetterCategory | "all";
  searchLocation?: string;
  userStarIds?: string[];
  focusedStarId: string | null;
  onSelectLetter: (letter: Letter) => void;
  newAscendingStar: Letter | null;
  onAscensionComplete: () => void;
  breathScale?: number;
  vigilProgress?: number;
}

interface BackgroundStar {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export default function ConstellationCanvas({
  letters,
  selectedCategory,
  searchLocation = "",
  userStarIds = [],
  focusedStarId,
  onSelectLetter,
  newAscendingStar,
  onAscensionComplete,
  breathScale = 1.0,
  vigilProgress = 0
}: ConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredLetter, setHoveredLetter] = useState<Letter | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Pan & Zoom state
  const cameraRef = useRef({ x: 0, y: 0, zoom: 1 });
  const targetCamRef = useRef<{ x: number; y: number; zoom: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const bgStarsRef = useRef<BackgroundStar[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const ascensionProgressRef = useRef<number>(0);

  // Initialize 3D depth background stars
  useEffect(() => {
    const bg: BackgroundStar[] = [];
    for (let i = 0; i < 750; i++) {
      bg.push({
        x: (Math.random() - 0.5) * 4500,
        y: (Math.random() - 0.5) * 4500,
        z: Math.random() * 3 + 0.4,
        size: Math.random() * 1.8 + 0.3,
        alpha: Math.random() * 0.75 + 0.2,
        speed: Math.random() * 0.015 + 0.003,
        phase: Math.random() * Math.PI * 2
      });
    }
    bgStarsRef.current = bg;
  }, []);

  // Spawn periodic spontaneous shooting stars (celestial release events)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3 && typeof window !== "undefined") {
        shootingStarsRef.current.push({
          x: Math.random() * window.innerWidth * 1.2 - 200,
          y: Math.random() * (window.innerHeight * 0.4),
          length: Math.random() * 120 + 80,
          speed: Math.random() * 6 + 4,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          opacity: 0.9,
          active: true
        });
      }
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  // Handle flying to focused star (Wander or My Stars)
  useEffect(() => {
    if (focusedStarId) {
      const target = letters.find((l) => l.id === focusedStarId);
      if (target) {
        targetCamRef.current = {
          x: -target.x,
          y: -target.y,
          zoom: 1.75
        };
      }
    }
  }, [focusedStarId, letters]);

  // When searchLocation changes, center on match
  useEffect(() => {
    if (searchLocation.trim()) {
      const query = searchLocation.toLowerCase().trim();
      const match = letters.find(
        (l) =>
          l.locationName.toLowerCase().includes(query) ||
          l.recipient.toLowerCase().includes(query)
      );
      if (match) {
        targetCamRef.current = {
          x: -match.x,
          y: -match.y,
          zoom: 1.45
        };
      }
    }
  }, [searchLocation, letters]);

  // Filter letters based on Category
  const filteredLetters = letters.filter(
    (l) =>
      selectedCategory === "all" ||
      l.category === selectedCategory ||
      (userStarIds || []).includes(l.id)
  );

  // Screen to World coords
  const screenToWorld = useCallback((sx: number, sy: number) => {
    const cam = cameraRef.current;
    const currentZoom = cam.zoom * breathScale;
    return {
      x: (sx - window.innerWidth / 2) / currentZoom - cam.x,
      y: (sy - window.innerHeight / 2) / currentZoom - cam.y
    };
  }, [breathScale]);

  // World to Screen coords
  const worldToScreen = useCallback((wx: number, wy: number) => {
    const cam = cameraRef.current;
    const currentZoom = cam.zoom * breathScale;
    return {
      x: (wx + cam.x) * currentZoom + window.innerWidth / 2,
      y: (wy + cam.y) * currentZoom + window.innerHeight / 2
    };
  }, [breathScale]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    targetCamRef.current = null;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    if (isDraggingRef.current) {
      const dx = (e.clientX - dragStartRef.current.x) / cameraRef.current.zoom;
      const dy = (e.clientY - dragStartRef.current.y) / cameraRef.current.zoom;
      cameraRef.current.x += dx;
      cameraRef.current.y += dy;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Hit test on interactive stars
    const world = screenToWorld(e.clientX, e.clientY);
    let found: Letter | null = null;
    for (const letter of filteredLetters) {
      const dist = Math.hypot(world.x - letter.x, world.y - letter.y);
      if (dist < letter.size * 5 + 18 / cameraRef.current.zoom) {
        found = letter;
        break;
      }
    }
    setHoveredLetter(found);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    const world = screenToWorld(e.clientX, e.clientY);
    for (const letter of filteredLetters) {
      const dist = Math.hypot(world.x - letter.x, world.y - letter.y);
      if (dist < letter.size * 5 + 18 / cameraRef.current.zoom) {
        onSelectLetter(letter);
        return;
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    targetCamRef.current = null;
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.min(Math.max(cameraRef.current.zoom * zoomFactor, 0.4), 3.0);
    cameraRef.current.zoom = newZoom;
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let time = 0;
    const searchQuery = searchLocation.toLowerCase().trim();

    const render = () => {
      time += 0.015;

      // Smooth camera interpolation
      if (targetCamRef.current) {
        const cam = cameraRef.current;
        const target = targetCamRef.current;
        cam.x += (target.x - cam.x) * 0.06;
        cam.y += (target.y - cam.y) * 0.06;
        cam.zoom += (target.zoom - cam.zoom) * 0.06;

        if (
          Math.hypot(target.x - cam.x, target.y - cam.y) < 1 &&
          Math.abs(target.zoom - cam.zoom) < 0.01
        ) {
          targetCamRef.current = null;
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Deep Living Cosmic Gradient with Ethereal Stardust Pulses
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      grad.addColorStop(0, "#090a18");
      grad.addColorStop(0.5, "#030409");
      grad.addColorStop(1, "#010103");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Cosmic Nebula Dust Clouds
      const nebulaPulse = Math.sin(time * 0.4) * 0.03 + 0.05;
      const nebGrad = ctx.createRadialGradient(
        width * 0.35,
        height * 0.4,
        50,
        width * 0.35,
        height * 0.4,
        450
      );
      nebGrad.addColorStop(0, `rgba(56, 189, 248, ${nebulaPulse})`);
      nebGrad.addColorStop(0.6, `rgba(192, 132, 252, ${nebulaPulse * 0.5})`);
      nebGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebGrad;
      ctx.fillRect(0, 0, width, height);

      // Global Silent Vigil Wave Effect
      if (vigilProgress > 0) {
        ctx.save();
        const maxVigilR = Math.hypot(width, height) * 0.75;
        const currentR = maxVigilR * Math.min(vigilProgress * 1.4, 1);

        const vigilGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, currentR);
        vigilGrad.addColorStop(0, `rgba(251, 191, 36, ${vigilProgress * 0.15})`);
        vigilGrad.addColorStop(0.7, `rgba(251, 191, 36, ${vigilProgress * 0.22})`);
        vigilGrad.addColorStop(1, "rgba(251, 191, 36, 0)");

        ctx.fillStyle = vigilGrad;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, currentR, 0, Math.PI * 2);
        ctx.fill();

        // Radiating pulse ring
        ctx.strokeStyle = `rgba(251, 191, 36, ${vigilProgress * 0.6})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, currentR * 0.95, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const cam = cameraRef.current;

      // 1. Draw 3D Depth-Drifting Background Stars
      for (const s of bgStarsRef.current) {
        // Slow organic cosmic drift
        s.y += s.speed * 0.04; s.x += Math.sin(time * 0.2 + s.phase) * 0.02;
        if (s.y > 2250) s.y = -2250;

        const parallaxFactor = 0.2 / s.z;
        const sx = (s.x + cam.x * parallaxFactor) * cam.zoom + width / 2;
        const sy = (s.y + cam.y * parallaxFactor) * cam.zoom + height / 2;

        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

        const twinkle = Math.sin(time * s.speed * 20 + s.phase) * 0.35 + 0.65;
        const starSize = Math.max(0.4, (s.size / s.z) * cam.zoom);

        ctx.fillStyle = `rgba(255, 255, 255, ${(s.alpha / s.z) * twinkle})`;
        ctx.beginPath();
        ctx.arc(sx, sy, starSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Spontaneous Falling / Shooting Stars (Meteors)
      const activeShooting = shootingStarsRef.current;
      for (let idx = activeShooting.length - 1; idx >= 0; idx--) {
        const meteor = activeShooting[idx];
        if (!meteor.active) continue;

        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.opacity -= 0.015;

        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

        const meteorGrad = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
        meteorGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        meteorGrad.addColorStop(1, `rgba(251, 191, 36, ${Math.max(0, meteor.opacity)})`);

        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(meteor.x, meteor.y);
        ctx.stroke();

        // Glowing white head
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, meteor.opacity)})`;
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (meteor.opacity <= 0 || meteor.x > width + 200 || meteor.y > height + 200) {
          activeShooting.splice(idx, 1);
        }
      }

      // 3. Draw Constellation Filaments between neighboring letters in same category
      ctx.lineWidth = 0.8;
      for (let i = 0; i < filteredLetters.length; i++) {
        for (let j = i + 1; j < filteredLetters.length; j++) {
          const l1 = filteredLetters[i];
          const l2 = filteredLetters[j];
          if (l1.category === l2.category) {
            const d = Math.hypot(l1.x - l2.x, l1.y - l2.y);
            if (d < 380) {
              const p1 = worldToScreen(l1.x, l1.y);
              const p2 = worldToScreen(l2.x, l2.y);
              const alpha = (1 - d / 380) * 0.18;
              ctx.strokeStyle = l1.glowColor.replace(/[\d.]+\)$/g, `${alpha})`);
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // 3.b Draw Golden Resonance Filaments between Twin Resonant Stars
      for (const letter of filteredLetters) {
        if (letter.resonantLetterId && letter.id < letter.resonantLetterId) {
          const sister = letters.find((l) => l.id === letter.resonantLetterId);
          if (sister) {
            const p1 = worldToScreen(letter.x, letter.y);
            const p2 = worldToScreen(sister.x, sister.y);

            // Shimmering Golden Thread
            ctx.save();
            ctx.lineWidth = 1.8 * cam.zoom;
            ctx.strokeStyle = "rgba(251, 191, 36, 0.45)";
            ctx.setLineDash([6, 6]);
            ctx.lineDashOffset = -time * 30;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.setLineDash([]);

            // Flowing Light Energy Bead along the bridge
            const tEnergy = (time * 0.35) % 1;
            const bx = p1.x + (p2.x - p1.x) * tEnergy;
            const by = p1.y + (p2.y - p1.y) * tEnergy;

            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#fbbf24";
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.arc(bx, by, 3.2 * cam.zoom, 0, Math.PI * 2);
            ctx.fill();

            // Reverse energy bead
            const tEnergyRev = 1 - tEnergy;
            const rx = p1.x + (p2.x - p1.x) * tEnergyRev;
            const ry = p1.y + (p2.y - p1.y) * tEnergyRev;
            ctx.beginPath();
            ctx.arc(rx, ry, 2.2 * cam.zoom, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // 4. Draw Interactive Star Nodes
      for (const letter of filteredLetters) {
        const pos = worldToScreen(letter.x, letter.y);
        if (pos.x < -50 || pos.x > width + 50 || pos.y < -50 || pos.y > height + 50) continue;

        const isUserStar = (userStarIds || []).includes(letter.id);
        const isHovered = hoveredLetter?.id === letter.id;
        const isFocused = focusedStarId === letter.id;

        // Search highlight check
        const matchesSearch =
          !searchQuery ||
          letter.locationName.toLowerCase().includes(searchQuery) ||
          letter.recipient.toLowerCase().includes(searchQuery);

        const starAlpha = matchesSearch ? 1.0 : 0.18;
        const pulse = Math.sin(time * letter.pulseSpeed + letter.pulsePhase) * 0.25 + 0.75;
        const baseRadius = (letter.size + (isHovered || isFocused ? 3 : 0)) * cam.zoom;

        // Special golden beacon for USER STAR or FOCUSED STAR (Teleport)
        if (isUserStar || isFocused) {
          const beaconPulse = Math.sin(time * 3.5) * 0.3 + 1;
          ctx.strokeStyle = isUserStar ? "rgba(251, 191, 36, 0.85)" : "rgba(129, 140, 248, 0.85)";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, baseRadius * 3.5 * beaconPulse, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = isUserStar ? "rgba(251, 191, 36, 0.3)" : "rgba(129, 140, 248, 0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, baseRadius * 5.5 * beaconPulse, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = isUserStar ? "#fbbf24" : "#a5b4fc";
          ctx.font = `600 ${Math.max(10, 11 * cam.zoom)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(
            isUserStar ? "★ YOUR STAR" : `✦ ${letter.locationName}`,
            pos.x,
            pos.y - baseRadius * 5.5
          );
        }

        // Outer Aura Halo
        const glowRadius = baseRadius * (isHovered ? 8 : 4.5) * pulse;
        const aura = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
        aura.addColorStop(0, letter.glowColor.replace(/[\d.]+\)$/g, `${starAlpha * 0.8})`));
        aura.addColorStop(0.4, letter.glowColor.replace(/[\d.]+\)$/g, `${starAlpha * 0.2})`));
        aura.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Star Core
        ctx.globalAlpha = starAlpha;
        ctx.fillStyle = isHovered || isUserStar || isFocused ? "#ffffff" : letter.color;
        ctx.shadowColor = isUserStar ? "#fbbf24" : letter.color;
        ctx.shadowBlur = isHovered || isUserStar || isFocused ? 24 : 10;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, baseRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        // Special Time-Capsule Nebula Rendering
        if (letter.isTimeCapsule) {
          ctx.save();
          const nebPulse = Math.sin(time * 1.5 + letter.pulsePhase) * 0.2 + 1.0;
          const nebRadius = baseRadius * 4.2 * nebPulse;

          // Multi-layer rotating nebula gas
          const gasGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, nebRadius);
          gasGradient.addColorStop(0, "rgba(56, 189, 248, 0.85)");
          gasGradient.addColorStop(0.35, "rgba(168, 85, 247, 0.35)");
          gasGradient.addColorStop(0.7, "rgba(59, 130, 246, 0.12)");
          gasGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = gasGradient;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, nebRadius, 0, Math.PI * 2);
          ctx.fill();

          // Swirling cosmic orbital ring
          ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
          ctx.lineWidth = 1.2 * cam.zoom;
          ctx.setLineDash([3, 4]);
          ctx.lineDashOffset = time * 15;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, baseRadius * 2.8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Locked Core Glyph
          ctx.fillStyle = "#ffffff";
          ctx.font = `600 ${Math.max(9, 10 * cam.zoom)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("⏳", pos.x, pos.y + 3);

          ctx.fillStyle = "#38bdf8";
          ctx.font = `500 ${Math.max(8, 9 * cam.zoom)}px monospace`;
          ctx.fillText("TIME CAPSULE", pos.x, pos.y - baseRadius * 3.2);
          ctx.restore();
        }

        // Cross spikes on Hover
        if (isHovered) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
          ctx.lineWidth = 1;
          const spikeLen = baseRadius * 3.5;
          ctx.beginPath();
          ctx.moveTo(pos.x - spikeLen, pos.y);
          ctx.lineTo(pos.x + spikeLen, pos.y);
          ctx.moveTo(pos.x, pos.y - spikeLen);
          ctx.lineTo(pos.x, pos.y + spikeLen);
          ctx.stroke();
        }
      }

      // 5. Ascension Animation
      if (newAscendingStar) {
        ascensionProgressRef.current += 0.02;
        const prog = Math.min(ascensionProgressRef.current, 1);

        const targetScreen = worldToScreen(newAscendingStar.x, newAscendingStar.y);
        const startX = width / 2;
        const startY = height + 50;

        const currentX = startX + (targetScreen.x - startX) * prog;
        const currentY = startY + (targetScreen.y - startY) * Math.pow(prog, 0.7);

        const beamGrad = ctx.createLinearGradient(currentX, currentY + 80, currentX, currentY);
        beamGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        beamGrad.addColorStop(1, newAscendingStar.color);

        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(currentX, currentY + 80);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = newAscendingStar.color;
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (prog >= 1) {
          ascensionProgressRef.current = 0;
          onAscensionComplete();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    filteredLetters,
    hoveredLetter,
    userStarIds,
    focusedStarId,
    searchLocation,
    worldToScreen,
    newAscendingStar,
    onAscensionComplete,
    breathScale,
    vigilProgress
  ]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
        className="w-full h-full block"
      />

      {/* Floating Hover Whisper Tooltip */}
      {hoveredLetter && !isDraggingRef.current && (
        <div
          style={{
            left: Math.min(Math.max(mousePos.x + 20, 20), window.innerWidth - 320),
            top: Math.min(Math.max(mousePos.y - 40, 20), window.innerHeight - 180)
          }}
          className="pointer-events-none fixed z-30 w-72 rounded-2xl border border-white/15 bg-black/85 backdrop-blur-xl p-4 shadow-2xl shadow-black/80 transition-opacity duration-200"
        >
          <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
            <span
              className="inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full text-[10px]"
              style={{
                backgroundColor: `${hoveredLetter.color}15`,
                color: hoveredLetter.color,
                border: `1px solid ${hoveredLetter.color}40`
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: hoveredLetter.color }}
              />
              {hoveredLetter.category.toUpperCase()}
            </span>
            {(userStarIds || []).includes(hoveredLetter.id) ? (
              <span className="text-[10px] text-amber-300 font-semibold">★ YOUR STAR</span>
            ) : (
              <span className="text-[11px] text-white/60">📍 {hoveredLetter.locationName}</span>
            )}
          </div>

          {hoveredLetter.isTimeCapsule && (
            <div className="mb-1.5 px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-400/30 text-[10px] text-sky-300 font-mono flex items-center gap-1.5">
              <span>⏳</span>
              <span>Time-Locked • Ignites {hoveredLetter.igniteDate}</span>
            </div>
          )}

          {hoveredLetter.resonantLetterId && (
            <div className="mb-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-[10px] text-amber-300 font-mono flex items-center gap-1.5">
              <span>✦</span>
              <span>Resonant Sister Star Linked</span>
            </div>
          )}

          <h4 className="text-sm font-semibold text-white/95 line-clamp-1 mb-1">
            {hoveredLetter.recipient}
          </h4>
          <p className="text-xs text-white/70 italic line-clamp-2 leading-relaxed">
            "{hoveredLetter.content}"
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/10">
            <span>✨ Click to open letter</span>
            <span>🤍 {hoveredLetter.lightCount.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Bottom Subtle Navigation & Compliance */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-auto z-10">
        <span className="pointer-events-none text-center text-[10px] sm:text-[11px] tracking-wider text-white/30 font-light">
          DRAG TO EXPLORE COSMOS • SCROLL TO ZOOM • CLICK ANY STAR TO READ
        </span>
        <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] text-white/30 font-mono tracking-widest uppercase">
          <a href="/chronicles" className="hover:text-amber-300/90 transition-colors">
            Chronicles
          </a>
          <span>•</span>
          <a href="/privacy" className="hover:text-amber-300/90 transition-colors">
            Privacy
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-amber-300/90 transition-colors">
            Terms
          </a>
          <span>•</span>
          <a href="/contact" className="hover:text-amber-300/90 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}