import { load as cheerioLoad } from "cheerio";
import { search, SafeSearchType } from "duck-duck-scrape";

export const description = 'A custom search engine designed to answer questions about current events. The input is a search query, and the output is a JSON array of results.'

// For jsonschema in TypeScript, see: https://github.com/YousefED/typescript-json-schema
export type Argument = {
  /**
   * The search query
   */
  input: string;
}

export async function handler(args: Argument) {
  console.log(JSON.stringify(args))

  try {
    const result = await duckDuckGoSearch(args.input)
    return result
  } catch (err) {
    console.error(err)
    return { error: err }
  }
}

async function duckDuckGoSearch(query: string) {
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

  const charset = $('meta[charset]').attr('charset')
  if (charset && charset !== 'utf-8') {
    return { title: "", content: "" }
  }
  
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
