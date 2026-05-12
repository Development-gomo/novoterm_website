import Image from "next/image";

export default function AuthorCard({ card }) {
  if (!card) return null;

  const {
    name,
    description,
    image,
    company_name,
    website_url,
    linkedin_profile_url,
  } = card;

  const imageUrl =
    typeof image === "object"
      ? image?.url || image?.sizes?.medium || null
      : image || null;

  const getHref = (url) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <div className="flex items-start gap-5 bg-[#e9f1fb] rounded-[3px] p-6 border border-[#e8edf3]">
      {imageUrl && (
        <div className="flex-shrink-0">
          <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={name || "Author"}
              fill
              className="object-cover"
              sizes="100px"
              loading="lazy"
            />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {name && (
          <h4 className="text-[18px] font-semibold text-[#061837] mb-2 font-montserrat">
            {name}
          </h4>
        )}

        {description && (
          <div
            className="text-[14px] text-[#000000] leading-[1.7] tracking-normal mb-5 [&_p]:mb-0 [&_p]:text-[14px] space-y-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        <div className="flex flex-wrap items-center gap-5">
          {website_url && (
            <a
              href={getHref(website_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#2555C4] text-[14px] font-medium hover:underline"
            >
              {/* Globe icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{company_name || website_url}</span>
            </a>
          )}

          {linkedin_profile_url && (
            <a
              href={getHref(linkedin_profile_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#2555C4] text-[14px] font-medium hover:underline"
            >
              {/* LinkedIn icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>{name || "LinkedIn"}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
