---
name: ccb-git-helper
description: |
  Git operations helper: smart commits, branch management, stash with metadata,
  auto-tracking of changes. Inspired by Claude Code Best's git tracking.
  Use when: committing code, managing branches, stashing with context,
  or reviewing git history. Triggers: "git commit", "create branch",
  "stash with message", "git history", "branch diff".
---

# Git Helper

Enhanced Git operations with context awareness.

## Usage

```bash
# Smart commit (auto-adds changed files)
node smart-commit.mjs "feat: add user auth"

# Stash with metadata
node stash.mjs "WIP: refactoring auth module"

# Branch with context
node branch.mjs feature/user-auth

# Auto-track all changes
node track.mjs

# Show change summary
node summary.mjs

# Undo last commit (soft)
node undo.mjs
```

## Smart Commit

Automatically:
1. Stages all changed files
2. Shows diff summary
3. Commits with message
4. Shows commit hash

## Stash with Context

Stashes with:
- Timestamp
- Branch name
- List of changed files
- Worktree status

## Config

```json
{
  "autoAdd": true,
  "commitTemplate": "{type}: {message}",
  "trackedPatterns": ["*.ts", "*.js", "*.py"],
  "ignoredPatterns": ["node_modules", ".git", "dist"]
}
```
