module.exports = (config) => {
  for (const output of config.output) {
    // output.dir = `${output.dir}/${output.format}`
    output.preserveModules = true // Do not bundle files
    //output.entryFileNames = '[name].js'
    //output.chunkFileNames = '[name].js'
  }

  return config
}
