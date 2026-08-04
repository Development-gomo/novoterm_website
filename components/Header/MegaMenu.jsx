import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MegaMenu({ menuData, logo, mobileMode = false }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const closeTimer = useRef(null);

  // Mobile state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedIdx, setMobileExpandedIdx] = useState(null);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (!mobileMode) return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, mobileMode]);

  const openMenu = (idx) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveIdx(idx);
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setActiveIdx(null), 150);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const closeNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveIdx(null);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpandedIdx(null);
  };

  if (!menuData || !menuData.length) return null;

  // 🔥 LINK NORMALIZER (final)
  const getLinkData = (link) => {
    let url =
      link?.url ||
      link?.link?.url ||
      link?.href ||
      link?.permalink ||
      link?.slug;

    if (typeof url === "object") {
      url = url?.url || null;
    }

    if (!url || typeof url !== "string") url = "#";

    if (url !== "#" && !url.startsWith("/") && !url.startsWith("http")) {
      url = `/${url}`;
    }

    return {
      url,
      title:
        link?.title ||
        link?.label ||
        link?.link?.title ||
        "Link",
      target:
        link?.target ||
        link?.link?.target ||
        "_self",
    };
  };

  const hasContent = (value) =>
    typeof value === "string"
      ? value.replace(/<[^>]*>/g, "").trim().length > 0
      : Boolean(value);

  const hasUsableLink = (link) => getLinkData(link).url !== "#";

  const hasRenderableCard = (card) =>
    !!card &&
    (hasContent(card.title) ||
      hasContent(card.description) ||
      hasUsableLink(card.button_link));

  // ===== MOBILE MODE =====
  if (mobileMode) {
    return (
      <>
        {/* Hamburger button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white w-10 h-10 flex items-center justify-center"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none">
            <line x1="0" y1="1" x2="24" y2="1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="0" y1="9" x2="18" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="0" y1="17" x2="12" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-[10001]"
            onClick={closeMobile}
          />
        )}

        {/* Drawer */}
        {mobileOpen && (
          <aside className="fixed top-0 right-0 h-screen w-[320px] max-w-[85vw] bg-[#0B2347] text-white z-[10002] flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
              {logo ? (
                <Image src={logo} alt="Logo" width={120} height={28} className="h-7 w-auto" />
              ) : (
                <span className="text-xl font-semibold">Menu</span>
              )}
              <button
                onClick={closeMobile}
                className="text-3xl leading-none text-white/70 hover:text-white transition"
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>

            {/* Menu items */}
            <nav className="flex-1 overflow-y-auto">
              {menuData.map((menu, idx) => {
                const isExpanded = mobileExpandedIdx === idx;
                const hasDropdown =
                  menu.layout_type !== "no_column" &&
                  menu.columns &&
                  menu.columns.length > 0;

                return (
                  <div key={idx} className="border-b border-white/10">
                    {/* Top-level item row */}
                    <div className="flex items-center justify-between px-6 py-4">
                      {menu.layout_type === "no_column" && menu.menu_title_link?.url ? (
                        <a
                          href={menu.menu_title_link.url}
                          target={menu.menu_title_link.target || "_self"}
                          rel={menu.menu_title_link.target === "_blank" ? "noopener noreferrer" : undefined}
                          onClick={closeMobile}
                          style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", fontWeight: 500, color: "#FFF" }}
                        >
                          {menu.menu_title}
                        </a>
                      ) : menu.menu_title_link?.url ? (
                        <a
                          href={menu.menu_title_link.url}
                          target={menu.menu_title_link.target || "_self"}
                          rel={menu.menu_title_link.target === "_blank" ? "noopener noreferrer" : undefined}
                          style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", fontWeight: 500, color: "#FFF" }}
                        >
                          {menu.menu_title}
                        </a>
                      ) : (
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", fontWeight: 500, color: "#FFF" }}>
                          {menu.menu_title}
                        </span>
                      )}

                      {hasDropdown && (
                        <button
                          onClick={() => setMobileExpandedIdx(isExpanded ? null : idx)}
                          className="text-white/60 hover:text-white px-2 py-1 transition flex-shrink-0"
                          aria-label="Toggle submenu"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="6"
                            viewBox="0 0 12 6"
                            fill="none"
                            style={{ transition: "transform 0.2s", transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)" }}
                          >
                            <path d="M5.625 0C5.525 0 5.4375 0.0375004 5.3625 0.1125L0.1125 5.3625C-0.0375 5.5125 -0.0375 5.75 0.1125 5.8875C0.2625 6.0375 0.5 6.0375 0.6375 5.8875L5.625 0.9L10.6125 5.8875C10.7625 6.0375 11 6.0375 11.1375 5.8875C11.2875 5.7375 11.2875 5.5 11.1375 5.3625L5.8875 0.1125C5.8125 0.0375004 5.725 0 5.625 0Z" fill="white"/>
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Expanded dropdown content */}
                    {hasDropdown && isExpanded && (
                      <div className="bg-[#061837] border-t border-white/10">
                        {/* Cards row */}
                        {menu.columns.some((col) => hasRenderableCard(col.card)) && (
                          <div className="px-4 pt-4 flex flex-col gap-3">
                            {menu.columns.map((col, cIdx) =>
                              hasRenderableCard(col.card) ? (
                                <div
                                  key={cIdx}
                                  className="bg-[#D0D5DD33] rounded-[3px] p-4 flex flex-col"
                                >
                                  <h4 className="text-[14px] font-semibold text-white mb-1">{col.card.title}</h4>
                                  <div
                                    className="text-[12px] text-white/75 leading-[18px]"
                                    dangerouslySetInnerHTML={{ __html: col.card.description }}
                                  />
                                  {col.card.button_link &&
                                    (() => {
                                      const { url } = getLinkData(col.card.button_link);
                                      return (
                                        url !== "#" && (
                                          <Link
                                            href={url}
                                            onClick={closeMobile}
                                            className="inline-flex items-center justify-center w-7 h-7 bg-[#2655C4] text-white rounded-[3px] transition self-start mt-3"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 12 11" fill="none">
                                              <path d="M12 5.14285C12 5.01758 11.92 4.85124 11.8389 4.77052L7.2675 0.168963C7.05407 -0.0400802 6.7083 -0.0643065 6.45948 0.147849C6.23702 0.337512 6.23148 0.707414 6.43719 0.913372L10.1068 4.60138H0.571433C0.255831 4.60138 0 4.84375 0 5.14273C0 5.44172 0.255831 5.68412 0.571433 5.68412H10.1068L6.43719 9.37213C6.23151 9.57806 6.24611 9.93888 6.45948 10.1376C6.68476 10.3475 7.05733 10.3288 7.2675 10.1165L11.8389 5.51496C11.9732 5.39015 11.9977 5.26996 12 5.14285Z" fill="white"/>
                                            </svg>
                                          </Link>
                                        )
                                      );
                                    })()}
                                </div>
                              ) : null
                            )}
                          </div>
                        )}

                        {/* Links — all columns stacked vertically */}
                        <div className="px-4 pb-4">
                          {menu.columns.map((col, cIdx) => {
                            const hasCard = hasRenderableCard(col.card);
                            const linkFontStyle = hasCard ? "italic" : "normal";
                            return (
                              <ul key={cIdx} className={cIdx > 0 ? "mt-2" : "mt-4"}>
                                {col.links &&
                                  col.links.map((link, lIdx) => {
                                    const { url, title } = getLinkData(link);
                                    return (
                                      <li
                                        key={lIdx}
                                        className="border-b border-dashed border-white/20 last:border-none"
                                      >
                                        {url !== "#" ? (
                                          <Link
                                            href={url}
                                            onClick={closeMobile}
                                            className="group flex items-center justify-between py-3 transition"
                                          >
                                            <div className="flex items-center">
                                              <span className="block w-0 h-2 rounded-full bg-[#2655C4] flex-shrink-0 overflow-hidden transition-all duration-200 group-hover:w-2 group-hover:mr-2" />
                                              <span
                                                className="text-white/80 group-hover:text-white transition-colors"
                                                style={{
                                                  fontFamily: "Cabin, sans-serif",
                                                  fontSize: "14px",
                                                  fontStyle: linkFontStyle,
                                                }}
                                              >
                                                {title}
                                              </span>
                                            </div>
                                            <span className="flex-shrink-0 ml-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 12 11" fill="none">
                                                <path d="M12 5.14285C12 5.01758 11.92 4.85124 11.8389 4.77052L7.2675 0.168963C7.05407 -0.0400802 6.7083 -0.0643065 6.45948 0.147849C6.23702 0.337512 6.23148 0.707414 6.43719 0.913372L10.1068 4.60138H0.571433C0.255831 4.60138 0 4.84375 0 5.14273C0 5.44172 0.255831 5.68412 0.571433 5.68412H10.1068L6.43719 9.37213C6.23151 9.57806 6.24611 9.93888 6.45948 10.1376C6.68476 10.3475 7.05733 10.3288 7.2675 10.1165L11.8389 5.51496C11.9732 5.39015 11.9977 5.26996 12 5.14285Z" fill="white"/>
                                              </svg>
                                            </span>
                                          </Link>
                                        ) : (
                                          <span
                                            className="py-3 block text-white/50"
                                            style={{
                                              fontFamily: "Cabin, sans-serif",
                                              fontSize: "14px",
                                              fontStyle: linkFontStyle,
                                            }}
                                          >
                                            {title}
                                          </span>
                                        )}
                                      </li>
                                    );
                                  })}
                              </ul>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>
        )}
      </>
    );
  }

  // ===== DESKTOP MODE =====
  return (
    <div className="w-full">
      <nav className="flex gap-4 items-center">
        {menuData.map((menu, idx) => (
          <div
            key={idx}
            className="relative"
            onMouseEnter={() => openMenu(idx)}
            onMouseLeave={closeMenu}
          >
            {/* TOP MENU */}

            {/* If layout_type is 'no_column', render as a link or button with NO arrow or dropdown */}
            {menu.layout_type === 'no_column' ? (
              menu.menu_title_link && menu.menu_title_link.url ? (
                <a
                  href={menu.menu_title_link.url}
                  target={menu.menu_title_link.target || '_self'}
                  rel={menu.menu_title_link.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2 cursor-pointer px-3 py-2"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 400, color: '#FFF', fontStyle: 'normal' }}
                >
                  {menu.menu_title}
                </a>
              ) : (
                <span
                  className="flex items-center gap-2 cursor-pointer px-3 py-2"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 400, color: '#FFF', fontStyle: 'normal' }}
                >
                  {menu.menu_title}
                </span>
              )
            ) : (
              <button
                className="flex items-center gap-2 cursor-pointer px-3 py-2"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 400, color: '#FFF', fontStyle: 'normal', background: 'none', border: 'none' }}
                aria-haspopup="true"
                aria-expanded={activeIdx === idx}
              >
                {menu.menu_title_link && menu.menu_title_link.url ? (
                  <a
                    href={menu.menu_title_link.url}
                    target={menu.menu_title_link.target || '_self'}
                    rel={menu.menu_title_link.target === '_blank' ? 'noopener noreferrer' : undefined}
                    style={{ color: 'inherit', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {menu.menu_title}
                  </a>
                ) : (
                  menu.menu_title
                )}
                {/* Dropdown chevron — vertically centered */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="6"
                  viewBox="0 0 12 6"
                  fill="none"
                  style={{ transition: 'transform 0.2s', transform: activeIdx === idx ? 'rotate(0deg)' : 'rotate(180deg)', flexShrink: 0 }}
                >
                  <path d="M5.625 0C5.525 0 5.4375 0.0375004 5.3625 0.1125L0.1125 5.3625C-0.0375 5.5125 -0.0375 5.75 0.1125 5.8875C0.2625 6.0375 0.5 6.0375 0.6375 5.8875L5.625 0.9L10.6125 5.8875C10.7625 6.0375 11 6.0375 11.1375 5.8875C11.2875 5.7375 11.2875 5.5 11.1375 5.3625L5.8875 0.1125C5.8125 0.0375004 5.725 0 5.625 0Z" fill="white"/>
                </svg>
              </button>
            )}

            {/* DROPDOWN: Only show if not no_column */}
            {activeIdx === idx && menu.layout_type !== 'no_column' && (() => {
              const isThree = menu.layout_type === 'three_column';
              const isTwo   = menu.layout_type === 'two_column';
              const isOne   = menu.layout_type === 'one_column';

              // Total panel width
              const panelWidth = isThree ? 930 : isTwo ? 630 : 330;
              // Links area width (panel minus image when image exists)
              const hasImage = !!menu.side_image;
              const imageWidth = 300;
              const linksWidth = hasImage
                ? panelWidth - imageWidth
                : panelWidth;

              return (
                <div
                  onMouseEnter={cancelClose}
                  onMouseLeave={closeMenu}
                  className="fixed z-50 bg-white rounded-[3px]  flex overflow-hidden"
                  style={{
                    top: '72px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: `${panelWidth}px`,
                    maxHeight: 'calc(100vh - 90px)',
                    overflowY: 'auto',
                  }}
                >
                  {/* LINKS SECTION */}
                  <div
                    className="flex flex-col p-[10px] flex-shrink-0"
                    style={{ width: `${linksWidth}px` }}
                  >
                    {/* CARDS ROW */}
                    {menu.columns && menu.columns.some((col) => hasRenderableCard(col.card)) && (
                      <div className="flex mb-6" style={{ gap: '20px' }}>
                        {menu.columns.map((col, cIdx) => (
                          hasRenderableCard(col.card) ? (
                            <div
                              key={cIdx}
                              className="bg-[#D0D5DD33] rounded-[3px] p-5 flex flex-col"
                              style={{ flex: '1 1 0', minWidth: '0' }}
                            >
                              <div className="flex-1">
                                <h4 className="text-[18px] font-semibold mb-2 text-[#061837]">{col.card.title}</h4>
                                <p
                                  className="text-[12px] text-[#061837] leading-[18px]"
                                  dangerouslySetInnerHTML={{ __html: col.card.description }}
                                />
                              </div>
                              {col.card.button_link && (() => {
                                const { url } = getLinkData(col.card.button_link);
                                return url !== "#" && (
                                  <Link
                                    href={url}
                                    onClick={closeNow}
                                    className="inline-flex items-center justify-center w-8 h-8 bg-[#2655C4] text-white rounded-[3px] transition self-start mt-[14px]"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                      <path d="M12 5.14285C12 5.01758 11.92 4.85124 11.8389 4.77052L7.2675 0.168963C7.05407 -0.0400802 6.7083 -0.0643065 6.45948 0.147849C6.23702 0.337512 6.23148 0.707414 6.43719 0.913372L10.1068 4.60138H0.571433C0.255831 4.60138 0 4.84375 0 5.14273C0 5.44172 0.255831 5.68412 0.571433 5.68412H10.1068L6.43719 9.37213C6.23151 9.57806 6.24611 9.93888 6.45948 10.1376C6.68476 10.3475 7.05733 10.3288 7.2675 10.1165L11.8389 5.51496C11.9732 5.39015 11.9977 5.26996 12 5.14285Z" fill="white"/>
                                    </svg>
                                  </Link>
                                );
                              })()}
                            </div>
                          ) : (
                            <div key={cIdx} style={{ flex: '1 1 0' }} />
                          )
                        ))}
                      </div>
                    )}

                    {/* LINKS ROW — columns side by side */}
                    <div className="flex" style={{ gap: isOne ? '0px' : '20px' }}>
                      {menu.columns && menu.columns.map((col, cIdx) => {
                        const hasCard = hasRenderableCard(col.card);
                        const linkFontStyle = hasCard ? 'italic' : 'normal';
                        return (
                        <div className="px-5" key={cIdx} style={{ flex: '1 1 0', minWidth: '0' }}>
                          <ul>
                            {col.links.map((link, lIdx) => {
                              const { url, title } = getLinkData(link);
                              return (
                                <li key={lIdx} className="border-b border-dashed border-[#D0D5DD] last:border-none">
                                  {url !== "#" ? (
                                    <Link href={url} onClick={closeNow} className="group flex items-center justify-between py-4 transition">
                                      <div className="flex items-center">
                                        <span className="block w-0 h-2 rounded-full bg-[#2655C4] flex-shrink-0 overflow-hidden transition-all duration-200 group-hover:w-2 group-hover:mr-2" />
                                        <span
                                          className="transition-colors duration-200 group-hover:!text-[#2655C4]"
                                          style={{ fontFamily: 'Cabin, sans-serif', fontSize: '16px', fontStyle: linkFontStyle, color: '#061837', hoverColor: '#2655C4' }}
                                        >
                                          {title}
                                        </span>
                                      </div>
                                      <span className="flex-shrink-0 ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                          <path
                                            d="M12 5.14285C12 5.01758 11.92 4.85124 11.8389 4.77052L7.2675 0.168963C7.05407 -0.0400802 6.7083 -0.0643065 6.45948 0.147849C6.23702 0.337512 6.23148 0.707414 6.43719 0.913372L10.1068 4.60138H0.571433C0.255831 4.60138 0 4.84375 0 5.14273C0 5.44172 0.255831 5.68412 0.571433 5.68412H10.1068L6.43719 9.37213C6.23151 9.57806 6.24611 9.93888 6.45948 10.1376C6.68476 10.3475 7.05733 10.3288 7.2675 10.1165L11.8389 5.51496C11.9732 5.39015 11.9977 5.26996 12 5.14285Z"
                                            fill="#061837"
                                            className="transition-colors duration-200 group-hover:fill-[#2655C4]"
                                          />
                                        </svg>
                                      </span>
                                    </Link>
                                  ) : (
                                    <span
                                      className="py-3 block"
                                      style={{ fontFamily: 'Cabin, sans-serif', fontSize: '16px', fontStyle: linkFontStyle, color: '#061837' }}
                                    >
                                      {title}
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT IMAGE — 300px, full height cover */}
                  {hasImage && (
                    <div
                      className="flex-shrink-0 relative"
                      style={{ width: `${imageWidth}px`, minHeight: '200px' }}
                    >
                      <Image
                        src={menu.side_image}
                        alt=""
                        fill
                        sizes="300px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ))}
      </nav>
    </div>
    
  );
}
