import React from 'react';

export default function GeoAgentSection({
  content = '',
  bg_color = '#e3edff',
  font_color = '#e3edff',
  section_label = '',
  sectionId = '',
}) {
  return (
    <section
      id={sectionId}
      style={{
        backgroundColor: bg_color,
        color: font_color,
      }}
      className="geo-agent-section -mb-[70px] md:-mb-[50px]"
    >
      <div className="max-w-4xl mx-auto">
        {section_label && (
          <p className="text-sm font-semibold uppercase tracking-wide mb-4 opacity-80">
            {section_label}
          </p>
        )}
        {content && (
          <div
            className="prose prose-lg max-w-none text-xs md:text-base"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
}
