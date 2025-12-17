"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer({ data }) {
  if (!data) return null;

  const { cta, services, quick, resources, contact, branding } = data;

  return (
    <footer className="w-full bg-[#061837] text-white p-[80px] pb-0">
      <div className="mx-auto">

        {/* ROW 1 — Custom Width Columns */}
        <div className="flex flex-wrap lg:flex-nowrap gap-16">

          {/* COLUMN 1 — CTA (40%) */}
          <div className="w-full lg:w-[42%]">
            <h2 className="text-[32px] md:text-[36px] font-semibold leading-[1.3] mb-6 text-white/90">
              {cta?.cta_heading}
            </h2>

            {/* CTA BUTTON + SOCIAL */}
            <div className="flex items-center gap-4 mb-10">
              <Link href={cta?.cta_button_link} className="btn-primary">
                {cta?.cta_button_text}
              </Link>

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

            <p className="text-white/60 text-[14px] leading-relaxed">
              {branding?.copyright_text}
            </p>
          </div>

          {/* COLUMN 2 — SERVICES (15%) */}
          <div className="w-full lg:w-[12%]">
            <h4 className="uppercase text-[15px] font-medium tracking-wider text-[#5C83DD] mb-4">
              SERVICES
            </h4>
            <ul className="space-y-2">
              {services?.service_links?.map((item, i) => (
                <li key={i}>
                  <Link href={item.url} className="text-white hover:text-[#5C83DD] text-[16px] font-normal">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3 — QUICK LINKS (15%) */}
          <div className="w-full lg:w-[12%]">
            <h4 className="uppercase text-[15px] font-medium tracking-wider text-[#5C83DD] mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2">
              {quick?.quick_links?.map((item, i) => (
                <li key={i}>
                  <Link href={item.url} className="text-white hover:text-[#5C83DD] text-[16px] font-normal">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4 — RESOURCES (15%) */}
          <div className="w-full lg:w-[12%]">
            <h4 className="uppercase text-[15px] font-medium tracking-wider text-[#5C83DD] mb-4">
              RESOURCES
            </h4>
            <ul className="space-y-2">
              {resources?.resource_links?.map((item, i) => (
                <li key={i}>
                  <Link href={item.url} className="text-white hover:text-[#5C83DD] text-[16px] font-normal">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 5 — CONTACT (15%) */}
          <div className="w-full lg:w-[12%]">
            <h4 className="uppercase text-[15px] font-medium tracking-wider text-[#5C83DD] mb-4">
              CONTACT
            </h4>

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
          <div className="mt-20 flex justify-center">
            <Image
              src={branding.footer_logo_large}
              alt="Footer Logo"
              width={1500}
              height={216}
              className="object-contain"
            />
          </div>
        )}

      </div>
    </footer>
  );
}
