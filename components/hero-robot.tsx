"use client";

import Image from "next/image";
import { useRef } from "react";

export function HeroRobot({
  alt,
  caption,
  size = "hero",
}: {
  alt: string;
  caption?: string;
  size?: "hero" | "compact";
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const hero = size === "hero";

  function tilt(event: React.PointerEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage) return;
    const box = stage.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    stage.style.setProperty("--rx", `${(-y * 16).toFixed(2)}deg`);
    stage.style.setProperty("--ry", `${(x * 20).toFixed(2)}deg`);
  }

  function reset() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--rx", "8deg");
    stage.style.setProperty("--ry", "-12deg");
  }

  return (
    <figure
      ref={stageRef}
      onPointerMove={hero ? tilt : undefined}
      onPointerLeave={hero ? reset : undefined}
      className={`relative mx-auto select-none ${
        hero
          ? "h-[400px] w-full max-w-[360px] sm:h-[520px] sm:max-w-[440px]"
          : "h-40 w-32 sm:h-48 sm:w-36"
      }`}
      style={{
        perspective: "1200px",
        ["--rx" as string]: "8deg",
        ["--ry" as string]: "-12deg",
      }}
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: "rotateX(var(--rx)) rotateY(var(--ry))",
          transformStyle: "preserve-3d",
          transition: "transform 220ms ease-out",
        }}
      >
        <div className="robot-float relative h-full w-full">
          <span
            aria-hidden="true"
            className="absolute inset-x-[12%] bottom-[6%] h-10 rounded-[100%] bg-cyan-300/25 blur-2xl sm:h-14"
          />
          <span
            aria-hidden="true"
            className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(212,160,23,0.28),transparent_62%)] blur-xl"
          />
          <Image
            src="/mascots/hero-robot.png"
            alt={alt}
            width={864}
            height={1152}
            priority={hero}
            quality={90}
            sizes={hero ? "(max-width: 1024px) 80vw, 440px" : "160px"}
            className="relative z-10 h-full w-full object-contain [mask-image:radial-gradient(ellipse_70%_78%_at_50%_46%,#000_52%,transparent_78%)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_68%_76%_at_50%_46%,transparent_48%,#071c45_78%)]"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="sr-only">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
