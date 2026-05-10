export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Backend",
    skills: [".NET", ".NET Framework", "ASP.NET", "ASP.NET MVC", "ASP.NET Web Forms", "ASP.NET API", "C#", "VB.NET", "PHP", "CodeIgniter"],
  },
  {
    category: "Frontend",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "jQuery", "AJAX"],
  },
  {
    category: "Database",
    skills: ["Microsoft SQL Server", "MySQL", "SSIS", "SSRS"],
  },
  {
    category: "CMS & Platforms",
    skills: ["Sitefinity"],
  },
  {
    category: "Tools & DevOps",
    skills: ["Git", "Katalon", "IIS", "Azure VM"],
  },
];
