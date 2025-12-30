# Flower

<a alt="Flower logo" href="https://flowerjs.it/" target="_blank" rel="noreferrer"><img src="https://flowerjs.it/_next/static/media/flower-logo.bb32f863.svg" width="50"></a>

Flower is a front-end development library that allows you to manage and visualize workflows through an intuitive graphical representation. This library is designed to help developers create, modify, and monitor workflows via a user-friendly graphical interface.

<!-- ## NOTE
Flower is currently available for React only. -->

## Features

- **Manage flows using Rules Sets**: Usign a set of rules you could tell Flower which is the next node to mount.
- **Customization**: Extensive customization options for flow elements, including nodes, connections, and labels.
- **Compatibility**: Easily integrates with React.
- **Interactivity**: Customizable events and interactions to respond to user actions and changes.
- **Form Management**: Flower has a powerfull built-in Form Manager that allows to create sets of rules to know if a form is valid.
- **Render Benefits**: Flower optimally manages rerenders, ensuring top-notch performance.

## External Redux Store Support

Flower può convivere con uno store già esistente semplicemente usando `createFlowerStore`, lo stesso helper che `FlowerProvider` usa internamente: la funzione accetta la stessa configurazione di `configureStore` ma aggiunge un reducer che intercetta gli id `#external.*` e aggiorna il rispettivo path alla radice dello stato. I reducer esterni non devono contenere logiche custom per Flower, basta combinarli normalmente.

```tsx
import { createFlowerStore } from '@flowerforce/flower-react'
import { reducerFlower } from '@flowerforce/flower-react'

const store = createFlowerStore({
  reducer: {
    flower: reducerFlower,
    external: (state = { externalMessage: '' }) => state
  }
})

function AppWithExternalStore() {
  return (
    <FlowerProvider store={store}>
      {/* i tuoi flow */}
    </FlowerProvider>
  )
}
```

`FlowerField` e le regole di navigazione possono continuare a usare `#external.*`, e ogni scrittura viene automaticamente applicata al path specificato (es. `state.external.externalMessage`). I reducer esterni vedono i dati aggiornati senza dover ascoltare azioni Flower-specifiche.

## Full Documentation

For more info [flowerjs.it/](https://flowerjs.it/).

## Contributing

Contributing to Flower is easy and encouraged! If you find a bug or have a suggestion for improvement, feel free to open an issue or a pull request in the [GitHub repository](https://github.com/flowerforce/flower).

## Future Plans

We are excited about the future of Flower! Here are some upcoming features and improvements:

- **Angular Integration**: We plan to extend support to Angular, allowing Angular developers to leverage Flower in their projects.
- **Flutter Integration**: Future updates will include support for Flutter, enabling cross-platform mobile and web applications to utilize Flower's powerful workflow visualization capabilities.

## License

Flower is an open-source library.

---

Thank you for choosing Flower for your projects! We hope our library helps you create amazing user experiences.
