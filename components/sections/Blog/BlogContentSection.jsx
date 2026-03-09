"use client";

import { useEffect, useState } from "react";
import BlogSlider from "../../Sliders/Blog_sliders/BlogSlider";

export default function BlogContentSection({ section }) {
  if (!section) return null;

  const { 
    heading,
    excerpt,
    content,
    author,
    published_date,
    reading_time,
    category,
  } = section;

  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    async function loadRelatedPosts() {
      try {
        const res = await fetch(
          `/wp-api/wp/v2/posts?_embed&per_page=6`
        );
        const data = await res.json();

        const formatted = data.map((post) => ({
          title: post.title?.rendered || '',
          excerpt: post.excerpt?.rendered?.replace(/<[^>]*>/g, '').slice(0, 100) + '...' || '',
          url: `/blog/${post.slug}`,
          image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/default-blog.jpg',
          category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'General',
          date: new Date(post.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
          readTime: `${Math.max(1, Math.ceil(post.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length / 200))} MIN READ`,
        }));

        setRelatedPosts(formatted);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    }

    loadRelatedPosts();
  }, []);

  return (
    <section 
      id="next-section" 
      className="w-full bg-white py-[100px] px-[80px]"
    >
      <div className="mx-auto">
        
        {/* CATEGORY TAG */}
        {category && (
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-[#2655C4] text-white text-[12px] sm:text-[14px] font-semibold uppercase tracking-wider rounded">
              {category}
            </span>
          </div>
        )}

        {/* BLOG HEADING */}
        {heading && (
          <h1 
            className="font-heading font-semibold text-[#061837]
              text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px]
              leading-tight mb-6"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        )}

        {/* META INFO */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#5C6C8A] text-[12px] sm:text-[14px] mb-8 pb-8 border-b border-[#E5E7EB]">
          {author && (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 1.5c-2.67 0-8 1.34-8 4v1.5h16v-1.5c0-2.66-5.33-4-8-4z" fill="currentColor"/>
              </svg>
              <span className="font-medium text-[#061837]">{author}</span>
            </div>
          )}
          {published_date && (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 2h-1V1a1 1 0 00-2 0v1H6V1a1 1 0 00-2 0v1H3a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zm0 11H3V6h10v7z" fill="currentColor"/>
              </svg>
              <span>{published_date}</span>
            </div>
          )}
          {reading_time && (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5A5.5 5.5 0 118 2.5a5.5 5.5 0 010 11z" fill="currentColor"/>
                <path d="M8.5 4.5h-1v4l3.5 2.1.5-.8-3-1.8V4.5z" fill="currentColor"/>
              </svg>
              <span>{reading_time} min read</span>
            </div>
          )}
        </div>

        {/* EXCERPT */}
        {excerpt && (
          <div
            className="text-[#5C6C8A] text-[16px] sm:text-[18px] leading-[28px] italic mb-10 pb-10 border-b border-[#E5E7EB]"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        )}

        {/* CONTENT */}
        {content && (
          <div
            className="
              prose prose-lg max-w-none
              [&_h2]:font-heading [&_h2]:text-[22px] [&_h2]:sm:text-[24px] [&_h2]:md:text-[28px]
              [&_h2]:font-semibold [&_h2]:text-[#061837] [&_h2]:mb-4 [&_h2]:mt-8
              [&_h3]:font-heading [&_h3]:text-[18px] [&_h3]:sm:text-[20px] [&_h3]:md:text-[22px]
              [&_h3]:font-semibold [&_h3]:text-[#061837] [&_h3]:mb-3 [&_h3]:mt-6
              [&_h4]:font-heading [&_h4]:text-[16px] [&_h4]:sm:text-[18px] [&_h4]:md:text-[20px]
              [&_h4]:font-semibold [&_h4]:text-[#061837] [&_h4]:mb-2 [&_h4]:mt-5
              [&_p]:text-[#000] [&_p]:text-[14px] [&_p]:sm:text-[16px] [&_p]:leading-[24px]
              [&_p]:sm:leading-[28px] [&_p]:mb-6
              [&_ul]:mb-6 [&_ul]:pl-6 [&_ul]:list-disc
              [&_ol]:mb-6 [&_ol]:pl-6 [&_ol]:list-decimal
              [&_li]:text-[#000] [&_li]:text-[14px] [&_li]:sm:text-[16px] [&_li]:leading-[24px]
              [&_li]:mb-2
              [&_a]:text-[#2655C4] [&_a]:underline [&_a]:hover:text-[#061837]
              [&_img]:rounded-[3px] [&_img]:my-8 [&_img]:w-full
              [&_blockquote]:border-l-4 [&_blockquote]:border-[#2655C4] [&_blockquote]:pl-6
              [&_blockquote]:italic [&_blockquote]:text-[#061837] [&_blockquote]:my-6
              [&_code]:bg-[#EAF1FF] [&_code]:px-2 [&_code]:py-1 [&_code]:rounded
              [&_code]:text-[#061837] [&_code]:text-[14px]
              [&_pre]:bg-[#061837] [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-[3px]
              [&_pre]:overflow-x-auto [&_pre]:my-6
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-6
              [&_th]:bg-[#EAF1FF] [&_th]:text-[#061837] [&_th]:font-semibold
              [&_th]:p-3 [&_th]:text-left [&_th]:border [&_th]:border-[#C4D0E6]
              [&_td]:p-3 [&_td]:border [&_td]:border-[#C4D0E6] [&_td]:text-[#000]
            "
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* RELATED POSTS SLIDER */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-16 border-t border-[#E5E7EB]">
            <h2 className="font-heading text-[28px] sm:text-[32px] md:text-[36px] font-semibold text-[#061837] mb-10">
              Related Articles
            </h2>
            <BlogSlider slides={relatedPosts} />
          </div>
        )}
      </div>
    </section>
  );
}
