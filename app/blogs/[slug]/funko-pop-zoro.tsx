'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FunkoPopZoroSvg } from '@/assets/icons';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';

function getRandomInteractionMessage() {
  const interactionMessages = [
    'Hey there! Just finished a hundred push-ups. Need a summary of this blog while I catch my breath?',
    'Yo! Taking a break from sword practice. Need me to summarize this blog for you while I recharge?',
    'Hello! I seem to have gotten lost again. While I find my bearings, how about a summary of this blog?',
    "Hey! Just taking a moment to reflect. Want me to summarize this blog for you while I contemplate life's mysteries?",
    'Hi there! Just enjoying the breeze. How about a summary of this blog while I take in the scenery?',
    'Yo! Always ready for action. Want me to summarize this blog for you before the next adventure begins?',
  ];
  const randomIndex = Math.floor(Math.random() * interactionMessages.length);
  return interactionMessages[randomIndex];
}

interface FunkoPopZoroProps {
  blogTitle?: string;
}

export function FunkoPopZoro({ blogTitle }: FunkoPopZoroProps) {
  const { scrollYProgress } = useScroll();

  const [translateY, setTranslateY] = useState('100%');
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const newTranslateY = `${100 - 10 * Math.min(latest * 100, 10)}%`;
    setTranslateY(newTranslateY);
    setIsVisible(latest * 100 >= 10);
  });

  return (
    <motion.div
      style={{
        position: 'fixed',
        right: 10,
        bottom: 0,
        transform: `translateY(${translateY})`,
      }}
      //@ts-expect-error -- I don't know why this error is coming
      className='hidden transition-transform duration-500 ease-in lg:block'
    >
      <div className='relative'>
        <FunkoPopZoroSvg />
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1,
              }}
              //@ts-expect-error -- I don't know why this error is coming
              className='absolute -top-32 right-16 max-w-sm rounded-lg border border-gray-300 bg-white p-4 shadow-lg'
            >
              <p className='text-sm text-gray-700'>
                {`${getRandomInteractionMessage()} `}
                <Link
                  href={{
                    pathname: '/bot',
                    query: {
                      ...(blogTitle && {
                        prompt: `Summarize "${blogTitle}" Blog`,
                      }),
                    },
                  }}
                  className='text-green-500 underline'
                >
                  click here
                </Link>
              </p>
              <div className='absolute -bottom-2 right-8 h-0 w-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white'></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
