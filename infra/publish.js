import process from 'child_process'

// First see if the working set is empty
process.exec('git status -s', {}, (error, stdout, stderr) => {
  if (error) {
    console.log(error, stderr) // eslint-disable-line no-console
    return
  }

  if (stdout.length !== 0) {
    console.error('Error: working set not empty') // eslint-disable-line no-console
    return
  }

  const commands = [
    'npm run build',
    'git checkout -B gh-pages',
    'git add -f build',
    'git commit -am "Rebuild"',
    'git filter-branch -f --prune-empty --subdirectory-filter build',
    'git push -f origin gh-pages',
    'git checkout -',
  ]

  commands.forEach(command => {
    process.execSync(command)
  })
})
