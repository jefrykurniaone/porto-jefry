export interface SkillCategory {
    category: string;
    skills: string[];
}

export const skillCategories: SkillCategory[] = [
    {
        category: 'Backend',
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
        category: 'Frontend',
        skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'jQuery', 'AJAX'],
    },
    {
        category: 'Database',
        skills: ['Microsoft SQL Server', 'MySQL', 'SSIS', 'SSRS'],
    },
    {
        category: 'AI & Emerging Tech',
        skills: ['Python', 'Semantic Kernel', 'OpenAI API', 'Azure OpenAI', 'LLM Integration'],
    },
    {
        category: 'CMS & Platforms',
        skills: ['Sitefinity'],
    },
    {
        category: 'Tools & DevOps',
        skills: ['Git', 'Docker', 'Swagger / OpenAPI', 'Postman', 'Azure VM', 'Azure DevOps', 'IIS', 'Katalon'],
    },
];
