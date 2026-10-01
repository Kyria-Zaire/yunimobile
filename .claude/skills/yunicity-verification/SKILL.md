---
name: yunicity-verification
description: Use in the Yunicity Mobile repository before stating that work is complete, fixed or passing, or before setting a ticket to "terminé" or "à revoir". Matches each claim to evidence relevant to the state actually evaluated, and labels it as own check, third-party report or independent review. Not needed for answers that make no claim about the state of the work.
---

# Yunicity Verification

Adapted from `verification-before-completion` (obra/superpowers, MIT License).
See `LICENSE` in this directory and `docs/engineering/skills-provenance.md`.

## Precedence

`AGENTS.md`, the active ticket and `docs/engineering/loop-protocol.md` take
precedence over this skill.

This skill never authorizes a commit, push, merge, installation, new dependency,
delegation to another agent, or any action the ticket does not allow. If the only
way to obtain evidence is a forbidden action (for example installing dependencies to
run a build), do not take it: report the claim as unverified and say why.

## Core rule

No claim about the state of the work without evidence relevant to the state actually
evaluated.

A claim covers a specific state: a commit, a working tree, a configuration, an
environment. Evidence obtained on another state does not prove it.

## Before making a claim

1. **Identify** the claim and the exact state it is about.
2. **Choose** the check that proves this claim (see "What proves what").
3. **Obtain** the evidence: run the check, or reuse an earlier result when nothing
   relevant has changed since it ran (see "Reusing an earlier check").
4. **Read** the full output: exit code, failure and warning counts.
5. **State** the claim with its evidence, or state the actual status.

## Evidence record

Each piece of evidence cites:

- **Command or check**: the exact command, or what was inspected.
- **Result**: exit code and the relevant output (counts, errors, warnings).
- **State evaluated**: commit SHA and working-tree state (for example
  `git status --short`), plus relevant configuration or environment.
- **Provenance**: own check, third-party report or independent review; who ran or
  examined it, and when.

## Kinds of evidence

| Kind | Meaning | How to report it |
|---|---|---|
| Own check | Run or inspected by you | Command, result, state evaluated |
| Third-party report | Result reported by a person or another agent, not re-run by you | "Reported by …, not re-run" |
| Independent review | Someone other than the author examined the result | Reviewer and scope of the review |

Never present one kind as another. Checking your own work is an own check, not an
independent review.

Reading an output, a log or a diff yourself is an own inspection of that output, log
or diff. It does not change the provenance of the execution it reports: a test run,
build or command executed by someone else remains a third-party report until you run
it yourself. Another agent's "success" message is a third-party report.

## Reusing an earlier check

You may cite an earlier result instead of running the check again when:

- nothing it depends on has changed since it ran (files, dependencies,
  configuration, environment); and
- you can still cite its command, result, state evaluated and provenance.

Run it again, or report the claim as unverified, as soon as something relevant has
changed. There is no need to re-run checks for every reply, but never cite a result
for a state it did not cover.

## What proves what

| Claim | Requires | Not sufficient |
|---|---|---|
| Tests pass | Test command on the evaluated state: 0 failures | Lint, typecheck, a run on another state |
| Build succeeds | Build command on the evaluated state: exit 0 | Lint or typecheck passing |
| Configured typecheck passes | Typecheck with the project configuration: 0 errors | Lint passing |
| Lint is clean | Lint on the relevant files: 0 errors | Lint on other files |
| Bug fixed | Original symptom reproduced, then gone | Code changed, "should work" |
| Regression test works | Fails without the fix, passes with it | Passes once |
| Acceptance criteria met | Each criterion checked against evidence | Tests passing |
| Delegated task done | Diff or output inspected; executions it reports stay third-party until re-run | The agent's report |

Lint and typecheck prove only themselves. Never present them as evidence of a build
or a test run. A passing typecheck shows that the configured type checks report no
errors; it does not prove functional correctness.

## When a check cannot be run

Say so explicitly: "not executed", with the reason (tool unavailable, action not
allowed by the ticket, missing environment). Following the loop protocol, a ticket
cannot be `terminé` while one of its criteria lacks evidence; use `à revoir` or
`bloqué` as appropriate.

## Red flags

- "should", "probably", "seems to" about a state you have not checked;
- expressing success before reading the output;
- citing a result obtained on a different commit or working tree;
- reporting someone else's result as your own check;
- presenting lint or typecheck as a build or test result.

When one of these appears, go back to "Before making a claim".
