# 🤝 Contributing to CareerHub

First of all, thank you for considering contributing to **CareerHub**! 🎉

We welcome contributions from developers of all experience levels. Whether you're fixing a bug, improving documentation, enhancing the UI, or adding a new feature, your contribution is greatly appreciated.

---

# 📌 Before You Start

Please make sure you:

- Read the project **README.md**.
- Check existing Issues and Pull Requests before creating a new one.
- Discuss major changes by opening an Issue first.

---

# 🚀 Getting Started

## 1. Fork the Repository

Click the **Fork** button at the top-right corner of this repository.

---

## 2. Clone Your Fork

```bash
git clone https://github.com/<your-username>/carrerhubv2.git
```

Replace `<your-username>` with your GitHub username.

---

## 3. Navigate to the Project

```bash
cd carrerhubv2
```

---

## 4. Install Dependencies

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

Open a new terminal.

```bash
cd frontend-shell
npm install
npm run dev
```

---

# 🌿 Creating a Branch

Always create a new branch before making changes.

```bash
git checkout -b feature/your-feature-name
```

Example:

```bash
git checkout -b feature/add-dark-mode
```

---

# 💻 Making Changes

Please ensure your changes:

- Follow the existing project structure.
- Are clean and readable.
- Don't introduce unnecessary dependencies.
- Include comments where appropriate.
- Maintain responsive design.
- Follow TypeScript best practices.

---

# ✅ Before Committing

Make sure:

- The project builds successfully.
- No unnecessary files are added.
- No `.env` files or secrets are committed.
- Code has been tested locally.
- Formatting and linting issues are resolved.

---

# 📝 Commit Messages

Write meaningful commit messages.

### Good Examples

```text
feat: add job bookmarking feature

fix: resolve login validation issue

docs: improve README documentation

style: improve recruiter dashboard layout

refactor: simplify authentication middleware
```

### Avoid

```text
update

changes

fixed

test
```

---

# 📤 Push Your Changes

```bash
git add .

git commit -m "feat: add dark mode"

git push origin feature/your-feature-name
```

---

# 🔥 Opening a Pull Request

When creating a Pull Request:

- Provide a clear title.
- Explain what changes you made.
- Link related Issues if applicable.
- Include screenshots for UI changes.
- Ensure the project builds successfully.

Example:

```text
## Description

Added Dark Mode support.

## Related Issue

Closes #12
```

---

# 🐞 Reporting Bugs

If you've found a bug:

Include:

- Operating System
- Browser (if frontend)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

---

# 💡 Suggesting Features

Feature requests are always welcome.

Please include:

- Feature description
- Why it is useful
- Possible implementation
- Mockups (optional)

---

# 📂 Project Structure

```text
backend/
    src/
        config/
        controllers/
        middleware/
        models/
        routes/
        utils/

frontend-shell/
    src/
        components/
        pages/
        hooks/
        services/
        context/
```

---

# 🏷 Issue Labels

Some commonly used labels:

- good first issue
- bug
- enhancement
- documentation
- help wanted
- frontend
- backend

---

# 📋 Code Style Guidelines

Please:

- Use meaningful variable names.
- Keep functions small and reusable.
- Avoid duplicate code.
- Follow existing folder structure.
- Write readable code.
- Remove unused imports.
- Keep components modular.

---

# ❌ Do Not

- Commit `.env` files.
- Commit `node_modules`.
- Push directly to the `main` branch.
- Introduce breaking changes without discussion.

---

# 🌟 Ways to Contribute

You can contribute by:

- Fixing bugs
- Improving documentation
- Improving UI/UX
- Optimizing performance
- Writing tests
- Refactoring code
- Adding new features
- Improving accessibility
- Reviewing Pull Requests

---

# 📜 Code of Conduct

Please be respectful and welcoming to everyone.

Constructive feedback is encouraged.

Harassment, abusive language, or discrimination will not be tolerated.

---

# ❤️ Thank You

Thank you for taking the time to contribute to **CareerHub**.

Every contribution, no matter how small, helps improve the project for everyone.

Happy Coding! 🚀