# Defense-in-Depth Validation

Adapted from `systematic-debugging/defense-in-depth.md` (obra/superpowers, MIT
License). Part of the `yunicity-debugging` skill; the diagnostic hygiene rules of
[SKILL.md](SKILL.md) apply.

## Overview

After fixing a bug caused by invalid data at its source, a single validation point
may still be bypassed by another code path, a refactoring or a mock.

**Core principle:** add validation at another layer only when a need is
demonstrated: a code path shown to bypass the existing check, a context where the
operation is dangerous, or a failure that recurred. No systematic duplication of
checks, and no change outside the ticket's scope.

## Deciding whether another layer is needed

Ask, with evidence:

- Is there a code path, caller or mock that reaches the operation without going
  through the existing check?
- Is the operation dangerous in a specific context (tests, production data,
  file system outside a temp directory)?
- Has the same class of bug already come back through another path?

If none applies, the fix at the source is enough. If one applies, add the matching
layer below, within the ticket's scope, and verify it.

## Possible layers

The examples below are illustrative.

### Entry point validation

Reject obviously invalid input at the boundary.

```typescript
function createProject(name: string, workingDirectory: string) {
  if (!workingDirectory || workingDirectory.trim() === '') {
    throw new Error('workingDirectory cannot be empty');
  }
  if (!existsSync(workingDirectory)) {
    throw new Error(`workingDirectory does not exist: ${workingDirectory}`);
  }
  if (!statSync(workingDirectory).isDirectory()) {
    throw new Error(`workingDirectory is not a directory: ${workingDirectory}`);
  }
  // ... proceed
}
```

### Business logic validation

Ensure the data makes sense for this operation, when callers can reach it without
the entry check.

```typescript
function initializeWorkspace(projectDir: string, sessionId: string) {
  if (!projectDir) {
    throw new Error('projectDir required for workspace initialization');
  }
  // ... proceed
}
```

### Environment guards

Prevent an operation that is dangerous in a specific context, for example a test
that creates files or runs `git init`.

- Give each test its own dedicated temporary directory, created by the test setup
  and removed afterwards, and pass it explicitly to the code under test.
- When the code must refuse to operate outside that directory, check containment
  with a method suited to the platform: resolve both paths to their canonical form
  (resolving symbolic links), then compare path segments rather than raw strings.
  Account for case-insensitive file systems and path separators on Windows.
- Do not present a plain string prefix check as a protection: a sibling path can
  share the prefix (`/tmp-other` starts with `/tmp`), and a symbolic link inside
  the directory can point outside it.

### Debug instrumentation

Capture non-sensitive context for forensics, when a failure is hard to observe.

```typescript
async function gitInit(directory: string) {
  const stack = new Error().stack;
  logger.debug('About to git init', {
    directory,
    cwd: process.cwd(),
    stack,
  });
  // ... proceed
}
```

Error messages and logs at every layer follow the diagnostic hygiene rules: no
secret, token or personal data, even in validation errors.

## Applying the pattern

After the root cause is fixed and verified:

1. **Trace the data flow**: where the bad value originated and where it is used.
2. **Look for bypasses**: list the paths that reach the operation, and check with
   evidence whether any of them skips the existing check.
3. **Add a layer only for a demonstrated bypass or risk**, within the ticket's
   scope.
4. **Verify each added layer**: exercise the bypassing path and check that the new
   layer catches it.

Report each added layer with the need it answers. A validation added without a
demonstrated need is unnecessary duplication, not extra safety.
