import { addPrefix, getContent, getOptionValue, isOptionSet, parserUsage, toCamel } from '../../../src/utils/index.ts'
import packageJSON from '../../../package.json'

describe('getContent', () => {
    it('should echo back strings', async () => {
        // given
        const str = 'string'

        // when
        return getContent(str).then(result => {
            // then
            expect(result).toEqual(str)
        })
    })

    it('should return file contents', async () => {
        // given
        const file = 'package.json'

        // when
        return getContent(file).then(result => {
            // then
            expect(JSON.parse(result)).toEqual(packageJSON)
        })
    })

    it('should return url contents', async () => {
        // given
        const url = 'https://google.com'

        // when
        return getContent(url).then(result => {
            // then
            expect(result.includes('google')).toEqual(true)
        })
    })

    it('should fail on directory read', async () => {
        // given
        const file = '/home'

        // when
        return getContent(file).catch(err => {
            // then
            expect(err.code).toMatch(/E(NOTSUP|ISDIR)/)
        })
    })

    it('should fail on fake url', async () => {
        // given
        const url = 'http://notnottarget.com'

        // when
        return getContent(url).catch(err => {
            // then
            expect(err.code).toEqual('ENOTFOUND')
        })
    })
})

describe('parser usage', () => {
    let consoleOutput
    beforeEach(() => {
        consoleOutput = ''
        console.log = jest.fn(l => {
            consoleOutput += l + '\n'
        })
    })

    it('should display the correct parser usage with no args', () => {
        // given
        const parser = 'example'
        const args = []
        const expected = `usage: graphql-liftoff example [--key=value|-k=value|--key|-k] <filename|url|none-for-stdin>

options:
\t--help,-h	Show this help documentation
`
        // when
        parserUsage(parser, args)

        // then
        expect(consoleOutput).toEqual(expected)
    })

    it('should display the correct parser usage with args', () => {
        // given
        const parser = 'example'
        const args = [
            {
                short: 'y',
                long: 'yaml',
                description: 'test description'
            }
        ]
        const expected = `usage: graphql-liftoff example [--key=value|-k=value|--key|-k] <filename|url|none-for-stdin>

options:
\t--help,-h	Show this help documentation
\t--yaml,-y	test description
`
        // when
        parserUsage(parser, args)

        // then
        expect(consoleOutput).toEqual(expected)
    })
})

describe('toCamel', () => {
    it('should convert snake to camel case', () => {
        // given
        const input = {
            test: {
                name: 'snake_case',
                fields: [
                    {
                        name: 'field_snake_case'
                    }
                ]
            }
        }

        // when
        const result = toCamel(input)

        // then
        expect(result).toEqual({ test: { name: 'snakeCase', fields: [ { name: 'fieldSnakeCase'}]}})
    })
})

describe('addPrefix', () => {
    it('should add a prefix', () => {
        // given
        const input = {
            test: {
                name: 'snake_case',
                fields: [
                    {
                        name: 'field_snake_case'
                    }
                ]
            }
        }

        // when
        const result = addPrefix(input, 'TEST_')

        // then
        expect(result).toEqual({ test: { name: 'TEST_snake_case', fields: [ { name: 'field_snake_case'}]}})
    })
})

describe('isOptionSet', () => {
    it('should find the short option value', () => {
        // given
        const input = {
            v: 'asdf'
        }

        // when
        const result = isOptionSet(input, 'v', 'verylongargname')

        // then
        expect(result).toEqual(true)
    })

    it('should find the long option value', () => {
        // given
        const input = {
            verylongargname: 'asdf'
        }

        // when
        const result = isOptionSet(input, 'v', 'verylongargname')

        // then
        expect(result).toEqual(true)
    })
})

describe('getOptionValue', () => {
    it('should get the short option value', () => {
        // given
        const input = {
            v: 'asdf'
        }

        // when
        const result = getOptionValue(input, 'v', 'verylongargname')

        // then
        expect(result).toEqual('asdf')
    })

    it('should get the long option value', () => {
        // given
        const input = {
            verylongargname: 'asdf'
        }

        // when
        const result = getOptionValue(input, 'v', 'verylongargname')

        // then
        expect(result).toEqual('asdf')
    })
})
