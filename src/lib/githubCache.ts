// src/lib/githubCache.ts
const githubCache = new Map<string, any>();

export async function fetchRepoData(repo: string) {
  // 標準化 Repo 名稱作為 Key
  const normalizedRepo = repo.toLowerCase().trim();

  // 如果快取中已有資料，直接回傳
  if (githubCache.has(normalizedRepo)) {
    console.log(`[GitHub Cache] Hit: ${normalizedRepo}`);
    return githubCache.get(normalizedRepo);
  }

  console.log(`[GitHub Fetch] Fetching: ${normalizedRepo}`);
  try {
    const response = await fetch(
      `https://api.github.com/repos/${normalizedRepo}`,
      {
        headers: {
          // 建議在 .env 加入 GITHUB_TOKEN 以增加 Rate Limit
          Authorization: import.meta.env.GITHUB_TOKEN
            ? `token ${import.meta.env.GITHUB_TOKEN}`
            : "",
          "User-Agent": "Astro-Build-Cache",
        },
      },
    );

    if (!response.ok) {
      if (response.status === 403)
        console.warn("GitHub API rate limit exceeded.");
      return null;
    }

    const data = await response.json();
    // 存入快取
    githubCache.set(normalizedRepo, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch repo ${repo}:`, error);
    return null;
  }
}
