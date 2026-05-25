export interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    period: string;
    location: string;
    tech?: string[];
}

export const experiences: ExperienceItem[] = [
    {
        id: 'xtremax-2025',
        company: 'PT Xtremax Teknologi Indonesia',
        role: 'Software Developer I - Backend',
        period: 'Jul 2025 – Present',
        location: 'Indonesia',
        tech: ['C#', '.NET', 'Sitefinity', 'SQL Server', 'RESTful API'],
    },
    {
        id: 'arkamaya-2024',
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
        id: 'nawa-lead-2024',
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
        id: 'nawa-onerisk-2023',
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
        id: 'xtremax-2022',
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
        id: 'nawa-2020',
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
