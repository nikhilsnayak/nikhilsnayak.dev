import {
  cloneElement,
  ComponentProps,
  createElement,
  PropsWithChildren,
  ReactElement,
} from 'react';
import Image from 'next/image';
import { highlight, LineNumbers } from 'code-syntactic-sugar';
import { AppWindow, Code2 } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Link } from 'next-view-transitions';
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
  highlightedLines?: LineNumbers;
  addedLines?: LineNumbers;
  removedLines?: LineNumbers;
}

function Code({
  children,
  highlightedLines,
  addedLines,
  removedLines,
}: Readonly<CodeProps>) {
  const codeLines = highlight(children, {
    modifiers: {
      highlightedLines,
      addedLines,
      removedLines,
    },
  });

  return <code>{codeLines}</code>;
}

interface PreProps {
  children: ReactElement<CodeProps, 'code'>;
  filename?: string;
  lineNumbers?: boolean;
  highlight?: string;
  addition?: string;
  deletion?: string;
}

function Pre(props: Readonly<PreProps>) {
  const { children, filename, lineNumbers, highlight, addition, deletion } =
    props;

  const getLineNumbers = (rawString?: string) => {
    const rangeArray = (numbers: number[]) => {
      if (numbers.length === 1) {
        return [numbers[0]];
      }
      const [start, end] = numbers;
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    };

    const lineNumbers = rawString
      ?.trim()
      ?.split(',')
      ?.flatMap((range) =>
        rangeArray(range.split('-').map((line) => Number(line)))
      );

    if (!lineNumbers || lineNumbers.length === 0) return;

    return lineNumbers as LineNumbers;
  };

  return (
    <pre
      className='relative border-2 border-neutral-400 p-0 dark:border-neutral-600'
      data-line-numbers={lineNumbers}
    >
      {filename ? (
        <h6 className='sticky left-0 right-0 top-0 overflow-hidden border-b-2 border-neutral-400 px-2 py-1 text-foreground dark:border-neutral-600'>
          {filename}
        </h6>
      ) : null}
      {cloneElement(children, {
        highlightedLines: getLineNumbers(highlight),
        addedLines: getLineNumbers(addition),
        removedLines: getLineNumbers(deletion),
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

interface CollapsibleContentProps extends PropsWithChildren {
  summary: string;
}

function CollapsibleContent({ summary, children }: CollapsibleContentProps) {
  return (
    <details className='my-4'>
      <summary className='cursor-pointer'>{summary}</summary>
      <div className='mt-2'>{children}</div>
    </details>
  );
}

function Row({ children }: PropsWithChildren) {
  return <div className='grid gap-4 sm:grid-cols-2'>{children}</div>;
}

function Column({ children }: PropsWithChildren) {
  return <div className='grid place-items-center'>{children}</div>;
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
  CollapsibleContent,
  Row,
  Column,
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
