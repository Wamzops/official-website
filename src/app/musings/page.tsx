import { Mailchimp } from "@/components";
import { Musings } from "@/components/musing/Musings";
import { baseURL, blog,  newsletter, person, musings } from "@/resources";
import { Column, Heading, Meta, Schema } from "@once-ui-system/core";

export async function generateMetadata() {
  return Meta.generate({
    title: musings.title,
    description: musings.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(musings.title)}`,
    path: musings.path,
  });
}

export default function Musing() {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="musingsPosting"
        baseURL={baseURL}
        title={musings.title}
        description={musings.description}
        path={musings.path}
        image={`/api/og/generate?title=${encodeURIComponent(musings.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/musings`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {musings.title}
      </Heading>
      <Column fillWidth flex={1} gap="40">
        <Musings range={[1, 1]} thumbnail />
        <Musings range={[2, 3]} columns="2" thumbnail direction="column" />
        <Mailchimp marginBottom="l" />
        <Heading as="h2" variant="heading-strong-xl" marginLeft="l">
          Earlier posts
        </Heading>
        <Musings range={[4]} columns="2" />
      </Column>
    </Column>
  );
}
