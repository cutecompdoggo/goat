# GOAT SDK with LlamaIndex

This example demonstrates how to integrate GOAT SDK with LlamaIndex to create an agent that can perform on-chain operations.

## Prerequisites

Before getting started, make sure you have the following:

- Node.js (v18 or newer)
- pnpm (recommended for monorepo)
- A wallet with funds (you can get testnet funds using faucets)
- RPC Provider URL (from providers like Alchemy, Infura, or QuickNode)
- OpenAI API key

## Setup

1. Clone the repository:

```bash
git clone https://github.com/goat-sdk/goat.git
cd goat
```

2. Install dependencies from the root of the monorepo:

```bash
pnpm install
```

3. Build the packages:

```bash
pnpm build
```

4. Create a `.env` file with your credentials:

```bash
cd typescript/examples/by-framework/llamaindex
cp .env.template .env
```

Add the following values to your `.env` file:

```
WALLET_PRIVATE_KEY=0x... # Your wallet private key (starting with 0x)
RPC_PROVIDER_URL=https://... # Your RPC provider URL
OPENAI_API_KEY=sk-... # Your OpenAI API key
```

## Running the Example

Start the example by running:

```bash
pnpm start
```

You can now interact with the agent by typing prompts. For example:

- "What's my ETH balance?"
- "Send 0.01 ETH to 0x123..."
- "What's my USDC balance?"
- "Help me swap some ETH for USDC"

Type "exit" to quit the application.

## How It Works

This example:

1. Sets up a wallet client using viem
2. Registers GOAT tools with LlamaIndex using the adapter
3. Creates a ReActAgent with the OpenAI LLM and the GOAT tools
4. Provides an interactive chat interface to interact with the agent

The GOAT tools allow the agent to check balances, send tokens, and interact with various protocols directly from the chat interface.

## Dependencies

- `@goat-sdk/adapter-llamaindex`: Connects GOAT SDK with LlamaIndex
- `@goat-sdk/plugin-erc20`: Provides ERC20 token functionality
- `@goat-sdk/wallet-viem`: Wallet implementation using viem
- `llamaindex`: LlamaIndex TypeScript library for building agents
- `viem`: Ethereum library for TypeScript 