"use client";

import { useRef } from "react";

const PRESETS = [
  { name: "Crash Zoom", kind: "Camera motion", accent: "#7c5cff" },
  { name: "Bullet Time", kind: "Camera motion", accent: "#35e0ff" },
  { name: "Dolly In", kind: "Camera motion", accent: "#ff7ad9" },
  { name: "FPV Drone", kind: "Camera motion", accent: "#8affc1" },
  { name: "360 Orbit", kind: "Camera motion", accent: "#ffd16a" },
  { name: "Face Punch", kind: "Camera motion", accent: "#ff6a6a" },
];

function PlayIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

export default function StyleCarousel() {
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const onPointerDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    el.classList.add("is-dragging");
  };

  const onPointerMove = (e) => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  };

  const endDrag = () => {
    const el = trackRef.current;
    if (!el) return;
    drag.current.active = false;
    el.classList.remove("is-dragging");
  };

  return (
    <div
      ref={trackRef}
      className="carousel"
      role="list"
      aria-label="Cinematic camera motion presets"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      {PRESETS.map((p) => (
        <article
          key={p.name}
          role="listitem"
          className="persona"
          style={{ "--accent": p.accent }}
        >
          <div
            className="persona__orb"
            style={{
              background: `radial-gradient(circle at 32% 28%, #fff 0%, ${p.accent} 38%, #1a1030 100%)`,
            }}
          />
          <div>
            <h3 className="text-lg font-medium tracking-tight">{p.name}</h3>
            <p className="text-sm text-white/45">{p.kind}</p>
          </div>
          <div className="flex items-center justify-between">
            <span
              className="text-xs uppercase tracking-[0.18em] text-white/35"
              style={{ color: p.accent }}
            >
              Preset
            </span>
            <button
              type="button"
              className="persona__play"
              aria-label={`Preview ${p.name} motion`}
            >
              <PlayIcon />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
