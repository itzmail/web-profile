import type { Social } from "../types/index";

export const siteInfo = {
    name: "Ismail Alam",
    title: "Fullstack Engineer for Hire",
    email: "ismailnuralam@itsmail.dev",
};

export const contactData = {
    titleStart: "Let's build",
    titleHighlight: "something",
    titleEnd: "great",
    description:
        "Have a product idea or need a reliable engineer on your team? I'm open to freelance projects, full-time opportunities, and interesting collaborations. Let's talk.",
    ctaText: "ismailnuralam@itsmail.dev",
    collaborateText: "let's collaborate",
    socialsLabel: "// find me on",
};

export const socialsData: Social[] = [
    {
        name: "GitHub",
        user: "@itsmail",
        href: "https://github.com/itzmail",
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
    },
    {
        name: "LinkedIn",
        user: "Ismail Alam",
        href: "https://www.linkedin.com/in/ismail-alam-3a6490230/",
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-plain.svg",
    },
    {
        name: "Twitter",
        user: "@itzmail_dev",
        href: "https://x.com/itsmail_ok",
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/twitter/twitter-original.svg",
    },
];

export const footerData = {
    logoBracketLeft: "[",
    logoName: "itsmail",
    logoDot: ".",
    logoDomain: "dev",
    logoBracketRight: "]",
    author: "Ismail Alam",
    builtWith: "Astro",
    builtWithSuffix: ", vanilla CSS & ☕",
};
