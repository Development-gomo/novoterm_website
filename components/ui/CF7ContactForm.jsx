"use client";

import { useState } from "react";

export default function ContactForm() {
  const [type, setType] = useState("company");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const formData = new FormData(e.target);
    formData.append("user_type", type);

    try {
      const res = await fetch(
        "https://gomostaging.com/novoterm-headless/wp-json/custom/v1/contact",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (result.success) {
        setStatus("Thank you! Your request has been sent.");
        e.target.reset();
        setType("company");
      } else {
        setStatus(result.message || "Something went wrong.");
      }
    } catch (err) {
      setStatus("Submission failed. Please try again later.");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[620px] text-white"
    >

      {/* ================= RADIO QUESTION ================= */}
      <p className="text-[16px] mb-4">
        Are you a company or a private individual?
      </p>

      <div className="flex gap-4 mb-8">
        {/* COMPANY */}
        <label className="flex items-center gap-3 px-[24px] py-[16px] border border-white/50 rounded-[3px] w-full cursor-pointer bg-white/[0.05]">
          <input
            type="radio"
            checked={type === "company"}
            onChange={() => setType("company")}
            className="hidden"
          />
          <span className="flex w-[16px] h-[16px] rounded-full bg-[#2655C4] items-center justify-center">
            <span className={`w-[6px] h-[6px] rounded-full bg-white ${type === "company" ? "opacity-100" : "opacity-0"}`} />
          </span>
          <span className="text-[13px] uppercase tracking-widest">
            Company
          </span>
        </label>

        {/* PRIVATE */}
        <label className="flex items-center gap-3 px-[24px] py-[16px] border border-white/50 rounded-[3px] w-full cursor-pointer bg-white/[0.05]">
          <input
            type="radio"
            checked={type === "private"}
            onChange={() => setType("private")}
            className="hidden"
          />
          <span className="flex w-[16px] h-[16px] rounded-full bg-[#2655C4] items-center justify-center">
            <span className={`w-[6px] h-[6px] rounded-full bg-white ${type === "private" ? "opacity-100" : "opacity-0"}`} />
          </span>
          <span className="text-[13px] uppercase tracking-widest">
            Private individual
          </span>
        </label>
      </div>

      {/* ================= SECTION TITLE ================= */}
      <p className="text-[16px] mb-4">Tell us about you</p>

      {/* ================= INPUTS ================= */}
      <div className="space-y-4">

        <input
          type="text"
          name="company_name"
          placeholder="COMPANY NAME*"
          required
          className="w-full h-[48px] px-4 rounded-[3px] border border-white/50 bg-white/[0.05] text-white text-[14px] outline-none placeholder-white/70"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="full_name"
            placeholder="FULL NAME*"
            required
            className="h-[48px] px-4 rounded-[3px] border border-white/50 bg-white/[0.05] text-white text-[14px] outline-none placeholder-white/70"
          />

          <input
            type="tel"
            name="phone"
            placeholder="PHONE NUMBER*"
            required
            className="h-[48px] px-4 rounded-[3px] border border-white/50 bg-white/[0.05] text-white text-[14px] outline-none placeholder-white/70"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            placeholder="E-MAIL*"
            required
            className="h-[48px] px-4 rounded-[3px] border border-white/50 bg-white/[0.05] text-white text-[14px] outline-none placeholder-white/70"
          />

          <div className="relative w-full">
            <select
              name="area"
              required
              className="w-full h-[48px] px-4 pr-10 rounded-[3px] border border-white/50 bg-white/[0.05] text-white text-[14px] outline-none appearance-none"
            >
              <option value="" className="text-black bg-white">
                AREA OF INTEREST
              </option>
              <option className="text-black bg-white">Translation</option>
              <option className="text-black bg-white">Localization</option>
              <option className="text-black bg-white">Review</option>
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
                <path d="M5.625 6L0.1125 0.6375C-0.0375 0.4875 -0.0375 0.25 0.1125 0.1125C0.2625 -0.0375 0.5 -0.0375 0.6375 0.1125L5.625 5.1L10.6125 0.1125C10.7625 -0.0375 11 -0.0375 11.1375 0.1125C11.2875 0.2625 11.2875 0.5 11.1375 0.6375L5.625 6Z" fill="white"/>
              </svg>
            </span>
          </div>
        </div>

        <textarea
          name="message"
          placeholder="MESSAGE"
          className="w-full min-h-[105px] px-4 py-3 rounded-[3px] border border-white/50 bg-white/[0.05] text-white text-[14px] outline-none resize-none placeholder-white/70"
        />
      </div>

      {/* ================= UPLOAD ================= */}
    <label className="inline-flex items-center gap-3 h-[56px] px-[24px] mt-6 border border-dashed border-white rounded-[3px] text-[13px] cursor-pointer text-white bg-white/[0.05]">
  <input
    type="file"
    name="file"
    className="hidden"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setFileName(e.target.files[0].name);
      }
    }}
  />

  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
    <path d="M7.98512 0C7.9785 0.000678357 7.97188 0.00135671 7.96526 0.0027136C7.95269 0.00339196 7.94078 0.00542721 7.92886 0.00678392C7.91629 0.00881916 7.90438 0.0115327 7.89247 0.0142463C7.88122 0.0162816 7.87063 0.0189952 7.85938 0.0223871C7.84747 0.0257793 7.83555 0.0298496 7.82298 0.0339199C7.81438 0.0379904 7.80511 0.0413824 7.79585 0.0454529C7.78129 0.0522368 7.76607 0.0596992 7.75217 0.0671617C7.74555 0.0705537 7.73959 0.0739456 7.73364 0.0780161C7.71842 0.0868353 7.70386 0.0970121 7.6893 0.107867C7.68533 0.111258 7.68136 0.11465 7.67672 0.118721C7.66349 0.129575 7.65025 0.141109 7.63702 0.153997C7.63371 0.156711 7.62974 0.159424 7.62576 0.162138L3.99514 3.88528H3.9958C3.79132 4.09558 3.79132 4.43547 3.9958 4.64509C4.20029 4.85471 4.53186 4.85471 4.73635 4.64509L7.4721 1.84466V10.541C7.4721 10.6842 7.5277 10.8212 7.6263 10.9223C7.72491 11.0234 7.85859 11.0797 7.99822 11.0797C8.1372 11.0797 8.27089 11.0234 8.36949 10.9223C8.46809 10.8212 8.52368 10.6842 8.52368 10.541V1.84466L11.2562 4.64509C11.3548 4.74617 11.4885 4.80316 11.6281 4.80316C11.7678 4.80316 11.9015 4.74618 12.0001 4.64509C12.2039 4.43547 12.2039 4.09558 12.0001 3.88528L8.38995 0.182631H8.38928C8.38266 0.175847 8.37605 0.169063 8.36877 0.162278V0.15753C8.35553 0.143962 8.34097 0.130393 8.32575 0.118183C8.32046 0.114112 8.31516 0.110042 8.30987 0.105971C8.29729 0.0964739 8.28472 0.0876544 8.27149 0.0801918C8.26354 0.0747646 8.25494 0.0700158 8.24634 0.0659453C8.23376 0.0591613 8.22119 0.0530558 8.20795 0.0469492C8.19869 0.0428789 8.18942 0.0388084 8.1795 0.0354164C8.16692 0.0306676 8.15369 0.0272756 8.14111 0.0232051C8.13052 0.0204917 8.11994 0.0177779 8.10935 0.0150645C8.09743 0.0123507 8.08618 0.0103157 8.07427 0.00828042C8.0617 0.00624518 8.04912 0.00488851 8.03655 0.00353162C8.0253 0.00285327 8.01339 0.00285322 8.00148 0.00285322C7.99684 0.00217487 7.99155 0.00217491 7.98692 0.00217491L7.98512 0ZM0.525466 9.03486C0.235609 9.03486 0.000660729 9.27501 0 9.57146V14.462C0 14.6052 0.0549286 14.7422 0.153535 14.8426C0.252141 14.9437 0.385824 15.0007 0.525458 15H15.4745C15.6142 15.0007 15.7479 14.9437 15.8465 14.8426C15.9451 14.7422 16 14.6052 16 14.462V9.57146C16 9.27501 15.7644 9.03416 15.4745 9.03486C15.1847 9.03486 14.9497 9.27501 14.9491 9.57146V13.9247H1.05088V9.57146C1.05022 9.27501 0.81534 9.03416 0.525466 9.03486Z" fill="white"/>
  </svg>

  <span className="uppercase tracking-widest truncate max-w-[240px]">
    {fileName ? fileName : "Upload file"}
  </span>
</label>


      {/* ================= SUBMIT ================= */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary cursor-pointer disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send request"}
        </button>

        {status && (
          <p className="mt-4 text-[14px] text-white">{status}</p>
        )}
      </div>
    </form>
  );
}
