import { tavily, TavilyClient } from '@tavily/core';
import { env } from "process";
import { load as cheerioLoad } from "cheerio";
import { search, SafeSearchType } from "duck-duck-scrape";

export const description = 'A custom search engine designed to answer questions about current events. The input is a search query, and the output is a JSON array of results.'

enum Topic {
  General = "general",
  News = "news",
  Finance = "finance"
}

// For jsonschema in TypeScript, see: https://github.com/YousefED/typescript-json-schema
export type Argument = {
  /**
   * The search query
   */
  input: string;
  /**
   * The topic to be queried
   */
  topic: Topic
}

export async function handler(args: Argument) {
  console.log(JSON.stringify(args))
  const searchEngine = createSearchEngine(env as ENV)

  try {
    const result = await searchEngine.Search(args.input, args.topic)
    console.log(JSON.stringify(result))
    return result
  } catch (err) {
    console.error(err)
    return { error: err }
  }
}

interface SearchEngine {
  Search(query: string, topic: Topic): Promise<SearchResult[]>
}

type ENV = {
  GOOGLE_API_KEY?: string,
  GOOGLE_CSE_ID?: string,
  TAVILY_API_KEY?: string,
}

function createSearchEngine(env: ENV): SearchEngine {
  if (env.GOOGLE_API_KEY && env.GOOGLE_CSE_ID) {
    console.log('Using Google Search Engine')
    return new GoogleSearch(env.GOOGLE_API_KEY, env.GOOGLE_CSE_ID)
  } else if (env.TAVILY_API_KEY) {
    console.log('Using Tavily Search Engine')
    return new TavilySearch(env.TAVILY_API_KEY)
  } else {
    console.log('Using DuckDuckGo Search Engine')
    return new DuckDuckGoSearch()
  }
}

class DuckDuckGoSearch implements SearchEngine {
  constructor() { }

  async Search(query: string, topic: Topic): Promise<SearchResult[]> {
    const resp = await search(query, {
      safeSearch: SafeSearchType.STRICT
    })

    let result = await Promise.all(
      resp.results
        .filter((item) => item.url)
        .map(async (item) => {
          console.log(`Reading link [${item.title}]: ${item.url}`)
          const html = await fetchWebPage(item.url)
          if (!html) {
            return { title: "", link: "", content: "" }
          }
          const content = extractHtml(html, item.description)

          console.log(`\t->[${content.title}] ${content.content.slice(0, 100)}`)

          return {
            link: item.url,
            title: content.title,
            content: content.content || item.description,
          }
        })
    )
    return result.filter((item) => item.title)
  }
}

class TavilySearch implements SearchEngine {
  protected client: TavilyClient

  constructor(apiKey: string) {
    this.client = tavily({ apiKey: apiKey })
  }

  async Search(query: string, topic: Topic): Promise<SearchResult[]> {
    const resp = await this.client.search(query, {
      topic: topic
    })
    return resp.results.map((result) => ({
      title: result.title,
      link: result.url,
      content: result.content
    }))
  }
}

type SearchResult = {
  title: string
  link: string
  content: string
}

class GoogleSearch implements SearchEngine {
  protected apiKey: string
  protected cseId: string


  constructor(apiKey: string, cseId: string) {
    this.apiKey = apiKey
    this.cseId = cseId
  }

  async Search(query: string, topic: Topic): Promise<SearchResult[]> {
    const resp = await this.googleSearch(query);

    let result = await Promise.all(
      resp
        .filter((item) => item.link)
        .map(async (item) => {
          console.log(`Reading link [${item.title}]: ${item.link}`)
          const html = await fetchWebPage(item.link as string)
          if (!html) {
            return { title: "", link: "", content: "" }
          }
          const content = extractHtml(html, item.content as string)

          console.log(`\t->[${content.title}] ${content.content.slice(0, 100)}`)

          return {
            link: item.link,
            title: content.title,
            content: content.content || item.content,
          }
        })
    )
    return result.filter((item) => item.title)
  }

  private async googleSearch(query: string) {
    const url = `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&num=6&cx=${this.cseId}&q=${encodeURIComponent(query)}`
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(
        `Got ${res.status} error from Google custom search: ${res.statusText}`
      );
    }

    const json = await res.json();

    const results: SearchResult[] = json?.items?.map(
      (item: { title: string; link: string; snippet: string; }) => ({
        title: item.title,
        link: item.link,
        content: item.snippet,
      })
    ) ?? [];

    return results;
  }
}

async function fetchWebPage(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return ""
    }
    const text = await res.text()
    return text
  } catch (error) {
    return ""
  }
}

function extractHtml(html: string, defaultContent: string) {
  const $ = cheerioLoad(html);

  // remove unwanted elements
  $("script, style, nav, footer, header").remove();

  // extract title
  const title = cleanText($("title").text() || "");

  // try to find main content
  let mainContent = $("main, article, .content").first();

  if (!mainContent.length) {
    mainContent = $("body");
  }

  // extract text from paragraphs
  const paragraphs = mainContent.find("p");
  let text = paragraphs
    .map((i, p) => $(p).text().trim())
    .get()
    .join(" ");

  // if no paragraphs found, get all text
  if (!text) {
    text = $("body").text().trim();
  }

  // clean up whitespace
  text = text.replace(/\s+/g, " ").trim() || defaultContent;

  return {
    title: title,
    content: text.slice(0, 2400), // limit to first 2400 characters
  };
}

function cleanText(title: string): string {
  return title
    .replace(/[\r\n\t]+/g, ' ')  // Replace newlines and tabs with space
    .replace(/\s+/g, ' ')        // Replace multiple spaces with single space
    .trim();                     // Remove leading/trailing whitespace
}
