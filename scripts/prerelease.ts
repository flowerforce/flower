import { releaseVersion } from 'nx/release'
import yargs from 'yargs'

/**
 * We don't generate new Git tags in prerelease to avoid conflicts in the actual release because nx doesn't differentiate between tags.
 * However, doing so allows only one prerelease version per release because nx only sees the latest release tag.
 * For instance, on release 3.0.0 the only prerelease tag would be 3.0.1-beta.0 until the release tag changes.
 * To correctly increment prerelease versions, we check the local package.json (disk) and not the tag.
 * See https://github.com/nrwl/nx/discussions/23387
 */
(async () => {
  const options = await yargs(process.argv)
    .option('dryRun', {
      alias: 'd',
      description: 'Whether or not to perform a dry-run of the release process, defaults to true',
      type: 'boolean',
      default: false,
    })
    .option('verbose', {
      description: 'Whether or not to enable verbose logging, defaults to false',
      type: 'boolean',
      default: false,
    })
    .parseAsync()

  await releaseVersion({
    specifier: 'prerelease',
    generatorOptionsOverrides: {
      currentVersionResolver: 'disk'
    },
    preid: 'beta',
    gitCommit: true,
    gitCommitMessage: 'chore(prerelease): publish [skip ci]',
    dryRun: options.dryRun,
    verbose: options.verbose
  })

  process.exit(0)
})()
