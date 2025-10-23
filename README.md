# 🚀 YoMo LLM Function Calling Examples

**Build powerful AI agents with the best open-source serverless function calling framework.**

This repository showcases real-world examples of LLM Function Calling using [YoMo](https://github.com/yomorun/yomo) - the fastest, most developer-friendly way to create serverless functions that your AI agents can call.

## Why YoMo for AI Agent Development?

### 🎯 **Built for AI Agents**
- **Type-Safe Development**: Write functions in TypeScript or Go with full type safety
- **LLM-Ready**: Functions automatically generate JSON schemas for seamless LLM integration
- **Real-Time Performance**: Ultra-low latency for responsive AI interactions

### 🔄 **Write Once, Run Anywhere**
- **Multi-Model Support**: Works with OpenAI, Claude, Llama, Mistral, Azure OpenAI, and more
- **Provider Flexibility**: Switch between LLM providers without changing your functions
- **No Vendor Lock-in**: Deploy on any cloud or self-host

### ⚡ **Developer Experience**
```bash
# Install YoMo CLI
curl -fsSL https://get.yomo.run | sh

# Run any example
cd node-tool-get-weather
yomo run -n get-weather
```

### 🌍 **Production Ready**
- **Geo-Distributed**: Deploy globally for low latency worldwide
- **Auto-Scaling**: Handle any load automatically  
- **Self-Hosting**: Full control over your infrastructure

## Quick Start

**Try it in 2 minutes:**

1. **Clone and run an example:**
```bash
git clone https://github.com/yomorun/llm-function-calling-examples.git
cd llm-function-calling-examples/node-tool-get-weather
yomo run -n get-weather
```

2. **Test with your LLM:**

You can grab a free account on [vivgrid.com](https://console.vivgrid.com) to build your AI Agent:

```bash
curl https://api.vivgrid.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-vivgrid.com-token>" \
  -d '{
    "messages": [{"role": "user", "content": "What's the weather in Tokyo?"}]
  }'
```

That's it! Your AI agent now has weather capabilities.

## 📚 Function Examples

Explore real-world serverless functions organized by category:

### 🌦️ **Weather & Location**
| Function | Language | Description |
|----------|----------|-------------|
| [node-tool-get-weather](./node-tool-get-weather) | TypeScript | Get weather by city using OpenWeatherMap API |
| [node-tool-get-weather-google-api](./node-tool-get-weather-google-api) | TypeScript | Get weather using Google Weather API |
| [golang-tool-get-weather](./golang-tool-get-weather) | Go | Weather information with geo-coordinates |
| [node-tool-get-utc-time](./node-tool-get-utc-time) | TypeScript | Get UTC time by city name |
| [golang-tool-get-utc-time](./golang-tool-get-utc-time) | Go | UTC time lookup |
| [golang-tool-timezone-calculator](./golang-tool-timezone-calculator) | Go | Calculate timezone for specific time |

### 💰 **Financial & Data**
| Function | Language | Description |
|----------|----------|-------------|
| [node-tool-currency-converter](./node-tool-currency-converter) | TypeScript | Real-time currency conversion |
| [golang-tool-currency-converter](./golang-tool-currency-converter) | Go | Currency calculator with live rates |

### 🔍 **Web Search & Network**
| Function | Language | Description |
|----------|----------|-------------|
| [node-tool-google-web-search](./node-tool-google-web-search) | TypeScript | Search using Google Custom Search |
| [node-tool-tavily-web-search](./node-tool-tavily-web-search) | TypeScript | Web search via [Tavily](https://tavily.com/) |
| [node-tool-duckduckgo-web-search](./node-tool-duckduckgo-web-search) | TypeScript | Privacy-focused DuckDuckGo search |
| [node-tool-get-ip-and-latency](./node-tool-get-ip-and-latency) | TypeScript | Get IP and latency for websites |
| [golang-tool-get-ip-and-latency](./golang-tool-get-ip-and-latency) | Go | Network diagnostics with ping |

### 📧 **Communication**
| Function | Language | Description |
|----------|----------|-------------|
| [node-tool-send-mail-smtp](./node-tool-send-mail-smtp) | TypeScript | Send email via SMTP with nodemailer |
| [node-tool-send-mail-resend](./node-tool-send-mail-resend) | TypeScript | Modern email via [Resend](https://resend.com/) API |
| [golang-tool-send-mail-smtp](./golang-tool-send-mail-smtp) | Go | Email sending with Go SMTP |
| [golang-tool-send-mail-resend](./golang-tool-send-mail-resend) | Go | Resend integration for Go |

### 🗄️ **Database**
| Function | Language | Description |
|----------|----------|-------------|
| [node-tool-postgres-db](./node-tool-postgres-db) | TypeScript | PostgreSQL database operations |

## 💡 How It Works

Each example demonstrates the YoMo pattern:

**TypeScript Functions:**
```typescript
// 1. Define what your function does
export const description = 'Get current weather for a city'

// 2. Define typed arguments
export type Argument = {
  city: string
  latitude: number
  longitude: number
}

// 3. Implement your logic
export async function handler(args: Argument) {
  // Your AI agent logic here
  return weatherData
}
```

**Go Functions:**
```go
// 1. Describe the function
func Description() string {
  return "Get current weather for a city"
}

// 2. Define schema
type LLMArguments struct {
  City      string  `json:"city"`
  Latitude  float64 `json:"latitude"`
  Longitude float64 `json:"longitude"`  
}

// 3. Handle requests
func Handler(ctx serverless.Context) {
  // Your AI agent logic here
}
```

## 🚀 Next Steps

### 🏗️ **Build Your Own Function**
```bash
# Create new function from template
yomo init my-awesome-function

# Run locally
yomo run
```

### 🌐 **Deploy Anywhere**

**☁️ Managed Cloud**: Use [VivGrid](https://console.vivgrid.com/) for instant deployment with global edge locations.

**🏠 Self-Host**: Deploy on your own infrastructure:
- [Self-Hosting Guide](https://yomo.run/docs/self-hosting) - Full control over your deployment
- [Geo-distributed Setup](https://yomo.run/docs/glossary) - Multi-region for global performance
- Kubernetes, Docker, or bare metal support

### 📖 **Resources**
- **[YoMo Documentation](https://yomo.run/docs)** - Complete guides and API reference
- **[LLM Providers](https://yomo.run/docs/llm-providers)** - Integrate with any LLM
- **[GitHub](https://github.com/yomorun/yomo)** - Star us and contribute!

---

**Ready to build the future of AI agents?** Start with YoMo today! 🎉

[![GitHub stars](https://img.shields.io/github/stars/yomorun/yomo?style=social)](https://github.com/yomorun/yomo)
[![Documentation](https://img.shields.io/badge/docs-yomo.run-blue)](https://yomo.run/docs)
[![Discord](https://img.shields.io/discord/770589787404640267?label=discord&logo=discord)](https://discord.gg/CTH3wv9)
