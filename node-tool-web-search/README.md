# LLM Function Calling - Web Search

This is a serverless function for web searching.

You can obtain your `GOOGLE_API_KEY` and `GOOGLE_CSE_ID` by following this [article](https://stackoverflow.com/questions/37083058/programmatically-searching-google-in-python-using-custom-search), then, add it to your `.env` file:

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
  -H "Authorization: Bearer EBozCjNiuxkpSHs.QJoVuDViUBpKIfhiZycfVpSCuMYpIE" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "How did the stock market perform today?"
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
    "prompt_tokens": 708,
    "completion_tokens": 137,
    "total_tokens": 730,
    "prompt_tokens_details": null,
    "completion_tokens_details": null
  },
  "system_fingerprint": "fp_04751d0b65",
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
