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
        "content": "How did the stock market perform today?"
      }
    ]
  }'
```

Based on the real time weather ifo, you may get response like:

```json
{"id":"chatcmpl-B0TzKPnHZm6mjSdS7I0Eiyu1zf3Fi","object":"chat.completion","created":1739454974,"model":"gpt-4o-2024-08-06","choices":[{"index":0,"message":{"role":"assistant","content":"Today, October 26, 2023, the stock market experienced declines. The S\u0026P 500 fell by approximately 1.2%, coming close to a correction as it digested stronger-than-expected U.S. GDP data. Meanwhile, the tech-heavy Nasdaq Composite declined around 1.8%, marking its most significant two-day drop since December 2022, primarily influenced by weaker-than-expected cloud sales growth from Alphabet. The Dow Jones Industrial Average dropped 0.8% as well. Overall, the S\u0026P 500 lost 60.91 points (1.4%) to close at 4,186.77, and the Nasdaq plunged by 318.65 points (2.4%) to 12,821.22. The Dow Jones fell by 105.45 points (0.3%) to close at 33,035.93.\n\nThe market's performance was influenced by economic data showing a 4.9% annualized GDP growth rate in the third quarter and heightened concerns over interest rates as Treasury yields climbed."},"finish_reason":"stop","content_filter_results":{"hate":{"filtered":false,"severity":"safe"},"self_harm":{"filtered":false,"severity":"safe"},"sexual":{"filtered":false,"severity":"safe"},"violence":{"filtered":false,"severity":"safe"},"jailbreak":{"filtered":false,"detected":false},"profanity":{"filtered":false,"detected":false}}}],"usage":{"prompt_tokens":4665,"completion_tokens":239,"total_tokens":4788,"prompt_tokens_details":{"audio_tokens":0,"cached_tokens":0},"completion_tokens_details":{"audio_tokens":0,"reasoning_tokens":0}},"system_fingerprint":"fp_f3927aa00d","prompt_filter_results":[{"index":0,"content_filter_results":{"hate":{"filtered":false,"severity":"safe"},"self_harm":{"filtered":false,"severity":"safe"},"sexual":{"filtered":false,"severity":"safe"},"violence":{"filtered":false,"severity":"safe"},"jailbreak":{"filtered":false,"detected":false},"profanity":{"filtered":false,"detected":false}}}]}
```
