import { Router } from '../router/router.svelte'

import Page1 from '../routes/Page1.svelte'
import Page2 from '../routes/Page2.svelte'

export const router = new Router([
    {
        path: '/',
        component: Page1,
    },
    {
        path: '/about',
        component: Page2,
    },
])
