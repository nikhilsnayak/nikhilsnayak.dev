import { highlight, type LineNumbers } from 'code-syntactic-sugar';
import type { MDXComponents } from 'mdx/types';
import * as motion from 'motion/react-client';
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

import { CodeFrame } from '~/components/code-frame';
import { ExternalLink } from '~/components/external-link';
import { HeadingAnchor } from '~/components/heading-anchor';
import { Spinner } from '~/components/spinner';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { detailEase } from '~/lib/motion';
import { cn, slugify } from '~/lib/utils';

function CustomLink({ href, ...props }: ComponentProps<'a'>) {
  if (href?.startsWith('/')) {
    return (
      <Link {...props} href={{ pathname: href }} className={cn('text-link', props.className)}>
        {props.children}
      </Link>
    );
  }

  if (href?.startsWith('#')) {
    return (
      // oxlint-disable-next-line jsx-a11y/anchor-has-content
      <a {...props} href={href} className={cn('text-link', props.className)} />
    );
  }

  return (
    <ExternalLink
      {...props}
      href={href}
      className={cn(
        'text-link [&>.external-arrow]:ml-1 [&>.external-arrow]:align-[-0.125em]',
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
    <CodeFrame code={children.props.children} filename={filename} lineNumbers={lineNumbers}>
      {cloneElement(children, {
        highlightedLines: getLineNumbers(highlight),
        addedLines: getLineNumbers(addition),
        removedLines: getLineNumbers(deletion),
        noHighlight,
      })}
    </CodeFrame>
  );
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slug = slugify(children);
    return createElement(
      `h${level}`,
      { id: slug },
      [createElement(HeadingAnchor, { key: `link-${slug}`, slug, label: children })],
      children,
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

function CodeBlock({ children }: PropsWithChildren) {
  return (
    <CustomTabs defaultValue='snippet'>
      <div className='border-border bg-muted/50 flex h-11 items-center border border-b-0 pr-28 pl-1.5'>
        <TabsList
          aria-label='Example view'
          className='group/code-view border-border relative h-9 rounded-full border bg-transparent p-0.5'
        >
          <TabsIndicator
            className='bg-secondary pointer-events-none absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-full group-has-focus-visible/code-view:transform-none!'
            render={<motion.span layout transition={{ duration: 0.18, ease: detailEase }} />}
          />
          {[
            ['snippet', 'Code'],
            ['preview', 'Preview'],
          ].map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className='data-active:text-foreground dark:data-active:text-foreground text-muted-foreground relative h-7.5 w-16 flex-none rounded-full border-0 px-0 font-mono text-[11px] font-normal shadow-none data-active:bg-transparent data-active:shadow-none dark:data-active:bg-transparent'
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {children}
    </CustomTabs>
  );
}

function Snippet({ children }: PropsWithChildren) {
  return <TabsContent value='snippet'>{children}</TabsContent>;
}

function Preview({ children }: PropsWithChildren) {
  return (
    <TabsContent value='preview' className='not-prose border-border bg-muted/50 border p-3 sm:p-4'>
      {children}
    </TabsContent>
  );
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
  return <Tabs className={cn('mdx-tabs my-6 gap-0', className)} {...props} />;
}

function CustomTabsList({ className, ...props }: ComponentProps<typeof TabsList>) {
  return (
    <div className='border-border bg-muted/50 border border-b-0 pr-28'>
      <ScrollArea className='w-full'>
        <TabsList className={cn('h-11 bg-transparent p-0', className)} {...props} />
        <ScrollBar
          orientation='horizontal'
          className='h-1 border-t-0 p-0'
          style={{ top: 0, bottom: 'auto' }}
        />
      </ScrollArea>
    </div>
  );
}

function CustomTabsTrigger({ className, ...props }: ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className={cn(
        'text-muted-foreground data-active:text-foreground data-active:border-foreground h-11 border-0 border-b border-transparent bg-transparent px-3.5 font-mono text-xs font-normal shadow-none data-active:bg-transparent data-active:shadow-none dark:data-active:border-foreground dark:data-active:bg-transparent',
        className,
      )}
      {...props}
    />
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
  LoadingSpinner: Spinner,
  pre: Pre,
  CodeBlock,
  Snippet,
  Preview,
  Tweet,
  Tabs: CustomTabs,
  TabsList: CustomTabsList,
  TabsTrigger: CustomTabsTrigger,
  TabsContent,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
