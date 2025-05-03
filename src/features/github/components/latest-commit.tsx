import { getLatestCommit } from '../functions/queries';

export async function LatestCommit() {
  const latestCommit = await getLatestCommit();
  return (
    <a
      href={latestCommit.url}
      target='_blank'
      rel='noopener noreferrer'
      className='dark:text-theme block text-xs tracking-tighter underline'
    >
      Latest commit: {latestCommit.message.split('\n')[0]} by{' '}
      {latestCommit.author} on {latestCommit.date}
    </a>
  );
}
