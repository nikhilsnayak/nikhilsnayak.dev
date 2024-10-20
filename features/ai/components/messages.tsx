import type { ComponentProps, PropsWithChildren } from 'react';
import Markdown from 'react-markdown';

export function UserMessage({ children }: PropsWithChildren) {
  return <p>{children}</p>;
}

function CustomLink({ children, ...rest }: ComponentProps<'a'>) {
  return (
    <a {...rest} className='text-green-500 hover:underline' target='_blank'>
      {children}
    </a>
  );
}

export function BotMessage({
  children,
}: Readonly<{
  children: string;
}>) {
  return (
    <Markdown
      components={{
        a: CustomLink,
      }}
    >
      {children}
    </Markdown>
  );
}
