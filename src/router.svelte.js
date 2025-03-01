/** @import {Component} from 'svelte' */

import { matchRoute, routesToRegex } from './matcher'

/**
 * Represents a route with a path and an optional component.
 * @typedef {Object} Route
 * @property {string} path - The path of the route.
 * @property {Component | (() => Promise<Component>)} component - The component associated with the route.
 */

/**
 * A class that manages a collection of routes.
 * @template {Route[]} T - The type of the routes array, an array of Route objects.
 */

export class Router {
    /**
     * @type {import('./matcher').ActiveRoute | undefined}
     */
    _page = $state()

    /**
     * @private
     * @type {T}
     */
    _routes
    _compiledRoutes

    /**
     * Creates a new Router instance.
     * @param {T} routes - The array of routes to initialize the router with.
     */
    constructor(routes) {
        this._routes = routes
        this._compiledRoutes = routesToRegex(this._routes)

        this._setupEventListeners()
        this.replace(new URL(window.location.href))
    }

    /**
     * Navigates to a new URL.
     * @param {string | URL} url
     */
    async goto(url) {
        await this.navigate(url, window.history.pushState)
    }

    /**
     * Replaces the current URL.
     * @param {string | URL} url
     */
    async replace(url) {
        await this.navigate(url, window.history.replaceState)
    }

    /**
     * Navigates to a new URL using the specified history method.
     * @private
     * @param {string | URL} url
     * @param {Function} historyMethod - The history method to use (pushState or replaceState).
     */
    async navigate(url, historyMethod) {
        const pathname = this._getPathname(url)
        if (pathname === window.location.pathname) return

        const route = this.matchRoute(pathname)
        if (!route) return

        const component = await this._waitForComponent(route)
        route.component = component

        historyMethod(window.history, {}, '', pathname)
        this._page = route
    }

    /**
     * Gets the current page component.
     * @returns {Component | undefined}
     */
    get page() {
        return this._page?.component
    }

    get params() {
        return this._page?.params ?? {}
    }

    /**
     * Gets the array of routes.
     * @returns {T} The routes array.
     */
    get routes() {
        return this._routes
    }

    /**
     * Sets up event listeners for navigation.
     * @private
     */
    _setupEventListeners() {
        document.addEventListener('click', this._handleLinkClick.bind(this))
        window.addEventListener('popstate', this._handlePopState.bind(this))
    }

    /**
     * Handles link click events.
     * @private
     * @param {MouseEvent} event
     */
    _handleLinkClick(event) {
        if (!(event.target instanceof HTMLAnchorElement)) return
        const url = new URL(event.target.href, window.location.origin)
        if (url.origin !== window.location.origin) return
        event.preventDefault()
        this.goto(url)
    }

    /**
     * Handles popstate events.
     * @private
     */
    _handlePopState() {
        this.replace(new URL(window.location.href))
    }

    /**
     * @param {import('./matcher').ActiveRoute} page
     */
    async _waitForComponent(page) {
        if (
            typeof page.component == 'function' &&
            page.component.constructor.name === 'AsyncFunction'
        ) {
            //@ts-expect-error - This is a dynamic import
            const module = await page.component()
            return module.default
        }
        return page.component
    }

    /**
     * Extracts the pathname from a URL or string.
     * @private
     * @param {string | URL} url
     * @returns {string}
     */
    _getPathname(url) {
        return url instanceof URL ? url.pathname : url
    }

    /**
     * Matches a path to a route.
     * @private
     * @param {string} path
     * @returns {import('./matcher').ActiveRoute | null}
     */
    matchRoute(path) {
        return matchRoute(this._compiledRoutes, path)
    }
}
