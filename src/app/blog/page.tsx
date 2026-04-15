import { ContentLayout } from "@/components/ContentLayout";
import { baseURL, blog, person } from "@/resources";
import { Meta, Schema } from "@once-ui-system/core";
import { getProjectFolders, getFolderSidebarPosts } from "@/utils/utils";
import { LibraryClient } from "@/components/LibraryClient";

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

const tagToColor: Record<string, string> = {
  Design: "dot-purple",
  "Open-Source": "dot-green",
  Product: "dot-yellow",
  Personal: "dot-teal",
  Engineering: "dot-blue",
  Analytics: "dot-green",
};

const filterCategories = [
  { label: "Engineering", dot: "dot-blue" },
  { label: "Product", dot: "dot-yellow" },
  { label: "Design", dot: "dot-purple" },
  { label: "Analytics", dot: "dot-green" },
  { label: "Personal", dot: "dot-teal" },
];

export default function Blog() {
  const posts = getProjectFolders(["src", "app", "blog", "posts"]);
  const sidebarPosts = getFolderSidebarPosts(posts);

  return (
    <ContentLayout posts={sidebarPosts} category="blog">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`/api/og/generate?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <div style={{ paddingBottom: "4rem" }}>
        {/* Modern Header */}
        <div style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>{blog.title}</h1>
          <p style={{ fontSize: "1.125rem", color: "var(--doc-secondary)", maxWidth: "600px" }}>
            {blog.description}
          </p>
        </div>

        {/* Interactive Library Client */}
        <LibraryClient
          initialPosts={posts}
          categories={filterCategories}
          tagToColor={tagToColor}
          type="blog"
          baseHref="/blog"
          searchPlaceholder="Search blog posts..."
        />
      </div>
    </ContentLayout>
  );
}

