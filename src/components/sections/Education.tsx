import { useTranslations } from "next-intl";
import { education } from "@/data/education";
import { GraduationCapIcon } from "lucide-react";

export default function Education() {
  const t = useTranslations("education");

  const formal = education.filter((e) => e.type === "formal");
  const informal = education.filter((e) => e.type === "informal");

  return (
    <section id="education" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          {t("title")}
        </h2>

        <div className="space-y-10">
          {/* Formal */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <GraduationCapIcon size={20} className="text-blue-500" />
              {t("formal")}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {formal.map((edu, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                >
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">
                    {edu.period}
                  </p>
                  <h4 className="text-gray-900 dark:text-white font-semibold">
                    {edu.institution}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {edu.degree}
                    {edu.major && ` — ${edu.major}`}
                  </p>
                  {edu.gpa && (
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                      {t("gpa")}: {edu.gpa}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Informal */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <GraduationCapIcon size={20} className="text-blue-500" />
              {t("informal")}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {informal.map((edu, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                >
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">
                    {edu.period}
                  </p>
                  <h4 className="text-gray-900 dark:text-white font-semibold">
                    {edu.institution}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {edu.degree}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
