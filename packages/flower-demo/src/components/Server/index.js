import React, { useEffect } from 'react'
import { useFlower } from '@flowerforce/flower-react'

const Api = React.memo(({ flow }) => {
  const { jump, nodeId } = useFlower()

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
        jump(data)
      })
      .catch((err) => {
        console.log('TCL: Portal -> err', err)
      })
  }, [nodeId, flow, jump])

  return '...'
})

export default Api
