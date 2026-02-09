import { getPosts } from "@/utils/utils";
import { Grid } from "@once-ui-system/core";
import Musing from "./Musing";

interface MusingsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
  exclude?: string[];
}

export function Musings({
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
}: MusingsProps) {
  let allMusings = getPosts(["src", "app", "musings", "musings"]);

  // Exclude by slug (exact match)
  if (exclude.length) {
    allMusings = allMusings.filter((musing) => !exclude.includes(musing.slug));
  }

  const sortedMusings = allMusings.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedMusings = range
    ? sortedMusings.slice(range[0] - 1, range.length === 2 ? range[1] : sortedMusings.length)
    : sortedMusings;

  return (
    <>
      {displayedMusings.length > 0 && (
        <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
          {displayedMusings.map((musing) => (
            <Musing key={musing.slug} musing={musing} thumbnail={thumbnail} direction={direction} />
          ))}
        </Grid>
      )}
    </>
  );
}
