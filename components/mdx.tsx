import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Slot } from '@radix-ui/react-slot';
import { nanoid } from 'nanoid';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeMdxCodeProps from 'rehype-mdx-code-props';
import { highlight } from 'sugar-high';

import { slugify } from '@/lib/utils';

import { Spinner } from './spinner';

function Table({
  data,
}: Readonly<{
  data: {
    headers: string[];
    rows: string[][];
  };
}>) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));

  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props: any) {
  const href = props.href;

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target='_blank' rel='noopener noreferrer' {...props} />;
}

function RoundedImage({ alt, ...props }: React.ComponentProps<typeof Image>) {
  return <Image alt={alt} className='rounded-lg' {...props} />;
}

function Code({ children, ...props }: any) {
  const codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function Pre(
  props: Readonly<{
    children: ReactNode;
    filename?: string;
    lineNumbers?: boolean;
    highlightLines?: string;
  }>
) {
  const { children, filename, lineNumbers, highlightLines } = props;

  const id = nanoid();

  const highlightLineNumbers = highlightLines?.trim()?.split(',');

  const highlightLinesLightMode = highlightLineNumbers
    ?.map((line) => `#${id} .sh__line:nth-child(${line})`)
    ?.join(',\n');

  const highlightLinesDarkMode = highlightLineNumbers
    ?.map((line) => `.dark #${id} .sh__line:nth-child(${line})`)
    ?.join(',\n');

  let highlightLinesStyles: string | undefined;

  if (highlightLines) {
    highlightLinesStyles = `
      ${highlightLinesLightMode} {
        background-color: #d4d4d4;
      }

      ${highlightLinesDarkMode} {
        background-color: #171717;
      }`;
  }

  return (
    <pre
      className='relative border-2 dark:border-neutral-600 border-neutral-400 p-0'
      data-line-numbers={lineNumbers}
    >
      {highlightLinesStyles ? <style>{highlightLinesStyles}</style> : null}
      {filename ? (
        <h6 className='sticky top-0 left-0 right-0 text-foreground overflow-hidden border-b-2 border-neutral-400 dark:border-neutral-600 px-2 py-1'>
          {filename}
        </h6>
      ) : null}
      <Slot id={id}>{children}</Slot>
    </pre>
  );
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
  LoadingSpinner: Spinner,
  pre: Pre,
};

export function CustomMDX(props: React.ComponentProps<typeof MDXRemote>) {
  return (
    <MDXRemote
      {...props}
      options={{
        mdxOptions: {
          rehypePlugins: [rehypeMdxCodeProps],
        },
      }}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
