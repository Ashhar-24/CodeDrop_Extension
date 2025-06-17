document.addEventListener("DOMContentLoaded", () => {
  const fields = {
    questionName: document.getElementById("questionName"),
    code: document.getElementById("code"),
    commitMessage: document.getElementById("commitMessage"),
    description: document.getElementById("description"),
    difficulty: document.getElementById("difficulty")
  };

  for (const key in fields) {
    const storedValue = localStorage.getItem(`gfg_${key}`);
    if (storedValue !== null) {
      fields[key].value = storedValue;
    }

    fields[key].addEventListener("input", () => {
      localStorage.setItem(`gfg_${key}`, fields[key].value);
    });
  }

  let shaIfExists = null;
  let fileNameIfExists = null;
  let pushDataIfExists = null;
  let fileExists = false;

  const pushBtn = document.getElementById("push");

  pushBtn.addEventListener("click", () => {
    const questionName = fields.questionName.value.trim();
    const code = fields.code.value;
    const commitMessage = fields.commitMessage.value.trim();
    const description = fields.description.value;
    const difficulty = fields.difficulty.value.trim();

    const existingWarning = document.getElementById("input-warning");
    if (
      !questionName ||
      !code ||
      !commitMessage ||
      !difficulty ||
      !description
    ) {
      if (!existingWarning) {
        const warningBox = document.createElement("div");
        warningBox.id = "input-warning";
        warningBox.textContent = "⚠️ Please fill in all fields.";
        warningBox.style.color = "red";
        warningBox.style.marginTop = "10px";
        document.body.insertBefore(warningBox, pushBtn);
        setTimeout(() => warningBox.remove(), 1000);
      }
      return;
    } else if (existingWarning) {
      existingWarning.remove();
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0]?.url || "";

      const data = {
        title: questionName,
        url,
        statement: "",
        code,
        commitMessage: commitMessage || "Add solution",
        description,
        difficulty
      };

      if (fileExists) {
        chrome.runtime.sendMessage({
          action: "delete_and_push",
          sha: shaIfExists,
          fileName: fileNameIfExists,
          data,
        });
      } else {
        chrome.runtime.sendMessage({
          action: "trigger_push",
          data,
        });
      }
    });
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "file_exists") {
      shaIfExists = message.sha;
      fileNameIfExists = message.fileName;
      pushDataIfExists = message.data;
      fileExists = true;

      const messageBox = document.createElement("div");
      messageBox.textContent = "⚠️ File already exists!";
      messageBox.style.color = "red";
      document.body.insertBefore(messageBox, pushBtn);
      setTimeout(() => messageBox.remove(), 3000);

      pushBtn.textContent = "🗑️ Push New File";
    }

    if (message.action === "push_success") {
      ["questionName", "code", "commitMessage", "description", "difficulty"].forEach(key => {
        localStorage.removeItem(`gfg_${key}`);
      });

      document.body.innerHTML = `
        <p><b>✅ Code pushed successfully!</b></p>
        <p>🔗 <a href="${message.fileUrl}" target="_blank">${message.fileUrl}</a></p>
        <button id="copyLink">📋 Copy Link</button>
      `;

      document.getElementById("copyLink").addEventListener("click", () => {
        navigator.clipboard.writeText(message.fileUrl).then(() => {
          alert("GitHub file link copied!");
        });
      });
    }
  });
});
