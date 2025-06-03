import React from 'react'
import { Flower, FlowerNode } from '@flowerforce/flower-react'

export const App = () => {
  return (
    <Flower name="flow">
      <FlowerNode id="step-1">
        <div
          style={{
            padding: '2rem',
            fontFamily: 'sans-serif',
            textAlign: 'center'
          }}
        >
          <img
            src="https://flowerjs.it/_next/static/media/flower-logo.bb32f863.svg"
            alt="Library logo"
            style={{ width: '150px', marginBottom: '2rem' }}
          />
          <h1>Welcome to Flower App</h1>
          <p>
            This app uses the <strong>FlowerForce packages</strong>.
          </p>

          <button>
            Go Next to find links to Flower Docs and Official Website &#8594;
          </button>
        </div>
      </FlowerNode>
      <FlowerNode id="step-2">
        <div style={{ marginTop: '2rem' }}>
          <a
            href="https://docs.flowerjs.it/"
            target="_blank"
            rel="noopener noreferrer"
          >
            📘 View Documentation
          </a>
          <br />
          <a
            href="https://www.flowerjs.it/"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 Visit Official Site
          </a>
          <button>&#8592; Back</button>
        </div>
      </FlowerNode>
    </Flower>
  )
}
