"use client";

import { useState, useEffect } from "react";
import type { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ContentSidebar } from "@/components/ContentSidebar";
import { DocTableOfContents } from "@/components/DocTableOfContents";
import type { Heading, Post } from "@/components/types";
import "@/resources/theme-ui.css";

export interface ContentLayoutProps {
  children: ReactNode;
  posts: Post[];
  category: string;
  tocHeadings?: Heading[];
}

export const ContentLayout: FC<ContentLayoutProps> = ({
  children,
  posts,
  category,
  tocHeadings = [],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileTOCActive, setIsMobileTOCActive] = useState(false);
  const pathname = usePathname() || "";

  // Handle body locking when drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("body-locked");
    } else {
      document.body.classList.remove("body-locked");
    }
    return () => document.body.classList.remove("body-locked");
  }, [isMobileMenuOpen]);

  // Derive breadcrumb post title
  const pathParts = pathname.split("/").filter(Boolean);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const currentPostSlug = pathParts[1];
  const currentPost = posts.find((p) => p.slug === currentPostSlug);
  const currentSectionSlug = pathParts[2];
  const currentSection = currentPost?.headings.find(
    (h) => h.level === 1 && h.slug === currentSectionSlug
  );

  // Breadcrumb text logic
  const breadcrumbText = currentSection 
    ? currentSection.text 
    : currentPost 
      ? currentPost.title 
      : categoryLabel;

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* ---- Mobile Header (Hamburger + Breadcrumbs) ---- */}
      <div className="doc-mobile-nav-bar">
        <button
          className="doc-mobile-hamburger"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
        <div className="doc-mobile-breadcrumbs">
          <Link href={`/${category}`}>{categoryLabel}</Link>
          {currentPost && (
            <>
              <span style={{ margin: "0 0.4rem", opacity: 0.4 }}>›</span>
              <span>{currentPost.title}</span>
            </>
          )}
        </div>
      </div>

      {/* ---- Sidebar Drawer (Full-height slide-in) ---- */}
      {isMobileMenuOpen && (
        <div className="doc-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="doc-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <ContentSidebar
              posts={posts}
              category={category}
              isMobile
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="doc-layout-root">
        {/* DESKTOP SIDEBAR */}
        <aside className="doc-sidebar-col">
          <ContentSidebar posts={posts} category={category} />
        </aside>

        {/* CONTENT AREA */}
        <main className="doc-content-col">
          <div className="doc-content-inner">
            {/* MOBILE ONLY: TOC Accordion */}
            {tocHeadings && tocHeadings.length > 0 && (
              <div className="doc-mobile-toc-wrapper">
                <button
                  className="doc-mobile-toc-toggle"
                  onClick={() => setIsMobileTOCActive(!isMobileTOCActive)}
                >
                  <span>On this page</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{
                      transform: isMobileTOCActive ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className={`doc-mobile-toc-content ${isMobileTOCActive ? "open" : ""}`}>
                  <DocTableOfContents 
                    headings={tocHeadings} 
                    onItemClick={() => setIsMobileTOCActive(false)}
                  />
                </div>
              </div>
            )}

            {/* Content wrapper */}
            <div className="doc-content">{children}</div>
          </div>
        </main>

        {/* DESKTOP TOC */}
        <aside className="doc-toc-col">
          <DocTableOfContents headings={tocHeadings} />
        </aside>
      </div>
    </div>
  );
};
