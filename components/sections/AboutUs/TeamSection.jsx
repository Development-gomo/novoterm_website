"use client";

import { useEffect, useState } from "react";
import DotIndicator from "../../ui/DotIndicator";

/* normalize image */
const getImage = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || null;
};

export default function TeamSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const { section_label, heading } = section;
  const [team, setTeam] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  useEffect(() => {
    async function fetchTeam() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/our-team?_embed&per_page=50`
      );
      const data = await res.json();

      const mapped = data
        .map((item) => ({
          id: item.id,
          name: item.title.rendered,
          image: item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
          hover_image: getImage(item.acf?.hover_image),
          position: item.acf?.position,
          email: item.acf?.email,
          quote: item.acf?.quote,
          quote_image: getImage(item.acf?.quote_image),
          bio: item.acf?.bio,
          order: item.acf?.display_order ?? 999,
        }))
        .sort((a, b) => a.order - b.order);

      setTeam(mapped);
    }

    fetchTeam();
  }, []);

  return (
    <section
      id={sectionId}
      className="w-full bg-[#E3EDFF] pt-[56px] pr-[24px] pb-[56px] pl-[24px] sm:pt-[72px] sm:pr-[40px] sm:pb-[72px] sm:pl-[40px] lg:pt-[80px] lg:pr-[80px] lg:pb-[80px] lg:pl-[80px]"
    >
      <div className="mx-auto max-w-[1440px]">

        <div className="flex flex-col md:flex-row gap-8 md:gap-0">

          {/* LEFT – 15% (STICKY LABEL) */}
          <div className="md:w-[15%] relative">
            {section_label && (
              <div
                className="flex items-center gap-2 mb-6 md:mb-0"
                style={{ position: "sticky", top: `${stickyTop}px`, zIndex: 10 + index }}
              >
                <DotIndicator />
                <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="md:w-[85%]">

            {/* HEADING */}
            {heading && (
              <div
                className="font-heading font-semibold text-[#0A1A3A]
                  text-[28px]
                  sm:text-[34px]
                  md:text-[40px]
                  lg:text-[48px]
                  leading-[36px]
                  sm:leading-[44px]
                  md:leading-[52px]
                  lg:leading-[58px] mb-12
                  max-w-[1090px] mb-10 [&_em]:italic [&_em]:text-[#2655C4]"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* TEAM GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {team.map((m) => {
                const isOpen = activeId === m.id;

                return (
                  <div key={m.id} className="rounded-[4px] overflow-hidden">

                    {/* IMAGE AREA – FULL IMAGE HEIGHT */}
                    <div className="relative w-full  overflow-hidden">

                      {/* BASE IMAGE */}
                      <img
                        src={m.image}
                        alt={m.name}
                        className={`w-full h-full object-contain transition-opacity duration-300 ${
                          isOpen ? "opacity-0" : "opacity-100"
                        }`}
                      />

                      {/* HOVER IMAGE */}
                      {m.hover_image && !isOpen && (
                        <img
                          src={m.hover_image}
                          alt=""
                          className="absolute inset-0 w-full h-full object-contain opacity-0 hover:opacity-100 transition-opacity duration-300"
                        />
                      )}

                      {/* EMAIL ICON */}
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          className="absolute top-4 right-4  flex items-center justify-center z-20"
                        >
                         <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect x="0.6" y="0.6" width="30.8" height="30.8" rx="15.4" stroke="white" stroke-width="1.2"/>
                                                            <path d="M16.2501 15.8109L22.7751 11H9.7251L16.2501 15.8109Z" fill="white"/>
                                                            <path d="M16.25 16.9708C16.1412 16.9708 16.0325 16.9397 15.9444 16.8724L9 11.7509V19.5964C9 19.8813 9.23303 20.1143 9.51786 20.1143H22.9821C23.267 20.1143 23.5 19.8813 23.5 19.5964V11.7509L16.5556 16.8724C16.4675 16.9397 16.3587 16.9708 16.25 16.9708Z" fill="white"/>
                                                            </svg>

                        </a>
                      )}

                      {/* OVERLAY */}
                      <div
                        className={`absolute inset-0 bg-[#051838] text-white transition-opacity duration-300 ${
                          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <div>

                                    {/* QUOTE IMAGE */}
                                {m.quote_image && (
                                <img
                                    src={m.quote_image}
                                    alt=""
                                    className="w-full h-full object-cover rounded-md mb-5"
                                />
                                )}
                                <div className="p-[24px]">
                                {m.quote && (
                                            <div
                                                className="
                                                text-[18px] font-semibold mb-6
                                                font-heading text-white
                                                [&_em]:italic [&_em]:font-bold
                                                [&_em]:text-[#5C83DD] tracking-wide
                                                "
                                                dangerouslySetInnerHTML={{ __html: m.quote }}
                                            />
                                            )}

                                <div className="w-full h-px bg-white/20 mb-4" />

                                {m.bio && (
                                <p className="text-[16px] font-normal text-white/80 leading-relaxed">
                                    {m.bio}
                                </p>
                                )}
                                 </div>               

                        </div>
                      </div>
                    </div>

                    {/* TEXT AREA */}
                    <div className="relative">
                      <h3 className="font-semibold leading-[48px] text-[18px]">
                        {m.name}
                      </h3>

                      {m.position && (
                        <p className=" text-[14px] uppercase tracking-[0.84px] text-[#5C83DD]">
                          {m.position}
                        </p>
                      )}

                      {/* PLUS BUTTON */}
               <button
  onClick={() => setActiveId(isOpen ? null : m.id)}
  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#2655C4] flex items-center justify-center transition-transform duration-300"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    className={`transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.07627 16.8348C8.07627 17.7217 9.42374 17.7217 9.42374 16.8348V9.42373H16.8348C17.7217 9.42373 17.7217 8.07626 16.8348 8.07626H9.42374V0.665178C9.42374 -0.221727 8.07627 -0.221727 8.07627 0.665178V8.07626H0.665179C-0.221726 8.07626 -0.221726 9.42373 0.665179 9.42373H8.07627V16.8348Z"
      fill="white"
    />
  </svg>
</button>

                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
