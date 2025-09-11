import fs from 'fs-extra'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'
import util from 'util'
import ora from 'ora'

const execAsync = util.promisify(exec)

const MODULES = '../templates'
const BASE = '../templates/base'

// Calcolo __dirname in ambiente ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function createFlowerApp({
  name,
  historySync,
  urlChanges,
  flowForm
}: {
  name: string
  historySync: boolean
  urlChanges: boolean
  flowForm: 'form' | 'flow' | 'both'
}) {
  const targetDir = path.resolve(process.cwd(), name)

  const baseTemplateDir = path.resolve(__dirname, BASE)
  if (!(await fs.pathExists(baseTemplateDir))) {
    throw new Error(`Base template directory not found: ${baseTemplateDir}`)
  }

  await fs.copy(baseTemplateDir, targetDir)

  updatePackageJson(targetDir, name)

  const targetSrcDir = path.join(targetDir, 'src')

  if (flowForm === 'flow' || flowForm === 'both') {
    const flowTemplateSrcDir = path.resolve(__dirname, `${MODULES}/flow/src`)
    if (!(await fs.pathExists(flowTemplateSrcDir))) {
      throw new Error(
        `Flow template src directory not found: ${flowTemplateSrcDir}`
      )
    }
    await fs.copy(flowTemplateSrcDir, targetSrcDir, { overwrite: true })
    await injectHistorySync(targetDir, { historySync, urlChanges })
  }

  if (flowForm === 'form' || flowForm === 'both') {
    const formTemplateSrcDir = path.resolve(__dirname, `${MODULES}/form/src`)
    if (!(await fs.pathExists(formTemplateSrcDir))) {
      throw new Error(
        `Form template src directory not found: ${formTemplateSrcDir}`
      )
    }
    await fs.copy(formTemplateSrcDir, targetSrcDir, { overwrite: true })
  }

  console.log(`✔️ App creata in ${targetDir}`)

  const gitSpinner = ora('Initializing git repository...').start()
  try {
    await execAsync('git init', { cwd: targetDir })
    gitSpinner.succeed('Git repository initialized!')
  } catch (error) {
    gitSpinner.fail('Git init failed')
    console.warn(error)
  }

  // Esegui npm install
  const npmSpinner = ora('Installing npm packages...').start()
  try {
    await execAsync('npm install --legacy-peer-deps', { cwd: targetDir })
    npmSpinner.succeed('npm packages installed')
  } catch (error) {
    npmSpinner.fail('npm install failed')
    console.warn(error)
  }
}

async function injectHistorySync(
  targetDir: string,
  options: { historySync: boolean; urlChanges: boolean }
) {
  const mainFile = path.join(targetDir, 'src', 'main.tsx')
  let content = await fs.readFile(mainFile, 'utf8')

  if (options.historySync) {
    content = content.replace(
      /import { FlowerProvider } from '@flowerforce\/flower-react'/,
      `import { FlowerProvider, HistoryContextProvider } from '@flowerforce/flower-react'`
    )
    content = content
      .replace(
        "<div id='historyprovideropen' />",
        options.urlChanges
          ? '<HistoryContextProvider withUrl>'
          : '<HistoryContextProvider>'
      )
      .replace("<div id='historyproviderclose' />", '</HistoryContextProvider>')
  } else {
    content = content
      .replace("<div id='historyprovideropen' />", '')
      .replace("<div id='historyproviderclose' />", '')
  }

  await fs.writeFile(mainFile, content)
}

async function updatePackageJson(targetDir: string, newName: string) {
  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = await fs.readJson(pkgPath)

  pkg.name = newName

  await fs.writeJson(pkgPath, pkg, { spaces: 2 })
}
