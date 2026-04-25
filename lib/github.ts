export type GithubPR = {
  owner: string;
  repo: string;
  number: string;
  shortUrl: string;
};

export function parseGithubPrUrl(url?: string | null): GithubPR | null {
  if (!url) return null;
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2],
    number: match[3],
    shortUrl: `github.com/${match[1]}/${match[2]}/pull/${match[3]}`,
  };
}
