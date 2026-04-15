"use client";

import { person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { Avatar, Card, Column, Media, Row, Text } from "@once-ui-system/core";

interface MusingsProps {
  musing: any;
  thumbnail: boolean;
  direction?: "row" | "column";
}

export default function Musing({ musing, thumbnail, direction }: MusingsProps) {
    const firstSection = musing.sections?.[0];
    const href = firstSection ? `/musings/${musing.slug}/${firstSection.slug}` : `/musings/${musing.slug}`;

    return (
      <Card
        fillWidth
        key={musing.slug}
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
      {musing.metadata.image && thumbnail && (
        <Media
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          border="neutral-alpha-weak"
          cursor="interactive"
          radius="l"
          src={musing.metadata.image}
          alt={"Thumbnail of " + musing.metadata.title}
          aspectRatio="16 / 9"
        />
      )}
      <Row fillWidth>
        <Column maxWidth={28} paddingY="24" paddingX="l" gap="20" vertical="center">
          <Row gap="24" vertical="center">
            <Row vertical="center" gap="16">
              <Avatar src={person.avatar} size="s" />
              <Text variant="label-default-s">{person.name}</Text>
            </Row>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {formatDate(musing.metadata.publishedAt, false)}
            </Text>
          </Row>
          <Text variant="heading-strong-l" wrap="balance">
            {musing.metadata.title}
          </Text>
          {musing.metadata.tag && (
            <Text variant="label-strong-s" onBackground="neutral-weak">
              {musing.metadata.tag}
            </Text>
          )}
        </Column>
      </Row>
    </Card>
  );
}
