# Contributing to MergeMe
This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/merge-me.git
cd merge-me
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/ellyraad/merge-me.git
```

### Development Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up your environment variables (see `.env.example`)

3. Run database migrations:

```bash
pnpm prisma migrate dev
```

4. Start the development server:

```bash
pnpm dev
```

## Development Workflow

### Branch Naming

Create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
git checkout -b fix/bug-description
git checkout -b docs/documentation-update
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates
- `chore/` - Maintenance tasks

### Making Changes

1. **Keep commits atomic**: Each commit should represent a single logical change
2. **Write clear commit messages**: Follow conventional commit format
3. **Test your changes**: Ensure your code works as expected
4. **Run linter**: Fix any linting errors before committing

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples:**

```
feat(discover): add filter by programming language

Add ability to filter discovery feed by specific programming languages.
Users can now select multiple languages to narrow their search.

Closes #123
```

```
fix(messages): resolve real-time message duplication

Messages were appearing twice when sent due to Pusher event
being triggered multiple times. Added event deduplication logic.
```

### Code Style

We use **Biome** for linting and formatting. The configuration is in `biome.json`.

#### Key Style Guidelines

**TypeScript:**
- Use strict mode
- Prefer `import type` for type-only imports (except for app pages)
- Use path aliases: `@/*` → `./src/*`

**Formatting:**
- Tab indentation (2-space width)
- 80 character line width
- Double quotes for strings
- LF line endings

**Naming Conventions:**
- Components: PascalCase (`UserAvatar`, `AppNavbar`)
- Files: kebab-case for components, camelCase for utilities
- Functions: camelCase (`getUserById`, `handleSubmit`)
- Types/Interfaces: PascalCase (`User`, `ConversationData`)

**Error Handling:**
- Use `ActionResult<T>` type for server actions
- Validate input data with Zod
- Use try/catch with specific error types

#### Running Linter

```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm format
```

### Pre-commit Hooks

We use Husky and lint-staged to run checks before commits:

- Automatically formats staged files
- Runs linter on staged files
- Prevents commits with linting errors

If the pre-commit hook fails, fix the issues and try committing again.

## Testing

Currently, the project doesn't have a test framework configured. After making changes:

1. **Manual Testing:**
   - Test your changes thoroughly in the browser
   - Test on both light and dark modes
   - Test responsive behavior on different screen sizes
   - Test edge cases and error scenarios

2. **Build Test:**
   ```bash
   pnpm build
   ```

3. **Lint Check:**
   ```bash
   pnpm lint
   ```

## Pull Request Process

### Before Submitting

1. **Update from upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run linter:**
   ```bash
   pnpm lint
   ```

3. **Test build:**
   ```bash
   pnpm build
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push to your fork:**
   ```bash
   git push origin your-branch-name
   ```

### Creating the Pull Request

1. Go to the [MergeMe repository](https://github.com/ellyraad/merge-me)
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template:

```markdown
## Description

Brief description of changes and motivation.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes Made

- Bullet point list of specific changes
- Include file paths where relevant

## Testing

- [ ] Tested locally
- [ ] Build succeeds
- [ ] Linter passes
- [ ] Tested on different screen sizes
- [ ] Tested on both light and dark modes

## Screenshots (if applicable)

Add screenshots or screen recordings to demonstrate changes.

## Related Issues

Closes #123
Relates to #456
```

### PR Guidelines

- **Keep PRs focused**: One feature/fix per PR
- **Write descriptive titles**: Use conventional commit format
- **Provide context**: Explain why the change is needed
- **Add screenshots**: For UI changes, include before/after screenshots
- **Update documentation**: If your changes affect documentation
- **Respond to feedback**: Address review comments promptly

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR

## Database Changes

### Adding Migrations

If your changes require database schema updates:

1. **Modify the schema:**
   Edit `prisma/schema.prisma`

2. **Create migration:**
   ```bash
   pnpm prisma migrate dev --name descriptive-migration-name
   ```

3. **Update seed data (if needed):**
   Edit `prisma/seed.ts`

4. **Document the changes:**
   In your PR, explain the schema changes and why they're needed

### Migration Best Practices

- Use descriptive migration names
- Test migrations with existing data
- Avoid breaking changes when possible
- Document any required manual steps

## Adding New Features

### API Routes

1. Create route in `src/app/api/`
2. Use Zod for input validation
3. Return structured responses
4. Handle errors appropriately
5. Add TypeScript types

Example structure:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  field: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    
    // Your logic here
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: "Error message" },
      { status: 400 }
    );
  }
}
```

### Server Actions

1. Create action in `src/app/actions/`
2. Use "use server" directive
3. Return `ActionResult<T>` type
4. Validate with Zod schemas

Example:
```typescript
"use server";

import { z } from "zod";
import type { ActionResult } from "@/lib/types";

const schema = z.object({
  field: z.string(),
});

export async function myAction(
  data: z.infer<typeof schema>
): Promise<ActionResult<YourType>> {
  try {
    const validated = schema.parse(data);
    
    // Your logic here
    
    return { status: "success", data: result };
  } catch (error) {
    return { status: "error", error: "Error message" };
  }
}
```

### Components

1. Create component in `src/app/ui/components/`
2. Use TypeScript for props
3. Follow naming conventions
4. Add accessibility attributes
5. Support dark mode

Example:
```typescript
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="bg-background-light dark:bg-background-dark">
      <h2>{title}</h2>
      {onAction && (
        <button type="button" onClick={onAction}>
          Action
        </button>
      )}
    </div>
  );
}
```

## Documentation

### Code Comments

- Use JSDoc for function documentation
- Explain complex logic
- Document non-obvious behavior
- Keep comments up-to-date

### README Updates

If your changes affect:
- Installation steps
- Configuration
- Available scripts
- Project structure

Update the README.md accordingly.

## Questions?

If you have questions:

1. Check existing issues and discussions
2. Review the documentation
3. Ask in your PR or create a discussion
4. Reach out to maintainers

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

Thank you for contributing to MergeMe! Your efforts help make this project
better for everyone. 🚀
