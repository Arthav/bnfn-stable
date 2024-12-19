import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SkillCard = ({
  icon: Icon,
  name,
}: {
  icon: React.ElementType;
  name: string;
}) => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      `.${name}`, // Use the name directly for targeting the card
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: `.${name}`,
          start: "top 80%",  // Adjust these values based on the effect you want
          end: "top 60%",
          scrub: true,
          markers: false,
        },
      }
    );
  }, [name]);

  return (
    <div
      className={`${name} w-full flex items-center gap-4 p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 hover:scale-105 transition-transform duration-300 ease-in-out`}
    >
      <Icon className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 p-2" />
      <span>{name}</span>
    </div>
  );
};

export default SkillCard;
