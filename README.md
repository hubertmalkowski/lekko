# LEKKO Router

LEKKO Router is a simple and lightweight router for Svelte applications. It allows you to define routes with associated components and manage navigation within your Svelte app.

## Features

- Define routes with paths and optional components.
- Navigate between routes using `goto` and `replace` methods.
- Access current route parameters and components.

## Installation

To install LEKKO Router, you can use npm or yarn:

```bash
npm install lekkorouter
```

or

```bash
yarn add lekkorouter
```

## Usage

### Defining Routes

Create a `routes.ts` file to define your application routes:

```typescript
import Home from "./Home.svelte";
import About from "./About.svelte";
import { Router } from 'lekkorouter';

const router = new Router([
  {
    path: '/',
    component: Home
  },
  {
    path: '/about',
    component: About
  }
] as const);
```

### Using the Router in Svelte

In your `App.svelte` file, import and use the router:

```svelte
<script>
  import { router } from './routes.ts';
  $effect(() => {}); // It won't work without any $state or $effect
</script>

<a href="/">Home</a>
<a href="/about">Home</a>

<router.page />
```

## API

### Router Class

- **Constructor**: `new Router(routes: T)`
  - `routes`: An array of route objects to initialize the router.

- **Methods**:
  - `goto(path: string): void`: Navigate to a specified path.
  - `replace(path: string): void`: Replace the current path with a new one.

- **Properties**:
  - `routes`: Get the array of defined routes.
  - `params`: Get the current URL parameters as a record.
  - `page`: Get the current page component.

## License

This project is licensed under the MIT License.
``
