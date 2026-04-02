/**
 * Git summary - show change summary
 */
import { execSync } from 'child_process'

function run(cmd, cwd = process.cwd()) {
  try {
    return execSync(cmd, { encoding: 'utf-8', maxBuffer: 10*1024*1024 }).trim()
  } catch (e) {
    return e.stderr?.toString() || ''
  }
}

function getSummary(cwd = process.cwd()) {
  const status = run('git status --porcelain', cwd)
  const branch = run('git branch --show-current', cwd) || run('git rev-parse --short HEAD', cwd)
  const files = status.split('\n').filter(Boolean)

  const stats = { added: 0, modified: 0, deleted: 0, renamed: 0, untracked: 0 }
  const byType = { ts: [], js: [], py: [], json: [], md: [], other: [] }

  for (const f of files) {
    const code = f.slice(0, 2)
    const name = f.slice(3)
    const ext = name.split('.').pop()

    if (code === '??') { stats.untracked++; addExt(byType, ext, name) }
    else if (code === ' D' || code === 'D') stats.deleted++
    else if (code.includes('R')) stats.renamed++
    else if (code[0] !== ' ' && code[0] !== '?') stats.added++
    else stats.modified++
  }

  function addExt(obj, ext, name) {
    if (['ts','tsx','js','jsx'].includes(ext)) obj.ts.push(name)
    else if (ext === 'py') obj.py.push(name)
    else if (ext === 'json') obj.json.push(name)
    else if (ext === 'md') obj.md.push(name)
    else obj.other.push(name)
  }

  return { branch, files, stats, byType, total: files.length }
}

function printSummary(cwd = process.cwd()) {
  const summary = getSummary(cwd)
  const { branch, stats, total, byType } = summary

  console.log(`\n  Git Summary — ${branch}\n`)
  console.log(`  Total: ${total} files changed\n`)

  const cols = [
    ['Added', stats.added],
    ['Modified', stats.modified],
    ['Deleted', stats.deleted],
    ['Untracked', stats.untracked],
  ]
  for (const [label, count] of cols) {
    if (count > 0) console.log(`    ${label.padEnd(10)} ${count}`)
  }

  if (total > 0) {
    console.log('\n  By type:')
    if (byType.ts.length) console.log(`    TypeScript: ${byType.ts.length}`)
    if (byType.py.length) console.log(`    Python: ${byType.py.length}`)
    if (byType.md.length) console.log(`    Markdown: ${byType.md.length}`)
    if (byType.json.length) console.log(`    Config/JSON: ${byType.json.length}`)
  }

  if (total > 0) {
    console.log('\n  Changed files:')
    for (const f of summary.files.slice(0, 15)) {
      console.log(`    ${f}`)
    }
    if (summary.files.length > 15) {
      console.log(`    ... and ${summary.files.length - 15} more`)
    }
  }

  console.log()
}

// CLI
if (import.meta.url.endsWith(process.argv[1]?.replace(/^file:\/\//, ''))) {
  const cwd = process.env.GIT_CWD || process.cwd()
  printSummary(cwd)
}
