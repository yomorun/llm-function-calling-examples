export const description = 'Perform a search query on the web, and retrieve the most relevant URLs/web data'

// For jsonschema in TypeScript, see: https://github.com/YousefED/typescript-json-schema
export type Argument = {
  /**
   * The search query to perform.
   */
  query: string;
}

export async function handler(args: Argument): Promise<string> {
  try {
    const result = await exaSearch(args.query)
    return JSON.stringify(result, null, 2)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return JSON.stringify({ error: errorMessage }, null, 2)
  }
}

async function exaSearch(query: string) {
  const apiKey = process.env.EXA_API_KEY
  if (!apiKey) {
    throw new Error('EXA_API_KEY environment variable is not set')
  }

  console.log(`Performing web search for: ${query}`)
  
  const response = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      numResults: 10,
      type: 'auto'
    })
  })

  if (!response.ok) {
    throw new Error(`Exa API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  
  return {
    requestId: data.requestId,
    results: data.results.map((result: any) => ({
      title: result.title,
      url: result.url,
      publishedDate: result.publishedDate,
      author: result.author
    }))
  }
}

