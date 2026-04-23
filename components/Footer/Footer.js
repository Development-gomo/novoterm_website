
import Image from "next/image";
import Link from "next/link";
import { wpToPath, DEFAULT_LANG } from "../../lib/api";
import { useRouter } from "next/router";


export default function Footer({ data }) {
  const router = useRouter();
  const lang = router?.locale || DEFAULT_LANG;
  if (!data) return null;

  const { cta, services, quick, resources, contact, branding } = data;
  const t = {
    resources: lang === "sv" ? "Utforska" : "Explore",
    contact: lang === "sv" ? "Kontakta oss" : "CONTACT",
    services: lang === "sv" ? "TJÄNSTER" : "SERVICES",
    quickLinks: lang === "sv" ? "SNABBLÄNKAR" : "QUICK LINKS",
  };

  return (
    <footer className="w-full bg-[#061837] text-white pt-10  sm:pt-12 md:pt-16 lg:pt-[80px]">
      <div className="web-width mx-auto px-6 md:px-0">

        {/* ROW 1 — Custom Width Columns */}
        <div className="flex flex-wrap lg:flex-nowrap gap-12">

          {/* COLUMN 1 — CTA (40%) */}
          <div className="w-full lg:w-[616px]">
            <h2 className="text-[36px] md:text-[40px] font-semibold leading-[1.3] mb-8 text-white">
              {cta?.cta_heading}
            </h2>

            {/* CTA BUTTON + SOCIAL */}
            <div className="flex items-center gap-4 mb-8">
              {cta?.cta_button_link && cta?.cta_button_text && (
                <Link href={wpToPath(cta.cta_button_link, lang)} className="btn-primary">
                  {cta.cta_button_text}
                </Link>
              )}

              <div className="flex items-center gap-3">
                {cta?.social_links?.map((item, i) => (
                 <a key={i} href={item.url} target="_blank">
                    <div className="
                        w-[32px] h-[32px] rounded-[2px] bg-white 
                        flex items-center justify-center
                        hover:bg-opacity-80 transition
                        "
                    >
                        <Image
                        src={item.icon}
                        alt="social icon"
                        width={18}
                        height={18}
                        className="object-contain"
                        />
                    </div>
                    </a>

                ))}
              </div>
            </div>

            <p className="text-white/40 text-[14px] leading-relaxed" dangerouslySetInnerHTML={{ __html: branding?.copyright_text || '' }} />
          </div>

          {/* COLUMN 2 — SERVICES (15%) */}
          <div className="w-full lg:w-[14%]">
            <p className="uppercase text-[14px] font-montserrat font-medium tracking-wider text-[#5C83DD] mb-4">
              {t.services}
            </p>
            <ul className="space-y-2">
              {services?.service_links?.map((item, i) => (
                <li key={i}>
                  <Link href={wpToPath(item.url, lang)} className="text-white hover:text-[#5C83DD] text-[16px] font-normal">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3 — QUICK LINKS (15%) */}
          <div className="w-full lg:w-[14%]">
            <p className="uppercase text-[14px] font-montserrat font-medium tracking-wider text-[#5C83DD] mb-4">
              {t.quickLinks}
            </p>
            <ul className="space-y-2">
              {quick?.quick_links?.map((item, i) => (
                <li key={i}>
                  <Link href={wpToPath(item.url, lang)} className="text-white hover:text-[#5C83DD] text-[16px] font-normal">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4 — RESOURCES (15%) */}
          <div className="w-full lg:w-[12%]">
            <p className="uppercase text-[14px] font-montserrat font-medium tracking-wider text-[#5C83DD] mb-4">
              {t.resources}
            </p>
            <ul className="space-y-2">
              {resources?.resource_links?.map((item, i) => (
                <li key={i}>
                  <Link href={wpToPath(item.url, lang)} className="text-white hover:text-[#5C83DD] text-[16px] font-normal">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 5 — CONTACT (15%) */}
          <div className="w-full lg:w-[17%]">
            <p className="uppercase text-[14px] font-montserrat font-medium tracking-wider text-[#5C83DD] mb-4">
              {t.contact}
            </p>

            <div
              className="text-white hover:text-[#5C83DD] text-[16px] font-normal mb-3"
              dangerouslySetInnerHTML={{ __html: contact?.address }}
            />

            {contact?.email && (
              <p className="mb-1">
                <Link href={`mailto:${contact.email}`} className="text-white hover:text-[#5C83DD] text-[16px] font-normal">
                  {contact.email}
                </Link>
              </p>
            )}

            {contact?.phone && (
              <p>
                <Link href={`tel:${contact.phone}`} className="text-white hover:text-[#5C83DD] text-[16px] font-normal">
                  {contact.phone}
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* ROW 2 — LOGO CENTERED */}
        {branding?.footer_logo_large && (
          <div className="mt-20 w-full">
            <Image
              src={branding.footer_logo_large}
              alt="Footer Logo"
              width={1440}
              height={208}
              sizes="100vw"
              className="block h-auto w-full max-w-none object-contain"
            />
          </div>
        )}

      </div>
    </footer>
  );
}
