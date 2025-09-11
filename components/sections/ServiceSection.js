'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ServiceSection({
  label = 'SERVICES',
  heading = 'The cornerstones of our innovative solutions',
  services = [],
  slidesDesktop = 4,
  slidesTablet = 2,
  slidesMobile = 1,
  bandColor = '#2B351B',
  className = '',
}) {
  const hasItems = Array.isArray(services) && services.length > 0;

  // Explicit refs for controls (most reliable with Next + Swiper)
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const pagRef  = useRef(null);

  return (
    <section
      className={`relative w-full bg-[#EFEFE9] py-12 md:py-16 ${className}`}
      style={{ '--srv-band': bandColor }}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] bg-[var(--srv-band)] -z-10" />

      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
        <div className="mb-6 md:mb-8">
          {label ? (
            <span className="mb-3 inline-block rounded-md bg-[#E6E8E1] px-2.5 py-1 text-[12px] font-semibold tracking-wide text-[#1b1b1b] uppercase">
              {label}
            </span>
          ) : null}
          {heading ? (
            <h2 className="text-[32px] md:text-[40px] font-extrabold leading-tight text-[#0E0E0E]">
              {heading}
            </h2>
          ) : null}
        </div>

        {hasItems ? (
          <>
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              className="services-swiper"
              spaceBetween={22}
              slidesPerView={slidesMobile}
              breakpoints={{
                768: { slidesPerView: slidesTablet },
                1024: { slidesPerView: slidesDesktop },
              }}
              // Wire refs BEFORE init
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.params.pagination.el = pagRef.current;
              }}
              // Ensure init after refs exist (React StrictMode double-mount safe)
              onSwiper={(swiper) => {
                swiper.navigation.init();
                swiper.navigation.update();
                swiper.pagination.init();
                swiper.pagination.update();
              }}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              pagination={{ el: pagRef.current, clickable: true }}
            >
              {services.map((s) => (
                <SwiperSlide key={s.id ?? s.title}>
                  <ServiceCard item={s} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Controls row */}
            <div className="mt-6 flex items-center justify-center gap-5">
              <button
                ref={prevRef}
                className="h-10 w-10 rounded-full bg-white text-[#2B351B] grid place-items-center shadow"
                aria-label="Previous"
                type="button"
              >
                ←
              </button>
              <div ref={pagRef} className="swiper-pagination !static !w-auto !mx-1" />
              <button
                ref={nextRef}
                className="h-10 w-10 rounded-full bg-[var(--srv-band)] text-white grid place-items-center shadow"
                aria-label="Next"
                type="button"
              >
                →
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-[#E7E7E2] bg-white p-6 text-sm text-[#2A2A2A] opacity-80">
            No services to show yet. Pass a non-empty <code>services</code> array.
          </div>
        )}
      </div>

      <style jsx global>{`
        .services-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 1;
          margin: 0 6px !important;
        }
        .services-swiper .swiper-pagination-bullet-active {
          background: #6c8e5e;
        }
      `}</style>
    </section>
  );
}

function ServiceCard({ item = {} }) {
  return (
    <article className="w-[270px] rounded-[14px] border border-[#E7E7E2] bg-white overflow-hidden text-left">
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.title || ''}
          className="h-[150px] w-full object-cover"
          loading="lazy"
        />
      ) : null}

      <div className="px-5 pt-4 pb-6">
        {item.title ? (
          <h3 className="text-[22px] font-extrabold text-[#111]">{item.title}</h3>
        ) : null}
        {item.subtitle ? (
          <p className="mt-2 text-[14px] leading-relaxed text-[#2A2A2A] opacity-80">
            {item.subtitle}
          </p>
        ) : null}
        {item.link ? (
          <a href={item.link} className="mt-4 inline-block text-[14px] font-semibold text-[#111]">
            Read More
          </a>
        ) : null}
      </div>
    </article>
  );
}
