import { highlight, type LineNumbers } from 'code-syntactic-sugar';
import { AppWindow, Code2 } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import { cacheLife } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import {
  cloneElement,
  createElement,
  Fragment,
  type ComponentProps,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import { Tweet as ReactTweet, type TweetProps } from 'react-tweet';

import { Spinner } from '~/components/spinner';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn, slugify } from '~/lib/utils';

function Table({
  data,
}: Readonly<{
  data: {
    headers: string[];
    rows: string[][];
  };
}>) {
  const headers = data.headers.map((header, index) => <th key={index}>{header}</th>);

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

function CustomLink({ href, ...props }: ComponentProps<'a'>) {
  if (href?.startsWith('/')) {
    return (
      <Link
        {...props}
        href={{ pathname: href }}
        className={cn(
          'underline underline-offset-2 transition-all hover:underline-offset-4 focus-ring',
          props.className,
        )}
      >
        {props.children}
      </Link>
    );
  }

  if (href?.startsWith('#')) {
    return (
      // oxlint-disable-next-line jsx-a11y/anchor-has-content
      <a
        {...props}
        href={href}
        className={cn(
          'underline underline-offset-2 transition-all hover:underline-offset-4 focus-ring',
          props.className,
        )}
      />
    );
  }

  return (
    // oxlint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...props}
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        'underline underline-offset-2 transition-all hover:underline-offset-4 focus-ring',
        props.className,
      )}
    />
  );
}

interface CodeProps {
  children: string;
  highlightedLines?: LineNumbers;
  addedLines?: LineNumbers;
  removedLines?: LineNumbers;
  noHighlight?: boolean;
}

function Code({
  children,
  highlightedLines,
  addedLines,
  removedLines,
  noHighlight,
}: Readonly<CodeProps>) {
  if (children.split('\n').length === 1) {
    return <code>{children}</code>;
  }

  if (noHighlight) {
    return (
      <code data-no-highlight>
        {children
          .split('\n')
          .filter(Boolean)
          .map((line, index) => (
            <Fragment key={index}>
              <span className='css__line'>{line}</span>
              {'\n'}
            </Fragment>
          ))}
      </code>
    );
  }

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
  noHighlight?: boolean;
}

function Pre(props: Readonly<PreProps>) {
  const { children, filename, lineNumbers, highlight, addition, deletion, noHighlight } = props;

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
      ?.flatMap((range) => rangeArray(range.split('-').map((line) => Number(line))));

    if (!lineNumbers || lineNumbers.length === 0) return;

    return lineNumbers as LineNumbers;
  };

  return (
    <pre
      className='border-border bg-muted/50 relative rounded-none! border p-0!'
      data-line-numbers={lineNumbers}
    >
      {filename ? (
        <div className='border-border text-muted-foreground sticky top-0 right-0 left-0 overflow-hidden border-b px-4 py-2 font-mono text-xs font-normal'>
          {filename}
        </div>
      ) : null}
      {cloneElement(children, {
        highlightedLines: getLineNumbers(highlight),
        addedLines: getLineNumbers(addition),
        removedLines: getLineNumbers(deletion),
        noHighlight,
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
          className: 'anchor focus-ring',
          'aria-label': `Link to ${children}`,
        }),
      ],
      children,
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
  return (
    <TabsContent value='preview' className='not-prose'>
      {children}
    </TabsContent>
  );
}

interface CollapsibleContentProps extends PropsWithChildren {
  summary: string;
}

function CollapsibleContent({ summary, children }: CollapsibleContentProps) {
  return (
    <details className='my-4'>
      <summary className='focus-ring cursor-pointer'>{summary}</summary>
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

async function Tweet(props: TweetProps) {
  'use cache';
  cacheLife('max');
  return (
    <div className='not-prose'>
      <ReactTweet {...props} />
    </div>
  );
}

function CustomTabs({ className, ...props }: ComponentProps<typeof Tabs>) {
  return <Tabs className={cn('gap-0 [&_pre]:mt-0!', className)} {...props} />;
}

function CustomTabsList({ className, ...props }: ComponentProps<typeof TabsList>) {
  return (
    <ScrollArea className='border-border bg-muted/50 w-full border border-b-0'>
      <TabsList className={cn('bg-inherit', className)} {...props} />
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image,
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
  Tweet,
  ScrollArea,
  ScrollBar,
  Tabs: CustomTabs,
  TabsList: CustomTabsList,
  TabsTrigger,
  TabsContent,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
