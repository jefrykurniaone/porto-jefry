import { useTranslations } from "next-intl";
import { MailIcon, PhoneIcon } from "lucide-react";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";

export default function Contact() {
  const t = useTranslations("contact");

  const links = [
    {
      label: t("email_label"),
      href: "mailto:jefrykurniaone@gmail.com",
      value: "jefrykurniaone@gmail.com",
      icon: <MailIcon size={20} />,
      external: false,
    },
    {
      label: t("phone_label"),
      href: "tel:+6282126229978",
      value: "0821 26 229 978",
      icon: <PhoneIcon size={20} />,
      external: false,
    },
    {
      label: t("linkedin_label"),
      href: "https://www.linkedin.com/in/jefrykurniaone/",
      value: "linkedin.com/in/jefrykurniaone",
      icon: <LinkedInIcon size={20} />,
      external: true,
    },
  ];

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
          {t("description")}
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 group"
            >
              <span className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
              <span className="font-medium text-gray-900 dark:text-white text-sm">
                {link.label}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 break-all">
                {link.value}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
