import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SkillCard = ({
  icon: Icon,
  name,
  description, // Added description prop
}: {
  icon: React.ElementType;
  name: string;
  description: string; // Expecting a description for each skill
}) => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      `.${name}`,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: `.${name}`,
          start: "top 80%",
          end: "top 60%",
          scrub: true,
          markers: false,
        },
      }
    );
  }, [name]);

  return (
    <div
      className={`${name} group relative flex items-center gap-4 p-4 hover:scale-105 transition-transform duration-300 ease-in-out`}
    >
      {/* Icon with padding and a gradient background */}
      <Icon className="w-14 h-14 p-3 bg-black rounded-full shadow-lg" />

      {/* Skill name */}
      <span className="flex-grow text-2xl font-semibold text-white">
        {name}
      </span>

    </div>
  );
};

export default SkillCard;
