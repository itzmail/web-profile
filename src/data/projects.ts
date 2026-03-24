import type { Project } from "../types/index";

export const projectsList: Project[] = [
    {
        name: "Warehouse Management System",
        desc: "Designed for warehouse monitoring activities such as picking, storing, and tracking inventory.",
        stack: ["React Native", "Express JS"],
        accent: "var(--green)",
        links: { github: "#", live: "#" },
    },
    {
        name: "HRIS Mobile Application",
        desc: "An internal mobile platform for managing leaves, attendance, and employee performance.",
        stack: ["Flutter", "Dart", "Firebase"],
        accent: "var(--cyan)",
        links: { github: "#", live: "#" },
    },
    {
        name: "Sales Force Application",
        desc: "Streamlines sales tracking, catalogs, and customer visit logging for external agents.",
        stack: ["Flutter", "Dart", "REST API"],
        accent: "var(--purple)",
        links: { github: "#", live: "#" },
    },
    {
        name: "Job Application Dashboard",
        desc: "A web platform acting as a dashboard for prospective employees to apply and track status.",
        stack: ["Next.js", "TypeScript", "Tailwind"],
        accent: "var(--green)",
        links: { github: "#", live: "#" },
    },
];
