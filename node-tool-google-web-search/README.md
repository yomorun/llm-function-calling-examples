# LLM Function Calling - Web Search

This is a serverless function for web searching.

You can obtain your `GOOGLE_API_KEY` and `GOOGLE_CSE_ID` by following this [article](https://stackoverflow.com/questions/37083058/programmatically-searching-google-in-python-using-custom-search), then, add them to your `.env` file:

```sh
YOMO_SFN_NAME=web-search
YOMO_SFN_ZIPPER="zipper.vivgrid.com:9000"
YOMO_SFN_CREDENTIAL=<your-yomo-sfn-credential>
GOOGLE_API_KEY=
GOOGLE_CSE_ID=
```

Other environment variables can be found in the [vivgrid dashboard](https://dashboard.vivgrid.com/) serverless page

## Development

### 1. Install YoMo CLI

```bash
curl -fsSL https://get.yomo.run | sh
```

Detail usages of the cli can be found on [Doc: YoMo CLI](https://yomo.run/docs/cli).

### 2. Attach this function calling to your LLM Bridge

```bash
yomo run app.ts -n llm-tool-web-search
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
        "content": "How did the stock market perform in 2025.1.13?"
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
  "model": "gpt-4o-2024-08-06",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "On January 13, 2025, the stock market experienced mixed performances. The Dow Jones Industrial Average rose by 0.9%, while the S\u0026P 500 rebounded from earlier losses to close up 0.2%. However, the Nasdaq Composite fell 0.4%. The tech sector, particularly chip stocks, weighed down on the markets. Concerns were prevalent about the Federal Reserve's next move on interest rates, especially after a strong jobs report earlier raised doubts about potential rate cuts. The market dynamics were also influenced by pending economic data on inflation and the Consumer Price Index scheduled for that week."
      },
      "finish_reason": "stop",
      "content_filter_results": {
        "hate": {
          "filtered": false,
          "severity": "safe"
        },
        "self_harm": {
          "filtered": false,
          "severity": "safe"
        },
        "sexual": {
          "filtered": false,
          "severity": "safe"
        },
        "violence": {
          "filtered": false,
          "severity": "safe"
        },
        "jailbreak": {
          "filtered": false,
          "detected": false
        },
        "profanity": {
          "filtered": false,
          "detected": false
        }
      }
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
  "prompt_filter_results": [
    {
      "index": 0,
      "content_filter_results": {
        "hate": {
          "filtered": false,
          "severity": "safe"
        },
        "self_harm": {
          "filtered": false,
          "severity": "safe"
        },
        "sexual": {
          "filtered": false,
          "severity": "safe"
        },
        "violence": {
          "filtered": false,
          "severity": "safe"
        },
        "jailbreak": {
          "filtered": false,
          "detected": false
        },
        "profanity": {
          "filtered": false,
          "detected": false
        }
      }
    }
  ]
}
```
