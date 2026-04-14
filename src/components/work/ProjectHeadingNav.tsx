"use client";

import { Column, Flex, Icon, Row, SmartLink, Text } from "@once-ui-system/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface Heading {
  id: string;
  text: string;
}

export function ProjectHeadingNav() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef(0);

  // Collect only h1 elements on mount
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h1")).filter(
      (el) => !el.hasAttribute("data-exclude-nav")
    );

    const collected: Heading[] = elements.map((el, i) => ({
      id: el.id || `h1-${i}`,
      text: el.textContent || "",
    }));

    // Ensure each h1 has an id so scroll-to works
    elements.forEach((el, i) => {
      if (!el.id) el.id = `h1-${i}`;
    });

    setHeadings(collected);
    if (collected.length > 0) setActiveId(collected[0].id);
  }, []);

  const moveTo = useCallback(
    (id: string) => {
      const idx = headings.findIndex((h) => h.id === id);
      if (idx === -1) return;
      setActiveId(id);
      setActiveIndex(idx);
      if (indicatorRef.current) {
        indicatorRef.current.style.top = `calc(${idx} * var(--static-space-32))`;
      }
      lastUpdateRef.current = Date.now();
    },
    [headings]
  );

  // Scroll spy
  useEffect(() => {
    if (headings.length === 0) return;

    const positions = new Map<string, number>();
    const recalc = () => {
      headings.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) positions.set(id, el.getBoundingClientRect().top + window.scrollY - 150);
      });
    };
    recalc();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        let activeId = headings[0].id;
        let closest = -Infinity;
        positions.forEach((pos, id) => {
          if (pos <= scrollY && pos > closest) {
            closest = pos;
            activeId = id;
          }
        });
        if (Date.now() - lastUpdateRef.current > 100) moveTo(activeId);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recalc);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recalc);
    };
  }, [headings, moveTo]);

  if (headings.length === 0) return null;

  return (
    <Column gap="16" position="sticky" fitHeight>
      {/* Header */}
      <Row
        gap="12"
        paddingLeft="2"
        vertical="center"
        onBackground="neutral-medium"
        textVariant="label-default-s"
      >
        <Icon name="document" size="xs" />
        On this page
      </Row>

      {/* Links + sliding indicator */}
      <Row paddingLeft="8" gap="12">
        {/* Indicator track */}
        <Row width="2" background="neutral-alpha-medium" radius="full" overflow="hidden">
          <Row
            ref={indicatorRef}
            height="32"
            paddingY="4"
            fillWidth
            position="absolute"
            style={{
              top: `calc(${activeIndex} * var(--static-space-32))`,
              transition: "top 0.3s ease",
            }}
          >
            <Row fillWidth solid="brand-strong" radius="full" />
          </Row>
        </Row>

        {/* Heading links */}
        <Column fillWidth>
          {headings.map((heading, index) => {
            const isActive = heading.id === activeId;
            return (
              <Flex key={heading.id} fillWidth height="32" paddingX="4">
                <SmartLink
                  fillWidth
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(heading.id);
                    if (target) {
                      window.scrollTo({
                        top: target.getBoundingClientRect().top + window.scrollY - 150,
                        behavior: "smooth",
                      });
                      moveTo(heading.id);
                    }
                  }}
                  style={{
                    color: isActive
                      ? "var(--neutral-on-background-strong)"
                      : "var(--neutral-on-background-weak)",
                    transition: "color 0.2s ease",
                  }}
                >
                  <Text
                    variant={isActive ? "body-strong-s" : "body-default-s"}
                    truncate
                    style={{ transition: "font-weight 0.2s ease" }}
                  >
                    {heading.text}
                  </Text>
                </SmartLink>
              </Flex>
            );
          })}
        </Column>
      </Row>
    </Column>
  );
}
