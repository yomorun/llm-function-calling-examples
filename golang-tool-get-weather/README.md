# LLM Function Calling - Get Weather

This is a serverless function for getting weather info. This tool can be integrated with OpenAI, Gemini, Ollama, and other LLMs.

You can grab your api-key from [openweathermap.org](https://openweathermap.org) for free:

```sh
export OPENWEATHERMAP_API_KEY=<your-openweathermap.org-api-key>
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
zipper:
  host: "127.0.0.1"
  port: 9000
  tls: {}

http_api:
  host: "127.0.0.1"
  port: 9001
  enable_tool_api: false

llm_providers:
  - type: "openai-compatible"
    model_id: "gpt-5.4-nano"
    default: true
    params:
      model: "gpt-5.4-nano"
      api_key: "<YOUR_API_KEY>"
      base_url: "https://api.openai.com/v1"
```

### 3. Attach this function calling to your LLM Bridge

```bash
OPENWEATHERMAP_API_KEY=<your-openweathermap.org-api-key> yomo run -n get_weather

### 4. Trigger the function calling

Test in your terminal:

```bash
curl http://127.0.0.1:9001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
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
    "id": "chatcmpl-Ds3X5N9uiIS9gviAlaA1QfOLkqHHG",
    "created": 1781775663,
    "model": "gpt-5.4-nano-2026-03-17",
    "object": "chat.completion",
    "system_fingerprint": null,
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "No—there’s no rain reported in either city right now.\n\n- **Paris:** Clear sky (no rain)\n- **Sydney:** Overcast clouds (no rain)",
                "annotations": [

                ],
                "refusal": null
            },
            "finish_reason": "stop",
            "index": 0,
            "logprobs": null
        }
    ],
    "usage": {
        "prompt_tokens": 1108,
        "completion_tokens": 115,
        "total_tokens": 1223,
        "prompt_tokens_details": {
            "audio_tokens": 0,
            "cached_tokens": 0
        },
        "completion_tokens_details": {
            "accepted_prediction_tokens": 0,
            "audio_tokens": 0,
            "reasoning_tokens": 0,
            "rejected_prediction_tokens": 0
        }
    }
}
```

The log of the function calling will be printed in the terminal:

```bash
2026/06/18 17:41:02 INFO get-weather city=Paris result="&{GeoPos:{Longitude:2.3522 Latitude:48.8566} Sys:{Type:2 ID:2002900 Message:0 Country:FR Sunrise:1781754392 Sunset:1781812612} Base:stations Weather:[{ID:800 Main:Clear Description:clear sky Icon:01d}] Main:{Temp:31.1 TempMin:28.49 TempMax:32.22 FeelsLike:32.39 Pressure:1017 SeaLevel:1017 GrndLevel:1008 Humidity:48} Visibility:10000 Wind:{Speed:1.8 Deg:143} Clouds:{All:5} Rain:{OneH:0 ThreeH:0} Snow:{OneH:0 ThreeH:0} Dt:1781775331 ID:6455259 Name:Paris Cod:200 Timezone:7200 Unit:metric Lang:EN Key:d4a13cffd47f032b16e5378f0bb3eec6 Settings:0x2ad8f2a02100}"
2026/06/18 17:41:03 INFO get-weather city=Sydney result="&{GeoPos:{Longitude:151.2093 Latitude:-33.8688} Sys:{Type:2 ID:2018875 Message:0 Country:AU Sunrise:1781729950 Sunset:1781765592} Base:stations Weather:[{ID:804 Main:Clouds Description:overcast clouds Icon:04n}] Main:{Temp:17.81 TempMin:16.86 TempMax:18.49 FeelsLike:17.45 Pressure:1017 SeaLevel:1017 GrndLevel:1012 Humidity:69} Visibility:10000 Wind:{Speed:4.02 Deg:284} Clouds:{All:100} Rain:{OneH:0 ThreeH:0} Snow:{OneH:0 ThreeH:0} Dt:1781775503 ID:6619279 Name:Sydney Cod:200 Timezone:36000 Unit:metric Lang:EN Key:d4a13cffd47f032b16e5378f0bb3eec6 Settings:0x2ad8f2982030}"