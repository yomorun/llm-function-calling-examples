# LLM Function Calling - Timezone Calculator

When we ask Google Gemini: `what is the time in Singapore for Thursday, February 29th, 2024 9:00am (UTC-08:00) Pacific Time?`, it will returns:

```text
There seems to be a mistake. February 29th, 2024 doesn't exist. February only has 28 days in non-leap years.

Would you like to try a different date?
```

Obviously, 2024 is a leap year. 

Let's build a serverless function to calculate the timezone for a specific time to get rid of LLM hallucinate. This tool can be integrated with OpenAI, Gemini, Ollama, and other LLMs.

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
        "content": "what is the time in Singapore for February 28th, 2024 9:00am (UTC-08:00) Pacific Time?"
      }
    ]
  }'
```

You will get response like:

```json
{
  "id": "chatcmpl-9tXZYje8ppe0vPAYYeIyrGsRMfkbQ",
  "object": "chat.completion",
  "created": 1723024120,
  "model": "gpt-4o-2024-05-13",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "February 29th, 2024 at 9:00 AM Pacific Time (UTC-08:00) is equivalent to March 1st, 2024 at 1:00 AM in Singapore Time (UTC+08:00)."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 360,
    "completion_tokens": 108,
    "total_tokens": 468
  },
  "system_fingerprint": "fp_c9aa9c0491"
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
