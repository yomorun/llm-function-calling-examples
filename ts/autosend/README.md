# Overview

Enable your AI agent to generate and send professional emails to customers using [AutoSend](https://autosend.com). This integration allows you to automate transactional emails, notifications, and customer communications with AI-generated content.

# Use Cases

## Dynamic HTML Email Generation

Generate and send custom HTML emails with dynamic content. In this example, we'll send a credit balance notification with a payment link.

<img src="https://cdn.vivgrid.com/p/20251118.0.png" alt="Send email via Autosend on vivgrid" />

```markdown Send html format email wrap
- Write a HTML-formatted email addressed to fan.wei.xiao@gmail.com, referring to the recipient as Vincent Van.
- Inform him that his account credits are nearly depleted (98% used) and he needs to top up promptly to prevent service interruption.
- Include a CTA button that links to: https://checkout.stripe.com/c/pay/cs_livexxxxxx
- The primary theme color should be #33D78E
- The email should be written on behalf of the Acme Customer Success Team
```

**Testing with Alchemist Tool:**

You can test this integration using the [Alchemist Tool](https://alchemist.vivgrid.com):

<img src="https://cdn.vivgrid.com/p/20251118.1.png" alt="Send email via Autosend on vivgrid" />

**Result:**

<img src="https://cdn.vivgrid.com/p/20251118.2.png" alt="Send email via Autosend on vivgrid" />

## Template-Based Email Sending

Send emails using pre-configured templates for consistent branding and messaging.

<img src="https://cdn.vivgrid.com/p/20251118.3.png" alt="Send email via Autosend on vivgrid" />

Using the OpenAI SDK:

```markdown INSTRUCTION wrap
- Send an email to Vincent Fan at fanweixiao+test@gmail.com.
- Use the email template with template ID: A-8389b687e7c7adc3f697.
- The email should be sent on behalf of the Vivgrid Customer Success Team.
- Use #33D78E as the primary theme color.
```

```javascript Send template email icon="square-js" lines
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: 'viv-xxxxxxxxxx',
  baseURL: 'https://api.vivgrid.com/v1',
})

const chatCompletion = await client.chat.completions.create({
  messages: [{ role: 'user', content: INSTRUCTION }],
  stream: true,
})

for await (const chunk of chatCompletion) {
  const content = chunk.choices[0]?.delta?.content
  if (content) {
    console.log(content)
  }
}
```
