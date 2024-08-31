import { ComponentProps, PropsWithChildren } from 'react';
import Markdown from 'react-markdown';

export function UserMessage({ children }: PropsWithChildren) {
  return (
    <div className='max-w-full'>
      <p className='ml-auto max-w-max whitespace-pre-wrap rounded-md bg-gray-800 p-2 text-gray-100 dark:bg-gray-100 dark:text-gray-800'>
        {children}
      </p>
    </div>
  );
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
    <div className='max-w-full'>
      <div className='max-w-max whitespace-pre-wrap rounded-md bg-gray-100 p-4 dark:bg-gray-800'>
        <Markdown
          components={{
            a: CustomLink,
          }}
        >
          {children}
        </Markdown>
      </div>
    </div>
  );
}
