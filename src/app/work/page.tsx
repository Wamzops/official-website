import { ContentLayout } from "@/components/ContentLayout";
import { about, baseURL, person, work } from "@/resources";
import { Meta, Schema } from "@once-ui-system/core";
import { getProjectFolders, getFolderSidebarPosts } from "@/utils/utils";
import { LibraryClient } from "@/components/LibraryClient";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

const tagToColor: Record<string, string> = {
  Design: "dot-purple",
  "Open-Source": "dot-green",
  Product: "dot-yellow",
  Personal: "dot-teal",
  Engineering: "dot-blue",
  Analytics: "dot-green",
  Strategy: "dot-orange",
};

const filterCategories = [
  { label: "Engineering", dot: "dot-blue" },
  { label: "Product", dot: "dot-yellow" },
  { label: "Design", dot: "dot-purple" },
  { label: "Analytics", dot: "dot-green" },
  { label: "Strategy", dot: "dot-orange" },
];

export default function Work() {
  const projects = getProjectFolders(["src", "app", "work", "projects"]);
  const sidebarPosts = getFolderSidebarPosts(projects);

  return (
    <ContentLayout posts={sidebarPosts} category="work">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <div style={{ paddingBottom: "4rem" }}>
        {/* Modern Header */}
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>{work.title}</h1>
          <p style={{ fontSize: "1.125rem", color: "var(--doc-secondary)", maxWidth: "600px" }}>
            {work.description}
          </p>
        </div>

        {/* Interactive Library Client */}
        <LibraryClient
          initialPosts={projects}
          categories={filterCategories}
          tagToColor={tagToColor}
          type="work"
          baseHref="/work"
          searchPlaceholder="Search projects..."
        />
      </div>
    </ContentLayout>
  );
}
