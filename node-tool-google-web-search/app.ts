import { load as cheerioLoad } from "cheerio";
import { env } from "process";
import { ProxyAgent, setGlobalDispatcher } from "undici";

// https://stackoverflow.com/questions/72306101/make-a-request-in-native-fetch-with-proxy-in-nodejs-18
if (env.https_proxy) {
  const dispatcher = new ProxyAgent({ uri: new URL(env.https_proxy).toString() });
  setGlobalDispatcher(dispatcher);
}

export const description = `A custom search engine designed to answer questions about current events. The input is a search query, and the output is a JSON array of results.`;

export type Argument = {
  /**
   * The search query.
   */
  input: string;
};

const GOOGLE_API_KEY = env.GOOGLE_API_KEY
const GOOGLE_CSE_ID = env.GOOGLE_CSE_ID
console.log(`GOOGLE_API_KEY=${GOOGLE_API_KEY}, GOOGLE_CSE_ID=${GOOGLE_CSE_ID}`)

export async function handler(args: Argument) {
  try {
    console.log(args)
    const resp = await googleSearch(args.input);

    let result = await Promise.all(
      resp
        .filter((item) => item.link)
        .map(async (item) => {
          console.log(`Reading link [${item.title}]: ${item.link}`)
          const html = await fetchWebPage(item.link as string)
          if (!html) {
            return { title: "", link: "", content: "" }
          }
          const content = extractHtml(html, item.snippet as string)

          console.log(`\t->[${content.title}] ${content.content.slice(0, 100)}`)

          return {
            link: item.link,
            title: content.title,
            content: content.content || item.snippet,
          }
        })
    )
    result = result.filter((item) => item.title)
    console.log("fetch result", result.length)
    return JSON.stringify(result)

  } catch (err) {
    console.error(err)
    return { error: err }
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

async function googleSearch(input: string) {
  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(input)}`
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Got ${res.status} error from Google custom search: ${res.statusText}`
    );
  }

  const json = await res.json();

  const results: searchResult[] = json?.items?.map(
    (item: searchResult) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    })
  ) ?? [];

  return results;
}

type searchResult = {
  title?: string;
  link?: string;
  snippet?: string;
}

function cleanText(title: string): string {
  return title
    .replace(/[\r\n\t]+/g, ' ')  // Replace newlines and tabs with space
    .replace(/\s+/g, ' ')        // Replace multiple spaces with single space
    .trim();                     // Remove leading/trailing whitespace
}
