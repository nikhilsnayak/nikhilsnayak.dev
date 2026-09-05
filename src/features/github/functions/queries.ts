import 'server-only';
import { cacheLife } from 'next/cache';
import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });
const owner = 'nikhilsnayak';

export async function getContributions() {
  'use cache';
  cacheLife('hours');

  const response = await octokit.rest.search.issuesAndPullRequests({
    q: `is:pr is:merged is:public author:${owner} -user:${owner}`,
    sort: 'updated',
    order: 'desc',
    per_page: 3,
  });

  return response.data.items.map((pullRequest) => ({
    id: pullRequest.id,
    title: pullRequest.title,
    url: pullRequest.html_url,
    repository: new URL(pullRequest.repository_url).pathname.replace('/repos/', ''),
    number: pullRequest.number,
  }));
}
