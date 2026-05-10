import { useTranslations } from "next-intl";
import { AwardIcon } from "lucide-react";

export default function Certifications() {
  const t = useTranslations("certifications");

  return (
    <section id="certifications" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          {t("title")}
        </h2>
        <div className="max-w-md mx-auto">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex gap-4">
            <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/50 shrink-0 h-fit">
              <AwardIcon size={24} className="text-yellow-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t("coding_id.name")}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                {t("coding_id.issuer")}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                {t("coding_id.period")}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                {t("coding_id.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
