import { ContentLayout } from "@/components/ContentLayout";
import { baseURL, musings, person } from "@/resources";
import { Meta, Schema } from "@once-ui-system/core";
import { getProjectFolders, getFolderSidebarPosts } from "@/utils/utils";
import { LibraryClient } from "@/components/LibraryClient";

export async function generateMetadata() {
  return Meta.generate({
    title: musings.title,
    description: musings.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(musings.title)}`,
    path: musings.path,
  });
}

const tagToColor: Record<string, string> = {
  Design: "dot-purple",
  "Open-Source": "dot-green",
  Product: "dot-yellow",
  Personal: "dot-teal",
  Life: "dot-orange",
  Mindset: "dot-purple",
  Development: "dot-green",
};

const filterCategories = [
  { label: "Mindset", dot: "dot-purple" },
  { label: "Development", dot: "dot-green" },
  { label: "Personal", dot: "dot-teal" },
  { label: "Life", dot: "dot-orange" },
];

export default function Musings() {
  const posts = getProjectFolders(["src", "app", "musings", "musings"]);
  const sidebarPosts = getFolderSidebarPosts(posts);

  return (
    <ContentLayout posts={sidebarPosts} category="musings">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={musings.title}
        description={musings.description}
        path={musings.path}
        image={`/api/og/generate?title=${encodeURIComponent(musings.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <div style={{ paddingBottom: "4rem" }}>
        {/* Modern Header */}
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>{musings.title}</h1>
          <p style={{ fontSize: "1.125rem", color: "var(--doc-secondary)", maxWidth: "600px" }}>
            {musings.description}
          </p>
        </div>

        {/* Interactive Library Client */}
        <LibraryClient
          initialPosts={posts}
          categories={filterCategories}
          tagToColor={tagToColor}
          type="musings"
          baseHref="/musings"
          searchPlaceholder="Search musings..."
        />
      </div>
    </ContentLayout>
  );
}
