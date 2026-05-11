export interface ExperienceItem {
    company: string;
    role: string;
    period: string;
    location: string;
    tech?: string[];
}

export const experiences: ExperienceItem[] = [
    {
        company: 'PT Xtremax Teknologi Indonesia',
        role: 'Software Developer I - Backend',
        period: 'Jul 2025 – Present',
        location: 'Indonesia',
        tech: ['C#', '.NET', 'Sitefinity', 'SQL Server', 'RESTful API'],
    },
    {
        company: 'PT Arkamaya',
        role: 'Staff Programmer',
        period: 'Dec 2024 – Jul 2025',
        location: 'Indonesia',
        tech: [
            'C#',
            'ASP.NET MVC',
            'PHP',
            'CodeIgniter',
            'SQL Server',
            'MySQL',
            'jQuery',
            'AJAX',
            'GIT',
        ],
    },
    {
        company: 'PT Nawa Data Solutions',
        role: 'Technical Lead',
        period: 'Jan 2024 – Jul 2024',
        location: 'Indonesia',
        tech: [
            'VB.NET',
            'ASP.NET Web Forms',
            'SSRS',
            'SSIS',
            'SQL Server',
            'GIT',
        ],
    },
    {
        company: 'PT Nawa Data Solutions',
        role: '.NET Developer – OneRisk Engineer',
        period: 'Oct 2023 – Jan 2024',
        location: 'Indonesia',
        tech: [
            'VB.NET',
            'ASP.NET Web Forms',
            'SSRS',
            'SSIS',
            'SQL Server',
            'GIT',
        ],
    },
    {
        company: 'PT Xtremax Teknologi Indonesia',
        role: 'Associate Software Engineer (.NET)',
        period: 'Nov 2022 – Aug 2023',
        location: 'Indonesia',
        tech: [
            'C#',
            'Sitefinity',
            '.NET Framework MVC',
            'HTML',
            'CSS',
            'JavaScript',
            'SQL Server',
        ],
    },
    {
        company: 'PT Nawa Data Solutions',
        role: '.NET Developer',
        period: 'Feb 2020 – Nov 2022',
        location: 'Indonesia',
        tech: [
            'VB.NET',
            'ASP.NET Web Forms',
            'SSRS',
            'SSIS',
            'SQL Server',
            'GIT',
            'Katalon',
        ],
    },
];
