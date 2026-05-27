export default function PreviewBanner() {
  return (
    <div className="fixed bottom-5 left-1/2 z-[10050] flex w-[calc(100%-32px)] max-w-[520px] -translate-x-1/2 items-center justify-between gap-4 rounded-[3px] border border-[#BBC8E1] bg-[#061837] px-5 py-4 text-white shadow-2xl">
      <span className="font-montserrat text-sm font-medium">
        Preview mode enabled
      </span>
      <a
        href="/api/exit-preview"
        className="shrink-0 rounded-[3px] bg-white px-4 py-2 font-montserrat text-sm font-semibold text-[#061837] transition hover:bg-[#E3EDFF]"
      >
        Exit preview
      </a>
    </div>
  );
}
