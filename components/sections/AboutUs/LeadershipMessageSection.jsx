
import DotIndicator from "../../ui/DotIndicator";

/* normalize image safely */
const getImage = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || img.sizes?.large || img.sizes?.medium_large || null;
};

export default function LeadershipMessageSection({
  section,
  sectionId,
  index = 0,
}) {
  if (!section) return null;

  const {
    section_label,
    heading,
    name,
    role,
    message,
    signature,
    profile_image,
  } = section;

  const profileImg = getImage(profile_image);
  const signatureImg = getImage(signature);

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section
      id={sectionId}
      className="w-full bg-[#061837]
        py-[60px] sm:py-[80px] lg:py-[100px]"
    >
      <div className="web-width mx-auto px-6 md:px-0">

        <div className="flex flex-col md:flex-row gap-0">

          {/* LEFT – LABEL */}
          <div className="md:w-[15%] relative">
            {section_label && (
              <div className="flex items-center gap-2 mb-4 lg:mb-6 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium
                  text-[10px]
                  text-white tracking-wider">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – CONTENT */}
          <div className="md:w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2
                className="text-white font-heading font-semibold
                  text-[24px] sm:text-[28px] md:text-[40px]
                  leading-tight md:leading-[48px] mb-4
                  md:mb-10 
                  max-w-[577px]"   /* ← was fixed width */
              >
                {heading}
              </h2>
            )}

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

              {/* TEXT CONTENT */}
              <div className="flex-1 max-w-full">

                {name && (
                  <p className="text-white font-heading text-[20px]
                    md:text-[24px] leading-[32px]
                    font-semibold mb-2">
                    {name}
                  </p>
                )}

                {role && (
                  <p className="uppercase text-[14px] font-montserrat font-medium
                    tracking-widest text-white mb-4 md:mb-8">
                    {role}
                  </p>
                )}

                {message && (
                  <div
                    className="text-white
                      text-[15px] sm:text-[16px]
                      leading-[24px] space-y-4
                      mb-10
                      max-w-[504px]"  /* ← was fixed width */
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
                )}

                {signatureImg && (
                  <img
                    src={signatureImg}
                    alt="Signature"
                    className="h-[100px] sm:h-[85px]"
                  />
                )}
              </div>

              {/* PROFILE IMAGE */}
              {profileImg && (
                <div className="w-full lg:w-[466px] relative">
                  <div className="lg:sticky lg:top-[120px]">
                    <img
                      src={profileImg}
                      alt={name || "Leadership"}
                      className="
                        w-full max-w-[466px]
                        mx-auto lg:mx-0
                        object-cover object-top
                        rounded-[3px]
                        h-[420px] sm:h-[420px] lg:h-[510px]
                      "
                    />
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
