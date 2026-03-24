import type { Experience } from "../types/index";

// Fallback data used when the API is unavailable.
// Field names match the live API response shape.
export const experienceList: Experience[] = [
    {
        title: "Fullstack Developer",
        description:
            "Developed and maintained high-performance web and mobile applications using Next JS, Flutter, and Golang.",
        web_profile: {
            data: {
                company: "PT Indoglobal Nusa Persada (Pintro)",
                date: "12/24 - 12/26",
                accent: "var(--cyan)",
            },
        },
    },
    {
        title: "Software Engineer",
        description:
            "Developed REST APIs and implemented authentication protocols, such as OAuth, using Express JS and Spring Boot.",
        web_profile: {
            data: {
                company: "PT Kuantum Solusi Teknologi",
                date: "01/24 - 12/24",
                accent: "var(--green)",
            },
        },
    },
    {
        title: "Mobile Developer",
        description:
            "Maintained HRIS mobile app, developed a job application dashboard, and created a Warehouse Management System.",
        web_profile: {
            data: {
                company: "CV Mutif Corporation",
                date: "04/21 - 12/23",
                accent: "var(--purple)",
            },
        },
    },
];
