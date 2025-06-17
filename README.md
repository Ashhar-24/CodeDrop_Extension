# 🚀 GFG to GitHub Extension

This is a personal browser extension that helps you push your **GeeksforGeeks C++ submissions** directly to your GitHub repository with custom commit messages, approach notes, and difficulty level.

<p align="center">
  <img src="assets/gfgToGithub.png" alt="Extension Icon" width="150"/>
</p>

---

## 🧠 What It Does

- Manually push your GFG code submissions to GitHub from a popup UI.
- Add metadata like question name, difficulty, approach notes, and commit message.
- Creates `.cpp` files automatically with structured headers.
- Works with **Chrome** and **Firefox**.

---

## ⚠️ Important: Choose Your Browser

This project includes **two separate manifest files**:

- `manifest.chrome.json` → for Google Chrome
- `manifest.firefox.json` → for Mozilla Firefox

**Before using the extension**:

- ✅ If you're using **Chrome**, **rename `manifest.chrome.json` to `manifest.json`** and delete the other.
- ✅ If you're using **Firefox**, **rename `manifest.firefox.json` to `manifest.json`** and delete the other.

---

## 🛠️ Setup Instructions

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/Ashhar-24/gfgToGithub_Extension.git
cd gfgToGithub_Extension
```

### 2. ✏️ Update GitHub Configuration

Navigate to `/src/background.js` and update the following constants with your own details:

```js
const GITHUB_USERNAME = "your-username";
const GITHUB_REPO = "your-repo-name";
const GITHUB_TOKEN = "your-personal-access-token";

```

### 🧾 How to Generate a GitHub Token:

1. Go to: https://github.com/settings/tokens

2. Click "Generate new token (classic)"

3. Give it a name and select scopes:
        -  `repo` (Full control of private repositories)

4. Copy the generated token and paste it in the background file.

---- 


# 🧪 Test & Run

## 🟢 For Chrome

1. Open `chrome://extensions`

2. Enable Developer Mode

3. Click "Load unpacked"

4.  Select the root directory where `manifest.json` is located (after renaming `manifest.chrome.json` to `manifest.json`)

5. The extension should appear in the toolbar

## 🔵 For Firefox

1. Open Firefox and go to `about:debugging`

2. Click "This Firefox"

3. Click "Load Temporary Add-on"

4. Choose any file inside your root folder (e.g., `manifest.json`, after renaming `manifest.firefox.json` to `manifest.json)

5. The extension will be temporarily loaded

⚠️ Note: Firefox does not yet support `manifest_version: 3` fully. Use `manifest_version: 2` in `manifest.firefox.json`.

---

# 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

# 🌐 Author

**Md Ashhar**  
[🔗 LinkedIn](https://www.linkedin.com/in/md-ashhar/) • [💻 GitHub](https://github.com/Ashhar-24) • [🌐 Portfolio](https://parichay-2-0.vercel.app)
