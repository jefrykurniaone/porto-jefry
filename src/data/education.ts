export interface EducationItem {
    institution: string;
    degree: string;
    major?: string;
    period: string;
    gpa?: string;
    type: 'formal' | 'informal';
}

export const education: EducationItem[] = [
    {
        institution: 'Widyatama University',
        degree: "Bachelor's",
        major: 'Information Systems',
        period: '2018 – 2020',
        gpa: '3.63 / 4.00',
        type: 'formal',
    },
    {
        institution: 'Telkom University',
        degree: 'Diploma',
        major: 'Informatics Management',
        period: '2013 – 2017',
        gpa: '3.26 / 4.00',
        type: 'formal',
    },
    {
        institution: 'SMAN 03 Kayuagung',
        degree: 'Senior High School',
        period: '2010 – 2013',
        type: 'formal',
    },
    {
        institution: 'Coding.ID',
        degree: '.NET Programmer Class',
        period: 'Nov 2019 – Jan 2020',
        type: 'informal',
    },
];
