---
name: yunicity-debugging
description: Use in the Yunicity Mobile repository when investigating a bug, a failing test or build, or unexpected behavior, before proposing or applying a fix. Guides reproduction, evidence gathering without exposing secrets, one hypothesis at a time, and the loop's three-attempt limit. Not for questions that involve no failure to investigate.
---

# Yunicity Debugging

Adapted from `systematic-debugging` (obra/superpowers, MIT License).
See `LICENSE` in this directory and `docs/engineering/skills-provenance.md`.

## Precedence

`AGENTS.md`, the active ticket and `docs/engineering/loop-protocol.md` take
precedence over this skill. Debugging never widens the ticket's scope: no file
outside the allowed scope, no installation, no commit and no delegation unless the
ticket allows it.

## Core rule

Find the root cause before attempting a fix. A fix that only removes the symptom is
not a fix.

## When to use

Any technical failure: failing test, build or bundling failure, runtime error,
unexpected behavior, performance problem, integration issue. Use it especially when
under time pressure, when a "quick fix" seems obvious, or when a previous fix did not
work.

## Diagnostic hygiene

These rules apply to every phase.

- Never print, log or copy a secret, token, password, private key, cookie, session
  identifier or personal data, including in commands, logs, reports and tickets.
- Never dump the environment (`env`, `printenv`, `set`, `export -p`,
  `Get-ChildItem Env:`, `process.env` as a whole). Check variables by name, one at a
  time, with a presence test that prints only `SET` or `UNSET`.
- Do not open real secret files (`.env`, keystores, credential files) to debug.
  Check that the expected variable or file exists, not what it contains.
- Never log request or response headers or bodies that may carry credentials or
  personal data. Log status codes, durations, sizes and non-sensitive identifiers.
- Values that are known to be non-sensitive (for example `NODE_ENV`, a platform
  name, a version number) may be printed.
- Temporary instrumentation is removed before delivery, and its removal is checked
  in the diff.

Presence test, POSIX shell:

```bash
if [ -n "${API_TOKEN:-}" ]; then echo "API_TOKEN: SET"; else echo "API_TOKEN: UNSET"; fi
```

Presence test, PowerShell:

```powershell
if ($env:API_TOKEN) { "API_TOKEN: SET" } else { "API_TOKEN: UNSET" }
```

## The four phases

Complete each phase before moving to the next.

### Phase 1: Root cause investigation

1. **Read errors carefully.** Read warnings, stack traces, line numbers, file paths
   and error codes completely. They often point to the cause.
2. **Reproduce.** Find exact, repeatable steps. If you cannot reproduce, gather more
   data instead of guessing.
3. **Check recent changes.** `git diff`, recent commits, new dependencies,
   configuration changes, environment differences.
4. **Gather evidence across components.** When the failure crosses several
   components (CI → build → signing, app → API client → backend), add diagnostics
   at each boundary before proposing a fix:
   - what enters and leaves the component (shape, counts, status, not sensitive
     values);
   - whether the expected configuration reaches it (presence tests only);
   - the state at each layer.

   Run once, find **where** it breaks, then investigate that component.

   Example, checking that a signing identity reaches each layer without exposing it:

   ```bash
   # Layer 1: workflow — presence only, never the value
   if [ -n "${IDENTITY:-}" ]; then echo "workflow IDENTITY: SET"; else echo "workflow IDENTITY: UNSET"; fi

   # Layer 2: build script — same presence test, no environment dump
   if [ -n "${IDENTITY:-}" ]; then echo "build IDENTITY: SET"; else echo "build IDENTITY: UNSET"; fi

   # Layer 3: signing step — run the signing tool and read its exit code and
   # error message; do not print key material or certificate contents
   ```

   This shows which layer loses the configuration (for example: workflow `SET`,
   build `UNSET`).
5. **Trace the data flow.** When the error appears deep in a call stack, trace the
   bad value back to where it originates and fix it there. See
   [root-cause-tracing.md](root-cause-tracing.md).

### Phase 2: Pattern analysis

1. **Find a working example** of similar code in the same codebase.
2. **Read the reference completely** when applying a known pattern or API, including
   the documentation for the version actually installed.
3. **List every difference** between the working and the broken case, however small.
4. **Identify dependencies**: components, settings, environment, assumptions.

### Phase 3: Hypothesis and test

1. **State one hypothesis**: "X is the root cause because Y". Write it down; in a
   ticket, record it in the "Journal des tentatives".
2. **Test it minimally**: the smallest change, one variable at a time.
3. **Check the result.** Confirmed: go to phase 4. Refuted: form a new hypothesis;
   do not stack more changes on top.
4. **When you do not know**, say so, gather more evidence, or ask.

### Phase 4: Fix

1. **Reproduce the failure first.** Write the smallest reproduction that fails
   before the fix: an automated test when the project has a test setup and the
   ticket allows adding it, otherwise a documented manual reproduction (command,
   input, observed result). Confirm that it fails for the expected reason.
2. **Apply a single fix** addressing the root cause. No unrelated improvements, no
   bundled refactoring.
3. **Verify.** The reproduction now passes, other relevant checks still pass, and
   the original symptom is gone. Before claiming the fix works, apply the
   `yunicity-verification` skill (Claude Code: `/yunicity-verification`; Codex:
   `$yunicity-verification`; otherwise read
   `.agents/skills/yunicity-verification/SKILL.md`).
4. **If the fix does not work**, stop and go back to phase 1 with the new evidence.

## Attempt limit

The loop protocol allows **at most three correction attempts per blocker**.

- Each attempt needs a new hypothesis or new evidence; repeating a failed action
  does not count as progress, but it still counts against the limit.
- After the third failed attempt, **stop**. Report the evidence gathered, the
  hypotheses tested and the next action you propose. Do not attempt a fourth fix.
- When each fix reveals a new problem elsewhere, or needs a large refactor, the
  design itself may be wrong: say so in the report instead of continuing to patch.

## When no root cause is found

Distinguish a **demonstrated cause** (reproduced and confirmed by evidence) from a
**hypothesis** (plausible, not confirmed). An issue that looks environmental,
timing-dependent or external is a hypothesis until evidence confirms it.

When the cause is not demonstrated:

1. document what was investigated, the hypotheses tested and the evidence for or
   against each;
2. report the cause as not demonstrated; never present a hypothesis as the root
   cause.

A **mitigation** (for example a retry, a timeout, clearer error handling or
additional non-sensitive logging) is not prescribed by default. It is possible only
when it is justified by the evidence, allowed by the ticket and verified. Report it
as a mitigation, not as a demonstrated resolution of the cause.

An incomplete investigation is the most common reason no cause is found: check
phase 1 again first.

## Red flags

Stop and return to phase 1 when you catch yourself thinking:

- "quick fix for now, investigate later";
- "just try changing X and see";
- "several changes at once, then run the tests";
- "skip the reproduction, I will check manually";
- "it is probably X" without evidence;
- proposing fixes before tracing the data flow;
- a fourth attempt after three failed corrections, or another attempt with no new
  hypothesis or evidence.

Signals from the user such as "is that actually happening?", "stop guessing" or
"we're stuck" mean the same thing.

## Supporting guides

- [root-cause-tracing.md](root-cause-tracing.md): trace a bad value back through
  the call chain to its origin.
- [defense-in-depth.md](defense-in-depth.md): after finding the root cause, decide
  whether additional validation is needed at other layers. Add a check only where a
  need is demonstrated (for example a code path shown to bypass the existing check),
  without systematic duplication and without extending the ticket's scope.
- [condition-based-waiting.md](condition-based-waiting.md): replace arbitrary delays
  in tests with waiting for the actual condition.
