"use client";

import { useEffect, useState, useCallback } from "react";
import type { FC } from "react";
import Link from "next/link";
import type { Heading } from "@/components/types";

interface DocTableOfContentsProps {
  headings: Heading[];
  onItemClick?: () => void;
}

export const DocTableOfContents: FC<DocTableOfContentsProps> = ({ headings, onItemClick }) => {
  const [activeId, setActiveId] = useState<string>("");

  const moveTo = useCallback((id: string) => {
    setActiveId(id);
    if (onItemClick) onItemClick();
  }, [onItemClick]);

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            moveTo(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0% 0% -75% 0%", threshold: 0 }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings, moveTo]);

  // Only show H2 headings in "On this page" (H1 = section nav, H3 = too granular)
  const tocHeadings = headings.filter((h) => h.level === 2);

  if (!tocHeadings || tocHeadings.length === 0) return null;

  return (
    <div className="toc-container">
      <div className="toc-label">On this page</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {tocHeadings.map((heading) => {
          const isActive = activeId === heading.slug;
          return (
            <li key={heading.slug}>
              <Link
                href={`#${heading.slug}`}
                className={`toc-item ${isActive ? "active" : ""} ${
                  heading.level === 3 ? "level-3" : ""
                }`}
                onClick={() => moveTo(heading.slug)}
              >
                {heading.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
