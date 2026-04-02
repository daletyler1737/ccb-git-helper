---
name: ccb-git-helper
description: |
  Git operations helper / Git 操作助手
  Smart commits, branch management, stash with metadata, auto-tracking.
  用途：智能提交、分支管理、带元数据的 stash、自动追踪变更。
  触发词 / Triggers: "git commit", "create branch", "stash with message", "Git 提交", "分支管理"
---

# Git Helper / Git 助手

Enhanced Git operations with context awareness.
带上下文感知的增强型 Git 操作工具。

## 功能 / Features

- **Smart Commit / 智能提交** - 自动暂存所有变更文件，一次提交 / Auto-stage all changed files
- **Stash with Context / 带上下文的 Stash** - 记录时间戳、分支名、变更列表 / Record timestamp, branch, changed files
- **Branch with Context / 带上下文的分支** - 创建分支并记录目的 / Create branch with purpose
- **Auto-track / 自动追踪** - 追踪所有变更 / Track all changes
- **Change Summary / 变更摘要** - 查看变更统计 / View change statistics
- **Undo / 撤销** - 软撤销上次提交 / Soft undo last commit

## 使用方法 / Usage

```bash
# 智能提交 / Smart commit
node smart-commit.mjs "feat: add user auth"

# Stash 带元数据 / Stash with metadata
node stash.mjs "WIP: refactoring auth module"

# 创建分支 / Create branch
node branch.mjs feature/user-auth

# 自动追踪 / Auto-track all changes
node track.mjs

# 变更摘要 / Show change summary
node summary.mjs

# 撤销上次提交（软）/ Undo last commit (soft)
node undo.mjs
```

## 智能提交行为 / Smart Commit Behavior

1. 暂存所有变更文件 / Stage all changed files
2. 显示差异摘要 / Show diff summary
3. 执行提交 / Execute commit
4. 显示提交哈希 / Show commit hash
