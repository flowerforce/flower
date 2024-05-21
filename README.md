# Flower

<a alt="Flower logo" href="https://flower.stackhouse.dev/" target="_blank" rel="noreferrer"><img src="https://flower.stackhouse.dev/_next/static/media/flower-logo.bb32f863.svg" width="50"></a>

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

## Full Documentation

For more info [flower.stackhouse.dev/](https://flower.stackhouse.dev/).

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

# FlowerMonorepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨

## Integrate with editors

Enhance your Nx experience by installing [Nx Console](https://nx.dev/nx-console) for your favorite editor. Nx Console
provides an interactive UI to view your projects, run tasks, generate code, and more! Available for VSCode, IntelliJ and
comes with a LSP for Vim users.

## Nx plugins and code generators

Add Nx plugins to leverage their code generators and automated, inferred tasks.

```
# Add plugin
npx nx add @nx/react

# Use code generator
npx nx generate @nx/react:app demo

# Run development server
npx nx serve demo

# View project details
npx nx show project demo --web
```

Run `npx nx list` to get a list of available plugins and whether they have generators. Then run `npx nx list <plugin-name>` to see what generators are available.

Learn more about [code generators](https://nx.dev/features/generate-code) and [inferred tasks](https://nx.dev/concepts/inferred-tasks) in the docs.

## Running tasks

To execute tasks with Nx use the following syntax:

```
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Explore the project graph

Run `npx nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

## Connect with us!

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
