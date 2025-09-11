    "use client";

import React, { useMemo, useState } from "react";

/**
 * EarningsCalculator (Next.js + Tailwind, Client Component)
 * -------------------------------------------------------
 * Sliders + region pills on the left, results on the right.
 * Formula:
 *  impressions = visitors_per_month * pageviews_per_visit * ads_per_page
 *  revenue_month = impressions * (CPM_by_region / 1000)
 *  revenue_year  = revenue_month * 12
 *
 * Optional props:
 * - initial: { visitors, pageviews, adsPerPage, region }
 * - cpmMap:  { [regionLabel]: number }
 */
const DEFAULT_CPM = {
  "South America, Asia and Africa": 2.5,
  "EU and UK": 6,
  "US and Canada": 8,
};

function formatCurrency(n) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    // Fallback if Intl fails for some env
    return `$${Math.round(n).toLocaleString()}`;
  }
}

function SliderRow({ label, value, onChange, min = 0, max = 1000, step = 1 }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          ●
        </span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-[#558C4B] h-2 w-full cursor-pointer rounded-lg bg-gray-200 focus:outline-none"
        />
        <div className="w-20 shrink-0 rounded-md bg-amber-100 px-3 py-1 text-center text-sm font-semibold text-gray-900">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function EarningsCalculator({
  initial,
  cpmMap,
}) {
  const CPM_BY_REGION = cpmMap && Object.keys(cpmMap).length ? cpmMap : DEFAULT_CPM;
  const regions = Object.keys(CPM_BY_REGION);

  const [visitors, setVisitors] = useState(initial?.visitors ?? 500);
  const [pageviews, setPageviews] = useState(initial?.pageviews ?? 5);
  const [adsPerPage, setAdsPerPage] = useState(initial?.adsPerPage ?? 4);
  const [region, setRegion] = useState(initial?.region ?? regions[1]); // default "EU and UK"

  const cpm = CPM_BY_REGION[region];

  const { month, year, impressions } = useMemo(() => {
    const impressionsCalc = visitors * pageviews * adsPerPage;
    const monthCalc = (impressionsCalc * cpm) / 1000;
    return { month: monthCalc, year: monthCalc * 12, impressions: impressionsCalc };
  }, [visitors, pageviews, adsPerPage, cpm]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-center text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        How much can you earn?
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600">
        Use the calculator to see how much your site or app could earn.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: Controls */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-6">
            <SliderRow
              label="Visitors per month"
              value={visitors}
              onChange={setVisitors}
              min={0}
              max={100000}
              step={100}
            />
            <SliderRow
              label="Page views per visit"
              value={pageviews}
              onChange={setPageviews}
              min={1}
              max={20}
              step={1}
            />
            <SliderRow
              label="Ads per page"
              value={adsPerPage}
              onChange={setAdsPerPage}
              min={1}
              max={10}
              step={1}
            />

            {/* Region selector */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  ●
                </span>
                <span className="font-medium">User base from</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {regions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    className={
                      "rounded-xl border px-3 py-2 text-center text-sm font-medium transition " +
                      (region === r
                        ? "bg-[#558C4B] text-white border-transparent shadow"
                        : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200")
                    }
                    aria-pressed={region === r}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Estimated revenues are a guide and assume a reasonably competitive setup.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-6">
            <div className="divide-y divide-gray-200 rounded-xl bg-gray-50">
              <div className="flex items-center justify-between px-5 py-4 text-gray-700">
                <span className="text-sm">Revenue / month</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(month)}
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-4 text-gray-700">
                <span className="text-sm">Revenue / year</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(year)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-[#558C4B] px-6 py-3 text-center text-white shadow transition hover:opacity-90"
            >
              Get Started
            </button>

            <div className="text-xs text-gray-500">
              <div>
                Impressions / month:{" "}
                <span className="font-medium">
                  {impressions.toLocaleString()}
                </span>
              </div>
              <div>
                CPM ({region}):{" "}
                <span className="font-medium">${cpm.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-28 w-full items-end gap-4 px-4 pb-2">
            <div className="h-24 w-28 rounded-t-[40px] bg-yellow-300" />
            <div className="h-24 w-24 rounded-full bg-green-600" />
            <div className="h-24 w-28 rounded-t-[40px] bg-gray-300" />
            <div className="hidden h-24 w-28 rounded-t-[40px] bg-yellow-200 md:block" />
            <div className="ml-auto hidden h-24 w-36 rounded-t-[40px] bg-green-700 md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
