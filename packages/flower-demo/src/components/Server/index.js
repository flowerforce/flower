import React, { useEffect } from 'react'
import { useFlower } from '@flowerforce/flower-react'

const Api = React.memo(({ flow }) => {
  const { onNode, nodeId } = useFlower()

  useEffect(() => {
    fetch(`http://localhost:3100/flower`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        flow,
        startId: nodeId,
        value: {
          val: Math.random() * 100
        }
      })
    })
      .then((data) => data.json())
      .then((data) => {
        onNode(data)
      })
      .catch((err) => {
        console.log('TCL: Portal -> err', err)
      })
  }, [nodeId, flow, onNode])

  return '...'
})

export default Api

/*
// flower
{
  "type": "component",
  "isAction": true,
  "isServer": true,
  "name": "Api",
  "title": "Api",
  "category": "utils",
  "editing": [
    {
      "type": "Input",
      "id": "name",
      "label": "Saga name"
    }
  ],
  "output": {
    "success": "bool",
    "error": "text"
  }
}
*/
