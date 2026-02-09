import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import Certifications from "@/components/about/Certifications";
import { about, baseURL, person, social } from "@/resources";
import {
  Avatar,
  Button,
  Column,
  Grid,
  Heading,
  Icon,
  IconButton,
  Line,
  Media,
  Meta,
  RevealFx,
  Row,
  Schema,
  Tag,
  Text,
  TiltFx,
} from "@once-ui-system/core";
import React from "react";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default function About() {
  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((institution) => institution.name),
    },
    {
      title: about.technicalExpertise.title,
      display: about.technicalExpertise.display,
      items: about.technicalExpertise.expertise.map((item) => item.title),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((skill) => skill.title),
    },
  ];
  return (
    <Column maxWidth="xl">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}
      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" />
            <Row gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              {person.location}
            </Row>
            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((language, index) => (
                  <Tag key={index} size="l" variant="brand">
                    {language}
                  </Tag>
                ))}
              </Row>
            )}
          </Column>
        )}
        <Column className={styles.blockAlign} flex={9} maxWidth="xl">
          <Column
            id={about.intro.title}
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            {about.calendar.display && (
              <Row
                fitWidth
                border="brand-alpha-medium"
                background="brand-alpha-weak"
                radius="full"
                padding="4"
                gap="8"
                marginBottom="m"
                vertical="center"
                className={styles.blockAlign}
                style={{
                  backdropFilter: "blur(var(--static-space-1))",
                  cursor: "pointer",
                }}
                data-cal-link="wamuchie-colette-mjmj72/secret"
                data-cal-namespace="secret"
                data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              >
                <TiltFx>
                <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
                <Row paddingX="12">Schedule a call</Row>
                </TiltFx>
              </Row>
            )}
            <Heading className={styles.textAlign} variant="display-strong-xl">
              {person.name}
            </Heading>
            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {person.role}
            </Text>
            {social.length > 0 && (
              <Row
                className={styles.blockAlign}
                paddingTop="20"
                paddingBottom="8"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
                data-border="rounded"
              >
                {social
                  .filter((item) => item.essential)
                  .map(
                    (item) =>
                      item.link && (
                        <React.Fragment key={item.name}>
                          <Row s={{ hide: true }}>
                            <Button
                              key={item.name}
                              href={item.link}
                              prefixIcon={item.icon}
                              label={item.name}
                              size="s"
                              weight="default"
                              variant="secondary"
                            />
                          </Row>
                          <Row hide s={{ hide: false }}>
                            <IconButton
                              size="l"
                              key={`${item.name}-icon`}
                              href={item.link}
                              icon={item.icon}
                              variant="secondary"
                            />
                          </Row>
                        </React.Fragment>
                      ),
                  )}
              </Row>
            )}
          </Column>

          {about.intro.display && (
            <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
              {about.intro.description}
            </Column>
          )}

          {about.work.display && (
            <>
              <Heading as="h2" id={about.work.title} variant="display-strong-s" marginBottom="8">
                {about.work.title}
              </Heading>
              <Line
                background="brand-strong"
                marginBottom="m"
                style={{ width: "60px", height: "3px" }}
              />
              <Grid columns="1" gap="24" fillWidth marginBottom="40">
                {about.work.experiences.map((experience, index) => (
                  <Column
                    key={`${experience.company}-${experience.role}-${index}`}
                    fillWidth
                    padding="24"
                    className={styles.card}
                    gap="24"
                  >
                    <Column gap="12">
                      <Row gap="16">
                        {experience.logo && (
                          <Row padding="4" radius="m" vertical="center" horizontal="center">
                            <img
                              src={experience.logo}
                              alt={experience.company}
                              style={{ height: "40px", width: "auto" }}
                            />
                          </Row>
                        )}
                        <Column gap="4" flex={1}>
                          <Row fillWidth horizontal="between" vertical="center">
                            <Text id={experience.company} variant="heading-strong-l">
                              {experience.company}
                            </Text>
                            <Text variant="heading-default-xs" onBackground="neutral-weak">
                              {experience.timeframe}
                            </Text>
                          </Row>
                          <Text variant="body-default-s" onBackground="brand-weak">
                            {experience.role}
                          </Text>
                        </Column>
                      </Row>

                      <Column as="ul" gap="12" paddingLeft="8">
                        {experience.achievements.map(
                          (achievement: React.ReactNode, achIndex: number) => (
                            <Text
                              as="li"
                              variant="body-default-m"
                              key={`${experience.company}-${achIndex}`}
                            >
                              {achievement}
                            </Text>
                          ),
                        )}
                      </Column>
                    </Column>

                    {experience.images && experience.images.length > 0 && (
                      <Row fillWidth gap="12" wrap>
                        {experience.images.map((image, imgIndex) => (
                          <Row
                            key={imgIndex}
                            border="neutral-medium"
                            radius="m"
                            minWidth={image.width}
                            height={image.height}
                          >
                            <Media
                              enlarge
                              radius="m"
                              sizes={image.width.toString()}
                              alt={image.alt}
                              src={image.src}
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Grid>
            </>
          )}

          {about.studies.display && (
            <>
              <Heading as="h2" id={about.studies.title} variant="display-strong-s" marginBottom="8">
                {about.studies.title}
              </Heading>
              <Line
                background="brand-strong"
                marginBottom="m"
                style={{ width: "60px", height: "3px" }}
              />
              <Column fillWidth gap="l" marginBottom="40">
                {about.studies.institutions.map((institution, index) => (
                  <Column key={`${institution.name}-${index}`} fillWidth gap="4">
                    <Text id={institution.name} variant="heading-strong-l">
                      {institution.name}
                    </Text>
                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                      {institution.description}
                    </Text>
                  </Column>
                ))}
              </Column>
            </>
          )}

          {about.technicalExpertise.display && (
            <>
              <Heading
                as="h2"
                id={about.technicalExpertise.title}
                variant="display-strong-s"
                marginBottom="8"
              >
                {about.technicalExpertise.title}
              </Heading>
              <Line
                background="brand-strong"
                marginBottom="m"
                style={{ width: "60px", height: "3px" }}
              />

              <Text variant="body-default-l" onBackground="neutral-weak" marginBottom="40">
                {about.technicalExpertise.description}
              </Text>

              <Grid columns="2" s={{ columns: 1 }} gap="32" fillWidth marginBottom="40">
                {about.technicalExpertise.expertise.map((item, index) => (
                  <Column
                    key={`${item.title}-${index}`}
                    fillWidth
                    gap="4"
                    className={styles.cardBorder}
                  >
                    <Row gap="12" vertical="center" marginBottom="8">
                      <Icon name={item.icon} onBackground="brand-medium" />
                      <Text id={item.title} variant="heading-strong-s">
                        {item.title}
                      </Text>
                    </Row>

                    <Column gap="8">
                      <Row wrap gap="8">
                        {item.tags.map((tag, tagIndex) => (
                          <Tag key={`${item.title}-${tagIndex}`} size="m" variant="brand">
                            {tag}
                          </Tag>
                        ))}
                      </Row>
                    </Column>
                  </Column>
                ))}
              </Grid>
            </>
          )}

          {about.technical.display && <Certifications technical={about.technical} />}
        </Column>
      </Row>
    </Column>
  );
}
