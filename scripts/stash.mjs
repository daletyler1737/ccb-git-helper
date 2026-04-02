/**
 * Git stash with context metadata
 */
import { execSync } from 'child_process'
import { existsSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8' }).trim()
  } catch (e) {
    return e.stderr?.toString() || e.message
  }
}

function stashWithContext(message, cwd = process.cwd()) {
  const gitDir = join(cwd, '.git')
  if (!existsSync(gitDir)) {
    console.error('Not a git repository')
    return null
  }

  // Get current branch and status before stash
  const branch = run('git branch --show-current', cwd) || 'detached'
  const status = run('git status --porcelain', cwd)
  const files = status.split('\n').filter(Boolean).map(l => l.slice(3))

  // Create stash with message including context
  const fullMsg = `${message}

Branch: ${branch}
Files: ${files.length}
Date: ${new Date().toISOString()}
---
${files.slice(0, 20).join('\n')}${files.length > 20 ? `\n... and ${files.length - 20} more` : ''}`

  // Use git stash push with message (newer git)
  let result = run(`git stash push -m "${fullMsg.replace(/"/g, '\\"')}"`, cwd)

  if (result.includes('No local changes')) {
    console.log('Nothing to stash')
    return null
  }

  // Get stash index
  const stashList = run('git stash list', cwd)
  const match = stashList.match(/stash@\{0\}/)
  const stashRef = match ? match[0] : 'stash@{0}'

  console.log(`\n✓ Stashed: ${stashRef}`)
  console.log(`  Branch: ${branch}`)
  console.log(`  Files: ${files.length}`)
  console.log(`  Message: ${message}`)

  return { stashRef, branch, files: files.length }
}

// CLI
if (import.meta.url.endsWith(process.argv[1]?.replace(/^file:\/\//, ''))) {
  const message = process.argv.slice(2).join(' ') || 'WIP'
  const cwd = process.env.GIT_CWD || process.cwd()
  const result = stashWithContext(message, cwd)
  if (!result) process.exit(1)
}
