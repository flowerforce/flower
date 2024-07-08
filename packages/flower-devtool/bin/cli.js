#!/usr/bin/env node
const { glob } = require('glob')
var fs = require('fs')
const path = require('path')
const { program } = require('commander')
const { reactToFlowerJson } = require('./utilsAST')
const CryptoJS = require('crypto-js')
const keyBy = require('lodash/keyBy')
const get = require('lodash/get')
const watch = require('glob-watcher')
const { nanoid } = require('nanoid')
const { logDevtoolData } = require('./cliUtils')
const merge = require('lodash/merge')

const loadFlowMetadata = (file) => {
  const sourceDir = path.dirname(file)
  const dir = sourceDir + '/.flower'
  const ext = path.extname(file)
  const fileName = file.replace(sourceDir, '').replace(ext, '')

  return new Promise((resolve) => {
    const uri = `${dir}/${fileName}.metadata.json`
    try {
      const text = fs.readFileSync(uri, 'utf8')
      resolve(JSON.parse(text))
    } catch (error) {
      resolve({})
    }
  })
}

const filesFlows = []

const execute = ({ pattern, secretKey, dir }) =>
  glob(pattern, { ignore: 'node_modules/**' }).then(async (files) => {
    return Promise.all(
      files.map(async (file) => {
        const originalRaw = fs.readFileSync(file, 'utf8')
        if (originalRaw.includes('</Flower>')) {
          const flowMetadata = await loadFlowMetadata(file)
          try {
            const jsonAST = reactToFlowerJson(originalRaw)
            const parsed = JSON.parse(jsonAST)
            filesFlows.push({
              ...parsed,
              flowName: parsed.name,
              private: flowMetadata?.private,
              elements: parsed.elements.map((el) => {
                const metadata = merge(
                  get(flowMetadata, ['elements', el.id, '_metadata'], {}),
                  el?.data?._metadata
                )

                const previewUrl =
                  metadata.previewUrl &&
                  (metadata.previewUrl?.indexOf('http') === 0
                    ? metadata.previewUrl
                    : fs.readFileSync(
                        path.join(process.cwd(), metadata.previewUrl),
                        { encoding: 'base64' }
                      ))

                if (el.sourceHandle) {
                  return {
                    ...el,
                    data: {
                      ...metadata,
                      previewUrl,
                      rules: el.data.rules,
                      source: el.source,
                      target: el.target,
                      flowName: parsed.name
                    }
                  }
                } else {
                  return {
                    ...el,
                    data: {
                      ...metadata,
                      previewUrl,
                      label: el.id,
                      nodeId: el.id,
                      flowName: parsed.name
                    }
                  }
                }
              })
            })
            return
          } catch (error) {
            // console.log("🚀 ~ file: error:", error)
          }
        }
      })
    ).then(() => {
      const flowKeyBy = keyBy(filesFlows, 'flowName')

      const flowsCrypted = Object.entries(flowKeyBy).reduce((acc, [k, v]) => {
        return {
          ...acc,
          [k]: {
            type: 'flow',
            name: k,
            private: v.private,
            layout: 'vertical',
            elements: secretKey
              ? CryptoJS.AES.encrypt(
                  JSON.stringify(v.elements),
                  secretKey
                ).toString()
              : JSON.stringify(v.elements)
          }
        }
      }, {})

      fs.writeFileSync(dir, JSON.stringify(flowsCrypted))
    })
  })

const commandExecution = async (options) => {
  const { secretKey = nanoid(), pattern, dirsave } = options
  const dir = path.join(process.cwd(), dirsave + '/.flower.sourcemap.json')
  logDevtoolData({ secretKey, pattern, dir })

  if (options.help) return program.help()

  if (options.watch) {
    const watcher = watch(pattern, function (done) {
      execute({ secretKey, pattern, dir })
      done()
    })
    watcher.on('change', (path) => {
      const changeMessage = `\x1b[33m[${new Date().toLocaleTimeString()}]\x1b[0m \x1b[1m\x1b[32mChanges detected at:\x1b[0m \x1b[1m\x1b[34m${path}\x1b[0m`
      console.log(changeMessage)
    })
    watcher.on('add', (path) => {
      const changeMessage = `\x1b[33m[${new Date().toLocaleTimeString()}]\x1b[0m \x1b[1m\x1b[32mNew file:\x1b[0m \x1b[1m\x1b[34m${path}\x1b[0m`
      console.log(changeMessage)
    })
  }
  return execute({ secretKey, pattern, dir })
}

program.name('flower').description('Flower CLI').version('1.0.0')

program
  .command('generate-sourcemap')
  .option(
    '-p, --pattern <type>',
    'Add glob for search <Flower/> files',
    'src/**/*.{js,ts,tsx,jsx}'
  )
  .option(
    '-d, --dirsave <type>',
    'The directory where to save the sourcemap',
    'src'
  )
  .option('-w, --watch', 'Watch for files changes')
  .action(commandExecution)

program.parse()
