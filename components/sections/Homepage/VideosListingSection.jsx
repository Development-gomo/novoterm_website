import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_LANG } from "../../../lib/api";
import { fetchHeadlessVideos, getWatchPath } from "../../../lib/headlessVideo";

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function clampDescription(value = "") {
  const clean = stripHtml(value);
  if (!clean) return "";
  return clean;
}

function formatVideos(videos = []) {
  return videos
    .filter((video) => video?.slug && video?.title)
    .map((video) => ({
      id: video.id || video.slug,
      slug: video.slug,
      title: stripHtml(video.title),
      description: clampDescription(video.description || video.description_html),
      image: video.thumbnail_url || "/userfallback.webp",
    }));
}

export default function VideosListingSection({
  section,
  initialVideos = [],
}) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const formattedInitialVideos = formatVideos(initialVideos);
  const [videos, setVideos] = useState(formattedInitialVideos);

  useEffect(() => {
    setVideos(formattedInitialVideos);
  }, [initialVideos]);

  useEffect(() => {
    let cancelled = false;

    async function loadVideos() {
      const data = await fetchHeadlessVideos({ perPage: 100, lang });
      if (!cancelled) {
        const formatted = formatVideos(data);
        if (formatted.length > 0 || formattedInitialVideos.length === 0) {
          setVideos(formatted);
        }
      }
    }

    loadVideos();

    return () => {
      cancelled = true;
    };
  }, [lang, formattedInitialVideos.length]);

  if (!videos.length) return null;

  const heading = section?.heading || "";
  const ctaButtonTitle = section?.cta_button_title || (lang === "en" ? "Watch video" : "Titta pa video");

  return (
    <section className="w-full bg-white py-15 md:py-[100px]">
      <div className="web-width mx-auto px-6 md:px-0">
        {heading && (
          <h2
            className="mb-10 max-w-[760px] font-heading text-[28px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.15] text-[#061837]"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <article
              key={video.id}
              className="flex h-full flex-col overflow-hidden rounded-[3px] border border-[#D1D9E6] bg-white"
            >
              {/* <div className="relative aspect-[16/10] w-full bg-[#E3EDFF]">
                <Image
                  src={video.image}
                  alt={video.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
              </div> */}

              <div className="flex flex-1 flex-col px-6 py-6 bg-[#F9FAFB]">
                <h3 className="mb-3 font-heading text-[22px] font-semibold leading-[1.3] text-[#061837]">
                  {video.title}
                </h3>

                <p
                  className="mb-6 min-h-[78px] overflow-hidden text-[16px] leading-[1.65] text-[#606164]"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {video.description}
                </p>

                <div className="mt-auto">
                  <Link href={getWatchPath(video.slug, lang)} className="btn-primary w-fit">
                    {ctaButtonTitle}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
