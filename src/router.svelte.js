/** @import {Component} from 'svelte' */

import { matchRoute, routesToRegex } from './matcher'

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
     * Navigates to a new URL.
     * @param {string | URL} url
     */
    goto(url) {
        const pathname = this._getPathname(url)
        if (pathname === window.location.pathname) return
        const route = this.matchRoute(pathname)
        if (!route) return
        window.history.pushState({}, '', pathname)
        this._page = route
    }

    /**
     * Replaces the current URL.
     * @param {string | URL} url
     */
    replace(url) {
        const pathname = this._getPathname(url)
        const route = this.matchRoute(pathname)
        if (!route) return
        window.history.replaceState({}, '', pathname)
        this._page = route
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

    assignCurrentPage() {}

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
     * Matches a path to a route.
     * @private
     * @param {string} path
     * @returns {import('./matcher').ActiveRoute | null}
     */
    matchRoute(path) {
        return matchRoute(this._compiledRoutes, path)
    }
}
