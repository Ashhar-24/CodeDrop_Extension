const GITHUB_USERNAME = "your-username";
const GITHUB_REPO = "your-repo-name";
const GITHUB_TOKEN = "your-github-token";

// Cross-browser compatibility
const browserAPI = typeof browser !== "undefined" ? browser : chrome;

browserAPI.runtime.onMessage.addListener(
  async (message, sender, sendResponse) => {
    if (message.action === "trigger_push") {
      const fileName = `${message.data.title.replace(/[^\w]/g, "_")}.cpp`;
      const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${fileName}`;

      try {
        const res = await fetch(apiUrl, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
          },
        });

        if (res.status === 200) {
          const fileData = await res.json();
          browserAPI.runtime.sendMessage({
            action: "file_exists",
            fileUrl: fileData.html_url,
            sha: fileData.sha,
            fileName,
            data: message.data,
          });
        } else {
          await pushToGitHub(message.data);
        }
      } catch (err) {
        console.error("GitHub fetch error:", err);
      }
    }

    if (message.action === "delete_and_push") {
      await deleteAndPush(message.data, message.sha, message.fileName);
    }
  }
);

async function deleteAndPush(data, sha, fileName) {
  const deleteUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${fileName}`;

  await fetch(deleteUrl, {
    method: "DELETE",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      message: `Deleting old version of ${data.title}`,
      sha: sha,
    }),
  });

  await pushToGitHub(data);
}

async function pushToGitHub({
  title,
  url,
  code,
  commitMessage,
  description,
  difficulty,
}) {
  const fileName = `${title.replace(/[^\w]/g, "_")}.cpp`;

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateString = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timestamp = `${timeString}, ${dateString}`;

  let header = `/*\nProblem: ${title}`;
  if (url?.trim()) header += `\nURL: ${url}`;
  if (difficulty) header += `\nDifficulty: ${difficulty}`;
  header += `\nTimestamp: ${timestamp}`;
  header += `\n*/\n\n`;

  let footer = "";
  if (description?.trim()) footer += `\n\n/*\nNotes:\n${description}`;
  footer += `\n*/\n\n`;

  const cppContent = header + code + footer;
  const encodedContent = btoa(unescape(encodeURIComponent(cppContent)));

  const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${fileName}`;

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      message: commitMessage,
      content: encodedContent,
    }),
  });

  const result = await response.json();

  if (browserAPI.runtime?.sendMessage && result?.content?.html_url) {
    browserAPI.runtime.sendMessage({
      action: "push_success",
      fileUrl: result.content.html_url,
    });
  }
}