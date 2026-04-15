"use client";

import { person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { Avatar, Card, Column, Media, Row, Text } from "@once-ui-system/core";

interface PostProps {
  post: any;
  thumbnail: boolean;
  direction?: "row" | "column";
}

export default function Post({ post, thumbnail, direction }: PostProps) {
    const firstSection = post.sections?.[0];
    const href = firstSection ? `/blog/${post.slug}/${firstSection.slug}` : `/blog/${post.slug}`;

    return (
      <Card
        fillWidth
        key={post.slug}
        href={href}
      transition="micro-medium"
      direction={direction}
      border="transparent"
      background="transparent"
      padding="4"
      radius="l-4"
      gap={direction === "column" ? undefined : "24"}
      s={{ direction: "column" }}
    >
      {post.metadata.image && thumbnail && (
        <Media
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          border="neutral-alpha-weak"
          cursor="interactive"
          radius="l"
          src={post.metadata.image}
          alt={"Thumbnail of " + post.metadata.title}
          aspectRatio="16 / 9"
        />
      )}
      <Column
        fillWidth
        gap="16"
        padding="24"
        radius="l"
        border="neutral-alpha-weak"
        background="surface"
      >
        <Column gap="8">
          <Text variant="body-default-s" onBackground="neutral-weak">
            {formatDate(post.metadata.publishedAt, false)}
          </Text>
          <Text
            variant="heading-strong-xl"
            wrap="balance"
            style={{ color: "var(--neutral-on-background-strong)" }}
          >
            {post.metadata.title}
          </Text>
          <Row vertical="center" gap="12" marginTop="8">
            <Avatar src={person.avatar} size="s" />
            <Text variant="label-strong-s">{person.name}</Text>
          </Row>
        </Column>

        <Text variant="body-default-m" onBackground="neutral-weak" style={{ lineHeight: "1.6" }}>
          {post.metadata.summary}
        </Text>

        <Text variant="label-strong-m" color="brand-on-background-weak">
          Read More →
        </Text>
      </Column>
    </Card>
  );
}
