'use client';

import { ChevronDown, RotateCcw } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~/components/ui/collapsible';
import { Label } from '~/components/ui/label';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Slider } from '~/components/ui/slider';
import { Spinner } from '~/components/ui/spinner';

const stories = [
  [
    'The web used to have more doors',
    "On finding something you weren't looking for.",
    'Mira Chen',
    'I used to follow links without knowing where I would end up. A blogroll could take me somewhere no search query would have suggested.',
  ],
  [
    'Leave a little room',
    'A case for the empty space between things.',
    'Theo Martin',
    'Not every gap needs another feature. Sometimes leaving a little space makes the things already there easier to notice.',
  ],
  [
    'Software that knows when to stop',
    'The best feature might be the one you leave out.',
    'Asha Rao',
    'There is a point where another option makes a tool harder to use. Knowing when to stop is part of designing it.',
  ],
  [
    'A notebook with no search bar',
    'Remembering by writing, rather than retrieving.',
    'Leo Park',
    'Writing something down makes me decide what mattered. The notebook keeps a record, but the useful part happens before I close it.',
  ],
  [
    'Walking without a destination',
    'A small argument against optimising every afternoon.',
    'Nora Ellis',
    'I took a different street with no plan for where it led. It was a small change, but it made a familiar walk feel new.',
  ],
  [
    'The things we keep repairing',
    'What a worn-out object can tell us about its owner.',
    'Sam Okafor',
    'The handle has been replaced twice. I could buy another one, but by now repairing it feels like part of owning it.',
  ],
  [
    'A slower kind of attention',
    'Reading one thing all the way to the end.',
    'Mira Chen',
    'There is a difference between having read something and having reached the bottom of it. I’m trying to make more room for the former.',
  ],
  [
    'A good tool gets out of the way',
    'Familiarity is a feature too.',
    'Theo Martin',
    'The tools I keep coming back to don’t ask me to relearn them every month. They quietly make the familiar things easier.',
  ],
  [
    'Small places on the internet',
    'A personal website is still a good idea.',
    'Asha Rao',
    'A personal website doesn’t need to become a platform. Sometimes a place to leave your notes is enough.',
  ],
] as const;

function ReadingItem({ index }: { index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [title, summary, author, note] = stories[index];
  return (
    <li className='flex min-h-28 items-start gap-3 border-b py-4 last:border-0'>
      <span className='section-label pt-1 tabular-nums'>{String(index + 1).padStart(2, '0')}</span>
      <Collapsible open={expanded} onOpenChange={setExpanded} className='min-w-0 flex-1 space-y-2'>
        <div className='space-y-1'>
          <h4 className='text-sm font-medium'>{title}</h4>
          <p className='text-muted-foreground text-xs'>{summary}</p>
          <p className='text-muted-foreground text-xs'>{author}</p>
        </div>
        <CollapsibleTrigger
          render={<Button variant='ghost' size='sm' />}
          aria-label={`Read ${title}`}
        >
          {expanded ? 'Close note' : 'Read note'}
          <ChevronDown className={expanded ? 'rotate-180' : undefined} aria-hidden='true' />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className='pb-1 text-sm'>{note}</p>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

export function ReadingDemo({ streaming = false }: { streaming?: boolean }) {
  const delayId = useId();
  const [count, setCount] = useState(3);
  const [remaining, setRemaining] = useState(0);
  const [delay, setDelay] = useState(900);
  const [run, setRun] = useState(0);
  const waiting = remaining > 0;

  useEffect(() => {
    if (!remaining) return;
    const timer = setTimeout(
      () => {
        setCount((value) => value + (streaming ? 1 : 3));
        setRemaining((value) => value - (streaming ? 1 : 3));
      },
      delay * (streaming ? 1 : 3),
    );
    return () => clearTimeout(timer);
  }, [remaining, delay, streaming]);

  function reset() {
    setRemaining(0);
    setCount(3);
    setRun((value) => value + 1);
  }

  return (
    <figure className='not-prose my-8' data-demo={streaming ? 'stream' : 'page'}>
      <Card>
        <CardHeader className='border-b'>
          <CardTitle>Fieldnotes</CardTitle>
          <CardDescription>
            {streaming ? 'One entry at a time' : 'One page at a time'}
          </CardDescription>
          <CardAction>
            <Button variant='ghost' size='sm' onClick={reset} aria-label='Reset reading list'>
              <RotateCcw aria-hidden='true' /> Reset
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-84' aria-label='Reading list'>
            <ol key={run} className='pr-3'>
              {stories.slice(0, count).map((story, index) => (
                <ReadingItem key={story[0]} index={index} />
              ))}
              {Array.from({ length: remaining }, (_, index) => (
                <li
                  key={`pending-${count + index}`}
                  className='flex min-h-28 items-start gap-3 border-b py-4 last:border-0'
                  aria-hidden='true'
                >
                  <span className='section-label pt-1 tabular-nums'>
                    {String(count + index + 1).padStart(2, '0')}
                  </span>
                  <span className='text-muted-foreground flex items-center gap-2'>
                    <Spinner aria-hidden='true' /> Waiting for this entry…
                  </span>
                </li>
              ))}
            </ol>
          </ScrollArea>
        </CardContent>
        <CardContent className='space-y-3'>
          <div className='flex items-center justify-between gap-3'>
            <Label id={delayId}>Time per entry</Label>
            <output className='text-muted-foreground tabular-nums'>
              {(delay / 1000).toFixed(1)}s
            </output>
          </div>
          <Slider
            aria-labelledby={delayId}
            min={300}
            max={1800}
            step={300}
            value={[delay]}
            disabled={waiting}
            onValueChange={(value) => setDelay(typeof value === 'number' ? value : value[0])}
          />
        </CardContent>
        <CardFooter className='flex-wrap justify-between gap-3'>
          <output className='text-muted-foreground flex items-center gap-2 tabular-nums'>
            {waiting && <Spinner aria-hidden='true' />}
            {count} entries
            {waiting ? ' · loading more' : count === stories.length ? ' · all caught up' : ''}
          </output>
          <Button
            variant='outline'
            disabled={waiting || count === stories.length}
            onClick={() => setRemaining(3)}
          >
            {waiting ? 'Loading…' : 'Next three entries'}
          </Button>
        </CardFooter>
      </Card>
      <figcaption className='text-muted-foreground mt-3 text-xs'>
        Interactive illustration · local data and simulated latency. Expanded notes stay open as
        entries arrive.
      </figcaption>
    </figure>
  );
}
