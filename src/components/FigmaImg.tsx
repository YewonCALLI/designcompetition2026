"use client";

import { useCallback, useState } from "react";

/**
 * Static asset exported from Figma, served from /public/assets/<name>.svg.
 * Run `npm run assets` once to download them (see README).
 * Until the files exist the image is simply hidden so layouts stay intact.
 */
export function FigmaImg({
  name,
  className = "",
  alt = "",
  ext = "svg",
}: {
  name: string;
  className?: string;
  alt?: string;
  ext?: "svg" | "png" | "jpg";
}) {
  const [missing, setMissing] = useState(false);
  // The image may fail before hydration attaches onError, so also check on mount.
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth === 0) setMissing(true);
  }, []);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={`/assets/${name}.${ext}`}
      alt={alt}
      draggable={false}
      onError={() => setMissing(true)}
      className={`block max-w-none ${missing ? "invisible" : ""} ${className}`}
    />
  );
}

/**
 * A Figma vector slot: an outer box at the design size, with the SVG
 * stretched over an inset (Figma pads strokes with negative insets).
 * `className` and `inset` must be literal Tailwind classes.
 */
export function Icon({
  name,
  className = "",
  inset = "inset-0",
}: {
  name: string;
  className?: string;
  inset?: string;
}) {
  return (
    <span
      className={`${/(^|\s)absolute(\s|$)/.test(className) ? "" : "relative"} block shrink-0 ${className}`}
      aria-hidden
    >
      <span className={`absolute block ${inset}`}>
        <FigmaImg name={name} className="size-full" />
      </span>
    </span>
  );
}
