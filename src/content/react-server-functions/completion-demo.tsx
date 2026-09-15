'use client';

import { ChevronDown, Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
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
import { Progress, ProgressLabel, ProgressValue } from '~/components/ui/progress';
import { Slider } from '~/components/ui/slider';
import { Spinner } from '~/components/ui/spinner';

const events = [
  'Start a request for three entries.',
  'Entry 7 arrives. Its note is still rendering.',
  'Entry 8 arrives. Both notes are still rendering.',
  'Note 7 resolves inside the first entry.',
  'Entry 9 arrives. We now have every entry in the page.',
  'The item stream ends. Notes 8 and 9 still need the response.',
  'Note 8 resolves. The response is still open.',
  'Note 9 resolves. All three notes have arrived.',
  'The Flight response ends. The streaming call can finish.',
];
const cards = [
  {
    id: 7,
    arrival: 1,
    ready: 3,
    title: 'A slower kind of attention',
    note: 'There is a difference between having read something and having reached the bottom of it. I’m trying to make more room for the former.',
  },
  {
    id: 8,
    arrival: 2,
    ready: 6,
    title: 'A good tool gets out of the way',
    note: 'The tools I keep coming back to don’t ask me to relearn them every month. They quietly make the familiar things easier.',
  },
  {
    id: 9,
    arrival: 4,
    ready: 7,
    title: 'Small places on the internet',
    note: 'A personal website doesn’t need to become a platform. Sometimes a place to leave your notes is enough.',
  },
];

export function CompletionDemo() {
  const timelineId = useId();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [expanded, setExpanded] = useState<number[]>([9]);
  const complete = step === events.length - 1;

  useEffect(() => {
    if (!playing || cancelled || complete) return;
    const timer = setTimeout(
      () => {
        setStep((value) => value + 1);
        if (step === events.length - 2) setPlaying(false);
      },
      step === 5 ? 2600 : 1300,
    );
    return () => clearTimeout(timer);
  }, [playing, step, cancelled, complete]);

  function reset() {
    setStep(0);
    setPlaying(false);
    setCancelled(false);
    setExpanded([9]);
  }

  const status = cancelled ? 'interrupted' : complete ? 'complete' : step > 0 ? 'waiting' : 'idle';

  return (
    <figure className='not-prose my-8' data-demo='completion'>
      <Card>
        <CardHeader className='border-b'>
          <CardTitle>One request, two lifetimes</CardTitle>
          <CardDescription>Step through item delivery and the Flight response.</CardDescription>
          <CardAction>
            <Button
              variant='ghost'
              size='sm'
              onClick={reset}
              aria-label='Reset completion illustration'
            >
              <RotateCcw aria-hidden='true' /> Reset
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Progress value={cards.filter((card) => step >= card.arrival).length} max={3}>
            <ProgressLabel>Items</ProgressLabel>
            <ProgressValue>
              {() =>
                step >= 5
                  ? 'EOF'
                  : cancelled
                    ? 'stopped'
                    : `${cards.filter((card) => step >= card.arrival).length} / 3`
              }
            </ProgressValue>
          </Progress>
          <Progress value={step} max={8}>
            <ProgressLabel>Flight</ProgressLabel>
            <ProgressValue>
              {() => (complete ? 'EOF' : cancelled ? 'aborted' : step ? 'open' : 'idle')}
            </ProgressValue>
          </Progress>
          <div className='space-y-3 pt-2'>
            <Label id={timelineId}>Step through the response</Label>
            <Slider
              aria-labelledby={timelineId}
              min={0}
              max={8}
              step={1}
              value={[step]}
              onValueChange={(value) => {
                setStep(typeof value === 'number' ? value : value[0]);
                setPlaying(false);
                setCancelled(false);
              }}
            />
          </div>
          <output className='block min-h-16'>
            {cancelled
              ? 'The request was interrupted. Received content stays; unfinished notes cannot resolve on this response.'
              : events[step]}
          </output>
          <div className='divide-y border-y'>
            {cards.map((card) => {
              const arrived = step >= card.arrival;
              const ready = step >= card.ready;
              const open = expanded.includes(card.id);
              return (
                <Collapsible
                  key={card.id}
                  disabled={!arrived}
                  open={arrived && open}
                  onOpenChange={(nextOpen) =>
                    setExpanded((value) =>
                      nextOpen ? [...value, card.id] : value.filter((id) => id !== card.id),
                    )
                  }
                >
                  <CollapsibleTrigger
                    render={
                      <Button
                        variant='ghost'
                        className='h-auto w-full justify-start gap-3 py-3 text-left whitespace-normal'
                      />
                    }
                  >
                    <span className='section-label tabular-nums'>
                      {String(card.id).padStart(2, '0')}
                    </span>
                    <span className='flex-1'>
                      {arrived ? card.title : 'Entry hasn’t arrived yet'}
                    </span>
                    <ChevronDown
                      className={open && arrived ? 'rotate-180' : undefined}
                      aria-hidden='true'
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className='min-h-20 px-3 pb-4' data-note={card.id}>
                      {ready ? (
                        <p>{card.note}</p>
                      ) : cancelled ? (
                        <p className='text-destructive'>
                          This note was interrupted. Replay the illustration to start again.
                        </p>
                      ) : (
                        <p className='text-muted-foreground flex items-center gap-2'>
                          <Spinner aria-hidden='true' />
                          Loading the note…
                        </p>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className='flex-wrap justify-between gap-3'>
          <span className='text-muted-foreground'>
            Stream: <strong className='text-foreground font-medium'>{status}</strong>
          </span>
          <div className='flex flex-wrap items-center gap-2'>
            <Button
              variant='ghost'
              disabled={step === 0 || complete || cancelled}
              onClick={() => {
                setPlaying(false);
                setCancelled(true);
              }}
            >
              Cancel request
            </Button>
            <Button
              variant='outline'
              size='icon'
              disabled={complete || cancelled}
              onClick={() => {
                setPlaying(false);
                setStep((value) => Math.min(value + 1, 8));
              }}
              aria-label='Next event'
            >
              <SkipForward aria-hidden='true' />
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                if (complete || cancelled) {
                  reset();
                  setPlaying(true);
                } else setPlaying(!playing);
              }}
            >
              {playing ? <Pause aria-hidden='true' /> : <Play aria-hidden='true' />}
              {playing ? 'Pause' : complete || cancelled ? 'Replay' : 'Play'}
            </Button>
          </div>
        </CardFooter>
      </Card>
      <figcaption className='text-muted-foreground mt-3 text-xs'>
        Timing illustration · a model of item delivery and pending React content, not a live
        request.
      </figcaption>
    </figure>
  );
}
