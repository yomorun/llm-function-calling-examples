# LLM Function Calling - Get UTC time

This is a serverless function for getting current UTC time

```sh
YOMO_SFN_NAME=my_first_llm_function_tool
YOMO_SFN_ZIPPER=zipper.vivgrid.com:9000
YOMO_SFN_CREDENTIAL=<your-yomo-sfn-credential>
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
yomo run -n llm-tool-get-utc-time
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
        "role": "assistant",
        "content": "What is the time right now?"
      }
    ]
  }'
```

You may get response like:

```json
{
  "id": "chatcmpl-B29pH0TAOJWE3P9YwW755Hbg1m2Mf",
  "object": "chat.completion",
  "created": 1739854127,
  "model": "gpt-4o-2024-08-06",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The current time in UTC is 04:48 on February 18, 2025."
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
    "prompt_tokens": 118,
    "completion_tokens": 33,
    "total_tokens": 95,
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
          "filtered": false
        },
        "self_harm": {
          "filtered": false
        },
        "sexual": {
          "filtered": false
        },
        "violence": {
          "filtered": false
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
}```
