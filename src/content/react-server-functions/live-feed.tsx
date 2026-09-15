'use client';

import { ArrowUpRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { Button, buttonVariants } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from '~/components/ui/card';
import { Spinner } from '~/components/ui/spinner';

const feedUrl = 'https://effective-rsc-streaming-feed.vercel.app';

export function LiveFeed() {
  const [run, setRun] = useState(0);
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className='not-prose my-8' data-demo='live'>
      <Card className='gap-0 pb-0'>
        <CardHeader className='border-b'>
          <CardTitle>Fieldnotes</CardTitle>
          <CardDescription>Live streaming feed</CardDescription>
          <CardAction className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon-sm'
              onClick={() => {
                setLoaded(false);
                setRun((value) => value + 1);
              }}
              aria-label='Reload live feed'
            >
              <RotateCcw aria-hidden='true' />
            </Button>
            <a
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              href={feedUrl}
              target='_blank'
              rel='noreferrer'
            >
              Open full page <ArrowUpRight aria-hidden='true' />
            </a>
          </CardAction>
        </CardHeader>
        <div className='relative'>
          <iframe
            key={run}
            src={feedUrl}
            loading='lazy'
            title='Fieldnotes: live streaming Server Components example'
            className='bg-muted block h-136 w-full border-0 sm:h-152'
            onLoad={() => setLoaded(true)}
          />
          {!loaded && (
            <output className='bg-card text-muted-foreground pointer-events-none absolute inset-0 flex items-center justify-center gap-2'>
              <Spinner aria-hidden='true' /> Opening the live feed…
            </output>
          )}
        </div>
      </Card>
      <figcaption className='text-muted-foreground mt-3 text-xs'>
        Live ERSC app · scroll inside the feed to load more. Open a newly arrived note while the
        next entry is loading.
      </figcaption>
    </figure>
  );
}
