# LLM Function Calling - Send Email with Resend (Go)

This is a serverless function for sending emails using Resend, implemented in Go.

## Prerequisites

### 1. Environment Variables

```sh
YOMO_SFN_NAME=my_first_llm_function_tool
YOMO_SFN_ZIPPER=zipper.vivgrid.com:9000
YOMO_SFN_CREDENTIAL=<your-yomo-sfn-credential>
```

You can find other environment variables in the serverless page of [vivgrid dashboard](https://dashboard.vivgrid.com/).

### 2. Resend API Key

1. Sign up for a [Resend](https://resend.com) account
2. Get your API key
3. Add the API key to your `.env` file:

```bash
FROM_EMAIL=your-email@resend.dev
RESEND_API_KEY=<your-resend-api-key>
```

## Development

### 1. Install YoMo CLI

```bash
curl -fsSL https://get.yomo.run | sh
```

For detailed CLI usage, check [Doc: YoMo CLI](https://yomo.run/docs/cli).

### 2. Install Dependencies

```bash
go mod download
```

### 3. Test the Function

You can test the email sending functionality with the following curl command:

```bash
curl --request POST \
  --url https://api.vivgrid.com/v1/chat/completions \
  --header 'Authorization: Bearer <token>' \
  --header 'content-type: application/json' \
  --data '{
  "messages": [
    {
      "role": "assistant",
      "content": "send an email to mark@example.com, tell him I will attend the meeting"
    }
  ]
}'
```

### 4. Connect Function to LLM Bridge

```bash
yomo run main.go -n my_first_llm_function_tool
```