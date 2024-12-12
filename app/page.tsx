"use client";
import React, { useEffect } from "react";
import { FaReact, FaNodeJs, FaDocker, FaGitAlt } from "react-icons/fa";
import {
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiGraphql,
  SiKubernetes,
  SiLinux,
  SiHtml5,
  SiCss3,
} from "react-icons/si";

const SkillCard = ({
  icon: Icon,
  name,
}: {
  icon: React.ElementType;
  name: string;
}) => (
  <li className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all rounded-md p-2">
    <Icon className="text-xl text-blue-500 dark:text-blue-400" />
    <span className="text-lg dark:text-white">{name}</span>
  </li>
);


export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer/build/spline-viewer.js";
    script.async = true;

    script.onload = () => {
      const splineViewer = document.querySelector("spline-viewer");
      if (splineViewer) {
        const shadowRoot = splineViewer.shadowRoot;
        if (shadowRoot) {
          const logoElement = shadowRoot.querySelector("#logo");
          if (logoElement) {
            logoElement.remove();
          }
        }
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full">
      {/* Hero section */}
      {heroSection}
      <spline-viewer
        style={{
          backgroundColor: "transparent",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        url="https://prod.spline.design/pS-PjKUUhIiCodIC/scene.splinecode"
        events-target="global"
      ></spline-viewer>

      {/* Skills section */}
      {skillsSection}

      {/* Showcase section */}
      {showcaseSection}

      {/* Contact section */}

      {/* Footer section */}
    </section>
  );
}


const heroSection = (
  <div className="flex flex-col items-center justify-center gap-10 text-center lg:text-left px-4 sm:px-8 md:px-16 mb-10 w-full relative">
    <h1 className="text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl relative z-10 select-none">
      Hello, I&apos;m{" "}
      <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
        Christian Bonafena
      </span>
      ,<br /> a Fullstack Engineer.
    </h1>
    <p className="select-none text-lg text-gray-600 dark:text-gray-400 max-w-5xl mx-auto mt-4 md:text-xl relative z-10 mb-6">
      I&apos;m a passionate software engineer who thrives on building scalable,
      maintainable, and high-performing software systems. With a love for
      Next.js, React, and modern web technologies, I enjoy bringing ideas to
      life through clean, elegant code.
    </p>
    <div className="select-none mt-6 flex gap-4 justify-center lg:justify-start relative z-10 mb-20">
      <button className="hover:scale-105 text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 px-8 rounded-lg shadow-md hover:opacity-90 transition duration-300 ease-in-out">
        Let&apos;s Connect
      </button>
      <button className="border-2 border-gradient-to-r from-blue-500 to-purple-500 text-2xl text-blue-500 font-semibold py-4 px-8 rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition duration-300 ease-in-out">
        View Portfolio
      </button>
    </div>
  </div>
);
const skillsSection = (
  <div className="flex flex-col gap-10">
    <div className="h-16"></div>
    <h2 className="text-4xl font-bold dark:text-white">My Skills</h2>
    <p className="text-lg text-gray-600 dark:text-gray-300">
      I specialize in web development, working with both frontend and backend
      technologies.
    </p>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ul className="flex flex-col gap-4">
        <SkillCard icon={SiNextdotjs} name="Next.js" />
        <SkillCard icon={FaReact} name="React" />
        <SkillCard icon={SiJavascript} name="JavaScript" />
        <SkillCard icon={SiTypescript} name="TypeScript" />
        <SkillCard icon={SiHtml5} name="HTML" />
        <SkillCard icon={SiCss3} name="CSS" />
      </ul>
      <ul className="flex flex-col gap-4">
        <SkillCard icon={FaNodeJs} name="Node.js" />
        <SkillCard icon={FaGitAlt} name="Git" />
        <SkillCard icon={SiMongodb} name="MongoDB" />
        <SkillCard icon={SiPostgresql} name="PostgreSQL" />
        <SkillCard icon={SiGraphql} name="GraphQL" />
        <SkillCard icon={FaDocker} name="Docker" />
      </ul>
      <ul className="flex flex-col gap-4">
        <SkillCard icon={SiKubernetes} name="Kubernetes" />
        <SkillCard icon={SiLinux} name="Linux" />
      </ul>
    </div>
  </div>
);
const showcaseSection = (
  <div className="flex flex-col gap-6 w-full mt-12">
    <h2 className="text-4xl font-bold dark:text-white">Showcase</h2>
    <p className="text-lg text-gray-600 dark:text-gray-300">
      Here are some of the projects I&apos;ve worked on. Click on each project to learn more.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Project 1 */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
        <img
          src="https://via.placeholder.com/300" // Replace with your project image
          alt="Project 1"
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Project Title 1</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            A brief description of the project, highlighting what it does and the technologies used.
          </p>
          <a
            href="/"
            className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition-colors"
          >
            View Project
          </a>
        </div>
      </div>
      {/* Project 2 */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
        <img
          src="https://via.placeholder.com/300" // Replace with your project image
          alt="Project 2"
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Project Title 2</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            A brief description of the project, highlighting what it does and the technologies used.
          </p>
          <a
            href="/"
            className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition-colors"
          >
            View Project
          </a>
        </div>
      </div>
      {/* Project 3 */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
        <img
          src="https://via.placeholder.com/300" // Replace with your project image
          alt="Project 3"
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Project Title 3</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            A brief description of the project, highlighting what it does and the technologies used.
          </p>
          <a
            href="/"
            className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition-colors"
          >
            View Project
          </a>
        </div>
      </div>
    </div>
  </div>
);
