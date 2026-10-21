---
name: arena-prototypes
description: Run and compare independent coding implementations in Git worktrees with Agent Arena and Codex. Use when the user requests competing implementations or prototypes, rather than a debate or elimination tournament.
license: MIT
---

# Arena Prototypes for Codex

This fork's `arena` CLI has a built-in `codex` provider. It creates separate worktrees; it is not an elimination tournament. The workflow requires Node.js 20+, Git, this fork's built CLI, and an authenticated Codex CLI.

## Prepare

A plan-only or explanation request stops at the requested plan; do not run `init`, `create` or `launch` unless file preparation or execution is part of the ask.

Check `arena version`, `codex --version`, the intended Git root, branch and working tree. Existing uncommitted changes are not automatically part of candidate worktrees; establish the requested base before launching. Never commit unrelated changes to prepare a run.

Use the user's requested candidate count, models, implementation constraints and budget. Otherwise start with two candidates and preserve the user's configured Codex model; read the configured model without exposing credentials. Do not infer a model name from the Arena scaffold. Do not change global model, approval or sandbox configuration.

Run `arena init` once, then `arena create <name>`. Write the user's complete task and acceptance criteria into `.arena/<name>/requirements.md`. Edit `.arena/<name>/arena.json` so each variant has a distinct name, `provider: "codex"`, the selected `model`, the project's `techStack` and the intended `designPhilosophy`. Do not use a default Copilot scaffold as a Codex configuration. Distinguish requested strategies from constraints common to every candidate.

Worktree isolation does not isolate external files, network accounts or shared state. Keep candidate writes in their own worktrees; do not let candidates concurrently edit a canonical project memory file outside them, a shared vault, or deploy results. Each process consumes its provider's usage. State the planned candidate count before launch. An installation or help request does not authorize a candidate run.

## Run and compare

`arena launch <name>` starts the local TUI; `arena launch <name> --headless` plus `arena monitor <name>` separates running from monitoring. Use `arena status <name>` for recorded status. Respect stop requests and report failures; do not replace the user's exact model silently.

Configure `completionVerification.command` to the project's actual relevant validation command when available. Never invent a passing test command. Run `arena evaluate <name>` and inspect `.arena/<name>/comparison-report.md`, the actual changes and validation evidence. Its Git-based score is a comparison aid, not proof of correctness. Report the results and material tradeoffs.

`arena accept <name> <variant>` creates `accept/<name>/<variant>`; it does not merge into the main branch. Adopt or publish changes only within the user's authorization. Update canonical project memory and prepare any Grok handoff from the accepted result, not from all candidates as competing current truths.

Clean only when requested and after preserving needed results. `arena clean <name> --keep-remote` avoids remote branch deletion; do not use `--force` merely to bypass unmerged-work checks.
