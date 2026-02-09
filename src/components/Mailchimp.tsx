"use client";

import { mailchimp, newsletter } from "@/resources";
import { Background, Button, Column, Heading, Input, Row, Text } from "@once-ui-system/core";
import type { SpacingToken, opacity } from "@once-ui-system/core";
import { useState, useRef } from "react";

export const Mailchimp: React.FC<React.ComponentProps<typeof Column>> = ({ ...flex }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Ref to hold the timeout ID for debouncing
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validateEmail = (email: string): boolean => {
    if (email === "") {
      return true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleValidation = (value: string) => {
    if (!validateEmail(value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear success message when user starts typing again
    if (success) setSuccess(false);

    // Clear any pending validation timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // If there is already an error, validate immediately
    if (error) {
      handleValidation(value);
    } else {
      // Otherwise, debounce validation by 2 seconds
      validationTimeoutRef.current = setTimeout(() => {
        handleValidation(value);
      }, 2000);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    // Validate immediately on blur
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/newsletters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
        setTouched(false);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (newsletter.display === false) return null;

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
      {...flex}
    >
      <Background
        top="0"
        position="absolute"
        mask={{
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
          cursor: mailchimp.effects.mask.cursor,
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          opacity: mailchimp.effects.gradient.opacity as opacity,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
          color: mailchimp.effects.dots.color,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          opacity: mailchimp.effects.grid.opacity as opacity,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width,
          height: mailchimp.effects.grid.height,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
          thickness: mailchimp.effects.lines.thickness,
          angle: mailchimp.effects.lines.angle,
          color: mailchimp.effects.lines.color,
        }}
      />
      <Column maxWidth="xs" horizontal="center">
        <Heading marginBottom="s" variant="display-strong-xs">
          {newsletter.title}
        </Heading>
        <Text wrap="balance" marginBottom="l" variant="body-default-l" onBackground="neutral-weak">
          {newsletter.description}
        </Text>
      </Column>
      <form
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <Row fillWidth maxWidth={24} s={{ direction: "column" }} gap="8">
          <Input
            formNoValidate
            id="mce-EMAIL"
            name="EMAIL"
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={handleChange}
            onBlur={handleBlur}
            errorMessage={error}
          />
          <Row height="48" vertical="center">
            <Button
              id="mc-embedded-subscribe"
              value="Subscribe"
              size="m"
              fillWidth
              type="submit"
              loading={loading}
              variant={success ? "secondary" : "primary"}
            >
              {success ? "Subscribed!" : "Subscribe"}
            </Button>
          </Row>
        </Row>
      </form>
    </Column>
  );
};
