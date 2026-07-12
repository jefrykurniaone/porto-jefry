export interface EducationItem {
    /** Maps to i18n key: education.items.{id}.degree */
    id: string;
    institution: string;
    degree: string;
    major?: string;
    period: string;
    gpa?: string;
    type: 'formal' | 'informal';
}

export const education: EducationItem[] = [
    {
        id: 'widyatama',
        institution: 'Widyatama University',
        degree: "Bachelor's",
        major: 'Information Systems',
        period: '2018 – 2020',
        gpa: '3.63 / 4.00',
        type: 'formal',
    },
    {
        id: 'telkom',
        institution: 'Telkom University',
        degree: 'Diploma',
        major: 'Informatics Management',
        period: '2013 – 2017',
        gpa: '3.26 / 4.00',
        type: 'formal',
    },
    {
        id: 'sman03',
        institution: 'SMAN 03 Kayuagung',
        degree: 'Senior High School',
        period: '2010 – 2013',
        type: 'formal',
    },
    {
        id: 'coding_id',
        institution: 'Coding.ID',
        degree: '.NET Programmer Class',
        period: 'Nov 2019 – Jan 2020',
        type: 'informal',
    },
];
