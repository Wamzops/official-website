import type { About, Blog, Musings, Home, Newsletter, Person, Social, Work } from "@/types";
import React from "react";
import { Column, Line, Row, Tag, Text } from "@once-ui-system/core";
import Image from "next/image";

const person: Person = {
  firstName: "Colette",
  lastName: "Muiruri",
  name: `Colette Muiruri`,
  role: "Data Engineer",
  avatar: "/images/avatar.png",
  email: "wamuchiecolette@gmail.com",
  location: "Africa/Nairobi", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Swahili"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/wamzops",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/wamuchiecolette/",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Learn. Build. Teach. </>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Data Engineering</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work",
  },
  subline: (
    <>
      Hi! I am Colette. I work at{" "}
      <Text as="span" size="m" weight="strong" color="brand-strong">
        PwC, Kenya
      </Text>
      , where I help global organizations unlock value from their data. <br /> I also build my own projects and write about them
      during my spare time.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Colette is a Nairobi-based data engineer with a passion for transforming complex challenges
        into simple and resilient data solutions. Her work spans data engineering, data analytics,
        and its application in sustainable development.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Pricewaterhousecoopers (PwC) Kenya",
        timeframe: "2023 - Present",
        role: "",
        achievements: [
          <React.Fragment key="ach-pwc-1">
            Designed, documented, and implemented enterprise-wide data governance policies and
            frameworks, ensuring compliance with local and international regulations.
          </React.Fragment>,
          <React.Fragment key="ach-pwc-2">
            Spearheaded data quality initiatives by developing automated detection and remediation
            workflows, reducing manual intervention and increasing overall data accuracy.
          </React.Fragment>,
          <React.Fragment key="ach-pwc-3">
            Facilitated cross-functional data literacy workshops to empower stakeholders with the
            tools and knowledge to make data-driven decisions.
          </React.Fragment>,
          <React.Fragment key="ach-pwc-4">
            Established and chaired the Data Governance Council, fostering a culture of
            accountability and continuous improvement in data management practices.
          </React.Fragment>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
        ],
      },
      {
        company: "ExploreAI Academy",
        timeframe: " September 2023 - December 2023",
        role: "Data Science Intern",
        achievements: [
          <React.Fragment key="ach-ext-1">
            Led an international student team in the design, development, and deployment of a Gross
            Domestic Product (GDP) prediction application for South Africa using Python and Amazon
            S3 and EC2 services, achieving an 87% model accuracy in forecasting the country's
            economic performance
          </React.Fragment>,
          <React.Fragment key="ach-ext-2">
            Authored and published a comprehensive report on the application of geospatial data and
            satellite imagery in economic and financial modelling and provided actionable
            recommendations for policymakers and businesses.
          </React.Fragment>,
          <React.Fragment key="ach-ext-3">
            Orchestrated seamless communication and project management across time zones using tools
            such as Slack, Zoom, ClickUp and Trello, achieving 100% on-time delivery of project
            milestones.
          </React.Fragment>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Education",
    institutions: [
      {
        name: "Kenyatta University",
        description: (
          <Column gap="8" paddingBottom="20">
            <Column gap="4">
              <Text onBackground="neutral-strong">
                Bachelor of Science in Biomedical Engineering
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                Second Class Honours, Upper Division
              </Text>
            </Column>
            <Row wrap gap="8">
              {[
                "IEEE Student Branch",
                "Vice-chairperson Toastmasters Gavel Club",
                "Pivot Club member",
              ].map((activity) => (
                <Tag key={activity} size="s" variant="brand">
                  {activity}
                </Tag>
              ))}
            </Row>
          </Column>
        ),
      },

      {
        name: "ExploreAI Academy",
        description: (
          <Column gap="8">
            <Column gap="4">
              <Text onBackground="neutral-strong">Data Science</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                Distinction
              </Text>
            </Column>
            <Row wrap gap="8">
              {["Python", "SQL", "Machine Learning", "Data Visualization", "Cloud Computing"].map(
                (skill) => (
                  <Tag key={skill} size="s" variant="brand">
                    {skill}
                  </Tag>
                ),
              )}
            </Row>
          </Column>
        ),
      },
    ],
  },
  technicalExpertise: {
    display: true,
    title: "Technical Expertise",
    description: <>These are the skills I have honed through learning and doing:</>,
    expertise: [
      {
        title: "Data Analytics & Engineering",
        icon: "databaseBold",
        tags: ["Python", "SQL", "Alteryx", "Athena", "BigQuery", "Excel (Advanced)"],
      },
      {
        title: "Visualization & Reporting",
        icon: "chart",
        tags: ["Power BI", "Looker", "QuickSight", "Tableau"],
      },
      {
        title: "Cloud & Data Platforms",
        icon: "cloud",
        tags: ["Azure", "AWS", "Google Cloud Platform", "Oracle Cloud"],
      },
      {
        title: "Governance & Compliance",
        icon: "shield",
        tags: ["ISO 27001", "GDPR", "IT General Controls", "Application Controls"],
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Certifications & Training",
    skills: [
      {
        title: "AWS Certified Solutions Architect - Associate",
        description: (
          <>
            Validates knowledge of designing secure, resilient, high-performing, and cost-optimized
            architectures using AWS services.
          </>
        ),
        issuer: "Amazon Web Services",
        year: "2025",
        logo: "/images/logos/aws.svg",
        category: "Data",
        verifyUrl: "https://www.credly.com/badges/e8c9ca05-3c61-410a-a937-f10a3738c131",
        tags: [
          { name: "Data preparation" },
          { name: "Data Modeling" },
          { name: "Data Analysis & Visualization" },
          { name: "Managing & Securing Power BI" },
        ],
      },
      {
        title: "Google Associate Data Practitioner",
        description: (
          <>
            Demonstrates knowledge of data transformation, analysis, and visualization to support
            data-driven decision-making using google cloud services.
          </>
        ),
        issuer: "Google",
        year: "2025",
        logo: "/images/logos/google.svg",
        category: "Data",
        verifyUrl: "https://www.credly.com/badges/4a537c16-a1fd-4666-8526-8d22dbacdafe/public_url",
        tags: [
          { name: "Data Analysis" },
          { name: "Data Modeling" },
          { name: "Data Visualization" },
        ],
      },
      {
        title: "Microsoft Certified: Azure Fundamentals",
        description: (
          <>
            Validates foundational knowledge of cloud concepts, core Azure services, security,
            privacy, compliance, and Azure pricing and support.
          </>
        ),
        issuer: "Microsoft",
        year: "2024",
        logo: "/images/logos/azure.svg", // Assumes "google" exists in iconLibrary
        category: "Cloud Platforms",
        tags: [{ name: "Google Cloud Platform" }, { name: "BigQuery" }, { name: "Looker" }],
        verifyUrl:
          "https://learn.microsoft.com/api/credentials/share/en-us/ColetteMuiruriKE-1115/F621759D3A46918A?sharingId=50F6AF18E5FE4E36",
      },
      {
        title: "Microsoft Dynamics 365 Fundamentals (ERP)",
        description: (
          <>
            Confirms fundamental knowledge of the finance and operations capabilities of Microsoft
            Dynamics 365.
          </>
        ),
        issuer: "Microsoft",
        year: "2024",
        logo: "/images/logos/microsoft.svg",
        category: "ERP",
        tags: [
          { name: "Dynamics 365" },
          { name: "Finance & Operations" },
          { name: "Supply Chain Management" },
        ],
        verifyUrl:
          "https://learn.microsoft.com/api/credentials/share/en-us/ColetteMuiruriKE-1115/F0C1436517501A6A?sharingId=50F6AF18E5FE4E36",
      },
      {
        title: "AWS Cloud Practitioner",
        description: (
          <>
            Validates foundational knowledge of AWS Cloud concepts, core services, security and
            compliance, pricing, and billing models.
          </>
        ),
        issuer: "Amazon Web Services",
        year: "2024",
        logo: "/images/logos/aws.svg",
        category: "Cloud Platforms",
        tags: [{ name: "AWS" }, { name: "Cloud Computing" }, { name: "Cloud Services" }],
        verifyUrl: "https://www.credly.com/badges/78915560-7942-437b-b092-a192f11cfd7a",
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
};

const musings: Musings = {
  path: "/musings",
  label: "Musings",
  title: "A collection of my notes from life...",
  description: `A collection of my notes from life...`,
};

export { person, social, newsletter, home, about, blog, work, musings };
