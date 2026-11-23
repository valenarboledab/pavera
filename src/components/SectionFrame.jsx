import { useEffect, useRef, useState } from "react";
import "./SectionFrame.css";

/**
 * Every section is authored on a fixed 1600x900 (16:9) canvas so the layout
 * stays pixel-identical everywhere. SectionFrame measures the width it has
 * been given and uniformly scales that canvas to match, so the section always
 * fills its container edge to edge with no cropping and no scrollbars.
 *
 * It scales to *width* only, and takes its height from the 16:9 ratio in CSS.
 * That is what lets a section drop into a page that already exists: it flows
 * in normal document order like any other block, rather than claiming the
 * viewport. Scaling to `min(width, height)` instead would letterbox the canvas
 * inside whatever height the host happened to give it.
 *
 * The ratio lives on `.frame` as an `aspect-ratio`, not in this component's
 * state. Height is then correct on the very first paint, before the effect
 * below has measured anything — driving it from `scale` instead renders one
 * frame at the full 900px and visibly collapses.
 */
const DESIGN_W = 1600;
const DESIGN_H = 900;

export default function SectionFrame({ id, children, background = "#ffffff" }) {
  const hostRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const fit = () => {
      const { width } = host.getBoundingClientRect();
      if (width) setScale(width / DESIGN_W);
    };

    fit();
    // Observing the host is safe here because its height is derived from its
    // own width by `aspect-ratio`, so nothing this callback does can feed back
    // into the measurement and loop.
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  return (
    <section id={id} className="frame" ref={hostRef} style={{ background }}>
      <div
        className="frame__canvas"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </section>
  );
}
