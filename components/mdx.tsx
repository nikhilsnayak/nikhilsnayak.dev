import {
  cloneElement,
  ComponentProps,
  createElement,
  PropsWithChildren,
  ReactElement,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { highlight } from 'code-syntactic-sugar';
import { AppWindow, Code2 } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeMdxCodeProps from 'rehype-mdx-code-props';

import { cn, slugify } from '~/lib/utils';

import { Spinner } from './spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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

function CustomLink(props: ComponentProps<'a'>) {
  const href = props.href;

  if (href?.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href?.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target='_blank' rel='noopener noreferrer' {...props} />;
}

function RoundedImage({
  alt,
  className,
  ...props
}: React.ComponentProps<typeof Image>) {
  return <Image alt={alt} className={cn('rounded-lg', className)} {...props} />;
}

interface CodeProps {
  children: string;
  highlightedLineNumbers?: [number, ...number[]];
}

function Code({ children, highlightedLineNumbers }: Readonly<CodeProps>) {
  const codeHTML = highlight(children, {
    modifiers: {
      highlightedLines: highlightedLineNumbers,
    },
  });
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} />;
}

interface PreProps {
  children: ReactElement<CodeProps, 'code'>;
  filename?: string;
  lineNumbers?: boolean;
  highlightLines?: string;
}

function Pre(props: Readonly<PreProps>) {
  const { children, filename, lineNumbers, highlightLines } = props;

  const getHighlightedLineNumbers = () => {
    const highlightedLineNumbers = highlightLines
      ?.trim()
      ?.split(',')
      ?.map((line) => Number(line));

    if (!highlightedLineNumbers || highlightedLineNumbers.length === 0) return;

    return highlightedLineNumbers as [number, ...number[]];
  };

  return (
    <pre
      className='relative border-2 dark:border-neutral-600 border-neutral-400 p-0'
      data-line-numbers={lineNumbers}
    >
      {filename ? (
        <h6 className='sticky top-0 left-0 right-0 text-foreground overflow-hidden border-b-2 border-neutral-400 dark:border-neutral-600 px-2 py-1'>
          {filename}
        </h6>
      ) : null}
      {cloneElement(children, {
        highlightedLineNumbers: getHighlightedLineNumbers(),
      })}
    </pre>
  );
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slug = slugify(children);
    return createElement(
      `h${level}`,
      { id: slug },
      [
        createElement('a', {
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

function CodeBlock({ children }: PropsWithChildren) {
  return (
    <Tabs defaultValue='snippet'>
      <TabsList>
        <TabsTrigger value='snippet' className='flex items-center gap-2'>
          <Code2 className='size-5' />
          Code
        </TabsTrigger>
        <TabsTrigger value='preview' className='flex items-center gap-2'>
          <AppWindow className='size-5' />
          Preview
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

function Snippet({ children }: PropsWithChildren) {
  return <TabsContent value='snippet'>{children}</TabsContent>;
}

function Preview({ children }: PropsWithChildren) {
  return <TabsContent value='preview'>{children}</TabsContent>;
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
  CodeBlock,
  Snippet,
  Preview,
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
