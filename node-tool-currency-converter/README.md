# LLM Function Calling - Currency Converter

This is a serverless function for converting currency from USD to other currencies and vice versa.

You can grab your api-key from [Exchange Rate API](https://www.exchangerate-api.com/) for free, then, add it to your `.env` file:

```sh
YOMO_SFN_NAME=currency-converter
YOMO_SFN_ZIPPER=zipper.vivgrid.com:9000
YOMO_SFN_CREDENTIAL=<your-yomo-sfn-credential>
OPENEXCHANGERATES_API_KEY=<your-exchangerate-api.com-api-key>
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
yomo run -n llm-tool-currency-converter
```

### 3. Invoke LLM

Test in your terminal:

```bash
curl https://api.vivgrid.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "I want to buy a book that costs JPY 1,000. I have $8. Can I afford it?"
      }
    ]
  }'
```

Based on the real time exchange rate, you may get response like:

```json
{
  "id": "chatcmpl-Acss0I5tuh2ibDWr13E2p0X3LHVrG",
  "object": "chat.completion",
  "created": 1733830748,
  "model": "gpt-4o-2024-08-06",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "As of the current exchange rate, $8 is approximately JPY 1,138.60 (using the rate of 1 USD = 142.3246 JPY). Therefore, you can afford the book that costs JPY 1,000."
      },
      "finish_reason": "stop",
    }
  ],
  "usage": {
    "prompt_tokens": 226,
    "completion_tokens": 118,
    "total_tokens": 240,
    "prompt_tokens_details": null,
    "completion_tokens_details": null
  },
  "system_fingerprint": "fp_04751d0b65",
  "prompt_filter_results": []
}
```

## Deploy to Vivgrid

```bash
yc deploy . --env OPENEXCHANGERATES_API_KEY=<your-exchangerate-api.com-api-key>
```
