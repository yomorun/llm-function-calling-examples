# LLM Function Calling - Currency Converter

This is a serverless function for converting currency from USD to other currencies and vice versa. This tool can be integrated with OpenAI, Gemini, Ollama, and other LLMs.

The currency conversion is done using the [Exchange Rate API](https://www.exchangerate-api.com/). Developers need to register for their own API key to use this tool.

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
API_KEY=<your-openexchangerates.org-api-key> yomo run app.go
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
        "content": "I have $10. Can I afford sunglasses that cost 1,499 yen?"
      }
    ]
  }'
```

Based on the real time currency exchange rate, you may get response like:

```json
{
  "id": "chatcmpl-9rLPlliiUPndzuRi2kuu2TfZHM2cz",
  "object": "chat.completion",
  "created": 1722500729,
  "model": "gpt-4o-2024-05-13",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "With $10, you can get approximately 1,498.63 yen. Since the sunglasses cost 1,499 yen, you are just short by about 0.37 yen. So, you cannot afford the sunglasses with $10."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 223,
    "completion_tokens": 70,
    "total_tokens": 293
  },
  "system_fingerprint": "fp_4e2b2da518"
}
```

YoMo support concurrent function calling invokes, let's try ask `How much is 100 usd in Korea and UK currency`:

```bash
$ curl http://127.0.0.1:9000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "How much is 100 usd in Korea and UK currency"
      }
    ]
  }'
```

You will get the response like this:

```json
{
  "id": "chatcmpl-9rL9LfkVpKgM0t88v8dErbDhlP0xM",
  "object": "chat.completion",
  "created": 1722499711,
  "model": "gpt-4o-2024-05-13",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on today's exchange rates:\n\n- 100 USD is approximately 136,621.31 KRW (South Korean Won).\n- 100 USD is approximately 78.17 GBP (British Pound)."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 285,
    "completion_tokens": 99,
    "total_tokens": 384
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

`yc deploy app.go --envs API_KEY=<your-openexchangerates.org-api-key>`

### Realtime logs

`yc logs`

For more about cli `yc` usage, please check [Docs: Vivgrid CLI](https://docs.vivgrid.com/yc).
