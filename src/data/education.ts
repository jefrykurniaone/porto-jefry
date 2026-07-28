/**
 * Formal education only. Certifications are NOT listed here — they live in
 * `messages.certifications` and are rendered from there by both the Education
 * section and the PDF's Certifications block. Adding one back to this array
 * prints it twice in the CV.
 */
export interface EducationItem {
    /** Maps to i18n key: education.items.{id}.degree */
    id: string;
    institution: string;
    degree: string;
    major?: string;
    period: string;
    gpa?: string;
}

export const education: EducationItem[] = [
    {
        id: 'widyatama',
        institution: 'Widyatama University',
        degree: "Bachelor's",
        major: 'Information Systems',
        period: '2018 – 2020',
        gpa: '3.63 / 4.00',
    },
    {
        id: 'telkom',
        institution: 'Telkom University',
        degree: 'Diploma',
        major: 'Informatics Management',
        period: '2013 – 2017',
        gpa: '3.26 / 4.00',
    },
];
