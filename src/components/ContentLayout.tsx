"use client";

import { useState } from "react";
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
  const pathname = usePathname() || "";

  // Derive breadcrumb post title
  const pathParts = pathname.split("/").filter(Boolean);
  const currentPostSlug = pathParts[1];
  const currentPost = posts.find((p) => p.slug === currentPostSlug);
  const currentSectionSlug = pathParts[2];
  const currentSection = currentPost?.headings.find(
    (h) => h.level === 1 && h.slug === currentSectionSlug
  );

  return (
    <>
      {/* ---- Mobile top bar ---- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1.25rem",
          borderBottom: "1px solid var(--doc-border)",
          backgroundColor: "var(--doc-sidebar-bg)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
        className="doc-mobile-bar"
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "1px solid var(--doc-border)",
            borderRadius: "6px",
            padding: "0.4rem 0.75rem",
            cursor: "pointer",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "var(--doc-secondary)",
          }}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Menu
        </button>
        <span style={{ fontSize: "0.8125rem", color: "var(--doc-secondary)", fontWeight: 500 }}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      </div>

      {/* ---- Mobile Drawer ---- */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer panel */}
          <div
            style={{
              position: "relative",
              width: "min(85vw, 320px)",
              height: "100%",
              background: "var(--doc-sidebar-bg)",
              overflowY: "auto",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1rem 0.5rem",
                borderBottom: "1px solid var(--doc-border)",
              }}
            >
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--doc-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Navigation
              </span>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--doc-secondary)", padding: "0.25rem" }}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <ContentSidebar
              posts={posts}
              category={category}
              isMobile
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ---- 3-Column Layout ---- */}
      <div className="doc-layout-root">
        {/* LEFT: Sidebar */}
        <aside className="doc-sidebar-col doc-sidebar-responsive">
          <ContentSidebar posts={posts} category={category} />
        </aside>

        {/* CENTER: Content */}
        <main className="doc-content-col">
          <div className="doc-content-inner">
            {/* Breadcrumb */}
            <nav className="doc-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" prefetch>Home</Link>
              <span>›</span>
              <Link href={`/${category}`} prefetch>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
              {currentPost && (
                <>
                  <span>›</span>
                  <Link href={`/${category}/${currentPost.slug}`} prefetch>
                    {currentPost.title}
                  </Link>
                </>
              )}
              {currentSection && (
                <>
                  <span>›</span>
                  <span style={{ color: "var(--doc-text)", fontWeight: 500 }}>
                    {currentSection.text}
                  </span>
                </>
              )}
            </nav>

            {/* Page content */}
            <div className="doc-content">{children}</div>
          </div>
        </main>

        {/* RIGHT: TOC */}
        <aside className="doc-toc-col doc-toc-responsive">
          <DocTableOfContents headings={tocHeadings} />
        </aside>
      </div>

      <style>{`
        /* Hide mobile bar on large screens */
        @media (min-width: 997px) {
          .doc-mobile-bar { display: none !important; }
        }
        /* Hide sidebar col on mobile */
        @media (max-width: 996px) {
          .doc-sidebar-responsive { display: none !important; }
          .doc-layout-root { height: auto; overflow: visible; flex-direction: column; }
          .doc-content-col { height: auto; overflow: visible; }
        }
        /* Hide TOC on tablet/mobile */
        @media (max-width: 1200px) {
          .doc-toc-responsive { display: none !important; }
        }
      `}</style>
    </>
  );
};
