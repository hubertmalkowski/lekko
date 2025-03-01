/**
 * @typedef {import("./router.svelte").Route & {
    regex: RegExp;
    getParams: (path: string) => Record<string, string> | null;
}} CompiledRoute
*/

/**
 * @typedef {CompiledRoute & {
 * params: { [key: string]: string };
 * component: import("svelte").Component
 * }} ActiveRoute
 */

/**
 * @param {string} str
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * @param {string} path
 * @returns {{regex: RegExp, getParams: (path: string) => Record<string, string>|null}}
 */
export function pathToRegex(path) {
    if (path === '/') {
        return {
            regex: /^\/?$/,
            getParams: () => ({}),
        }
    }

    const segments = path.split('/').filter(Boolean)

    /**
     * @type {(string | number)[]}
     */
    const paramNames = []
    const isLastWildcard =
        segments.length > 0 && segments[segments.length - 1] === '*'

    const regexParts = segments.map((segment, index) => {
        if (segment.startsWith(':')) {
            paramNames.push(segment.slice(1)) // Store parameter name without ':'
            return '([^/]+)'
        } else if (segment === '*') {
            paramNames.push('wildcard' + index) // Name wildcards uniquely
            if (index === segments.length - 1) {
                return '(.*)'
            } else {
                return '([^/]+)'
            }
        } else {
            return escapeRegex(segment)
        }
    })

    let regexStr = '^/' + regexParts.join('/')
    if (!isLastWildcard) {
        regexStr += '/?$'
    } else {
        regexStr += '$'
    }

    const regex = new RegExp(regexStr)

    // Create getParams function that will extract parameter values
    const getParams = (/** @type {string} */ pathname) => {
        const match = pathname.match(regex)
        if (!match) return null

        /**
         * @type {Record<string, string>}
         */
        const params = {}
        // Start from index 1 to skip the full match string at index 0
        for (let i = 0; i < paramNames.length; i++) {
            params[paramNames[i]] = match[i + 1]
        }

        return params
    }

    return { regex, getParams }
}

/**
 * @param {import("./router.svelte").Route[]} routes
 * @returns {CompiledRoute[]}
 */
export function routesToRegex(routes) {
    return routes.map((route) => ({
        ...pathToRegex(route.path),
        ...route,
    }))
}

/**
 * @param {CompiledRoute[]} routes
 * @param {string} pathname
 * @returns {ActiveRoute | null}
 */
export function matchRoute(routes, pathname) {
    for (const route of routes) {
        const match = pathname.match(route.regex)
        if (match) {
            return {
                params: route.getParams(pathname) ?? {},
                ...route,
            }
        }
    }
    return null
}
