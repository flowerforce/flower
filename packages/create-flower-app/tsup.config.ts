import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],     // punto d'ingresso del tuo CLI
  format: ['esm'],             // obbligatorio per evitare `require`
  target: 'node18',            // o node20 se usi versioni più nuove
  outDir: 'dist',
  splitting: false,            // no code splitting (CLI semplice)
  clean: true,                 // pulizia prima della build
  sourcemap: false,
  dts: false,                  // niente tipi se non li usi
  banner: {
    js: '#!/usr/bin/env node', // necessario per eseguire con npx
  },
})
