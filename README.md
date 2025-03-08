# LLM Function Calling Examples

This repository contains examples of how to create a LLM (Large Language Model) Function Calling serverless by [YoMo framework](https://github.com/yomorun/yomo).

## Write Once, Run on any Model

YoMo support multiple LLM providers, like Ollama, Mistral, Llama, Azure OpenAI, Cloudflare AI Gateway, etc. You can choose the one you want to use, details can be found on [Doc: LLM Providers](https://yomo.run/docs/llm-providers) and [Doc: Configuration](https://yomo.run/docs/zipper-configuration).

## Examples List

### Node.js

- [node-tool-get-weather](./node-tool-get-weather): Get the weather information by city name by 3rd party API.
- [node-tool-currency-converter](./node-tool-currency-converter): Currency Calculator by 3rd party API.
- [node-tool-get-utc-time](./node-tool-get-utc-time): Get the UTC time by city name.
- [node-tool-get-ip-and-latency](./node-tool-get-ip-and-latency): Get IP and Latency by give website name like "Nike" and "Amazone" by `ping` command.
- [node-tool-send-mail-smtp](./node-tool-send-mail-smtp): Send email by `nodemailer` and `maildev`.
- [node-tool-send-mail-resend](./node-tool-send-mail-resend): Send email by `resend`.
- [node-tool-google-web-search](./node-tool-google-web-search): Search the web by Google Custom Search Engine.
- [node-tool-tavily-web-search](./node-tool-tavily-web-search): Search the web by [Tavily](https://tavily.com/) Search Engine.
- [node-tool-duckduckgo-web-search](./node-tool-duckduckgo-web-search): Search the web by [DuckDuckGo](https://github.com/Snazzah/duck-duck-scrape) Search Engine.

### Golang

- [golang-tool-get-weather](./golang-tool-get-weather): Get the weather information by city name by 3rd party API.
- [golang-tool-currency-converter](./golang-tool-currency-converter): Currency Calculator by 3rd party API.
- [golang-tool-get-utc-time](./golang-tool-get-utc-time): Get the UTC time by city name.
- [golang-tool-timezone-calculator](./golang-tool-timezone-calculator): Calculate the timezone for a specific time.
- [golang-tool-get-ip-and-latency](./golang-tool-get-ip-and-latency): Get IP and Latency by give website name like "Nike" and "Amazone" by `ping` command.
- [golang-tool-send-mail-smtp](./golang-tool-send-mail-smtp): Send email by smtp.
- [golang-tool-send-mail-resend](./golang-tool-send-mail-resend): Send email by `resend`.

## Self Hosting

Check [Docs: Self Hosting](https://yomo.run/docs/self-hosting) for details on how to deploy YoMo LLM Bridge and Function Calling Serverless on your own infrastructure. Furthermore, if your AI agents become popular with users all over the world, you may consider deploying in multiple regions to improve LLM response speed. Check [Docs: Geo-distributed System](https://yomo.run/docs/glossary) for instructions on making your AI applications more reliable and faster.
