
export interface Dictionary {
    navigation: {
        home: string;
        services: string;
        successCases: string;
        staffAugmentation: string;
        softwareOutsourcing: string;
        portfolio: string;
        aboutUs: string;
        careers: string;
        contact: string;
        aiWorkflows: string;
        strategicArchitecture: string;
        softwareDevelopment: string;
        scheduleCall: string;
        conversionHook: string;
        conversionCta: string;
    };
    footer: {
        title1: string;
        title2: string;
        subtitle: string;
        phones?: string;
        expertise?: string;
        company?: string;
        work?: string;
    };
    home: {
        hero: {
            title: string;
            subtitle: string;
            cta: string;
            welcome: string;
        };
        whatWeDo: {
            title: string;
            subtitle: string;
            description: string;
            tagline: string;
        };
        stats: {
            trustLabel: string;
            items: Array<{ label: string; value: string }>;
        };
        services: {
            title: string;
            items: Array<{ title: string; desc: string }>;
        };
    };
    contact: {
        title: string;
        form: {
            name: string;
            lastName: string;
            email: string;
            company: string;
            message: string;
            emailPlaceholder: string;
            messagePlaceholder: string;
            submit: string;
            sending: string;
            success: string;
            error: string;
        };
    };
    staffAugmentation: {
        hero: {
            title: string;
            subtitle1: string;
            subtitle2: string;
            cta: string;
        };
        whatIs: {
            title: string;
            content: string;
        };
        pillars: {
            items: Array<{ title: string; desc: string }>;
            lema: string;
        };
        process: {
            steps: Array<{ title: string; desc: string }>;
            cta: string;
        };
        roles: {
            title: string;
            items: Array<{ title: string; desc: string }>;
        };
        theDibrandWay: {
            title: string;
            items: Array<{ title: string; desc: string }>;
        };
    };
    softwareOutsourcing: {
        hero: {
            title: string;
            subtitle: string;
            cta: string;
        };
        pillars: {
            items: Array<{ title: string; desc: string }>;
            lema: string;
        };
        process: {
            title: string;
            subtitle: string;
            steps: Array<{ title: string; desc: string }>;
        };
    };
    softwareDevelopment: {
        hero: {
            title: string;
            subtitle: string;
            cta: string;
        };
        services: {
            title: string;
            items: Array<{ title: string; desc: string }>;
        };
        advantage: {
            title: string;
            items: Array<{ title: string }>;
        };
        finalCta: {
            title: string;
            cta: string;
        };
    };
}
