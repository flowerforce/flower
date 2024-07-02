const letters = {
  A: ['◉ ◉ ◉', '◉     ◉', '◉  ◉  ◉', '◉◉◉◉◉◉◉', '◉     ◉'],
  B: ['◉◉◉◉◉ ', '◉    ◉ ', '◉◉◉◉◉  ', '◉    ◉ ', '◉◉◉◉◉  '],
  C: [' ◉◉◉◉ ', '◉     ', '◉     ', '◉     ', ' ◉◉◉◉ '],
  D: ['◉◉◉◉◉ ', '◉    ◉ ', '◉    ◉ ', '◉    ◉ ', '◉◉◉◉◉  '],
  E: ['◉◉◉◉◉◉', '◉     ', '◉◉◉◉◉ ', '◉     ', '◉◉◉◉◉◉'],
  F: ['◉◉◉◉◉◉', '◉     ', '◉◉◉◉◉ ', '◉     ', '◉     '],
  G: [' ◉◉◉◉ ', '◉     ', '◉  ◉◉◉', '◉    ◉', ' ◉◉◉◉ '],
  H: ['◉    ◉', '◉    ◉', '◉◉◉◉◉◉', '◉    ◉', '◉    ◉'],
  I: ['◉◉◉◉◉', '  ◉  ', '  ◉  ', '  ◉  ', '◉◉◉◉◉'],
  J: ['   ◉◉◉◉◉', '     ◉  ', '     ◉  ', '◉    ◉  ', ' ◉◉◉◉◉  '],
  K: ['◉    ◉ ', '◉  ◉   ', '◉◉     ', '◉  ◉   ', '◉    ◉ '],
  L: ['◉      ', '◉      ', '◉      ', '◉      ', '◉◉◉◉◉◉◉'],
  M: ['◉     ◉', '◉◉   ◉◉', '◉ ◉ ◉ ◉', '◉  ◉  ◉', '◉     ◉'],
  N: ['◉     ◉', '◉◉    ◉', '◉ ◉   ◉', '◉  ◉  ◉', '◉   ◉◉'],
  O: [' ◉◉◉◉ ', '◉    ◉', '◉    ◉', '◉    ◉', ' ◉◉◉◉ '],
  P: ['◉◉◉◉◉ ', '◉    ◉', '◉◉◉◉◉ ', '◉     ', '◉     '],
  Q: [' ◉◉◉◉ ', '◉    ◉', '◉  ◉ ◉', '◉   ◉◉', ' ◉◉◉◉ '],
  R: ['◉◉◉◉◉ ', '◉    ◉', '◉◉◉◉◉ ', '◉   ◉ ', '◉    ◉'],
  S: [' ◉◉◉◉ ', '◉     ', ' ◉◉◉◉◉', '     ◉', '◉◉◉◉  '],
  T: ['◉◉◉◉◉◉◉', '   ◉   ', '   ◉   ', '   ◉   ', '   ◉   '],
  U: ['◉    ◉', '◉    ◉', '◉    ◉', '◉    ◉', ' ◉◉◉◉ '],
  V: ['◉     ◉', '◉     ◉', ' ◉   ◉ ', '  ◉ ◉  ', '   ◉   '],
  W: ['◉     ◉', '◉     ◉', '◉  ◉  ◉', '◉  ◉  ◉', ' ◉◉ ◉◉ '],
  X: ['◉    ◉', ' ◉  ◉ ', '  ◉◉  ', ' ◉  ◉ ', '◉    ◉'],
  Y: ['◉    ◉', ' ◉  ◉ ', '  ◉◉  ', '   ◉  ', '   ◉  '],
  Z: ['◉◉◉◉◉◉', '    ◉ ', '   ◉  ', '  ◉   ', '◉◉◉◉◉◉']
}

const red = '\x1b[31m'
const reset = '\x1b[0m'

const createPrettyText = (text) => {
  const textLines = ['', '', '', '', '', '']

  for (const char of text.toUpperCase()) {
    if (letters[char]) {
      for (let i = 0; i < letters[char].length; i++) {
        textLines[i] += letters[char][i] + ' '
      }
    } else {
      // Aggiungi spazi per caratteri non trovati
      for (let i = 0; i < textLines.length; i++) {
        textLines[i] += ' '.repeat(letters['A'][0].length) + ' '
      }
    }
  }

  return textLines.map((line) => red + line + reset).join('\n')
}

function DevtoolData(secretKey, pattern, dir) {
  this['Secret_Key'] = secretKey
  this['Files_Pattern'] = pattern
  this['Source_Map'] = dir
}

const logDevtoolData = ({ secretKey, pattern, dir }) => {
  const logMessage = createPrettyText('Flower Devtool')
  console.log(logMessage)
  const devtoolData = new DevtoolData(secretKey, pattern, dir)
  console.table(devtoolData)
}

module.exports = { logDevtoolData }
