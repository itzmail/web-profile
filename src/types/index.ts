export interface ApiProjectLink {
    url: string;
    label: string;
}

export interface ApiProject {
    id: string;
    title: string;
    description: string;
    web_profile: {
        data: {
            slug: string;
            stack: string[];
            accent: string;
            images: string[];
            content: string;
            links: ApiProjectLink[];
        };
    };
}

export interface Project {
    id: string;
    slug: string;
    name: string;
    desc: string;
    stack: string[];
    accent: string;
    images: string[];
    content: string;
    links: ApiProjectLink[];
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
    iconUrl: string;
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
            icon_url: string;
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
