export interface ProjectItem {
    id: string;
    name: string;
    company: string;
    period: string;
    tech: string[];
    description?: string;
    url?: string;
}

const TECH_SITEFINITY_DOTNET: string[] = [
    'Sitefinity',
    'C#',
    '.NET Framework MVC',
    'HTML',
    'CSS',
    'JavaScript',
    'SQL Server',
];

const TECH_VBNET_WEBFORMS: string[] = [
    'VB.NET',
    'ASP.NET Web Forms',
    'SSRS',
    'SSIS',
    'HTML',
    'CSS',
    'JavaScript',
    'SQL Server',
    'GIT',
];

export const projects: ProjectItem[] = [
    {
        id: 'heritagesg-website-maintenance',
        name: 'HeritageSG Website Maintenance',
        company: 'PT Xtremax Teknologi Indonesia',
        period: 'Mar 2026 – Present',
        tech: [
            'Sitecore',
            'C#',
            '.NET Framework MVC',
            'HTML',
            'CSS',
            'JavaScript',
            'SQL Server',
        ],
    },
    {
        id: 'yellow-ribbon-singapore-website',
        name: 'Yellow Ribbon Singapore Website',
        company: 'PT Xtremax Teknologi Indonesia',
        period: 'Jul 2025 – Present',
        tech: TECH_SITEFINITY_DOTNET,
    },
    {
        id: 'public-service-commission-website',
        name: 'Public Service Commission Website',
        company: 'PT Xtremax Teknologi Indonesia',
        period: 'Nov 2022 – Aug 2023',
        tech: TECH_SITEFINITY_DOTNET,
    },
    {
        id: 'agency-for-science-technology-and-research',
        name: 'Agency for Science, Technology and Research',
        company: 'PT Xtremax Teknologi Indonesia',
        period: 'Feb 2023 – Aug 2023',
        tech: TECH_SITEFINITY_DOTNET,
    },
    {
        id: 'defense-science-and-technology-agency',
        name: 'Defense Science and Technology Agency',
        company: 'PT Xtremax Teknologi Indonesia',
        period: 'Mar 2023 – Aug 2023',
        tech: TECH_SITEFINITY_DOTNET,
    },
    {
        id: 'unpacking-direction-ttlc',
        name: 'Unpacking Direction TTLC',
        company: 'PT Arkamaya',
        period: 'Dec 2024 – Jul 2025',
        tech: [
            'PHP',
            'CodeIgniter',
            'jQuery',
            'AJAX',
            'HTML',
            'CSS',
            'JavaScript',
            'MySQL',
            'GIT',
        ],
    },
    {
        id: 'sustainability-tam-event-management',
        name: 'Sustainability TAM (Event Management)',
        company: 'PT Arkamaya',
        period: 'Dec 2024 – Jul 2025',
        tech: [
            'C#',
            'ASP.NET MVC',
            'HTML',
            'CSS',
            'JavaScript',
            'jQuery',
            'AJAX',
            'SQL Server',
            'GIT',
            'NUnit',
        ],
    },
    {
        id: 'hris-job-tomori',
        name: 'HRIS JOB Tomori',
        company: 'PT Arkamaya',
        period: 'Dec 2024 – Jul 2025',
        tech: [
            'C#',
            'ASP.NET MVC',
            'HTML',
            'CSS',
            'JavaScript',
            'jQuery',
            'AJAX',
            'SQL Server',
            'GIT',
            'ASP.NET API',
            'XML SOAP API',
        ],
    },
    {
        id: 'trainer-tdk-framework-tmmin',
        name: 'Trainer TDK Framework TMMIN',
        company: 'PT Arkamaya',
        period: 'Dec 2024 – Jul 2025',
        tech: [
            'C#',
            'ASP.NET MVC',
            'HTML',
            'CSS',
            'JavaScript',
            'jQuery',
            'AJAX',
            'SQL Server',
        ],
    },
    {
        id: 'rbbr-super-bank',
        name: 'RBBR Super Bank',
        company: 'PT Nawa Data Solutions',
        period: 'Oct 2023 – Jul 2024',
        tech: TECH_VBNET_WEBFORMS,
    },
    {
        id: 'oprisk-super-bank',
        name: 'OPRISK Super Bank',
        company: 'PT Nawa Data Solutions',
        period: 'May 2024 – Jul 2024',
        tech: TECH_VBNET_WEBFORMS,
    },
    {
        id: 'orms-adira-insurance',
        name: 'ORMS Adira Insurance',
        company: 'PT Nawa Data Solutions',
        period: 'Feb 2020 – Nov 2022',
        tech: TECH_VBNET_WEBFORMS,
    },
    {
        id: 'orms-btpn',
        name: 'ORMS BTPN',
        company: 'PT Nawa Data Solutions',
        period: 'Feb 2020 – Nov 2022',
        tech: TECH_VBNET_WEBFORMS,
    },
    {
        id: 'nawa-point-web-application',
        name: 'Nawa Point Web Application',
        company: 'Coding.ID',
        period: 'Jan 2020',
        tech: ['C#', 'ASP.NET MVC (.NET Framework)', 'SQL Server'],
    },
];
