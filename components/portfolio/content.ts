// Portfolio facts and links retained from the original homepage.
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  theme: string;
  className?: string;
}

export const projects: Project[] = [
  {
    id: "credentid",
    title: "CredentID",
    description:
      "A seamless identity verification and credential management platform.",
    tags: ["Next.js", "Identity", "Secure", "Landing Page"],
    liveUrl: "https://credentid.vercel.app/",
    theme: "violet",
    className: "md:col-span-2",
  },
  {
    id: "vifive",
    title: "ViFive",
    description:
      "A cinematic landing page built to introduce and frame a novel story.",
    tags: ["Next.js", "Storytelling", "Cinematic", "Landing Page"],
    liveUrl: "https://vifive.vercel.app/",
    theme: "indigo",
    className: "md:col-span-2",
  },
  {
    id: "maxima",
    title: "Maxima Property",
    description:
      "Modern real estate listing and property management interface.",
    tags: ["React", "Real Estate", "Admin", "Marketplace"],
    liveUrl: "https://maxima-property.vercel.app/",
    theme: "teal",
    className: "md:col-span-1",
  },
  {
    id: "spinwin",
    title: "Spin & Win",
    description:
      "Interactive spin-the-wheel game for user engagement and rewards.",
    tags: ["React", "Gamification", "Fun"],
    liveUrl: "https://spin-win-psi.vercel.app/",
    theme: "amber",
    className: "md:col-span-1",
  },
  {
    id: "tiershare",
    title: "Tier Share Board",
    description:
      "Collaborative dashboard for visualizing tiered data and sharing insights.",
    tags: ["Next.js", "Dashboard", "Data Viz"],
    liveUrl: "https://tier-share-board.vercel.app/",
    theme: "pink",
    className: "md:col-span-2",
  },
  {
    id: "cbcal",
    title: "CB Cal",
    description: "A sleek and functional utility application.",
    tags: ["React", "Utility", "Minimalist"],
    liveUrl: "https://cb-cal.vercel.app/",
    theme: "rose",
    className: "md:col-span-1",
  },
  {
    id: "autofood",
    title: "Auto Food Polling Bot",
    description:
      "Telegram bot to automate daily food ordering polls for office.",
    tags: ["Node.js", "Telegram API", "Automation"],
    theme: "slate",
    className: "md:col-span-1",
  },
  {
    id: "aifixhuman",
    title: "AIFIXHUMAN",
    description:
      "Submit yourself to the ultimate AI optimization protocol. Say goodbye to flaws and biological limitations. (parody)",
    tags: ["Joke", "AI", "Design"],
    liveUrl: "https://aifixhuman.vercel.app/",
    theme: "rose",
    className: "md:col-span-1",
  },
  {
    id: "dracin",
    title: "Dracin",
    description:
      "A multi-platform streaming aggregator with cinematic dark UI and platform filtering.",
    tags: ["React", "Streaming", "UI/UX", "SaaS"],
    liveUrl: "https://dracin.indevs.in/",
    theme: "indigo",
    className: "md:col-span-2",
  },
  {
    id: "qanari",
    title: "Qanari",
    description: "Track Every Bug. Ship With Confidence.",
    tags: ["Next.js", "Management", "SaaS"],
    liveUrl: "https://qanari.vercel.app/",
    theme: "cyan",
    className: "md:col-span-1",
  },
];

export const experiences = [
  {
    title: "Fullstack Senior Software Engineer",
    company: "Harts Imagineering",
    period: "Sep 2024 – Present",
    description:
      "Building end-to-end solutions with scalability and security focus. Developing Internal Audit App and Superapp Bhakta (ERP). Managed backend with PHP and frontend with Gatsby.js.",
    tags: ["PHP", "Gatsby.js", "Scalability", "Security", "Mentorship"],
    hash: "a1b2c3d",
  },
  {
    title: "Backend Engineer",
    company: "Intimedia International",
    period: "Aug 2023 – Mar 2024",
    description:
      "Worked on TujuhLive streaming platform using PHP and ThinkPHP. Designed WebSocket for real-time data to improve engagement. Optimized performance and collaborated with cross-functional teams.",
    tags: ["PHP", "ThinkPHP", "WebSocket", "Real-time", "Optimization"],
    hash: "e4f5g6h",
  },
  {
    title: "Fullstack Engineer",
    company: "Alterra Academy",
    period: "2021 – Nov 2022",
    description:
      "Developed Alta.id, SKCBD (Nuxt + Express.js), and Talent Dashboard. Integrated AWS CI/CD, implemented Google Analytics, and set up Strapi on GCP.",
    tags: ["Nuxt.js", "Express.js", "AWS CI/CD", "GCP", "Strapi"],
    hash: "i7j8k9l",
  },
  {
    title: "Fullstack Engineer",
    company: "Alterra",
    period: "Jul 2019 – 2021",
    description:
      "Built Reconciliation Engine (Vue + Node + MongoDB) and PDAM Budgeting (Next.js + Node + GraphQL). Implemented unit testing with Jest and caching via GraphQL.",
    tags: ["Vue.js", "Node.js", "MongoDB", "GraphQL", "Jest"],
    hash: "m0n1o2p",
  },
];

export const archiveScenes = [
  {
    eyebrow: "PRIVATE ARCHIVE",
    headline: [
      "SOME WORK DOESN'T",
      "NEED A PITCH.",
      "IT JUST NEEDS",
      "A LITTLE DARKNESS",
      "AND YOUR ATTENTION.",
    ],
    sub: "Keep scrolling. Everything below is something I built when no one asked me to.",
  },
  {
    eyebrow: "STILL HERE",
    headline: [
      "I DON'T BUILD",
      "FOR THE FEED.",
      "I BUILD FOR THE",
      "PEOPLE WHO STAY",
      "PAST THE FIRST",
      "SCROLL.",
    ],
    sub: "You're one of them. Let's get into it.",
  },
  {
    eyebrow: "OFF THE RECORD",
    headline: [
      "MOST OF WHAT I",
      "MAKE NEVER GETS",
      "POSTED.",
      "YOU'RE ABOUT TO",
      "SEE WHY THAT'S",
      "CHANGING.",
    ],
    sub: "A short list of things that survived the doubt.",
  },
  {
    eyebrow: "LATE NIGHTS, MOSTLY",
    headline: [
      "BUILT IN THE",
      "HOURS NOBODY",
      "WAS WATCHING.",
      "SHIPPED ANYWAY.",
    ],
    sub: "Side projects, half-finished thoughts, and a few things that worked.",
  },
  {
    eyebrow: "GO AHEAD",
    headline: ["SCROLL SLOWER.", "THIS PART WAS", "WORTH THE WORK."],
    sub: "Three years of building quietly, condensed into the next ninety seconds.",
  },
];

export const skills = [
  "JavaScript (Node.js)",
  "TypeScript",
  "Vue.js / Nuxt",
  "React / Next.js",
  "PHP",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "GraphQL",
  "Docker",
  "GitHub",
  "Jira",
  "Sonarqube",
  "WordPress",
  "WebSocket",
  "Testing (Jest)",
];
