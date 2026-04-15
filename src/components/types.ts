export interface Heading {
  level: number;
  text: string;
  slug: string;
}

export interface Post {
  slug: string;
  title: string;
  headings: Heading[];
}
