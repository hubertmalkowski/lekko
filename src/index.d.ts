import { Component } from 'svelte'

/**
 * Represents a route with a path and an optional component.
 */
export type Route<Path extends string = string> = {
    path: Path
    component?: Component
}

/**
 * Extracts the union of path types from an object's routes array.
 */
export type RoutePaths<T extends { routes: readonly Route[] }> =
    T['routes'][number]['path']

/**
 * A class that manages a collection of routes.
 */
export class Router<T extends readonly Route[]> {
    /**
     * Creates a new Router instance.
     * @param routes The array of routes to initialize the router with.
     */
    constructor(routes: T)

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
    get page(): Component
}
