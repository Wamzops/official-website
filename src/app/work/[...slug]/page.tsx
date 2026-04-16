import { CustomMDX, ScrollToHash } from "@/components";
import { ContentLayout } from "@/components/ContentLayout";
import { about, baseURL, person, work } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import {
  getProjectFolders,
  getFolderSidebarPosts,
  extractHeadings,
} from "@/utils/utils";
import { AvatarGroup, Media, Meta, Schema, Text } from "@once-ui-system/core";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const projects = getProjectFolders(["src", "app", "work", "projects"]);
  const params: { slug: string[] }[] = [];

  for (const project of projects) {
    // /work/project-slug → will redirect to first section
    params.push({ slug: [project.slug] });
    for (const section of project.sections) {
      params.push({ slug: [project.slug, section.slug] });
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
  const projectSlug = slug[0];
  const sectionSlug = slug[1];

  const projects = getProjectFolders(["src", "app", "work", "projects"]);
  const project = projects.find((p) => p.slug === projectSlug);
  if (!project) return {};

  const section = sectionSlug
    ? project.sections.find((s) => s.slug === sectionSlug)
    : null;
  const title = section
    ? `${project.metadata.title} — ${section.title}`
    : project.metadata.title;

  return Meta.generate({
    title,
    description: project.metadata.summary,
    baseURL,
    image:
      project.metadata.images?.[0] ||
      `/api/og/generate?title=${encodeURIComponent(title)}`,
    path: `${work.path}/${slug.join("/")}`,
  });
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const projectSlug = slug[0];
  const sectionSlug = slug[1];

  const projects = getProjectFolders(["src", "app", "work", "projects"]);
  const project = projects.find((p) => p.slug === projectSlug);
  if (!project) notFound();

  // If no section specified, redirect to first section file
  if (!sectionSlug) {
    const firstSection = project.sections[0];
    if (firstSection) {
      redirect(`/work/${projectSlug}/${firstSection.slug}`);
    }
  }

  const sidebarPosts = getFolderSidebarPosts(projects);

  const currentSection = project.sections.find((s) => s.slug === sectionSlug);
  if (!currentSection) notFound();

  const allSections = project.sections;
  const currentIdx = allSections.findIndex((s) => s.slug === sectionSlug);
  const prevSection = currentIdx > 0 ? allSections[currentIdx - 1] : null;
  const nextSection =
    currentIdx < allSections.length - 1 ? allSections[currentIdx + 1] : null;

  // TOC from H2 headings in current section
  const sectionHeadings = extractHeadings(currentSection.content);

  const isFirstSection = currentIdx === 0;
  const avatars =
    project.metadata.team
      ?.map((m) => ({ src: m.avatar }))
      .filter((a) => a.src) || [];

  return (
    <ContentLayout
      posts={sidebarPosts}
      category="work"
      tocHeadings={sectionHeadings}
    >
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${slug.join("/")}`}
        title={project.metadata.title}
        description={project.metadata.summary}
        datePublished={project.metadata.publishedAt}
        dateModified={project.metadata.publishedAt}
        image={
          project.metadata.images?.[0] ||
          `/api/og/generate?title=${encodeURIComponent(project.metadata.title)}`
        }
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* ---- Section content ---- */}
      <div>
        {/* Show full project header on the first section only */}
        {isFirstSection && (
          <div style={{ marginBottom: "2rem" }}>
            {/* Cover image */}
            {project.metadata.images?.[0] && (
              <div
                style={{
                  marginBottom: "1.5rem",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <Media
                  priority
                  aspectRatio="16 / 9"
                  radius="m"
                  alt={project.metadata.title}
                  src={project.metadata.images[0]}
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
              {avatars[0] && (
                <img
                  src={avatars[0].src}
                  alt={person.name}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--doc-text)",
                  }}
                >
                  {person.name}
                </span>
                {project.metadata.publishedAt && (
                  <>
                    <span style={{ opacity: 0.3 }}>·</span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--doc-secondary)",
                      }}
                    >
                      {formatDate(project.metadata.publishedAt)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 style={{ marginBottom: "0.75rem" }}>
              {project.metadata.title}
            </h1>

            {/* Tag / role badge */}
            {project.metadata.role && (
              <span
                className="doc-section-badge"
                style={{
                  marginBottom: "1.5rem",
                  display: "inline-block",
                  backgroundColor:
                    project.metadata.role === "Lead" ? "#2563eb" : "#16a34a",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "6px",
                }}
              >
                {project.metadata.role}
              </span>
            )}
          </div>
        )}

        {/* Section heading (non-first sections) */}
        {!isFirstSection && (
          <h1 style={{ marginBottom: "1.5rem" }}>{currentSection.title}</h1>
        )}

        {/* Article body */}
        <article>
          <CustomMDX source={currentSection.content} />
        </article>

        {/* Docusaurus Pagination — using Link for instant navigation */}
        <div className="doc-pagination">
          {prevSection ? (
            <Link
              href={`/work/${projectSlug}/${prevSection.slug}`}
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
              href={`/work/${projectSlug}/${nextSection.slug}`}
              className="pagination-card next"
              prefetch
            >
              <span className="pagination-card-label">Next →</span>
              <span className="pagination-card-title">{nextSection.title}</span>
            </Link>
          ) : (
            <Link href="/work" className="pagination-card next" prefetch>
              <span className="pagination-card-label">Done</span>
              <span className="pagination-card-title">Back to Work</span>
            </Link>
          )}
        </div>
      </div>

      <ScrollToHash />
    </ContentLayout>
  );
}
