import { FigmaImg } from "./FigmaImg";

/* Minji's avatar — layered Figma vectors, each clipped by the round "Body" mask. */

const base =
  "absolute mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[35.883px_35.882px]";
const mask = { maskImage: 'url("/assets/a0110.svg")' } as const;

function Img({ name }: { name: string }) {
  return <FigmaImg name={name} className="absolute inset-0 size-full" />;
}

/** "before" = first home screen, "during" = in-semester Home (different outfit + head). */
export function Avatar({ variant = "before" }: { variant?: "before" | "during" }) {
  const layer = `${base} ${variant === "during" ? "inset-[0_1.39%_0_-1.39%]" : "inset-0"}`;
  const outfit = variant === "during" ? "7a0e9" : "ccb5c";
  const head = variant === "during" ? "15704" : "1ee29";
  return (
    <div className="relative size-[36px] shrink-0" aria-label="Minji">
      <div className={layer} style={mask}>
        <div className="absolute inset-[68.85%_19.66%_0.13%_13.3%]">
          <Img name="d3743" />
        </div>
      </div>
      <div className={layer} style={mask}>
        <div className="absolute inset-[68.88%_17.12%_-14.83%_6.76%]">
          <Img name={outfit} />
        </div>
      </div>
      <div className={layer} style={mask}>
        <div className="absolute inset-[19.3%_27.57%_15.34%_29.67%]">
          <Img name={head} />
        </div>
      </div>
      <div className={layer} style={mask}>
        <div className="absolute inset-[56.13%_38.53%_38.59%_53.67%]">
          <div className="absolute inset-[-1.37%_-1.48%_-2.19%_-1.48%]">
            <Img name="4b4f5" />
          </div>
        </div>
      </div>
      <div className={layer} style={mask}>
        <div className="absolute inset-[37.43%_29.32%_52.06%_49.34%]">
          <Img name="94de6" />
        </div>
      </div>
      <div className={layer} style={mask}>
        <Img name="a7cfd" />
      </div>
      <div className={layer} style={mask}>
        <div className="absolute inset-[52.64%_46.59%_45.05%_46.2%]">
          <Img name="63f86" />
        </div>
        <div className="absolute inset-[52.61%_29.55%_45.01%_67.4%]">
          <Img name="23d3e" />
        </div>
      </div>
      <div className={layer} style={mask}>
        <div className="absolute inset-[0_0.1%_0.06%_0.03%]">
          <Img name="cb08c" />
        </div>
      </div>
    </div>
  );
}
