export interface Project {
    name: string;
    desc: string;
    stack: string[];
    accent: string;
    links: {
        github: string;
        live: string;
    };
}

export interface ExperienceWebProfile {
    date: string;
    accent: string;
    company: string;
}

export interface Experience {
    title: string;
    description: string;
    web_profile: {
        data: ExperienceWebProfile;
    };
}

export interface Social {
    name: string;
    user: string;
    href: string;
    iconKey: string;
}

export interface WakatimeLanguage {
    name: string;
    percent: number;
}

export interface WakatimeStats {
    languages: WakatimeLanguage[];
    human_readable_total_including_other_language: string;
    human_readable_daily_average: string;
}
