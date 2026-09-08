import 'server-only';
import { cacheLife } from 'next/cache';
import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });
const owner = 'nikhilsnayak';

export async function getContributions() {
  'use cache';
  cacheLife('hours');

  const [pullRequests, issues] = await Promise.all(
    ['is:pr is:merged', 'is:issue is:closed'].map((filter) =>
      octokit.paginate(octokit.rest.search.issuesAndPullRequests, {
        q: `${filter} is:public author:${owner} -user:${owner}`,
        per_page: 100,
      }),
    ),
  );

  // Search cannot sort by merge/close date. Rank the combined results before taking three.
  return [...pullRequests, ...issues]
    .flatMap((item) => {
      const date = item.pull_request ? item.pull_request.merged_at : item.closed_at;
      if (!date) return [];

      return [
        {
          id: item.id,
          title: item.title,
          url: item.html_url,
          repository: new URL(item.repository_url).pathname.replace('/repos/', ''),
          kind: item.pull_request ? 'PR merged' : 'issue closed',
          date,
        },
      ];
    })
    .toSorted((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 3);
}
