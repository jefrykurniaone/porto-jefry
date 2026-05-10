export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  tech?: string[];
}

export const experiences: ExperienceItem[] = [
  {
    company: "PT Xtremax Teknologi Indonesia",
    role: "Software Developer I - Backend",
    period: "Jul 2025 – Present",
    location: "Indonesia",
    bullets: [
      "Designing and developing backend systems for dynamic, high-performance applications, ensuring seamless integration with front-end systems.",
      "Customizing and optimizing Sitefinity CMS features to deliver high-quality client solutions.",
      "Developing RESTful APIs and integrating third-party services to enhance client website functionality.",
      "Optimizing SQL queries and ensuring efficient database interactions for large data volumes.",
      "Conducting thorough unit tests and resolving issues promptly to maintain application stability and quality.",
      "Working with cross-functional teams to meet project requirements and deliver exceptional user experiences.",
    ],
    tech: ["C#", ".NET", "Sitefinity", "SQL Server", "RESTful API"],
  },
  {
    company: "PT Arkamaya",
    role: "Staff Programmer",
    period: "Dec 2024 – Jul 2025",
    location: "Indonesia",
    bullets: [
      "Building and developing software applications according to project needs, ensuring efficiency, security, and maintainability.",
      "Performing routine maintenance and updating existing systems to improve performance and ensure compatibility with the latest technologies.",
      "Conducting unit testing, debugging, and code optimization to ensure applications run smoothly and are free from bugs.",
      "Working collaboratively with other development teams, both internal and external, to create high-quality software solutions.",
      "Creating clear and detailed technical documentation for each developed application.",
      "Managing and optimizing database usage for efficient data handling and developing queries to support application needs.",
      "Addressing technical issues that arise during development or maintenance and providing effective and swift solutions.",
    ],
    tech: ["C#", "ASP.NET MVC", "PHP", "CodeIgniter", "SQL Server", "MySQL", "jQuery", "AJAX", "GIT"],
  },
  {
    company: "PT Nawa Data Solutions",
    role: "Technical Lead",
    period: "Jan 2024 – Jul 2024",
    location: "Indonesia",
    bullets: [
      "Managed teams of developers on technical aspects to ensure projects are delivered on time and within budget.",
      "Organized technical work by breaking it down into tasks and distributing them to the rest of the team.",
      "Helped on project plans and timelines in coordination with PM or Product Owner.",
      "Assisted in system design creation in coordination with BA.",
      "Created technical specification documents in coordination with BA based on functional specification documents (FSD).",
      "Led technical design meetings and tech breakdowns.",
      "Performed code review on pull/merge requests using GIT.",
      "Ensured best practices are implemented and followed.",
      "Deployed applications to IIS in Development/Testing Server (Windows Server in Azure VM).",
    ],
    tech: ["VB.NET", "ASP.NET Web Forms", "SSRS", "SSIS", "SQL Server", "GIT"],
  },
  {
    company: "PT Nawa Data Solutions",
    role: ".NET Developer – OneRisk Engineer",
    period: "Oct 2023 – Jan 2024",
    location: "Indonesia",
    bullets: [
      "Created functional specification documents in coordination with BA based on RED (Requirement Elicitation Document).",
      "Developed, analyzed, and tested software that meets requirements on system design.",
      "Inspected software defects in active systems.",
      "Tested and fixed production issues in active systems.",
      "Attended meetings and explained the technical breakdown of proposed solutions.",
      "Created deployment guideline documents.",
    ],
    tech: ["VB.NET", "ASP.NET Web Forms", "SSRS", "SSIS", "SQL Server", "GIT"],
  },
  {
    company: "PT Xtremax Teknologi Indonesia",
    role: "Associate Software Engineer (.NET)",
    period: "Nov 2022 – Aug 2023",
    location: "Indonesia",
    bullets: [
      "Created functional specification documents in coordination with BA based on RED.",
      "Developed, analyzed, and tested software meeting system design requirements.",
      "Inspected software defects and fixed production issues in active systems.",
      "Attended meetings and explained the technical breakdown of proposed solutions.",
      "Created deployment guideline documents and updated daily task reports.",
    ],
    tech: ["C#", "Sitefinity", ".NET Framework MVC", "HTML", "CSS", "JavaScript", "SQL Server"],
  },
  {
    company: "PT Nawa Data Solutions",
    role: ".NET Developer",
    period: "Feb 2020 – Nov 2022",
    location: "Indonesia",
    bullets: [
      "Coded high-quality programs that meet requirements on system design and follow best practices.",
      "Automated testing using Katalon.",
    ],
    tech: ["VB.NET", "ASP.NET Web Forms", "SSRS", "SSIS", "SQL Server", "GIT", "Katalon"],
  },
];
