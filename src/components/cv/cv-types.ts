export interface Messages {
    hero: { name: string; title: string };
    about: {
        title: string;
        /** Paragraphs. One string per rendered <Text> / <p> in both renderers. */
        description: string[];
        contact_email: string;
        contact_phone: string;
        contact_linkedin: string;
    };
    experience: {
        title: string;
        present: string;
        items: Record<string, { bullets: string[] }>;
    };
    /**
     * `combined_title` and `kind_cert`, not `title`: the CV folds the one
     * certification into this section exactly as the site does, so both
     * renderers print "Education & Certification" over the same two groups.
     */
    education: {
        combined_title: string;
        formal: string;
        kind_cert: string;
        gpa: string;
    };
    skills: {
        title: string;
        categories: Record<string, string>;
        working_note: string;
    };
    projects: {
        title: string;
        present: string;
        /**
         * The two group headings, PDF-only. The site says "Live public work" /
         * "Internal systems" over a grid and a disclosure; on paper both groups
         * are always visible and there is no note line under them, so the
         * heading itself has to carry why one half has no links.
         */
        cv_group_public: string;
        cv_group_internal: string;
        items: Record<string, { description: string; company?: string }>;
    };
    certifications: {
        title: string;
        coding_id: { name: string; issuer: string; period: string; description: string };
    };
}

export interface CvDocumentProps {
    messages: Messages;
    photoSrc?: string;
    locale?: string;
}
