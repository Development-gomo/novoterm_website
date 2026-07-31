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
      className="geo-agent-section"
    >
      <div className="w-full mx-auto">
        {section_label && (
          <p className="text-sm font-semibold uppercase tracking-wide mb-4 opacity-80">
            {section_label}
          </p>
        )}
        {content && (
          <div
            className="prose prose-lg max-w-none text-xs md:text-base text-center"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
}
