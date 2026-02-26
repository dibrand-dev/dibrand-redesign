
export interface Dictionary {
    navigation: {
        home: string;
        services: string;
        successCases: string;
        softwareDevelopment: string;
        staffAugmentation: string;
        portfolio: string;
        aboutUs: string;
        careers: string;
        contact: string;
        scheduleCall: string;
        conversionHook: string;
        conversionCta: string;
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
            submit: string;
            sending: string;
            success: string;
            error: string;
        };
    };
    staffAugmentation: {
        hero: {
            title: string;
            subtitle: string;
            cta: string;
        };
        whatIs: {
            title: string;
            content: string;
        };
        benefits: {
            items: Array<{ title: string; desc: string }>;
        };
        process: {
            steps: Array<{ title: string; desc: string }>;
            cta: string;
        };
    };
}
