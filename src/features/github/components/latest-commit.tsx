import * as motion from 'motion/react-client';

import { getLatestCommit } from '../functions/queries';

export async function LatestCommit() {
  const latestCommit = await getLatestCommit();
  return (
    <motion.a
      href={latestCommit.url}
      target='_blank'
      rel='noopener noreferrer'
      className='dark:text-accent block text-xs tracking-tighter underline'
      whileHover={{ opacity: 0.8 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      Latest commit: {latestCommit.message.split('\n')[0]} by{' '}
      {latestCommit.author} on {latestCommit.date}
    </motion.a>
  );
}
