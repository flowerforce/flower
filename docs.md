# Library Documentation

## Introduction
This library provides a set of modular packages designed to be framework-agnostic while offering specific integrations for React. The core package contains independent logic and utilities that can be used with various frontend frameworks or libraries. Additionally, React-specific packages extend functionality for state management, context handling, shared components, and dynamic form creation.

## Library Structure
The library is divided into the following packages:

### 1. Core
#### `flower-core`
- Contains agnostic logic independent of specific frontend frameworks.
- Provides reusable utilities and general functions.

### 2. React-Specific Packages

#### `flower-react-store`
- Provides a configurable Redux instance.
- Allows injection of external reducers.
- Facilitates global state management.

#### `flower-react-context`
- Generates a single instance of a configurable React context.
- Enables centralized state management without Redux.
- Supports customization of the context structure.

#### `flower-react-shared`
- Contains shared components and functions across various React packages.
- Prevents code duplication between library packages.

#### `flower-react-form`
- Manages dynamic forms using dedicated hooks and components.
- Integrates with `flower-react-store`, `flower-react-context`, and `flower-react-shared`.
- Can be used independently or together with `flower-react`.

#### `flower-react`
- The main package for React.
- Built on `flower-react-store`, `flower-react-context`, and `flower-react-shared`.
- Does not directly depend on `flower-react-form`, but is compatible with it.