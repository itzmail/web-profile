export interface ApiProjectLink {
    url: string;
    label: string;
}

export interface ApiProject {
    id: string;
    title: string;
    description: string;
    web_profile: {
        is_highlighted: boolean;
        data: {
            slug: string;
            stack: string[];
            accent: string;
            images: string[];
            content: string;
            links: ApiProjectLink[];
            is_open_source: boolean;
            project_type: 'production' | 'client_work' | 'side_project';
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
    is_highlighted: boolean;
    is_open_source: boolean;
    project_type: 'production' | 'client_work' | 'side_project';
}

export interface ApiSettings {
    available_for_work: string;
    profile_name: string;
    profile_bio: string;
    profile_location: string;
    profile_email: string;
}

export interface ApiStats {
    years_exp: string;
    total_projects: number;
    prod_apps: number;
    open_source: number;
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

export interface ApiCertificate {
    id: string;
    title: string;
    description: string;
    is_active: number;
    order: number;
    web_profile: {
        data: {
            slug: string;
            issuer: string;
            issued_at: string;
            expired_at: string | null;
            credential_id: string | null;
            credential_url: string | null;
            category: string | null;
            file_url: string | null;
            file_type: "pdf" | "image" | null;
        };
    };
}
