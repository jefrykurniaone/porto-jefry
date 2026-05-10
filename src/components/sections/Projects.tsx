import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { FolderIcon } from "lucide-react";

export default function Projects() {
  const t = useTranslations("projects");

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          {t("title")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <div
              key={i}
              className="flex flex-col p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 shrink-0">
                  <FolderIcon
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {project.company}
                  </p>
                </div>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-3">
                {project.period}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.tech.slice(0, 6).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 6 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    +{project.tech.length - 6}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
