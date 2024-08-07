# LLM Function Calling - IP and Latency Checker

When we ask OpenAI for "Compare the website speed of Puma and Nike. Please provide a concise answer.", it will return:

```text
I can't provide real-time data or a dynamic comparison of website speeds for Puma and Nike as of 2023. However, various third-party tools like Google PageSpeed Insights, GTmetrix, and Pingdom can be used to analyze and compare the performance metrics of these websites. Typically, these tools provide insights into elements such as page load times, responsiveness, and overall user experience metrics. For the most accurate and current comparison, it's best to run these tools directly on both websites.
```

Let's build a serverless function to get a website latency by `ping`. This tool can be integrated with OpenAI, Gemini, Ollama, and other LLMs.

## Development

### 1. Install YoMo CLI

```bash
curl -fsSL https://get.yomo.run | sh
```

Detail usages of the cli can be found on [Doc: YoMo CLI](https://yomo.run/docs/cli).

### 2. Start LLM Bridge service

```bash
yomo serve -c ./yomo.yml
```

the configuration file `yomo.yml` is as below:

```yaml
name: generic-llm-bridge
host: 0.0.0.0
port: 9000

bridge:
  ai:
    server:
      addr: 0.0.0.0:9000
      provider: openai

    providers:
      openai:
        api_key: <SK-XXXXX>
        model: <gpt-4o>
```

YoMo support multiple LLM providers, like Ollama, Mistral, Llama, Azure OpenAI, Cloudflare AI Gateway, etc. You can choose the one you want to use, details can be found on [Doc: LLM Providers](https://yomo.run/docs/llm-providers) and [Doc: Configuration](https://yomo.run/docs/zipper-configuration).

### 3. Attach this function calling to your LLM Bridge

```bash
yomo run app.go
```

### 4. Trigger the function calling

Test in your terminal:

```bash
curl http://127.0.0.1:9000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Compare the website speed of Puma and Nike. Please provide a concise answer."
      }
    ]
  }'
```

You will get response like:

```json
{
  "id": "chatcmpl-9tXvPPQUNEu7IyeZp902NQ2O6dF1M",
  "object": "chat.completion",
  "created": 1723025475,
  "model": "gpt-4o-2024-05-13",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Puma's website (puma.com) has an IP address of 151.101.66.132 with an average latency of 54.03 ms, while Nike's website (nike.com) has an IP address of 13.225.183.89 with an average latency of 80.91 ms. This suggests that Puma's website is faster than Nike's in terms of latency."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 240,
    "completion_tokens": 126,
    "total_tokens": 366
  },
  "system_fingerprint": "fp_3aa7262c27"
}
```

## Self Hosting

Check [Docs: Self Hosting](https://yomo.run/docs/self-hosting) for details on how to deploy YoMo LLM Bridge and Function Calling Serverless on your own infrastructure. Furthermore, if your AI agents become popular with users all over the world, you may consider deploying in multiple regions to improve LLM response speed. Check [Docs: Geo-distributed System](https://yomo.run/docs/glossary) for instructions on making your AI applications more reliable and faster.

## Deploy to Vivgrid

We know data is precious for every company, but managing multiple data regions is a big challenge. Vivgrid.com is a geo-distributed platform that routes user requests to the nearest LLM Bridge service. You can benefit from it to reduce latency and improve user experience while keeping your Function Calling Serverless deployed within your own infrastructure, even in your private cloud. Details can be found in [Docs: How to keep data security in LLM Function Calling](https://yomo.run/docs/sfn-networking).

Accelerating your LLM tools will improve user experience and increase user engagement. If LLM response speed is your top priority, you can consider deploying your LLM Bridge service on Vivgrid. Your function calling serverless will be deployed on every continent. Check [Docs: Deploy LLM function calling serverless on Vivgrid](https://docs.vivgrid.com/quick-start) for more details.

### Deploy to every data region just in one command

`yc deploy app.go`

### Realtime logs

`yc logs`

For more about cli `yc` usage, please check [Docs: Vivgrid CLI](https://docs.vivgrid.com/yc).
