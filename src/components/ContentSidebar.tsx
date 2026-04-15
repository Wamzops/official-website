"use client";

import { useState } from "react";
import type { FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { Post } from "@/components/types";

interface ContentSidebarProps {
  posts: Post[];
  category: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export const ContentSidebar: FC<ContentSidebarProps> = ({
  posts,
  category,
  isMobile,
  onClose,
}) => {
  const pathname = usePathname() || "";

  // Auto-expand the active post on load
  const activePost = posts.find((p) => pathname.includes(`/${p.slug}`));
  const [expandedSlugs, setExpandedSlugs] = useState<string[]>(
    activePost ? [activePost.slug] : []
  );

  const toggleExpand = (slug: string) => {
    setExpandedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const categoryLabel =
    category === "work"
      ? "Work Projects"
      : category === "blog"
      ? "Blog Posts"
      : "Musings";

  const baseUrl = `/${category}`;

  return (
    <nav
      aria-label={`${category} navigation`}
      style={{ padding: "1.5rem 0.75rem", minHeight: "100%" }}
    >
      {/* Category label */}
      <div className="sidebar-category-label">{categoryLabel}</div>

      {/* Post list */}
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {posts.map((post) => {
          const postUrl = `${baseUrl}/${post.slug}`;
          const isPostActive = pathname.startsWith(postUrl);
          const isExpanded = expandedSlugs.includes(post.slug) || isPostActive;

          // H1-level headings for sub-items (level = 1)
          const h1Sections = post.headings.filter((h) => h.level === 1);
          const hasChildren = h1Sections.length > 0;

          // Project title links to first section file (not the index)
          const firstSectionSlug = h1Sections[0]?.slug;
          const titleHref = firstSectionSlug ? `${postUrl}/${firstSectionSlug}` : postUrl;
          const isTitleActive = isPostActive && !pathname.split("/")[3];

          return (
            <li key={post.slug} style={{ margin: "1px 0" }}>
              {/* Post title row */}
              <div
                className={`sidebar-item ${isTitleActive ? "active" : ""}`}
                onClick={() => {
                  if (hasChildren) toggleExpand(post.slug);
                }}
                style={{ gap: "0.5rem" }}
              >
                <Link
                  href={titleHref}
                  prefetch={true}
                  style={{
                    flex: 1,
                    color: "inherit",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isMobile && onClose) onClose();
                  }}
                >
                  {post.title}
                </Link>
                {hasChildren && (
                  <svg
                    className={`sidebar-chevron ${isExpanded ? "expanded" : ""}`}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ flexShrink: 0, opacity: 0.5 }}
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* Sub-items: H1 sections */}
              {isExpanded && hasChildren && (
                <ul
                  style={{
                    listStyle: "none",
                    margin: "2px 0",
                    padding: "0 0 0 0.75rem",
                  }}
                >
                  {h1Sections.map((section) => {
                    const sectionUrl = `${postUrl}/${section.slug}`;
                    const isActive =
                      pathname === sectionUrl || pathname.startsWith(sectionUrl + "/");

                    return (
                      <li key={section.slug} style={{ margin: "1px 0" }}>
                        <Link
                          href={sectionUrl}
                          prefetch={true}
                          className={`sidebar-sub-item ${isActive ? "active" : ""}`}
                          onClick={() => {
                            if (isMobile && onClose) onClose();
                          }}
                        >
                          {section.text}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
