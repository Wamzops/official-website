import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import type React from "react";
import type { ReactNode } from "react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { slugify } from "@/utils/utils";

import {
  Accordion,
  AccordionGroup,
  Button,
  Card,
  CodeBlock,
  Column,
  Feedback,
  Grid,
  Heading,
  HeadingLink,
  Icon,
  InlineCode,
  Line,
  List,
  ListItem,
  Media,
  type MediaProps,
  Row,
  SmartLink,
  Table,
  Text,
  type TextProps,
} from "@once-ui-system/core";

import { LiveEditor } from "./mdx/LiveEditor";
import { Quiz } from "./mdx/Quiz";
import { 
  LineChart, 
  Line as RechartsLine, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from './mdx/RechartsWrapper';
import { 
  QuickCheck1, 
  QuickCheck2, 
  QuickCheck3, 
  OLSInteractive, 
  FinalOLSQuiz 
} from './mdx/LeastSquaresComponents';

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createImage({ alt, src, ...props }: MediaProps & { src: string }) {
  if (!src) {
    console.error("Media requires a valid 'src' property.");
    return null;
  }

  return (
    <Media
      marginTop="8"
      marginBottom="16"
      enlarge
      radius="m"
      border="neutral-alpha-medium"
      sizes="(max-width: 960px) 100vw, 960px"
      alt={alt}
      src={src}
      {...props}
    />
  );
}

function extractText(children: any): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (typeof children === "object" && children?.props?.children)
    return extractText(children.props.children);
  return "";
}



function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({
    children,
    ...props
  }: Omit<React.ComponentProps<typeof HeadingLink>, "as" | "id">) => {
    const slug = slugify(extractText(children));
    return (
      <HeadingLink marginTop="24" marginBottom="12" as={as} id={slug} {...props}>
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createCodeBlock(props: any) {
  // For pre tags that contain code blocks
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;

    // Extract language from className (format: language-xxx)
    const rawLanguage = className.replace("language-", "");
    const isText = rawLanguage === "text" || rawLanguage === "plaintext";
    
    // Mapping for common language aliases that Prism might not recognize directly
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'py': 'python',
      'sh': 'bash',
      'yml': 'yaml',
      'md': 'markdown',
      'rb': 'ruby',
    };

    const language = isText ? "bash" : (languageMap[rawLanguage] || rawLanguage);
    const label = isText ? "Plain Text" : language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codes={[
          {
            code: children,
            language,
            label,
          },
        ]}
        copyButton={true}
      />
    );
  }
  return <pre {...props} />;
}

function createList(as: "ul" | "ol") {
  return ({ children }: { children: ReactNode }) => <List as={as}>{children}</List>;
}

function createListItem({ children }: { children: ReactNode }) {
  return (
    <ListItem marginTop="4" marginBottom="8" style={{ lineHeight: "175%" }}>
      {children}
    </ListItem>
  );
}

function createHR() {
  return (
    <Row fillWidth horizontal="center">
      <Line maxWidth="40" />
    </Row>
  );
}

const getColor = (color?: string, opacity?: number) => {
  if (!color) return undefined;
  
  // Handle hex codes with custom opacity
  if (color.startsWith('#')) {
    // If it's a 6-digit hex, we can easily append alpha hex
    if (color.length === 7) {
      const alpha = opacity !== undefined ? opacity : 1;
      const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
      return `${color}${alphaHex}`;
    }
    return color;
  }
  
  // For other formats or tokens, use color-mix if opacity is needed
  if (opacity !== undefined && (color.startsWith('rgb') || color.startsWith('hsl') || !color.includes('var('))) {
    return `color-mix(in srgb, ${color}, transparent ${Math.round((1 - opacity) * 100)}%)`;
  }
  
  return color.startsWith('var(') ? color : `var(--${color}, ${color})`;
};

const Info = ({ children, color, opacity }: { children: ReactNode; color?: string; opacity?: number }) => (
  <Feedback
    variant="info"
    marginBottom="16"
    style={color ? { 
      backgroundColor: getColor(color, opacity ?? 0.1), 
      borderColor: getColor(color, opacity ?? 0.3) 
    } : undefined}
  >
    {children}
  </Feedback>
);

const Alert = ({ children, color, opacity }: { children: ReactNode; color?: string; opacity?: number }) => (
  <Feedback
    variant="danger"
    marginBottom="16"
    style={color ? { 
      backgroundColor: getColor(color, opacity ?? 0.1), 
      borderColor: getColor(color, opacity ?? 0.3) 
    } : undefined}
  >
    {children}
  </Feedback>
);

const Warning = ({ children, color, opacity }: { children: ReactNode; color?: string; opacity?: number }) => (
  <Feedback
    variant="warning"
    marginBottom="16"
    style={color ? { 
      backgroundColor: getColor(color, opacity ?? 0.1), 
      borderColor: getColor(color, opacity ?? 0.3) 
    } : undefined}
  >
    {children}
  </Feedback>
);

const Success = ({ children, color, opacity }: { children: ReactNode; color?: string; opacity?: number }) => (
  <Feedback
    variant="success"
    marginBottom="16"
    style={color ? { 
      backgroundColor: getColor(color, opacity ?? 0.1), 
      borderColor: getColor(color, opacity ?? 0.3) 
    } : undefined}
  >
    {children}
  </Feedback>
);

const Highlight = ({ children, color = "brand-alpha-weak", opacity }: { children: ReactNode; color?: string; opacity?: number }) => (
  <Text
    as="span"
    paddingX="4"
    style={{
      backgroundColor: getColor(color, opacity),
      borderRadius: 'var(--radius-s)',
    }}
  >
    {children}
  </Text>
);

const Underline = ({ children, color = "brand-strong", opacity }: { children: ReactNode; color?: string; opacity?: number }) => (
  <Text
    as="span"
    style={{
      borderBottom: `2px solid ${getColor(color, opacity)}`,
      paddingBottom: "1px",
    }}
  >
    {children}
  </Text>
);

const Details = ({ children, color, opacity, ...props }: any) => {
  const borderColor = color ? getColor(color, opacity ?? 0.3) : 'var(--mdx-details-border)';
  const bgColor = color ? getColor(color, opacity ?? 0.05) : 'var(--mdx-details-bg)';
  const textColor = color ? getColor(color, 1) : 'var(--mdx-details-text)';

  return (
    <details
      className="markdown-details"
      style={{
        border: `1px solid ${borderColor}`,
        backgroundColor: bgColor,
        borderRadius: '8px',
        marginBottom: '1.5rem',
        overflow: 'hidden',
        display: 'block',
        ['--mdx-details-text' as any]: textColor,
      } as any}
      {...props}
    >
      {children}
    </details>
  );
};

const Summary = ({ children, color, ...props }: any) => {
  const textColor = color ? getColor(color, 1) : 'var(--mdx-details-text)';
  
  return (
    <summary
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        fontWeight: '500',
        cursor: 'pointer',
        color: textColor,
        listStyleWidth: '0',
      } as any}
      {...props}
    >
      {children}
    </summary>
  );
};


const components = {
  LiveEditor,
  Quiz,
  LineChart,
  Line: RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  details: Details,
  summary: Summary,
  Details,
  Summary,
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  img: createImage as any,
  a: CustomLink as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  ol: createList("ol") as any,
  ul: createList("ul") as any,
  li: createListItem as any,
  hr: createHR as any,
  Info,
  Alert,
  Warning,
  Success,
  Highlight,
  Underline,
  Heading,
  Text,
  CodeBlock,
  InlineCode,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
  QuickCheck1,
  QuickCheck2,
  QuickCheck3,
  OLSInteractive,
  FinalOLSQuiz,
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      }}
    />
  );
}
