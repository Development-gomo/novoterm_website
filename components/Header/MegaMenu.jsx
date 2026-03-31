import { useState, useRef } from "react";
import Link from "next/link";

export default function MegaMenu({ menuData }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const closeTimer = useRef(null);

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
                    {menu.columns && menu.columns.some(col => col.card && (col.card.title || col.card.description || col.card.button_link)) && (
                      <div className="flex mb-6" style={{ gap: '20px' }}>
                        {menu.columns.map((col, cIdx) => (
                          col.card && (col.card.title || col.card.description || col.card.button_link) ? (
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
                        const hasCard = !!(col.card && (col.card.title || col.card.description || col.card.button_link));
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
                                      <div className="flex items-center overflow-hidden">
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
                      <img
                        src={menu.side_image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
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