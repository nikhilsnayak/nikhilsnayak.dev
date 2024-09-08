'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function HeartButton({ count }: { count: number }) {
  return (
    <motion.button
      className='flex items-center gap-1 rounded-full bg-red-100 p-2 text-red-500 transition-colors hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
      aria-label={`Like. Current likes: ${count}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 0.5 },
        }}
      >
        <Heart className='size-6 fill-current' />
      </motion.div>
      <AnimatePresence mode='wait'>
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className='font-semibold tabular-nums'
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
