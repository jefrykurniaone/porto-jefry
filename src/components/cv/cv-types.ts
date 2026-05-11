export interface Messages {
    hero: { name: string; title: string };
    about: {
        title: string;
        description: string;
        contact_email: string;
        contact_phone: string;
        contact_linkedin: string;
    };
    experience: { title: string; present: string };
    education: { title: string; formal: string; informal: string; gpa: string };
    skills: { title: string };
    projects: { title: string };
    certifications: {
        title: string;
        coding_id: { name: string; issuer: string; period: string; description: string };
    };
}

export interface CvDocumentProps {
    messages: Messages;
    photoSrc?: string;
}
