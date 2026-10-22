import type { CSSProperties } from "react";
import { FigmaImg } from "./FigmaImg";

/*
 * "Cute Avatar" instances from Figma: layered vectors, each clipped by the round "Body" mask.
 * Every export of the avatar comes with its own asset set, so each person/size is a table here.
 */

type Layer = {
  img: string;
  /** position of the layer inside the avatar box (Figma inset) */
  inset?: string;
  /** extra stroke padding around the vector */
  pad?: string;
};

type AvatarDef = { mask: string; maskSize: string; box: string; layers: Layer[] };

const AVATARS = {
  /* Home header (1501:1526 / 1501:1271) */
  minji: {
    mask: "a0110",
    maskSize: "35.883px 35.882px",
    box: "size-[36px]",
    layers: [
      { img: "d3743", inset: "68.85% 19.66% 0.13% 13.3%" },
      { img: "7a0e9", inset: "68.88% 17.12% -14.83% 6.76%" },
      { img: "15704", inset: "19.3% 27.57% 15.34% 29.67%" },
      { img: "4b4f5", inset: "56.13% 38.53% 38.59% 53.67%", pad: "-1.37% -1.48% -2.19% -1.48%" },
      { img: "94de6", inset: "37.43% 29.32% 52.06% 49.34%" },
      { img: "c31b8" },
      { img: "63f86", inset: "52.64% 46.59% 45.05% 46.2%" },
      { img: "23d3e", inset: "52.61% 29.55% 45.01% 67.4%" },
      { img: "cb08c", inset: "0 0.1% 0.06% 0.03%" },
    ],
  },
  /* Family Space conversation (1501:3668) */
  minjiChat: {
    mask: "9cfbd",
    maskSize: "25.879px 25.879px",
    box: "size-[25.964px]",
    layers: [
      { img: "68976", inset: "68.85% 19.66% 0.13% 13.3%" },
      { img: "bfc2e", inset: "68.88% 17.12% -14.83% 6.76%" },
      { img: "de679", inset: "19.3% 27.57% 15.34% 29.67%" },
      { img: "e87a8", inset: "56.13% 38.53% 38.59% 53.67%" },
      { img: "29668", inset: "37.43% 29.32% 52.06% 49.34%" },
      { img: "3c21c" },
      { img: "88887", inset: "52.64% 46.59% 45.05% 46.2%" },
      { img: "ad3b7", inset: "52.61% 29.55% 45.01% 67.4%" },
      { img: "2a2f7", inset: "0 0.1% 0.06% 0.03%" },
    ],
  },
  /* Mom (1501:3682) */
  mom: {
    mask: "4380e",
    maskSize: "25.914px 25.914px",
    box: "size-[26px]",
    layers: [
      { img: "ac8df", inset: "68.85% 19.66% 0.13% 13.3%" },
      { img: "c426b", inset: "67.88% 11.16% -12.11% 4.56%" },
      { img: "5a0c9", inset: "65.16% 36.53% 10.86% 29.42%" },
      { img: "88066", inset: "19.3% 27.29% 15.34% 29.68%" },
      { img: "c024c", inset: "56.14% 38.31% 40.47% 54.48%" },
      { img: "b50bf", inset: "36.98% 28.93% 52.06% 49.14%" },
      { img: "760b2", inset: "16.02% 22.89% 18.85% 11.4%" },
      { img: "a56c3", inset: "40.78% 26.24% 46.63% 38.25%" },
      { img: "21570", inset: "0 0.1% 0.06% 0.03%" },
    ],
  },
} satisfies Record<string, AvatarDef>;

export type AvatarName = keyof typeof AVATARS;

export function Avatar({ who = "minji", className = "" }: { who?: AvatarName; className?: string }) {
  const a: AvatarDef = AVATARS[who];
  const mask: CSSProperties = {
    maskImage: `url("/assets/${a.mask}.svg")`,
    WebkitMaskImage: `url("/assets/${a.mask}.svg")`,
    maskSize: a.maskSize,
    WebkitMaskSize: a.maskSize,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskMode: "alpha",
    maskComposite: "intersect",
    maskClip: "no-clip",
  };
  return (
    <div className={`relative shrink-0 ${a.box} ${className}`} aria-label={who === "mom" ? "Mom" : "Minji"}>
      {a.layers.map((l) => (
        <div key={l.img} className="absolute inset-0" style={mask}>
          <div className="absolute" style={{ inset: l.inset ?? "0" }}>
            <div className="absolute" style={{ inset: l.pad ?? "0" }}>
              <FigmaImg name={l.img} className="size-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
