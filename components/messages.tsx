import { ComponentProps, PropsWithChildren } from 'react';
import Markdown from 'react-markdown';

export function UserMessage({ children }: PropsWithChildren) {
  return <p>{children}</p>;
}

function CustomLink(props: ComponentProps<'a'>) {
  return (
    <a {...props} className='text-green-500 hover:underline' target='_blank' />
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
