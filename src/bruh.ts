import type { Route } from '.'

const index: Route = {
    path: 'briuh',
    lazyComponent: async () => import('./bruh.svelte'),
}
