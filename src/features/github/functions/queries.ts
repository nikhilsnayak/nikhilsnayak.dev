import 'server-only';

import { Octokit } from 'octokit';

import { formatDate } from '~/lib/utils';

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });
const owner = 'nikhilsnayak';
const repo = 'nikhilsnayak.dev';

export async function getLatestCommit() {
  'use cache';
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
      ? formatDate(new Date(latestCommit.commit.author.date))
      : null,
    message: latestCommit.commit.message,
    url: latestCommit.html_url,
  };
}

export async function getLanguages() {
  'use cache';
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
