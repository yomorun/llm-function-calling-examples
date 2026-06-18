# YoMo LLM Function Calling Examples

This repository contains TypeScript and Go examples for YoMo LLM function calling.

Examples are grouped by language:

- `ts/`: TypeScript tools
- `go/`: Go tools

Each example exports a description, typed arguments, and a handler that YoMo can expose as an LLM callable tool.

## Examples

### Weather and Location

| Example | Language | Description |
| --- | --- | --- |
| [get-weather](./ts/get-weather) | TypeScript | Get current weather by city and coordinates with OpenWeatherMap. |
| [get-weather-google-api](./ts/get-weather-google-api) | TypeScript | Get current weather for an address with Google Geocoding and Weather APIs. |
| [get-weather](./go/get-weather) | Go | Get current weather by city and coordinates with OpenWeatherMap. |
| [get-utc-time](./ts/get-utc-time) | TypeScript | Return the current UTC time. |
| [get-utc-time](./go/get-utc-time) | Go | Return the current UTC time. |
| [timezone-calculator](./go/timezone-calculator) | Go | Convert a time between IANA time zones. |

### Finance and Data

| Example | Language | Description |
| --- | --- | --- |
| [currency-converter](./ts/currency-converter) | TypeScript | Convert USD to another currency with ExchangeRate API. |
| [currency-converter](./go/currency-converter) | Go | Convert USD to another currency with Open Exchange Rates. |

### Web Search and Network

| Example | Language | Description |
| --- | --- | --- |
| [exa-web-search](./ts/exa-web-search) | TypeScript | Search the web with Exa. |
| [google-web-search](./ts/google-web-search) | TypeScript | Search with Google Custom Search and extract page content. |
| [tavily-web-search](./ts/tavily-web-search) | TypeScript | Search current web content with Tavily. |
| [duckduckgo-web-search](./ts/duckduckgo-web-search) | TypeScript | Search current web content with DuckDuckGo. |
| [get-ip-and-latency](./ts/get-ip-and-latency) | TypeScript | Resolve a domain and measure latency. |
| [get-ip-and-latency](./go/get-ip-and-latency) | Go | Resolve a domain and measure latency with ping. |

### Communication

| Example | Language | Description |
| --- | --- | --- |
| [autosend](./ts/autosend) | TypeScript | Send text, HTML, or template email with AutoSend. |
| [send-mail-smtp](./ts/send-mail-smtp) | TypeScript | Send email with SMTP and nodemailer. |
| [send-mail-resend](./ts/send-mail-resend) | TypeScript | Send email with Resend. |
| [send-mail-smtp](./go/send-mail-smtp) | Go | Send email with SMTP. |
| [send-mail-resend](./go/send-mail-resend) | Go | Send email with Resend. |

### Database

| Example | Language | Description |
| --- | --- | --- |
| [postgres-db](./ts/postgres-db) | TypeScript | Query and manage PostgreSQL tables. |

## YoMo Usage

### 1. Install YoMo CLI

```bash
curl -fsSL https://get.yomo.run | sh
```

Detailed CLI usage is available in the YoMo CLI documentation: https://yomo.run/docs/cli

### 2. Configure the LLM Bridge

Create a `yomo.yml` file:

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

### 3. Start the LLM Bridge

Run this from the directory that contains `yomo.yml`:

```bash
yomo serve -c ./yomo.yml
```

### 4. Run a Function

Open another terminal, enter one example directory, set any environment variables required by that example, and run it:

```bash
cd ts/get-weather
OPENWEATHERMAP_API_KEY=<your-openweathermap-api-key> yomo run -n get-weather
```

For Go examples, use the same pattern:

```bash
cd go/get-weather
OPENWEATHERMAP_API_KEY=<your-openweathermap-api-key> yomo run -n get-weather
```

Each subdirectory README lists only the environment variables required by that specific example.

### 5. Send a Chat Completion Request

Call the local HTTP API exposed by `yomo serve`:

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

YoMo routes the request to the LLM provider, exposes the running functions as tools, invokes the matching function, and returns the final assistant response.

## Function Shape

TypeScript examples use this shape:

```typescript
export const description = 'Get current weather for a city'

export type Argument = {
  city: string
  latitude: number
  longitude: number
}

export async function handler(args: Argument) {
  return weatherData
}
```

Go examples use this shape:

```go
const Description = "Get current weather for a city"

type Arguments struct {
	City      string  `json:"city"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type Result struct {
	Weather any `json:"weather"`
}

func Handler(args Arguments) (Result, error) {
	return Result{Weather: weatherData}, nil
}
```
