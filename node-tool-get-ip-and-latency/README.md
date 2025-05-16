# LLM Function Calling - Get IP and Latency

This is a serverless function for getting IP and Latency info.

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
yomo run -n llm-tool-get-ip-and-latency
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
        "content": "Compare the website speed of Puma and Nike. Please provide a concise answer."
      }
    ]
  }'
```

You may get response like:

```json
{
  "id": "chatcmpl-B27HtaKk2XrWs5y9p7hf2jNBQLMiJ",
  "object": "chat.completion",
  "created": 1739844369,
  "model": "gpt-4o-2024-08-06",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Puma's website (puma.com) has an IP address of 151.101.194.132 with an average latency of 252.080 ms. Meanwhile, Nike's website (nike.com) has an IP address of 108.157.254.92 with an average latency of 92.155 ms. Therefore, Nike's website is faster compared to Puma's website based on these latency measurements."
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
    "prompt_tokens": 247,
    "completion_tokens": 139,
    "total_tokens": 295,
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
