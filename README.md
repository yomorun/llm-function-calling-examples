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

### Golang

- [golang-tool-get-weather](./golang-tool-get-weather): Get the weather information by city name by 3rd party API.
- [golang-tool-currency-converter](./golang-tool-currency-converter): Currency Calculator by 3rd party API.
- [golang-tool-get-utc-time](./golang-tool-get-utc-time): Get the UTC time by city name.
- [golang-tool-timezone-calculator](./golang-tool-timezone-calculator): Calculate the timezone for a specific time.
- [golang-tool-get-ip-and-latency](./golang-tool-get-ip-and-latency): Get IP and Latency by give website name like "Nike" and "Amazone" by `ping` command.

## Self Hosting

Check [Docs: Self Hosting](https://yomo.run/docs/self-hosting) for details on how to deploy YoMo LLM Bridge and Function Calling Serverless on your own infrastructure. Furthermore, if your AI agents become popular with users all over the world, you may consider deploying in multiple regions to improve LLM response speed. Check [Docs: Geo-distributed System](https://yomo.run/docs/glossary) for instructions on making your AI applications more reliable and faster.
