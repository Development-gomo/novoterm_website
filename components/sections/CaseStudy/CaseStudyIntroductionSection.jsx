
import Image from "next/image";
import { useRouter } from "next/router";
import DotIndicator from "../../ui/DotIndicator";
import { DEFAULT_LANG } from "../../../lib/api";

const formatLabel = (layout) => {
  if (!layout) return null;
  return layout
    .replace(/_section$/, '')
    .replace(/^(services?_|casestudy_|blog_|industry_)/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function CaseStudyIntroductionSection({
  section,
  sectionId,
  index = 0,
  postAcf,
}) {

  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const t = (sv, en) => lang === "sv" ? sv : en;

  if (!section) return null;

  const {
    section_label,
    heading,
    sub_heading,
    company_logo,
    left_title,
    left_content,
    client,
    industry,
    services,
  } = section;

  const time_text = postAcf?.time_text;
  const subtext = postAcf?.subtext;
  const service_title = postAcf?.service_title;
  const service_used = postAcf?.service_used;

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section
      id={sectionId}
      className="w-full bg-[#EAF1FF] py-6 md:py-8 lg:py-[100px]"
    >
      <div className="web-width mx-auto px-6 md:px-0">

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">

          {/* LEFT LABEL */}
          <div className="lg:w-[15%] relative">
            {(section_label || section?.acf_fc_layout) && (
              <div className="flex items-center gap-2 text-[#0A1A3A] mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat text-[#061837] font-medium text-[10px] tracking-wider">
                  {section_label || formatLabel(section?.acf_fc_layout)}
                </span>
              </div>
            )}
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:w-[85%]">


            {/* HEADING */}
            {heading && (
              <h2
                className="
                  font-heading font-semibold text-[#061837]
                  text-[28px]
                  sm:text-[34px]
                  md:text-[40px]
                  lg:text-[48px]
                  leading-[36px]
                  sm:leading-[44px]
                  md:leading-[52px]
                  lg:leading-[58px]
                  max-w-[1090px]
                  mb-4 lg:mb-6
                  [&_em]:text-[#2655C4]
                  [&_em]:italic
                  [&_em]:font-semibold
                "
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* SUB HEADING */}
            {sub_heading && (
              <div
                className="
                  text-[15px] md:text-[16px] leading-[1.5] text-[#000000] space-y-4  leading-relaxed [&_a]:text-[#2655c4] [&_a]:underline
                          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:marker:text-[#2655c4]
                          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:marker:text-[#2655c4]
                          [&_li]:mb-1 [&_p]:mb-2
                          [&_br]:block [&_br]:content-[''] [&_br]:mb-2
                          [&_strong]:font-semibold [&_em]:italic
                "
                dangerouslySetInnerHTML={{ __html: sub_heading }}
              />
            )}


            {/* CONTENT + INFO CARD */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-[48px] mt-8 items-start">

              {/* LEFT TEXT */}
              <div className="w-full lg:flex-[682px] max-w-full">

                {left_title && (
                  <h3 className="text-[24px] leading-[48px] font-semibold text-[#061837]">
                    {left_title}
                  </h3>
                )}

                {left_content && (
                  <div
                    className="text-[15px] md:text-[16px] leading-[1.5] text-[#000000] space-y-4"
                    dangerouslySetInnerHTML={{ __html: left_content }}
                  />
                )}

                
            {/* COMPANY LOGO */}
            {company_logo && (() => {
              const logoUrl = typeof company_logo === "string" ? company_logo : company_logo?.url;
              return logoUrl ? (
                <div className="mt-6">
                  <Image
                    src={logoUrl}
                    alt={company_logo?.alt || "Company logo"}
                    width={company_logo?.width || 200}
                    height={company_logo?.height || 80}
                    className="object-contain h-[80px] w-auto max-w-[400px]"
                  />
                </div>
              ) : null;
            })()}
              </div>

              {/* RIGHT INFO CARD */}
              <div className="w-full lg:flex-[360px] bg-[#061837] text-white rounded-[3px] p-[24px] lg:p-[48px]
">


                {client && (
                  <div className="mb-8">
                    <p suppressHydrationWarning className="text-[14px] uppercase !font-montserrat font-medium tracking-[0.84px] text-[#5C83DD] mb-[8px]">
                      {t("KUND", "Client")}
                    </p>
                    <p className="text-[16px] leading-[24px] !font-normal">{client}</p>
                  </div>
                )}


                {time_text && (
                  <div className="mb-8">
                    <p suppressHydrationWarning className="text-[14px] uppercase font-normal tracking-[0.84px] text-[#5C83DD] mb-[8px]">
                      {time_text}
                    </p>
                    <p className="text-[16px] leading-[24px] font-medium">{subtext}</p>
                  </div>
                )}


                {service_title && (
                  <div>
                    <p suppressHydrationWarning className="text-[14px] uppercase font-normal tracking-[0.84px] text-[#5C83DD] mb-[8px]">
                      {service_title}
                    </p>
                    <p className="text-[16px] leading-[24px] font-medium">{service_used}</p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
