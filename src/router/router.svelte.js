/** @import {Component} from 'svelte' */

/**
 * Represents a route with a path and an optional component.
 * @typedef {Object} Route
 * @property {string} path - The path of the route.
 * @property {Component} component - The component associated with the route.
 */

/**
 * A class that manages a collection of routes.
 * @template {Route[]} T - The type of the routes array, an array of Route objects.
 */
export class Router {
    /**
     * @private
     */
    _page = $state()

    /**
     * Creates a new Router instance.
     * @param {T} routes - The array of routes to initialize the router with.
     */
    constructor(routes) {
        this._routes = routes
        this._page = routes[0].component
    }

    /**
     * @private
     */
    matchRoute() {}

    get page() {
        return this._page
    }

    /**
     * Gets the array of routes.
     * @returns {T} The routes array.
     */
    get routes() {
        return this._routes
    }
}
