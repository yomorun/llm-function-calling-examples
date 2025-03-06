import { tavily } from '@tavily/core';
import { env } from "process";

const TAVILY_API_KEY = env.TAVILY_API_KEY
console.log(`TAVILY_API_KEY=${TAVILY_API_KEY}`)

const client = tavily({ apiKey: TAVILY_API_KEY });

enum Topic {
  General = "general",
  News = "news",
  Finance = "finance"
}

export const description = 'A custom search engine designed to answer questions about current events. The input is a search query, and the output is a JSON array of results.'

// For jsonschema in TypeScript, see: https://github.com/YousefED/typescript-json-schema
export type Argument = {
  /**
   * The search query
   */
  query: string;

  /**
   * The topic to be queried
   */
  topic: Topic
}

export async function handler(args: Argument) {
  console.log(JSON.stringify(args))

  try {
    const resp = await client.search(args.query, {
      topic: args.topic,
    })

    const result = resp.results.map((result) => ({
      title: result.title,
      link: result.url,
      content: result.content
    }))

    console.log(JSON.stringify(result))
    return result

  } catch (err) {
    console.error(err)
    return { error: err }
  }
}
