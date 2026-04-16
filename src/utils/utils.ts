import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  role?: string;
  link?: string;
};

import { notFound } from "next/navigation";

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return [];
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    subtitle: data.subtitle || "",
    publishedAt: data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || "",
    role: data.role || "",
    team: data.team || [],
    link: data.link || "",
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles
    .map((file) => {
      const data = readMDXFile(path.join(dir, file));
      if (!data) return null;

      const { metadata, content } = data;
      const slug = path.basename(file, path.extname(file));

      return {
        metadata,
        slug,
        content,
      };
    })
    .filter((post): post is { metadata: Metadata; slug: string; content: string } => post !== null);
}

export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(/* turbopackIgnore: true */ process.cwd(), ...customPath);
  return getMDXData(postsDir);
}

export function extractHeadings(content: string) {
  // Extract H1 AND H2 headings for sidebar/TOC display
  const headingRegex = /^(#{1,3})\s+(.*)$/gm;
  const headings = [];
  const slugCounts: Record<string, number> = {};
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      let slug = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      
      if (slugCounts[slug] !== undefined) {
        slugCounts[slug]++;
        slug = `${slug}-${slugCounts[slug]}`;
      } else {
        slugCounts[slug] = 0;
      }

      headings.push({ level, text, slug });
  }

  return headings;
}

export function splitPostIntoSections(content: string) {
  // Split on H1 (#) so each major section is its own navigable page
  const h1Regex = /^#\s+(.*)$/gm;
  const sections: { title: string; slug: string; content: string }[] = [];
  const slugCounts: Record<string, number> = {};

  let firstMatch = h1Regex.exec(content);

  if (!firstMatch) {
      // No H1 found — treat entire content as one overview section
      sections.push({
          title: "Overview",
          slug: "overview",
          content: content.trim()
      });
      return sections;
  }

  // Content before the first H1 = intro preamble
  const preamble = content.substring(0, firstMatch.index).trim();
  if (preamble) {
      sections.push({
          title: "Introduction",
          slug: "introduction",
          content: preamble
      });
  }

  // Reset and iterate all H1 matches
  h1Regex.lastIndex = 0;
  const allMatches: RegExpExecArray[] = [];
  let m: RegExpExecArray | null;
  while ((m = h1Regex.exec(content)) !== null) {
      allMatches.push(m);
  }

  for (let i = 0; i < allMatches.length; i++) {
      const match = allMatches[i];
      const title = match[1].trim();
      let slug = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      
      if (slugCounts[slug] !== undefined) {
        slugCounts[slug]++;
        slug = `${slug}-${slugCounts[slug]}`;
      } else {
        slugCounts[slug] = 0;
      }

      const startIndex = match.index + match[0].length;
      const endIndex = i + 1 < allMatches.length ? allMatches[i + 1].index : content.length;

      sections.push({
          title,
          slug,
          content: content.substring(startIndex, endIndex).trim()
      });
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Folder-based project structure
// Each project is a FOLDER inside the base dir, e.g.:
//   /work/projects/nighttime-lights/
//     index.mdx          ← project metadata + overview content
//     project-summary.mdx
//     project-checklist.mdx
//     additional-notes.mdx
// ---------------------------------------------------------------------------

type SectionFile = {
  slug: string;        // filename without .mdx, used as URL segment
  title: string;       // from frontmatter "title" field
  order: number;       // from frontmatter "order" field (default 99)
  content: string;
  headings: ReturnType<typeof extractHeadings>;
};

type ProjectFolder = {
  slug: string;        // folder name
  metadata: {
    title: string;
    subtitle?: string;
    publishedAt: string;
    summary: string;
    image?: string;
    images: string[];
    tag?: string;
    team: Team[];
    role?: string;
    link?: string;
  };
  overview: string;    // content from index.mdx
  sections: SectionFile[];
};

/**
 * Read all project folders from a base directory.
 * Returns an array of ProjectFolder objects.
 */
export function getProjectFolders(basePath: string[]) {
  const baseDir = path.join(/* turbopackIgnore: true */ process.cwd(), ...basePath);

  if (!fs.existsSync(baseDir)) {
    console.warn(`Base dir not found: ${baseDir}`);
    return [];
  }

  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  const folders = entries.filter((e) => e.isDirectory());

  const results: {
    slug: string;
    metadata: {
      title: string; subtitle: string; publishedAt: string; summary: string;
      image: string; images: string[]; tag: string; team: Team[]; role: string; link: string;
    };
    overview: string;
    sections: SectionFile[];
  }[] = [];

  for (const folder of folders) {
    const folderPath = path.join(baseDir, folder.name);
    const indexPath = path.join(folderPath, "index.mdx");
    if (!fs.existsSync(indexPath)) continue;

    const indexRaw = fs.readFileSync(indexPath, "utf-8");
    const { data, content: overviewContent } = matter(indexRaw);

    const metadata = {
      title: data.title || folder.name,
      subtitle: data.subtitle || "",
      publishedAt: data.publishedAt || "",
      summary: data.summary || "",
      image: data.image || "",
      images: data.images || [],
      tag: data.tag || "",
      team: data.team || [],
      role: data.role || "",
      link: data.link || "",
    };

    const mdxFiles = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".mdx") && f !== "index.mdx")
      .sort();

    const sections: SectionFile[] = mdxFiles
      .map((file) => {
        const filePath = path.join(folderPath, file);
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data: sd, content: sectionContent } = matter(raw);
        const sectionSlug = path.basename(file, ".mdx");
        const title = sd.title || sectionSlug.replace(/-/g, " ").replace(/^\d+-/, "").trim();
        return {
          slug: sectionSlug,
          title,
          order: sd.order ?? 99,
          content: sectionContent.trim(),
          headings: extractHeadings(sectionContent),
        };
      })
      .sort((a, b) => a.order - b.order);

    const projectSlug = folder.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    results.push({ slug: projectSlug, metadata, overview: overviewContent.trim(), sections });
  }

  return results;
}


/**
 * Get sidebar-compatible post list from folder-based projects.
 * Each ProjectFolder is displayed as an accordion parent in the sidebar,
 * with its sections as children.
 */
export function getFolderSidebarPosts(projects: ProjectFolder[]) {
  return projects.map((p) => ({
    slug: p.slug,
    title: p.metadata.title,
    // Sub-items are just the section files — project title itself links to first section
    headings: p.sections.map((s) => ({ level: 1, text: s.title, slug: s.slug })),
  }));
}



