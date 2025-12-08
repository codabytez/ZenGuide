# Contributing to ZenGuide

## Branch Naming Convention

Use the following format for branch names:

```
feat/<component>/<feature>
```

**Examples:**
- `feat/dashboard/tours-page`
- `feat/dashboard/analytics`
- `feat/external-pages/landing`
- `feat/auth/login`
- `feat/widget/tour-modal`

## Workflow

1. **Always pull from `dev` branch:**
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create your feature branch:**
   ```bash
   git checkout -b feat/dashboard/your-feature
   ```

3. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push your branch:**
   ```bash
   git push -u origin feat/dashboard/your-feature
   ```

5. **Create a Pull Request to `dev` branch**

## Commit Message Format

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**
- `feat: add tour creation form`
- `fix: resolve analytics chart rendering issue`
- `docs: update API documentation`

## Code Style

- Use TypeScript for all new files
- Follow the existing component structure
- Use Tailwind CSS for styling
- Ensure components are responsive
- Add proper TypeScript types

## Before Submitting PR

- [ ] Code builds without errors
- [ ] No TypeScript errors
- [ ] Tested on desktop and mobile
- [ ] Follows project structure
- [ ] Commit messages follow convention
