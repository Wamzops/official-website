"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";

interface ProjectFolder {
  slug: string;
  metadata: {
    title: string;
    summary: string;
    publishedAt: string;
    image?: string;
    images: string[];
    tag?: string;
    role?: string;
  };
  sections: { slug: string }[];
}

interface FilterCategory {
  label: string;
  dot: string;
}

interface LibraryClientProps {
  initialPosts: ProjectFolder[];
  categories: FilterCategory[];
  tagToColor: Record<string, string>;
  type: "blog" | "musings" | "work";
  baseHref: string;
  searchPlaceholder: string;
}

export const LibraryClient = ({
  initialPosts,
  categories,
  tagToColor,
  type,
  baseHref,
  searchPlaceholder,
}: LibraryClientProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const metadata = post.metadata;
      const tagLabel = (type === "work" ? metadata.role : metadata.tag) || "";
      
      const matchesCategory =
        activeCategory === "All" || tagLabel.toLowerCase() === activeCategory.toLowerCase();
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        metadata.title.toLowerCase().includes(searchLower) ||
        metadata.summary.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, searchQuery, activeCategory, type]);

  return (
    <>
      {/* Filter & Search Bar */}
      <div className="modern-filter-container">
        <div className="modern-filter-bar">
          <div
            className={`filter-chip ${activeCategory === "All" ? "active" : ""}`}
            onClick={() => setActiveCategory("All")}
          >
            All
          </div>
          {categories.map((cat) => (
            <div
              key={cat.label}
              className={`filter-chip ${activeCategory === cat.label ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.label)}
            >
              <div className={`status-dot ${cat.dot}`} />
              {cat.label}
            </div>
          ))}
        </div>
        <div className="modern-search">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Modern Grid */}
      <div className="modern-card-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const firstSection = post.sections?.[0];
            const href = firstSection
              ? `${baseHref}/${post.slug}/${firstSection.slug}`
              : `${baseHref}/${post.slug}`;

            const metadata = post.metadata;
            const tagLabel = (type === "work" ? metadata.role : metadata.tag) || "General";
            const dotClass = tagToColor[tagLabel] || "dot-blue";
            const badgeLabel = type === "work" ? "case study" : type === "musings" ? "musing" : "doc";
            const cardImage = type === "work" ? metadata.images?.[0] : metadata.image;

            return (
              <Link key={post.slug} href={href} className="modern-card" prefetch>
                {cardImage && (
                  <img src={cardImage} alt={metadata.title} className="modern-card-image" />
                )}
                <div className="modern-card-body">
                  <div className="modern-card-header">
                    <h2 className="modern-card-title">{metadata.title}</h2>
                    <span className="modern-card-badge">{badgeLabel}</span>
                  </div>
                  <p className="modern-card-description">{metadata.summary}</p>
                </div>
                <div className="modern-card-footer">
                  <div className="tag-pill">
                    <div className={`status-dot ${dotClass}`} />
                    {tagLabel}
                  </div>
                  <div className="tag-pill" style={{ opacity: 0.6 }}>
                    {formatDate(metadata.publishedAt)}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{ padding: "4rem 0", textAlign: "center", width: "100%", gridColumn: "1 / -1", opacity: 0.5 }}>
            No results found for "{searchQuery}" in {activeCategory}
          </div>
        )}
      </div>
    </>
  );
};
