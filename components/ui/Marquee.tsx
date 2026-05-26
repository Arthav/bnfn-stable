"use client";

interface MarqueeTextProps {
  children: string;
  reverse?: boolean;
}

function MarqueeText({ children, reverse = false }: MarqueeTextProps) {
  return (
    <div className="overflow-hidden whitespace-nowrap leading-[0.8]">
      <div
        className={`flex w-max shrink-0 whitespace-nowrap font-bold uppercase text-[9rem] will-change-transform md:text-[12rem] ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} className="mr-12 block opacity-10">
            {children}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="pointer-events-none absolute top-[20%] z-0 w-full select-none opacity-30 mix-blend-overlay">
      <MarqueeText reverse>DEVELOPER CREATOR ENGINEER</MarqueeText>
      <MarqueeText>DESIGN CODE SHIP</MarqueeText>
    </section>
  );
}
