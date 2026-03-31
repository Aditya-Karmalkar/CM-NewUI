# Bytez AI Integration

This service integrates the Bytez API for AI chat functionality in CuraMind.

## Setup

1. The Bytez API key is stored in `.env` file:
   ```
   REACT_APP_BYTEZ_API_KEY=your_api_key_here
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Available Models

The following free open-source models are verified and available through Bytez:

### Qwen (Alibaba) - Excellent multilingual support
- **Qwen 2.5 7B** - Best balance of power and speed (Default)
- **Qwen 2.5 3B** - Fast and efficient
- **Qwen 2.5 1.5B** - Very fast, good for simple queries
- **Qwen 2.5 0.5B** - Ultra-fast, lightweight

### Llama (Meta) - Strong general reasoning
- **Llama 3.2 3B** - Efficient and capable
- **Llama 3.2 1B** - Lightweight and fast

### Mistral AI - Great balance of performance and efficiency
- **Mistral 7B v0.3** - Efficient and reliable

### Gemma (Google) - Efficient and fast
- **Gemma 2 9B** - Larger, more capable
- **Gemma 2 2B** - Fast and efficient

### Phi (Microsoft) - Small but powerful
- **Phi 3.5 Mini** - Latest version, very capable
- **Phi 3 Mini** - Compact and efficient

## Usage

### Import the service

```javascript
import { sendChatMessage, AVAILABLE_MODELS } from '../services/bytezService';
```

### Send a chat message

```javascript
const messages = [
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'Hello!' }
];

const { error, output } = await sendChatMessage(messages, 'Qwen 2.5 7B');

if (!error) {
  console.log('Response:', output);
}
```

## Model Selection Guide

- **For general health questions**: Use Qwen 2.5 7B (default) or Gemma 2 9B
- **For quick responses**: Use Qwen 2.5 1.5B, Llama 3.2 1B, or Phi 3 Mini
- **For complex queries**: Use Qwen 2.5 7B or Gemma 2 9B
- **For fastest responses**: Use Qwen 2.5 0.5B or Llama 3.2 1B

## API Documentation

For more information about Bytez API, visit: https://bytez.com/docs
