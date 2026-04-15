import { CustomMDX, ScrollToHash } from "@/components";
import { ContentLayout } from "@/components/ContentLayout";
import { about, baseURL, musings, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getProjectFolders, getFolderSidebarPosts, extractHeadings } from "@/utils/utils";
import { Media, Meta, Schema, Text } from "@once-ui-system/core";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const posts = getProjectFolders(["src", "app", "musings", "musings"]);
  const params: { slug: string[] }[] = [];

  for (const post of posts) {
    params.push({ slug: [post.slug] });
    for (const section of post.sections) {
      params.push({ slug: [post.slug, section.slug] });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const postSlug = slug[0];
  const sectionSlug = slug[1];

  const posts = getProjectFolders(["src", "app", "musings", "musings"]);
  const post = posts.find((p) => p.slug === postSlug);
  if (!post) return {};

  const section = sectionSlug ? post.sections.find((s) => s.slug === sectionSlug) : null;
  const title = section ? `${post.metadata.title} — ${section.title}` : post.metadata.title;

  return Meta.generate({
    title,
    description: post.metadata.summary,
    baseURL,
    image:
      post.metadata.image ||
      post.metadata.images?.[0] ||
      `/api/og/generate?title=${encodeURIComponent(title)}`,
    path: `${musings.path}/${slug.join("/")}`,
  });
}

export default async function MusingPost({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const postSlug = slug[0];
  const sectionSlug = slug[1];

  const posts = getProjectFolders(["src", "app", "musings", "musings"]);
  const post = posts.find((p) => p.slug === postSlug);
  if (!post) notFound();

  // If no section specified, redirect to first section file
  if (!sectionSlug) {
    const firstSection = post.sections[0];
    if (firstSection) {
      redirect(`/musings/${postSlug}/${firstSection.slug}`);
    }
  }

  const sidebarPosts = getFolderSidebarPosts(posts);

  const currentSection = post.sections.find((s) => s.slug === sectionSlug);
  if (!currentSection) notFound();

  const allSections = post.sections;
  const currentIdx = allSections.findIndex((s) => s.slug === sectionSlug);
  const prevSection = currentIdx > 0 ? allSections[currentIdx - 1] : null;
  const nextSection = currentIdx < allSections.length - 1 ? allSections[currentIdx + 1] : null;

  // TOC from H2 headings in current section
  const sectionHeadings = extractHeadings(currentSection.content);

  const isFirstSection = currentIdx === 0;

  return (
    <ContentLayout posts={sidebarPosts} category="musings" tocHeadings={sectionHeadings}>
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${musings.path}/${slug.join("/")}`}
        title={post.metadata.title}
        description={post.metadata.summary}
        datePublished={post.metadata.publishedAt}
        dateModified={post.metadata.publishedAt}
        image={
          post.metadata.image ||
          post.metadata.images?.[0] ||
          `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`
        }
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* ---- Section content ---- */}
      <div>
        {/* Show full post header on the first section only */}
        {isFirstSection && (
          <div style={{ marginBottom: "2rem" }}>
            {/* Cover image */}
            {(post.metadata.image || post.metadata.images?.[0]) && (
              <div style={{ marginBottom: "1.5rem", borderRadius: "12px", overflow: "hidden" }}>
                <Media
                  priority
                  aspectRatio="16 / 9"
                  radius="m"
                  alt={post.metadata.title}
                  src={post.metadata.image || post.metadata.images?.[0]}
                />
              </div>
            )}

            {/* Meta row: avatar + date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <img
                src={person.avatar}
                alt={person.name}
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--doc-text)" }}>
                  {person.name}
                </span>
                {post.metadata.publishedAt && (
                  <>
                    <span style={{ opacity: 0.3 }}>·</span>
                    <span style={{ fontSize: "0.875rem", color: "var(--doc-secondary)" }}>
                      {formatDate(post.metadata.publishedAt)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 style={{ marginBottom: "0.75rem" }}>{post.metadata.title}</h1>

            {/* Tag badge */}
            {post.metadata.tag && (
              <span
                className="doc-section-badge"
                style={{ marginBottom: "1.5rem", display: "inline-block" }}
              >
                {post.metadata.tag}
              </span>
            )}
          </div>
        )}

        {/* Section heading (non-first sections) */}
        {!isFirstSection && <h1 style={{ marginBottom: "1.5rem" }}>{currentSection.title}</h1>}

        {/* Article body */}
        <article>
          <CustomMDX source={currentSection.content} />
        </article>

        {/* Docusaurus Pagination — using Link for instant navigation */}
        <div className="doc-pagination">
          {prevSection ? (
            <Link
              href={`/musings/${postSlug}/${prevSection.slug}`}
              className="pagination-card prev"
              prefetch
            >
              <span className="pagination-card-label">← Previous</span>
              <span className="pagination-card-title">{prevSection.title}</span>
            </Link>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          {nextSection ? (
            <Link
              href={`/musings/${postSlug}/${nextSection.slug}`}
              className="pagination-card next"
              prefetch
            >
              <span className="pagination-card-label">Next →</span>
              <span className="pagination-card-title">{nextSection.title}</span>
            </Link>
          ) : (
            <Link href="/musings" className="pagination-card next" prefetch>
              <span className="pagination-card-label">Done</span>
              <span className="pagination-card-title">Back to Musings</span>
            </Link>
          )}
        </div>
      </div>

      <ScrollToHash />
    </ContentLayout>
  );
}

