# PostgreSQL Database Tool for LLM Function Calling

This tool allows LLMs to interact with PostgreSQL databases through function calling. It supports the following operations:

- Execute read-only SQL queries
- Create new tables
- Insert data
- Update data
- Delete data
- Delete tables
- List all tables
- Get table schema information

## Environment Variables Setup

Before running this tool, create a `.env` file and set the following environment variables:

```
YOMO_SFN_NAME=postgres-db-tool
YOMO_SFN_ZIPPER="zipper.vivgrid.com:9000"
YOMO_SFN_CREDENTIAL=<your-yomo-sfn-credential>

# PostgreSQL database connection URL
DATABASE_URL=postgres://username:password@localhost:5432/database_name
```

## Installation

```bash
npm install
```

## Running

### 1. Install YoMo CLI

```bash
curl -fsSL https://get.yomo.run | sh
```

Detailed CLI usage instructions can be found in the [YoMo CLI documentation](https://yomo.run/docs/cli).

### 2. Run the function

```bash
yomo run app.ts -n postgres-db-tool
```

## Function Call Examples

Here are some examples of how to use this tool:

```bash
curl --request POST \
  --url https://api.vivgrid.com/v1/chat/completions \
  --header 'Authorization: Bearer <YOUR_TOKEN>' \
  --header 'content-type: application/json' \
  --data '{
  "messages": [
    {
      "role": "assistant",
      "content": "tell me how many tables in my centre database"
    }
  ]
}'
```

You will get following result:

```json
{
  "id": "chatcmpl-B9M9aiAAv0Q3rf6LxxUFxphuAVPsC",
  "object": "chat.completion",
  "created": 1741569810,
  "model": "gpt-4o-2024-08-06",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Your \"centre\" database contains 5 tables."
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
    "prompt_tokens": 164,
    "completion_tokens": 45,
    "total_tokens": 117,
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "cached_tokens": 0
    },
    "completion_tokens_details": {
      "audio_tokens": 0,
      "reasoning_tokens": 0
    }
  },
  "system_fingerprint": "fp_b705f0c291",
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
}
```

## Security Considerations

- Ensure the database user has only necessary permissions
- Consider using a read-only user for query operations
- In production environments, don't hardcode database credentials directly in the code
- Consider using connection pool limits and timeout settings to prevent resource exhaustion
