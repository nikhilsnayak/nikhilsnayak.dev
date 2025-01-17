'use client';

import {
  useState,
  // unstable_ViewTransition as ViewTransition,
  type ReactNode,
} from 'react';

import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ViewTransitionTabsProps {
  tabs: Array<{
    value: string;
    name?: string;
    content: ReactNode;
  }>;
}

export function ViewTransitionTabs({ tabs }: ViewTransitionTabsProps) {
  const [selected, setSelected] = useState(tabs[0]?.value);

  const handleChange = (value: string) => {
    // startTransition(() => {
    //   setSelected(value);
    // });
    if ('startViewTransition' in document) {
      document.startViewTransition(() => {
        setSelected(value);
      });
    } else {
      setSelected(value);
    }
  };

  return (
    <Tabs value={selected} onValueChange={handleChange}>
      <ScrollArea className='w-full'>
        <TabsList>
          {tabs.map((tab) => {
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.name ?? tab.value}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      {/* <ViewTransition
      > */}

      {tabs.map((tab) => {
        return (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        );
      })}

      {/* </ViewTransition> */}
    </Tabs>
  );
}
