const generate = require('@babel/generator').default
const parser = require('@babel/parser')
const { nanoid } = require('nanoid')
const isEmpty = require('lodash/isEmpty')
const trim = require('lodash/trim')

const traverse = require('@babel/traverse').default
const trimStart = require('lodash/trimStart')

const SOURCE_TYPE = 'module'
const PARSER_PLUGINS = ['jsx', 'typescript']
const FLOWER_NODE_TO_SEARCH = 'Flower'

const findTypeDeep = (list) =>
  (!list
    ? []
    : list.reduce(
        (acc, child) => [...acc, child.type, ...findTypeDeep(child.children)],
        []
      )
  ).filter((f) => f.indexOf('Flower') === 0)

const addIdsToChildrenDeep = (list) =>
  list?.map((child) =>
    child.children
      ? {
          ...child,
          _id: nanoid(),
          children: addIdsToChildrenDeep(child.children)
        }
      : { ...child, _id: nanoid() }
  )

function removeComments(string) {
  //Takes a string of code, not an actual function.
  return string.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, '').trim() //Strip comments
}

/**
 * FUNCTION THAT MADE THE CODE VALUES FROM BABEL GENERATE FUNCTION
 * FIT TO A VALID JSON STRING TO RETURN A PLAIN OBJECT
 * @param {string} inputString
 * @returns {Object}
 */
function convertStringToJSON(inputString) {
  const jsonString = removeComments(inputString).slice(1, -1).replace(/'/g, '"')
  const cleanedString = jsonString.replace(/\n\s*/g, '')
  let obj

  try {
    obj = eval('(' + cleanedString + ')')
  } catch (error) {
    obj = inputString
  }

  return obj
}

/**
 * UTILITY THAT READ THE REAL VALUE OF A AST NODE
 * USED TO PASS THOSE VALUES TO FLOWER JSON FILE
 * @param nodeAttributes
 * @returns {any} nodeValue
 */
const getDeepValuesFromASTStructure = (nodeAttributes) => {
  if (nodeAttributes.name.name === 'to') {
    return {
      _to: convertStringToJSON(generate(nodeAttributes.value).code)
    }
  }

  if (nodeAttributes.value.expression.type === 'ArrayExpression') {
    return convertStringToJSON(generate(nodeAttributes.value).code)
  }
  if (nodeAttributes.value.expression.type === 'ObjectExpression') {
    return convertStringToJSON(generate(nodeAttributes.value).code)
  }

  if (nodeAttributes.value.expression.type === 'NumericLiteral') {
    return nodeAttributes.value.expression.value
  }

  if (nodeAttributes.value.expression.type === 'BooleanLiteral') {
    return nodeAttributes.value.expression.value
  }

  return {
    _raw: nodeAttributes.value
  }
}

const generateJSONCommentMetadata = (comments) => {
  // check title
  const [row1, ...restRows] = comments.split('\n')
  const row1Cleaned = row1.replace(/[^a-zA-Z0-9\s]/g, '')
  const existTitle = /^[A-Z0-9]+(?:\s|$)/.test(row1Cleaned)

  if (existTitle)
    return {
      title: row1,
      description: restRows.join('\n')
    }

  return {
    title: null,
    description: comments
  }
}

/**
 * FUNCTION THAT TAKES ALL NODES FROM TRAVERSE FUNCTION
 * IT CONVERTS AST FILE TO FLOWER JSON FILE
 * @param {AST NODES} pathNode
 * @returns {JSON}
 */
const fromASTNodesToJSON = (pathNode) => {
  if (!pathNode) return null

  if (!pathNode.openingElement) {
    if (
      pathNode.expression?.innerComments &&
      pathNode.expression.innerComments.length
    ) {
      const comments = pathNode.expression.innerComments
        .map((v) =>
          v.value
            .trim()
            .split('\n')
            .map((r) => trimStart(r.trim(), '*').trim())
            .join('\n')
            .trim()
        )
        .join('\n')

      // check exist @text on comment
      const nodeText = /@text/.test(comments)
      const cleanedComments = comments.replace('@text', '')

      // generate metadata
      const metadata = generateJSONCommentMetadata(cleanedComments)

      const jsonData = {
        type: 'FlowerComment',
        _value: cleanedComments,
        data: {
          _metadata: {
            ...metadata,
            nodeText
          }
        },
        selectable: false
      }

      return jsonData
    }

    if (pathNode.type === 'JSXText' && isEmpty(trim(pathNode.value)))
      return null

    if (pathNode.type === 'JSXText') {
      return {
        type: pathNode.type,
        value: pathNode.value,
        _raw: pathNode,
        _title: pathNode.type.replace('JSX', '')
      }
    }

    return {
      type: pathNode.type,
      _raw: pathNode,
      _title: (pathNode.expression?.type || pathNode.type).replace('JSX', ''),
      _value: generate(pathNode).code
    }
  }

  const nodeName = pathNode.openingElement.name.name
  const jsonData = {
    type: nodeName
  }

  if (pathNode.openingElement.attributes) {
    pathNode.openingElement.attributes.forEach((attr) => {
      if (attr.type === 'JSXSpreadAttribute') {
        Object.assign(jsonData, {
          [attr.argument.name]: { _raw: attr, _spread: true }
        })
      }

      // preserve prop type
      const _type = attr.name?.name === 'type' ? '_type' : attr.name?.name

      // props senza valore
      if (attr.name?.type === 'JSXIdentifier' && attr.value === null) {
        Object.assign(jsonData, { [_type]: true })
      }

      if (attr.value?.type === 'StringLiteral') {
        Object.assign(jsonData, { [_type]: attr.value.value })
      }

      if (attr.value?.type === 'JSXExpressionContainer') {
        Object.assign(jsonData, {
          [_type]: getDeepValuesFromASTStructure(attr)
        })
      }
    })
  }

  if (pathNode.children && pathNode.children.length > 0) {
    jsonData.children = pathNode.children
      .map((child) => fromASTNodesToJSON(child))
      .filter(Boolean)
  }

  return jsonData
}

const isEdge = (element) =>
  element.to && element.to._to && Object.keys(element.to._to).length > 0

function addEdges(elements) {
  return elements
    .filter(isEdge)
    .map((el) =>
      Object.entries(el.to._to).reduce(
        (acc, [k, v]) => [
          ...acc,
          {
            targetHandle: 'primary',
            sourceHandle: 'primary',
            source: el.id,
            target: k,
            data:
              typeof v === 'string' || !v
                ? { name: v }
                : {
                    label: v.label,
                    name: v.name,
                    rules: v.rules
                  },
            id: `reactflow__edge-${el.id}-${k}`
          }
        ],
        []
      )
    )
    .flat()
}

const reactToFlowerJsonMergeComment = (json) => {
  const nodeMerged = []

  return {
    ...json,
    children: json.children.reduce((acc, inc, index) => {
      const metadata = inc.data?._metadata
      const nodeText = inc.data?._metadata.nodeText

      // Se esiste un altro FlowerComment con value uguale va ignorato
      if (
        inc.type === 'FlowerComment' &&
        inc?._value &&
        acc.find((e) => e._value === inc?._value)
      )
        return acc

      // Se l'id è già presente tra i nodi già mergiati va ignorato
      if (nodeMerged.includes(inc.id)) return acc

      // Se il nodo è di tipo 'FlowerComment' ed non è di tipo nodeText può essere unito con il successivo
      if (inc.type === 'FlowerComment' && metadata && !nodeText) {
        const restNodes = json.children.slice(index + 1)
        const nextNodeIndex = restNodes.findIndex(
          (e) => e.type !== 'FlowerComment'
        )

        // NESSUN nodo successivo da unificare
        if (nextNodeIndex < 0) return [...acc, inc]

        const nextNode = restNodes[nextNodeIndex]

        // SE e' un nodo già unito ignora
        if (nodeMerged.includes(nextNode.id)) return acc
        const restComments = restNodes
          .slice(0, nextNodeIndex)
          .filter(
            (e) => e.type === 'FlowerComment' && e.data?._metadata.nodeText
          )

        // UNIFICHIAMO nodo successivo con i METADATA di "FlowerComment" e
        nodeMerged.push(nextNode.id) // aggiungi alla lista dei nodi mergiati

        return [
          ...acc,
          ...restComments,
          {
            ...nextNode,
            data: {
              ...(nextNode?.data || {}),
              _metadata: {
                ...(nextNode?.data?._metadata || {}),
                title: metadata?.title,
                description: metadata?.description
              }
            }
          }
        ]
      }

      return [...acc, inc]
    }, [])
  }
}

const reactToFlowerJson = (code) => {
  const ast = parser.parse(code, {
    sourceType: SOURCE_TYPE,
    plugins: PARSER_PLUGINS
  })

  // Define a function to extract React components
  let one = 0
  let json = null

  traverse(ast, {
    JSXElement(path) {
      const openingElement = path.node.openingElement
      if (
        one === 0 &&
        openingElement &&
        openingElement.name &&
        openingElement.name.name === FLOWER_NODE_TO_SEARCH
      ) {
        one++
        json = fromASTNodesToJSON(path.node)
      }
    }
  })

  json = reactToFlowerJsonMergeComment(json)

  const result = {
    type: 'flow',
    name: json.name,
    initialData: json.initialData,
    layout: json.layout || 'vertical',
    startId: json.startId,
    elements: [
      ...json.children.map((el, idx) => ({
        ...el,
        id: (el.id || idx).toString(),
        sourceType: el.type, // original name component
        children: undefined,
        data: {
          ...el.data,
          children: addIdsToChildrenDeep(el?.children)
        }
      })),
      ...addEdges(json.children)
    ]
  }

  return JSON.stringify(result)
}

module.exports = { reactToFlowerJson }
