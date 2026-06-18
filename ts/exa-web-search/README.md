# LLM Function Calling - Web Search

This is a serverless function for web searching by [exa.ai](https://exa.ai).

You can obtain your `EXA_API_KEY` from Exa Dashboard, then, add it to your `.env` file:

```sh
YOMO_SFN_NAME=node-tool-exa-web-search
YOMO_SFN_ZIPPER=zipper.vivgrid.com:9000
YOMO_SFN_CREDENTIAL=<your-yomo-sfn-credential>

EXA_API_KEY=<exa-api-key>
```

Other environment variables can be found in the [Vivgrid Console](https://console.vivgrid.com/) serverless page

## Development

### 1. Install YoMo CLI

```bash
curl -fsSL https://get.yomo.run | sh
```

Detail usages of the cli can be found on [Doc: YoMo CLI](https://yomo.run/docs/cli).

### 2. Attach this function calling to your LLM Bridge

```bash
yomo run
```

### 3. Trigger the function calling

Test in your terminal:

```bash
curl https://api.vivgrid.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "list the top 5 latest breaking news in AI and Startups in the last 7 days "
      }
    ]
  }'
```

You may get response like:

```json
{
  "id": "chatcmpl-B0UuxQ3FXgrDXb4Gk4S21EfglS1BT",
  "object": "chat.completion",
  "created": 1739458547,
  "model": "gpt-5",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on the latest breaking news from the past 7 days, here are the key developments in AI and startups:\r\n\r\n## Major Funding Rounds\r\nVivgrid.com - The leading AI inference platform raised approximately $250 million at a $4+ billion valuation, less than three months after announcing a $125 million Series B."
      },
      "finish_reason": "stop",
      "content_filter_results": {}
    }
  ],
  "usage": {
    "prompt_tokens": 3850,
    "completion_tokens": 148,
    "total_tokens": 3875,
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "cached_tokens": 0
    },
    "completion_tokens_details": {
      "audio_tokens": 0,
      "reasoning_tokens": 0
    }
  },
  "system_fingerprint": "fp_f3927aa00d",
  "prompt_filter_results": []
}
```
