# LLM Function Calling - Get Weather

This is a serverless function for getting weather info. This tool can be integrated with OpenAI, Gemini, Ollama, and other LLMs.

You can grab your api-key from [openweathermap.org](https://openweathermap.org) for free, then, add it to your `.env` file:

```sh
YOMO_SFN_NAME=llm_tool_get_weather
YOMO_SFN_ZIPPER=localhost:9000
OPENWEATHERMAP_API_KEY=<your-openweathermap.org-api-key>
```

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
OPENWEATHERMAP_API_KEY=<your-openweathermap.org-api-key> yomo run app.go
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
        "content": "Is it raining in Paris and Sydney?"
      }
    ]
  }'
```

Based on the real time weather ifo, you may get response like:

```json
{
  "id": "chatcmpl-9tXBf7I4gb9GRlZBxHRvYaewoZm30",
  "object": "chat.completion",
  "created": 1723022639,
  "model": "gpt-4o-2024-05-13",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "As of the most recent data:\n\n- In **Paris**, the weather is currently characterized by broken clouds with a cloud coverage of 75%. It is not raining.\n- In **Sydney**, the weather is clear with no clouds. It is also not raining.\n\nSo, it is not raining in either Paris or Sydney at this moment."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 714,
    "completion_tokens": 138,
    "total_tokens": 852
  },
  "system_fingerprint": "fp_3aa7262c27"
}
```

The log of the function calling will be printed in the terminal:

```bash
2024/08/07 17:23:58 INFO get-weather city=Paris rag="{\"coord\":{\"lon\":2.3522,\"lat\":48.8566},\"weather\":[{\"id\":803,\"main\":\"Clouds\",\"description\":\"broken clouds\",\"icon\":\"04d\"}],\"base\":\"stations\",\"main\":{\"temp\":19.8,\"feels_like\":19.56,\"temp_min\":18.36,\"temp_max\":21.75,\"pressure\":1015,\"humidity\":66,\"sea_level\":1015,\"grnd_level\":1009},\"visibility\":10000,\"wind\":{\"speed\":5.14,\"deg\":300},\"clouds\":{\"all\":75},\"dt\":1723022471,\"sys\":{\"type\":2,\"id\":2012208,\"country\":\"FR\",\"sunrise\":1723005151,\"sunset\":1723058410},\"timezone\":7200,\"id\":6455259,\"name\":\"Paris\",\"cod\":200}"
2024/08/07 17:23:58 INFO get-weather city=Sydney rag="{\"coord\":{\"lon\":151.2093,\"lat\":-33.8688},\"weather\":[{\"id\":800,\"main\":\"Clear\",\"description\":\"clear sky\",\"icon\":\"01n\"}],\"base\":\"stations\",\"main\":{\"temp\":10.46,\"feels_like\":9.62,\"temp_min\":8.49,\"temp_max\":12.01,\"pressure\":1027,\"humidity\":79,\"sea_level\":1027,\"grnd_level\":1019},\"visibility\":10000,\"wind\":{\"speed\":0.45,\"deg\":99,\"gust\":0.89},\"clouds\":{\"all\":0},\"dt\":1723022638,\"sys\":{\"type\":2,\"id\":2091046,\"country\":\"AU\",\"sunrise\":1722976940,\"sunset\":1723015175},\"timezone\":36000,\"id\":6619279,\"name\":\"Sydney\",\"cod\":200}"```

## Self Hosting

Check [Docs: Self Hosting](https://yomo.run/docs/self-hosting) for details on how to deploy YoMo LLM Bridge and Function Calling Serverless on your own infrastructure. Furthermore, if your AI agents become popular with users all over the world, you may consider deploying in multiple regions to improve LLM response speed. Check [Docs: Geo-distributed System](https://yomo.run/docs/glossary) for instructions on making your AI applications more reliable and faster.

## Deploy to Vivgrid

We know data is precious for every company, but managing multiple data regions is a big challenge. Vivgrid.com is a geo-distributed platform that routes user requests to the nearest LLM Bridge service. You can benefit from it to reduce latency and improve user experience while keeping your Function Calling Serverless deployed within your own infrastructure, even in your private cloud. Details can be found in [Docs: How to keep data security in LLM Function Calling](https://yomo.run/docs/sfn-networking).

Accelerating your LLM tools will improve user experience and increase user engagement. If LLM response speed is your top priority, you can consider deploying your LLM Bridge service on Vivgrid. Your function calling serverless will be deployed on every continent. Check [Docs: Deploy LLM function calling serverless on Vivgrid](https://docs.vivgrid.com/quick-start) for more details.

### Deploy to every data region just in one command

`yc deploy app.go --envs OPENWEATHERMAP_API_KEY=<your-openweathermap.org-api-key>`

### Realtime logs

`yc logs`

For more about cli `yc` usage, please check [Docs: Vivgrid CLI](https://docs.vivgrid.com/yc).


