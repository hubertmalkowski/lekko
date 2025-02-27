# LEKKO Router ![NPM Version](https://img.shields.io/npm/v/lekko?style=plastic&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Flekko)

LEKKO Router is a simple and lightweight router for Svelte applications. 

## Installation

Install LEKKO Router, with your favourite package manager:

```bash
npm install lekko
```
or

```bash
pnpm add lekko
```

or

```bash
bun install lekko
```

## Usage

### Defining Routes

Create a `routes.ts` file to define your application routes:

```typescript
import Home from "./Home.svelte";
import About from "./About.svelte";
import UserPage from './UserPage.svelte';
import Page404 from './404Page.svelte';
import { Router } from 'lekkorouter';

const router = new Router([
  {
    path: '/',
    component: Home
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/user/:id',
    component: UserPage
  },
  {
    path: '*', // Will match any route
    component: Page404
  }
] as const);
```

### Using the Router in Svelte

In your `App.svelte` file, import and use the router:

```svelte
<script>
  import { router } from './routes.ts';
  $effect(() => {}); // You need to add at least one rune to you `app.svelte` for the router to update
</script>

<a href="/">Home</a>
<a href="/about">Home</a>

<router.page />
```

### Using route params

```svelte
<script>
import {router} from './routes.ts'
</script>

<div>user id is {router.params["id"]}</div>
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
