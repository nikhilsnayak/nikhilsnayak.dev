import { unstable_cache } from 'next/cache';
import { Octokit } from 'octokit';

import { formatDate } from './utils';

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });
const owner = 'nikhilsnayak';
const repo = 'nikhilsnayak.dev';

async function INTERNAL__getLatestCommit() {
  const response = await octokit.rest.repos.listCommits({
    owner,
    repo,
    ref: 'main',
    per_page: 1,
  });

  const latestCommit = response.data[0];

  return {
    author: latestCommit?.commit?.author?.name,
    date: latestCommit?.commit.author?.date
      ? formatDate(latestCommit.commit.author.date)
      : null,
    message: latestCommit.commit.message,
    url: latestCommit.html_url,
  };
}

async function INTERNAL__getLanguages() {
  const response = await octokit.rest.repos.listLanguages({
    owner,
    repo,
  });

  const languages = response.data;
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  const languageStats = Object.entries(languages).map(([name, bytes]) => ({
    name,
    percentage: (bytes / totalBytes) * 100,
  }));

  return languageStats.sort((a, b) => b.percentage - a.percentage);
}

export const getLatestCommit = unstable_cache(
  INTERNAL__getLatestCommit,
  ['getLatestCommit'],
  {
    tags: ['getLatestCommit'],
  }
);

export const getLanguages = unstable_cache(
  INTERNAL__getLanguages,
  ['getLanguages'],
  {
    tags: ['getLanguages'],
  }
);
