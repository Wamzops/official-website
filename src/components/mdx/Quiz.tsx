"use client";

import React, { useState } from 'react';
import { Row, Column, Button, Text, Feedback } from "@once-ui-system/core";

export const Quiz = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const options = ['Docusaurus', 'Next.js', 'Gatsby', 'Jekyll'];
  const correctAnswer = 'Jekyll';

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedOption) {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  return (
    <Column
      fillWidth
      padding="24"
      radius="m"
      border="neutral-alpha-medium"
      background="neutral-alpha-weak"
      marginBottom="16"
      gap="20"
    >
      <Column gap="8">
        <Text variant="heading-strong-xs">Quiz: Which of these tools does NOT support MDX?</Text>
        <Text variant="body-default-s" onBackground="neutral-medium">Select the correct answer from the options below.</Text>
      </Column>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Column gap="12" marginBottom="20">
          {options.map((option) => (
            <Row
              key={option}
              vertical="center"
              gap="12"
              padding="12"
              radius="s"
              border="neutral-alpha-weak"
              background={selectedOption === option ? "brand-alpha-weak" : "transparent"}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => handleOptionChange(option)}
            >
              <input
                type="radio"
                name="quiz-option"
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
                style={{ cursor: 'pointer' }}
              />
              <Text variant="body-default-m">{option}</Text>
            </Row>
          ))}
        </Column>

        <Row gap="12">
          <Button type="submit" fillWidth size="m" disabled={!selectedOption || showResult}>
            Submit Answer
          </Button>
          {showResult && (
            <Button type="button" variant="secondary" size="m" onClick={resetQuiz}>
              Try Again
            </Button>
          )}
        </Row>
      </form>

      {showResult && (
        <Feedback
          variant={selectedOption === correctAnswer ? "success" : "danger"}
          fillWidth
        >
          {selectedOption === correctAnswer ? (
            <Text variant="body-default-m">Correct! Jekyll does not support MDX out of the box.</Text>
          ) : (
            <Text variant="body-default-m">Incorrect. The correct answer is Jekyll.</Text>
          )}
        </Feedback>
      )}
    </Column>
  );
};

export default Quiz;
