import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { Musings } from "@/components/musing/Musings";
import { Projects } from "@/components/work/Projects";
import { about, baseURL, home, person, routes } from "@/resources";
import {
  Avatar,
  Badge,
  Button,
  Column,
  Heading,
  Line,
  Meta,
  RevealFx,
  Row,
  Schema,
  ShineFx,
  Text,
} from "@once-ui-system/core";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column fillWidth horizontal="center" gap="m">
        <RevealFx paddingBottom="24">
          <Column horizontal="center" fillWidth>
            <Avatar
              src={person.avatar}
              size="xl"
              style={{
                borderRadius: "50%",
              }}
            />
          </Column>
        </RevealFx>
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx
            translateY="4"
            fillWidth
            horizontal="center"
            paddingBottom="16"
          >
            <Heading wrap="balance" variant="display-strong-m">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx
            translateY="8"
            delay={0.2}
            fillWidth
            horizontal="center"
            paddingBottom="32"
          >
            <Text
              wrap="balance"
              onBackground="neutral-weak"
              variant="heading-default-m"
            >
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx
            paddingTop="12"
            delay={0.4}
            horizontal="center"
            paddingLeft="12"
          >
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
            >
              <Row gap="8" vertical="center" paddingRight="4">
                {about.title}
              </Row>
            </Button>
          </RevealFx>
        </Column>
      </Column>

      {/* Section to highlight the most recent project*/}

      {/*
      <RevealFx translateY="16" delay={0.6}>
        <Projects range={[1, 1]} />
      </RevealFx>
      */}

      {routes["/blog"] && (
        <Column fillWidth gap="24" marginBottom="l">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>

          <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
            <Row flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                Latest from the blog
              </Heading>
            </Row>

            <Column flex={3} paddingX="20" gap="16" horizontal="center">
              <Posts range={[1, 2]} columns="2" />
              <RevealFx translateY="8" delay={0.2} fillWidth horizontal="end">
                <Badge
                  href="/blog"
                  id="badge-blog"
                  title="View more posts"
                  textVariant="label-default-s"
                />
              </RevealFx>
            </Column>
          </Row>
        </Column>
      )}

    </Column>
  );
}
