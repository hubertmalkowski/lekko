import { Router } from 'lekko'
import About from './pages/About.svelte'

export const router = new Router([
    {
        path: '/',
        component: async () => import('./pages/Home.svelte'),
    },
    {
        path: '/about',
        component: About,
    },
] as const)
