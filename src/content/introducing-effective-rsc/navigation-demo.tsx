'use client';

import { startTransition, useEffect, useRef, useState, ViewTransition } from 'react';

import { Button } from '~/components/ui/button';

type Route = 'event' | 'events';
type Phase = 'complete' | 'requesting' | 'streaming';

const FirstCommitDelay = 600;
const StreamCompletionDelay = 1_800;

const statusLabel = (phase: Phase) => {
  switch (phase) {
    case 'requesting':
      return 'Preparing the next UI';
    case 'streaming':
      return 'URL and first UI committed · stream continues';
    case 'complete':
      return 'Navigation settled';
  }
};

export function NavigationDemo() {
  const [phase, setPhase] = useState<Phase>('complete');
  const [route, setRoute] = useState<Route>('events');
  const generation = useRef(0);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(
    () => () => {
      generation.current += 1;
      for (const timer of timers.current) clearTimeout(timer);
    },
    [],
  );

  const navigate = (destination: Route) => {
    generation.current += 1;
    const currentGeneration = generation.current;
    for (const timer of timers.current) clearTimeout(timer);
    timers.current = [];
    setPhase('requesting');

    const commitTimer = setTimeout(() => {
      if (generation.current !== currentGeneration) return;

      startTransition(() => {
        setRoute(destination);
        setPhase(destination === 'event' ? 'streaming' : 'complete');
      });

      if (destination === 'event') {
        const completionTimer = setTimeout(() => {
          if (generation.current !== currentGeneration) return;
          setPhase('complete');
        }, StreamCompletionDelay);
        timers.current.push(completionTimer);
      }
    }, FirstCommitDelay);

    timers.current.push(commitTimer);
  };

  const eventIsStreaming = route === 'event' && phase !== 'complete';

  return (
    <figure className='not-prose border-border bg-muted/50 my-8 overflow-hidden border'>
      <div className='border-border bg-muted flex items-center gap-2 border-b px-3 py-2'>
        <span aria-hidden='true' className='size-2 bg-red-400' />
        <span aria-hidden='true' className='size-2 bg-amber-400' />
        <span aria-hidden='true' className='size-2 bg-green-400' />
        <div className='ml-2 min-w-0 flex-1 truncate border border-neutral-400 bg-white px-2 py-1 font-mono text-xs dark:border-neutral-600 dark:bg-neutral-950'>
          effective.test{route === 'event' ? '/events/effect-days' : '/events'}
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-xs'>
        <span className='font-mono font-medium' aria-live='polite'>
          {statusLabel(phase)}
        </span>
        <span className='text-neutral-600 dark:text-neutral-400'>Timing model · simulated</span>
      </div>

      <div className='min-h-72 p-4 sm:p-6' aria-busy={phase !== 'complete'}>
        <ViewTransition name='effective-rsc-navigation-demo' enter='slide-up' exit='slide-down'>
          {route === 'events' ? (
            <section key='events' className='space-y-5'>
              <div>
                <p className='text-xs font-medium tracking-wide text-neutral-600 uppercase dark:text-neutral-400'>
                  Events
                </p>
                <h3 className='mt-1 text-xl font-semibold'>Upcoming</h3>
              </div>
              <div className='flex items-center justify-between gap-4 border bg-white p-4 dark:bg-neutral-950'>
                <div>
                  <p className='font-medium'>Effect Days</p>
                  <p className='mt-1 text-sm text-neutral-600 dark:text-neutral-400'>
                    September 18
                  </p>
                </div>
                <Button disabled={phase === 'requesting'} onClick={() => navigate('event')}>
                  Open event
                </Button>
              </div>
            </section>
          ) : (
            <section key='event' className='space-y-5'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-xs font-medium tracking-wide text-neutral-600 uppercase dark:text-neutral-400'>
                    Event
                  </p>
                  <h3 className='mt-1 text-xl font-semibold'>Effect Days</h3>
                </div>
                <Button
                  variant='outline'
                  disabled={phase === 'requesting'}
                  onClick={() => navigate('events')}
                >
                  Back
                </Button>
              </div>

              <div className='border bg-white p-4 dark:bg-neutral-950'>
                <p className='font-medium'>Schedule</p>
                {eventIsStreaming ? (
                  <div className='mt-4 space-y-3' aria-label='Schedule is still streaming'>
                    <div className='h-3 w-4/5 bg-neutral-200 motion-safe:animate-pulse dark:bg-neutral-800' />
                    <div className='h-3 w-3/5 bg-neutral-200 motion-safe:animate-pulse dark:bg-neutral-800' />
                    <div className='h-3 w-2/3 bg-neutral-200 motion-safe:animate-pulse dark:bg-neutral-800' />
                  </div>
                ) : (
                  <ul className='mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300'>
                    <li>09:30 — Effect-native application architecture</li>
                    <li>11:00 — Structured concurrency in practice</li>
                    <li>14:00 — Building with React Server Components</li>
                  </ul>
                )}
              </div>
            </section>
          )}
        </ViewTransition>
      </div>

      <figcaption className='border-t px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400'>
        Open the event, then press Back while its schedule is still streaming. The unfinished work
        is retired instead of committing over the newer navigation.
      </figcaption>
    </figure>
  );
}
