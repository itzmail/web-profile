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

export interface ApiProjectLink {
    url: string;
    label: string;
}

export interface ApiProject {
    title: string;
    description: string;
    web_profile: {
        data: {
            stack: string[];
            accent: string;
            links: ApiProjectLink[];
        };
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

export interface MasterSkillItem {
    id: string;
    key: string;
    value: string;
    metadata: {
        icon: string;
        category: string;
    };
    order: number;
}

export interface SkillGroup {
    category: string;
    items: MasterSkillItem[];
}

export interface ApiSocial {
    title: string;
    web_profile: {
        data: {
            href: string;
            user: string;
            icon_key: string;
        };
    };
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
