# LLM Function Calling - Get Weather

This is a serverless function for getting weather info.

You can grab your api-key from [openweathermap.org](https://openweathermap.org) for free, then, add it to your `.env` file:

```sh
YOMO_SFN_NAME=my_first_llm_function_tool
YOMO_SFN_ZIPPER=zipper.vivgrid.com:9000
YOMO_SFN_CREDENTIAL=<your-yomo-sfn-credential>
OPENWEATHERMAP_API_KEY=<your-openweathermap.org-api-key>
```

Other environment variables can be found in the [vivgrid console](https://console.vivgrid.com/) serverless page

## Development

### 1. Install YoMo CLI

```bash
curl -fsSL https://get.yomo.run | sh
```

Detail usages of the cli can be found on [Doc: YoMo CLI](https://yomo.run/docs/cli).

### 2. Attach this function calling to your LLM Bridge

```bash
yomo run -n tool-get-weather
```

### 3. Trigger the function calling

Test in your terminal:

```bash
curl https://api.vivgrid.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
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
  "id": "chatcmpl-AcrlEtrh6nuOkz7fjGlwkCg2L7QpC",
  "object": "chat.completion",
  "created": 1733826484,
  "model": "gpt-4o-2024-08-06",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Currently, it is not raining in either Paris or Sydney. \n\n- In **Paris**, the weather is characterized by broken clouds with a temperature of 6.1°C.\n- In **Sydney**, the weather also features broken clouds with a temperature of 20.82°C."
      },
      "finish_reason": "stop",
      "content_filter_results": {}
    }
  ],
  "usage": {
    "prompt_tokens": 708,
    "completion_tokens": 137,
    "total_tokens": 730,
    "prompt_tokens_details": null,
    "completion_tokens_details": null
  },
  "system_fingerprint": "fp_04751d0b65",
  "prompt_filter_results": []
}
```
