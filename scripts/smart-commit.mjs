/**
 * Git Helper - Smart commit
 */
import { execSync, exec } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

function run(cmd, cwd = process.cwd()) {
  try {
    return execSync(cmd, { encoding: 'utf-8', cwd, stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  } catch (e) {
    return e.stderr?.toString() || e.message
  }
}

function isGitRepo(cwd = process.cwd()) {
  return existsSync(join(cwd, '.git'))
}

function getStatus(cwd = process.cwd()) {
  const output = run('git status --porcelain', cwd)
  if (!output) return { changed: [], staged: [], untracked: [] }
  
  const lines = output.split('\n').filter(Boolean)
  const staged = []
  const changed = []
  const untracked = []
  
  for (const line of lines) {
    const index = line.slice(0, 2)
    const file = line.slice(3)
    if (index === '??') untracked.push(file)
    else if (index[1] !== ' ') changed.push(file)
    if (index[0] !== ' ' && index[0] !== '?') staged.push(file)
  }
  
  return { changed, staged, untracked }
}

function smartCommit(message, cwd = process.cwd()) {
  if (!isGitRepo(cwd)) {
    console.error('Not a git repository')
    return null
  }

  const status = getStatus(cwd)
  
  if (status.changed.length === 0 && status.staged.length === 0 && status.untracked.length === 0) {
    console.log('Nothing to commit')
    return null
  }

  // Stage all
  run('git add -A', cwd)
  const newStatus = getStatus(cwd)

  console.log('\n  Smart Commit\n')
  console.log(`  Message: ${message}`)
  console.log(`  Staged: ${newStatus.staged.length} files`)
  console.log(`  Untracked: ${newStatus.untracked.length} files\n`)

  if (newStatus.staged.length > 0) {
    console.log('  Files:')
    for (const f of newStatus.staged.slice(0, 10)) {
      console.log(`    + ${f}`)
    }
    if (newStatus.staged.length > 10) {
      console.log(`    ... and ${newStatus.staged.length - 10} more`)
    }
  }

  // Commit
  const commitHash = run(`git commit -m "${message.replace(/"/g, '\\"')}"`, cwd)

  if (commitHash.includes('nothing to commit')) {
    console.log('Nothing to commit')
    return null
  }

  // Get the actual hash
  const hash = run('git rev-parse HEAD', cwd)
  console.log(`\n✓ Committed: ${hash.slice(0, 8)}`)

  return { hash, staged: newStatus.staged.length, untracked: newStatus.untracked.length }
}

// CLI
if (import.meta.url.endsWith(process.argv[1]?.replace(/^file:\/\//, ''))) {
  const message = process.argv.slice(2).join(' ')
  if (!message) {
    console.error('Usage: node smart-commit.mjs "<message>"')
    process.exit(1)
  }

  const cwd = process.env.GIT_CWD || process.cwd()
  const result = smartCommit(message, cwd)
  if (!result) process.exit(1)
}
