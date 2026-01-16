import Link from "next/link";
import DotIndicator from "../../ui/DotIndicator";

export default function CaseStudyChallengeSection({ section }) {
  if (!section) return null;

  const { section_label, heading, description, image, challenges = [], cta_text, cta_url } = section;

  const imageUrl = typeof image === "string" ? image : image?.url || image?.sizes?.large || image?.sizes?.medium_large || "";

  return (
    <section className="w-full bg-[#061837] p-[80px]">
      <div className="mx-auto">
        <div className="flex gap-0">

          {/* LEFT – 15% */}
          <div className="w-[15%]">
            {section_label && (
              <div className="flex items-center gap-2 mt-2">
                <DotIndicator />
                <span className="uppercase font-montserrat font-medium text-[12px] tracking-widest text-white">{section_label}</span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2 className="max-w-[760px] font-heading font-semibold text-white text-[44px] leading-[1.25] mb-[24px]">
                {heading}
              </h2>
            )}

            {/* DESCRIPTION */}
            {description && (
              <div className="max-w-[520px] text-[15px] leading-[1.7] text-white mb-[56px]" dangerouslySetInnerHTML={{ __html: description }} />
            )}

            {/* CONTENT GRID */}
            <div className="grid grid-cols-[466px_1fr] gap-[80px] items-start">

              {/* IMAGE */}
              {imageUrl && (
                <div className="w-[466px] h-[553px] rounded-[3px] bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
              )}

              {/* CHALLENGES */}
              <div className="space-y-[32px]">

                <div className="space-y-[32px]">
                {challenges.map((item, index) => (
                    <div key={index}>

                    <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2655C4] text-white text-[12px] flex items-center justify-center font-medium mt-[2px]">
                        {index + 1}
                        </div>

                        <div>
                        <h4 className="text-[16px] font-semibold text-white mb-2">{item.title}</h4>
                        <p className="text-[14px] leading-[1.6] text-white">{item.content}</p>
                        </div>
                    </div>

                    {/* DIVIDER — ALWAYS SHOWN */}
                    <div className="w-full h-px bg-white/15 mt-[24px]" />

                    </div>
                ))}
                </div>



                {cta_text && cta_url && (
                  <Link href={cta_url} className="btn-primary">
                    {cta_text}
                  </Link>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
