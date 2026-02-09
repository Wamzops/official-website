"use client";

import { useState } from "react";
import {
  Column,
  Row,
  Text,
  Grid,
  Button,
  Icon,
  Tag,
  Line,
} from "@once-ui-system/core";
import styles from "./about.module.scss";

interface CertificationProps {
  technical: {
    display: boolean;
    title: string;
    skills: Array<{
      title: string;
      description?: React.ReactNode;
      issuer: string;
      year: string;
      category: string;
      verifyUrl?: string;
      logo?: string;
      tags?: Array<{
        name: string;
        icon?: string;
      }>;
    }>;
  };
}

export default function Certifications({ technical }: CertificationProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  if (!technical.display) return null;

  // Extract unique categories
  const categories = [
    "All",
    ...Array.from(new Set(technical.skills.map((skill) => skill.category))),
  ];

  const filteredSkills =
    activeCategory === "All"
      ? technical.skills
      : technical.skills.filter((skill) => skill.category === activeCategory);

  return (
    <>
      <Column fillWidth gap="8" marginBottom="40">
        <Text variant="display-strong-s">{technical.title}</Text>
        <Line
          background="brand-strong"
          marginBottom="4"
          style={{ width: "60px", height: "3px" }}
        />
        <Text variant="body-default-l" onBackground="neutral-weak">
          Certifications that I have obtained so far.
        </Text>
      </Column>

      <Row gap="8" wrap marginBottom="40">
        {categories.map((category) => (
          <Button
            key={category}
            label={category}
            onClick={() => setActiveCategory(category)}
            variant={activeCategory === category ? "primary" : "tertiary"}
            size="s"
          />
        ))}
      </Row>

      <Grid columns="2" s={{ columns: 1 }} gap="24" fillWidth>
        {filteredSkills.map((skill, index) => (
          <Column
            key={`${skill.title}-${index}`}
            fillWidth
            padding="24"
            className={styles.card}
            // Ensure the card itself is a flex container that stretches
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* 1. WRAP TOP CONTENT: Added flex={1} here to push the footer down */}
            <Column flex={1} gap="12">
              <Row gap="16">
                {skill.logo && (
                  <Row
                    padding="4"
                    radius="m"
                    vertical="center"
                    horizontal="center"
                  >
                    {skill.logo.startsWith("/") ? (
                      <img
                        src={skill.logo}
                        alt={skill.issuer}
                        style={{ height: "40px", width: "auto" }}
                      />
                    ) : (
                      <Icon
                        name={skill.logo}
                        size="xl"
                        style={{
                          color:
                            skill.logo === "aws"
                              ? "#FF9900"
                              : skill.logo === "google"
                                ? "#4285F4"
                                : skill.logo === "azure"
                                  ? "#008AD7"
                                  : skill.logo === "microsoft"
                                    ? "#00A4EF"
                                    : undefined,
                        }}
                      />
                    )}
                  </Row>
                )}
                <Column gap="4">
                  <Text variant="heading-strong-s">{skill.title}</Text>
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {skill.issuer} • {skill.year}
                  </Text>
                </Column>
              </Row>

              <Text variant="body-default-s" onBackground="neutral-medium">
                {skill.description}
              </Text>

              {skill.tags && skill.tags.length > 0 && (
                <Row wrap gap="8">
                  {skill.tags.map((tag, tagIndex) => (
                    <Tag
                      key={`${skill.title}-${tagIndex}`}
                      size="s"
                      variant="brand"
                    >
                      {tag.name}
                    </Tag>
                  ))}
                </Row>
              )}
            </Column>

            {/* 2. FOOTER: This will now always sit at the bottom */}
            <Row horizontal="between" vertical="center" marginTop="24">
              <Tag size="s" variant="neutral">
                {skill.category}
              </Tag>
              {skill.verifyUrl && (
                <Row
                  gap="8"
                  vertical="center"
                  style={{ cursor: "pointer" }}
                  onClick={() => window.open(skill.verifyUrl, "_blank")}
                >
                  <Text variant="label-strong-s">Verify</Text>
                  <Icon name="arrowUpRightFromSquare" size="xs" />
                </Row>
              )}
            </Row>
          </Column>
        ))}
      </Grid>
    </>
  );
}
