import { Component } from 'svelte'

/**
 * Represents a route with a path and an optional component.
 */
export type Route<Path extends string = string> = {
    path: Path
    component: Component | (() => Promise<{ default: Component }>)
}

/**
 * LEKKO Router
 *
 * A simple router for Svelte applications.
 *
 * Usage
 * ```ts
 * // routes.ts
 * import Home from "./Home.svelte";
 * import About from "./About.svelte";
 *
 * const router = new Router([{
 *    path: '/',
 *    component: Home
 * },
 * {
 *    path: '/about',
 *    component: About
 * }] as const)
 *  ```
 * ```svelte
 * <!-- App.svelte -->
 * <script>
 *    import { router } from './routes.ts'
 *    $effect(() => {}) // It won't work without any $state or $effect
 * </script>
 *
 * <router.page />
 * ```
 */
export class Router<T extends readonly Route[]> {
    /**
     * Creates a new Router instance.
     * @param routes The array of routes to initialize the router with.
     */
    constructor(routes: T)

    goto(path: string): Promise<void>
    replace(path: string): Promise<void>

    /**
     * Gets the array of routes.
     */
    get routes(): T

    /**
     * State with the url params.
     */
    get params(): Record<string, string>

    /**
     * @component
     * Current page component
     */
    get page(): Component | undefined
}
