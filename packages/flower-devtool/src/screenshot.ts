import { toCanvas } from 'html-to-image'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const filter = (node: any) => {
  const exclusion = ['NOSCRIPT']
  return !exclusion.some((name) => node.nodeName === name)
}

const screenshot = async () => {
  await delay(300)
  return toCanvas(document.body, { filter }).then((canvas) => {
    const base64Canvas = canvas.toDataURL('image/png').split(';base64,')[1]
    return base64Canvas
  })
}

export { screenshot }
