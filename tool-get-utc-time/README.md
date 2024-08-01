# LLM Function Calling - Get UTC Time

When we ask OpenAI API: `What's time right now?`, it will returns:

```json
{
  "id": "chatcmpl-9rM7Qz4OurF03S4yATWAuMzLYOb1m",
  "object": "chat.completion",
  "created": 1722503436,
  "model": "gpt-4o-2024-05-13",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "I'm unable to provide the current time as I don't have real-time capabilities. You can check the time on your device or look up the current time based on your location."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 14,
    "completion_tokens": 34,
    "total_tokens": 48
  },
  "system_fingerprint": "fp_4e2b2da518"
}
```

This serverless function demostrate how to retrival current time in UTC format for LLM service. This tool can be integrated with OpenAI, Gemini, Ollama, and other LLMs.

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
        "content": "What is the time right now?"
      }
    ]
  }'
```

You will get response like:

```json
{
  "id": "chatcmpl-9rMBaBwAsddm1MS4SaS9RnrA2dPGv",
  "object": "chat.completion",
  "created": 1722503694,
  "model": "gpt-4o-2024-05-13",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The current Coordinated Universal Time (UTC) is 2024-08-01T09:14:53Z. To determine your local time, you would need to adjust for your specific time zone."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 120,
    "completion_tokens": 58,
    "total_tokens": 178
  },
  "system_fingerprint": "fp_bc2a86f5f5"
}
```

By this, OpenAI can answer correctly when you ask: `Are people in Saipan asleep right now?`

```json
{
  "id": "chatcmpl-9rMH8Aa39QaH4ykgBLxuUFTvr1Gyd",
  "object": "chat.completion",
  "created": 1722504038,
  "model": "gpt-4o-2024-05-13",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Saipan is in the Chamorro Standard Time Zone (ChST), which is UTC+10. \n\nGiven that it is currently 09:20 UTC, adding 10 hours would make it 19:20 (7:20 PM) on August 1st in Saipan.\n\nAt 7:20 PM, it is generally evening in Saipan, so most people would not be asleep yet, although some may be preparing for bed or engaged in evening activities."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 124,
    "completion_tokens": 111,
    "total_tokens": 235
  },
  "system_fingerprint": "fp_4e2b2da518"
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
