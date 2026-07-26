export interface SkillCategory {
    category: string;
    /** Shipped to production in a role or project listed on this site. */
    skills: string[];
    /** Used in personal or side work, but not yet backed by listed work. */
    working?: string[];
}

// Ordered by hiring signal: the .NET/data core first, AI workflow last.
export const skillCategories: SkillCategory[] = [
    {
        category: 'backend',
        skills: [
            '.NET',
            '.NET Framework',
            'ASP.NET MVC',
            'ASP.NET Web Forms',
            'ASP.NET Web API',
            'REST API Design',
            'C#',
            'VB.NET',
            'PHP',
            'CodeIgniter',
        ],
        working: ['.NET 6 / 7 / 8', 'Node.js'],
    },
    {
        category: 'database',
        skills: ['Microsoft SQL Server', 'MySQL', 'SSIS', 'SSRS'],
    },
    {
        // TypeScript/React/Next.js are production-backed by the Porto-Jefry
        // project entry, which ships this site and its PDF CV renderer.
        category: 'frontend',
        skills: [
            'HTML',
            'CSS',
            'JavaScript',
            'TypeScript',
            'React',
            'Next.js',
            'jQuery',
            'AJAX',
        ],
    },
    {
        category: 'cms_platforms',
        skills: ['Sitefinity', 'Sitecore'],
    },
    {
        category: 'tools_devops',
        skills: [
            'Git',
            'Visual Studio',
            'VS Code',
            'SSMS',
            'Postman',
            'IIS',
            'Azure VM',
        ],
        working: ['Swagger / OpenAPI', 'Azure DevOps', 'AWS'],
    },
    {
        category: 'ai_workflow',
        skills: ['Claude', 'GitHub Copilot', 'OpenCode'],
    },
];
