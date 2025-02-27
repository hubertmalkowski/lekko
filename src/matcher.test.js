import { describe, it, expect } from 'vitest'
import { pathToRegex } from './matcher' // Adjust the import path

describe('pathToRegex', () => {
    // Test cases for static paths
    describe('Static Paths', () => {
        it('matches exact static paths with optional trailing slash', () => {
            const { regex } = pathToRegex('/about')
            expect(regex.test('/about')).toBe(true)
            expect(regex.test('/about/')).toBe(true)
            expect(regex.test('/abou')).toBe(false) // Partial match
            expect(regex.test('/about/us')).toBe(false) // Extra segment
        })

        it('matches the root path "/"', () => {
            const { regex } = pathToRegex('/')
            expect(regex.test('/')).toBe(true)
            expect(regex.test('/home')).toBe(false)
        })
    })

    // Test cases for dynamic parameters (e.g., :id)
    describe('Dynamic Parameters', () => {
        it('captures :id in /users/:id', () => {
            const { regex } = pathToRegex('/users/:id')
            expect(regex.test('/users/42')).toBe(true)
            expect(regex.test('/users/42/')).toBe(true)
            expect(regex.test('/users')).toBe(false) // Missing ID
            expect(regex.test('/users/42/posts')).toBe(false) // Extra segment
        })

        it('handles multiple parameters (e.g., /posts/:year/:month)', () => {
            const { regex } = pathToRegex('/posts/:year/:month')
            expect(regex.test('/posts/2023/10')).toBe(true)
            expect(regex.test('/posts/2024/02/')).toBe(true)
            expect(regex.test('/posts/2023')).toBe(false) // Missing month
            expect(regex.test('/posts/2023/10/extra')).toBe(false) // Extra segment
        })
    })

    // Test cases for wildcards (*)
    describe('Wildcards', () => {
        it('matches anything after /files/*', () => {
            const { regex } = pathToRegex('/files/*')
            expect(regex.test('/files/image.jpg')).toBe(true)
            expect(regex.test('/files/documents/report.pdf')).toBe(true)
            expect(regex.test('/files')).toBe(false) // Missing trailing segment
            expect(regex.test('/file/image.jpg')).toBe(false) // Incorrect prefix
        })

        it('matches wildcard at root (/*)', () => {
            const { regex } = pathToRegex('/*')
            expect(regex.test('/any-path')).toBe(true)
            expect(regex.test('/')).toBe(true)
        })
    })

    // Test escaping special characters (e.g., +)
    it('escapes special regex characters in static paths', () => {
        const { regex } = pathToRegex('/user+name')
        expect(regex.test('/user+name')).toBe(true)
        expect(regex.test('/username')).toBe(false) // + is treated literally
    })

    // Test wildcard in the middle (e.g., /a/*/b)
    it('matches wildcard in the middle (/a/*/b)', () => {
        const { regex } = pathToRegex('/a/*/b')
        expect(regex.test('/a/anything/b')).toBe(true)
        expect(regex.test('/a/123/b/')).toBe(true)
        expect(regex.test('/a/b')).toBe(false) // Missing wildcard segment
    })

    // Test cases for getParams function
    describe('getParams function', () => {
        it('extracts parameters from path with single parameter', () => {
            const { getParams } = pathToRegex('/users/:id')
            expect(getParams('/users/john')).toEqual({ id: 'john' })
        })

        it('extracts parameters from path with multiple parameters', () => {
            const { getParams } = pathToRegex('/posts/:year/:month')
            expect(getParams('/posts/2023/10')).toEqual({
                year: '2023',
                month: '10',
            })
        })

        it('extracts wildcards as parameters', () => {
            const { getParams } = pathToRegex('/files/*')
            expect(getParams('/files/documents/report.pdf')).toEqual({
                wildcard1: 'documents/report.pdf',
            })
        })

        it('extracts wildcard in the middle', () => {
            const { getParams } = pathToRegex('/a/*/b')
            expect(getParams('/a/something/b')).toEqual({
                wildcard1: 'something',
            })
        })

        it('returns null when path does not match pattern', () => {
            const { getParams } = pathToRegex('/users/:id')
            expect(getParams('/users')).toBeNull()
        })

        it('handles complex paths with mixed parameters and wildcards', () => {
            const { getParams } = pathToRegex(
                '/api/users/:userId/posts/:filter'
            )
            expect(getParams('/api/users/42/posts/latest')).toEqual({
                userId: '42',
                filter: 'latest',
            })
        })

        it('returns empty object for static paths with no parameters', () => {
            const { getParams } = pathToRegex('/about')
            expect(getParams('/about')).toEqual({})
        })
    })
})
