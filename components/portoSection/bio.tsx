// @ts-nocheck
"use client";
import Image from "next/image";

import { useEffect, useRef } from "react";
import { animate, scroll, spring } from "motion";
import { ReactLenis } from "lenis/react";

export default function HorizontalScroll(): JSX.Element {
  const ulRef = useRef<HTMLUListElement | null>();

  useEffect(() => {
    // const items = ulRef.current?.querySelectorAll("li");
    const items = document.querySelectorAll("li");
    const section = document.querySelector("section");

    if (!ulRef.current || !section || !items || items.length === 0) return;

    // Animate the horizontal scrolling of the list
    const controls = animate(
      ulRef.current,
      {
        transform: ["none", `translateX(-${(items.length - 1) * 100}vw)`],
      },
      { easing: spring() }
    );
    scroll(controls, { target: section });

    const segmentLength = 1 / items.length;

    // Animate each <li> element individually
    items.forEach((item, i) => {
      const header = item.querySelector("h2");
      if (!header) return;

      scroll(
        animate(item, {
          transform: ["translateX(565vw)", "translateX(465vw)"],
        }),
        {
          target: section,
          offset: [i * segmentLength, (i + 1) * segmentLength],
        }
      );

      // end
    });
  }, []);

  return (
    <ReactLenis root>
      <main>
        <article>
          <header className="text-white relative  w-full bg-slate-950  grid place-content-center  h-[80vh]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <h1 className="text-6xl font-bold text-center tracking-tight">
              At this level <br />
              You must want to know me better
            </h1>
          </header>
          <section className="h-[500vh] relative">
            <ul ref={ulRef} className="flex sticky top-0">
              <li className="h-screen w-screen bg-red-400 flex flex-col justify-center overflow-hidden  items-center">
                <h2 className="text-[20vw] font-semibold relative bottom-5 inline-block text-black">
                  PASSIONate
                </h2>
                <Image
                  src="/images/pexels-chevanon-325044.jpg"
                  className="2xl:w-[550px] w-[380px] absolute bottom-0"
                  width={500}
                  height={500}
                  alt="image"
                />
              </li>
              <li className="h-screen w-screen bg-blue-400 flex flex-col justify-center overflow-hidden  items-center">
                <h2 className="text-[20vw] font-semibold relative bottom-5 inline-block text-black">
                  CREATIVE
                </h2>
                <Image
                  src="/images/pexels-chevanon-325044.jpg"
                  className="2xl:w-[550px] w-[380px] absolute bottom-0"
                  width={500}
                  height={500}
                  alt="image"
                />
              </li>
              <li className="h-screen w-screen bg-orange-400 flex flex-col justify-center overflow-hidden  items-center">
                <h2 className="text-[20vw] font-semibold relative bottom-5 inline-block text-black">
                  MOTIVATED
                </h2>
                <Image
                  src="/images/pexels-chevanon-325044.jpg"
                  className="2xl:w-[550px] w-[380px] absolute bottom-0"
                  width={500}
                  height={500}
                  alt="image"
                />
              </li>
              <li className="h-screen w-screen bg-yellow-400 flex flex-col justify-center overflow-hidden  items-center">
                <h2 className="text-[20vw] font-semibold relative bottom-5 inline-block text-black">
                  INSPIRING
                </h2>
                <Image
                  src="/images/pexels-chevanon-325044.jpg"
                  className="2xl:w-[550px] w-[380px] absolute bottom-0"
                  width={500}
                  height={500}
                  alt="image"
                />
              </li>
              <li className="h-screen w-screen bg-green-400 flex flex-col justify-center overflow-hidden  items-center">
                <h2 className="text-[20vw] font-semibold relative bottom-5 inline-block text-black">
                  EVERLEARNING
                </h2>
                <Image
                  src="/images/pexels-chevanon-325044.jpg"
                  className="2xl:w-[550px] w-[380px] absolute bottom-0"
                  width={500}
                  height={500}
                  alt="image"
                />
              </li>
            </ul>
          </section>
          <footer className="bg-red-600 text-white grid place-content-center h-[80vh]">
            <p>
              "I am who i am" <br />
              <br />
              <a target="_blank" href="">
                ~ Christian Bonafena
              </a>
            </p>
          </footer>
        </article>
        <div className="progress fixed left-0 right-0  h-2 rounded-full bg-red-600 bottom-[50px] scale-x-0"></div>
      </main>
    </ReactLenis>
  );
}
