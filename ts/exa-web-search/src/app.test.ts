import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { handler, type Argument } from './app'

// Mock fetch globally
global.fetch = vi.fn()

describe('exaSearch', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should successfully perform a search with valid API key', async () => {
    process.env.EXA_API_KEY = 'test-api-key'
    
    const mockResponse = {
      requestId: 'req-123',
      results: [
        {
          title: 'Test Result 1',
          url: 'https://example.com/1',
          publishedDate: '2024-01-01',
          author: 'Author 1',
          extraField: 'should be filtered'
        },
        {
          title: 'Test Result 2',
          url: 'https://example.com/2',
          publishedDate: '2024-01-02',
          author: 'Author 2'
        }
      ]
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const args: Argument = { query: 'test query' }
    const result = await handler(args)
    const parsed = JSON.parse(result)

    expect(global.fetch).toHaveBeenCalledWith('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'x-api-key': 'test-api-key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'test query',
        numResults: 10,
        type: 'auto'
      })
    })

    expect(parsed).toEqual({
      requestId: 'req-123',
      results: [
        {
          title: 'Test Result 1',
          url: 'https://example.com/1',
          publishedDate: '2024-01-01',
          author: 'Author 1'
        },
        {
          title: 'Test Result 2',
          url: 'https://example.com/2',
          publishedDate: '2024-01-02',
          author: 'Author 2'
        }
      ]
    })
  })

  it('should return error string when EXA_API_KEY is not set', async () => {
    delete process.env.EXA_API_KEY

    const args: Argument = { query: 'test query' }
    const result = await handler(args)
    const parsed = JSON.parse(result)

    expect(parsed).toEqual({
      error: 'EXA_API_KEY environment variable is not set'
    })

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should return error string when API returns non-ok response', async () => {
    process.env.EXA_API_KEY = 'test-api-key'

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    })

    const args: Argument = { query: 'test query' }
    const result = await handler(args)
    const parsed = JSON.parse(result)

    expect(parsed).toEqual({
      error: 'Exa API error: 401 Unauthorized'
    })
  })

  it('should return error string for API 500 error', async () => {
    process.env.EXA_API_KEY = 'test-api-key'

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    })

    const args: Argument = { query: 'test query' }
    const result = await handler(args)
    const parsed = JSON.parse(result)

    expect(parsed).toEqual({
      error: 'Exa API error: 500 Internal Server Error'
    })
  })

  it('should handle empty results array', async () => {
    process.env.EXA_API_KEY = 'test-api-key'

    const mockResponse = {
      requestId: 'req-456',
      results: []
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const args: Argument = { query: 'no results query' }
    const result = await handler(args)
    const parsed = JSON.parse(result)

    expect(parsed).toEqual({
      requestId: 'req-456',
      results: []
    })
  })

  it('should return error string for network errors', async () => {
    process.env.EXA_API_KEY = 'test-api-key'

    ;(global.fetch as any).mockRejectedValueOnce(
      new Error('Network error')
    )

    const args: Argument = { query: 'test query' }
    const result = await handler(args)
    const parsed = JSON.parse(result)

    expect(parsed).toEqual({
      error: 'Network error'
    })
  })
})
