"use client";

import React, { useState } from 'react';
import { Row, Column, Button, Text } from "@once-ui-system/core";

export const LiveEditor = () => {
  const [code, setCode] = useState(`console.log('Hello, MDX!');`);
  const [output, setOutput] = useState('');

  const runCode = () => {
    try {
      // Capture console.log output
      let logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: any[]) => {
        logs.push(args.join(' '));
        originalLog(...args);
      };
      // eslint-disable-next-line no-new-func
      new Function(code)();
      console.log = originalLog;
      setOutput(logs.join('\n'));
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <Column
      fillWidth
      padding="16"
      radius="m"
      border="neutral-alpha-medium"
      background="neutral-alpha-weak"
      marginBottom="16"
      gap="12"
    >
      <Text variant="label-default-s" onBackground="neutral-medium">Live JS Editor</Text>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={5}
        style={{
          width: '100%',
          fontFamily: 'var(--font-code)',
          padding: '12px',
          borderRadius: '8px',
          background: 'var(--neutral-alpha-weak)',
          color: 'var(--neutral-strong)',
          border: '1px solid var(--neutral-alpha-medium)',
          outline: 'none',
          resize: 'vertical'
        }}
      />
      <Row vertical="center" gap="12">
        <Button size="s" onClick={runCode}>Run Code</Button>
        <Button size="s" variant="secondary" onClick={() => setOutput('')}>Clear Output</Button>
      </Row>
      {output && (
        <Column
          fillWidth
          padding="12"
          radius="s"
          background="neutral-alpha-medium"
          border="neutral-alpha-medium"
        >
          <Text variant="label-default-xs" onBackground="neutral-medium" marginBottom="4">Output:</Text>
          <pre style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            fontFamily: 'var(--font-code)',
            fontSize: 'var(--font-size-code-s)',
            color: 'var(--neutral-strong)'
          }}>
            {output}
          </pre>
        </Column>
      )}
    </Column>
  );
};

export default LiveEditor;
