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
  SiHtml5,
  SiCss3,
} from "react-icons/si";
import SkillCardComponent from "@/components/SkillCard";
import BioSection from "@/components/portoSection/bio";


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

      {/* Bio section */}
      <BioSection />

      {/* Showcase section */}
      {/* {showcaseSection} */}

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
      <a href="https://www.linkedin.com/in/cbonz/" target="_blank" rel="noopener noreferrer" className="hover:scale-105 text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 px-8 rounded-lg shadow-md hover:opacity-90 transition duration-300 ease-in-out">
        Let&apos;s Connect
      </a>
      <button
        className="border-2 border-gradient-to-r from-blue-500 to-purple-500 text-2xl text-white font-semibold py-4 px-8 rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition duration-300 ease-in-out"
        onClick={() => {
          const section = document.getElementById("showcase");
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        View Showcase
      </button>
    </div>
  </div>
);
const skillsSection = (
  <div id="skills" className="flex flex-col gap-10 w-full">
    <div className="h-16"></div>
    <h2 className="text-4xl font-bold dark:text-white">My Skills</h2>
    <p className="text-lg text-gray-600 dark:text-gray-300">
      I specialize in web development, working with both frontend and backend
      technologies.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 w-full">
      <ul className="flex flex-col gap-4 w-full">
        <SkillCardComponent
          icon={SiNextdotjs}
          name="Next.js"
          description="A popular React framework for building server-side rendered and statically generated websites."
        />
        <SkillCardComponent
          icon={FaReact}
          name="React"
          description="A JavaScript library for building user interfaces."
        />
        <SkillCardComponent
          icon={SiJavascript}
          name="JavaScript"
          description="A high-level, dynamic, and interpreted programming language."
        />
        <SkillCardComponent
          icon={SiTypescript}
          name="TypeScript"
          description="A superset of JavaScript that adds optional static typing and other features."
        />
        <SkillCardComponent
          icon={SiHtml5}
          name="HTML"
          description="A markup language used for structuring and presenting content on the web."
        />
        <SkillCardComponent
          icon={SiCss3}
          name="CSS"
          description="A styling language used for describing the presentation of web pages."
        />
        <SkillCardComponent
          icon={FaNodeJs}
          name="Nodejs"
          description="A JavaScript runtime built on Chrome's V8 JavaScript engine."
        />
        <SkillCardComponent
          icon={FaGitAlt}
          name="Git"
          description="A version control system for tracking changes in source code."
        />
        <SkillCardComponent
          icon={SiMongodb}
          name="MongoDB"
          description="A document-oriented NoSQL database."
        />
        <SkillCardComponent
          icon={SiPostgresql}
          name="PostgreSQL"
          description="A powerful, open-source relational database management system."
        />
        <SkillCardComponent
          icon={SiGraphql}
          name="GraphQL"
          description="A query language for APIs and a runtime for fulfilling those queries."
        />
        <SkillCardComponent
          icon={FaDocker}
          name="Docker"
          description="A containerization platform for deploying and managing applications."
        />

      </ul>
    </div>
  </div>
);
const showcaseSection = (
  <div id="showcase" className="flex flex-col gap-6 w-full mt-12">
    <h2 className="text-4xl font-bold dark:text-white">Projects</h2>
    <p className="text-lg text-gray-600 dark:text-gray-300">
      Here are some of the projects I&apos;ve worked on. Click on each project
      to learn more.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Project 1 */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
        <img
          src="https://via.placeholder.com/300"
          alt="Project 1"
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Project Title 1
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            A brief description of the project, highlighting what it does and
            the technologies used.
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
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Project Title 2
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            A brief description of the project, highlighting what it does and
            the technologies used.
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
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Project Title 3
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            A brief description of the project, highlighting what it does and
            the technologies used.
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
