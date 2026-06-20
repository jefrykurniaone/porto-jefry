export interface SkillCategory {
    category: string;
    skills: string[];
}

export const skillCategories: SkillCategory[] = [
    {
        category: 'backend',
        skills: [
            '.NET',
            '.NET Framework',
            '.NET 6 / 7 / 8',
            'ASP.NET MVC',
            'ASP.NET Web Forms',
            'ASP.NET Web API',
            'REST API Design',
            'C#',
            'VB.NET',
            'Node.js',
            'PHP',
            'CodeIgniter',
        ],
    },
    {
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
        category: 'database',
        skills: ['Microsoft SQL Server', 'MySQL', 'SSIS', 'SSRS'],
    },
    {
        category: 'ai_emerging',
        skills: [
            'Python',
            'Claude',
            'GitHub Copilot',
            'OpenCode',
            'LLM Integration',
        ],
    },
    {
        category: 'cms_platforms',
        skills: ['Sitefinity'],
    },
    {
        category: 'tools_devops',
        skills: [
            'Git',
            'Visual Studio',
            'VS Code',
            'SSMS',
            'Swagger / OpenAPI',
            'Postman',
            'Azure VM',
            'Azure DevOps',
            'IIS',
            'Katalon',
        ],
    },
];
