import * as readline from "node:readline";

import { OpenAI } from "llamaindex";

import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

import { getOnChainTools } from "@goat-sdk/adapter-llamaindex";
import { PEPE, USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";

require("dotenv").config();

// 1. Create a wallet client
const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: baseSepolia,
});

(async (): Promise<void> => {
    // 2. Get on-chain tools for your wallet using the LlamaIndex adapter
    const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [sendETH(), erc20({ tokens: [USDC, PEPE] })],
    });

    // 3. Set up LlamaIndex with OpenAI
    const llm = new OpenAI({
        model: "gpt-4o",
        apiKey: process.env.OPENAI_API_KEY,
    });

    // 4. Create a readline interface to interact with the agent
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // 5. Display available tools
    console.log("Available blockchain tools:");
    tools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name}: ${tool.description}`);
    });
    console.log("\n");

    // 6. Run the interactive loop
    while (true) {
        const query = await new Promise<string>((resolve) => {
            rl.question('Enter your prompt (or "exit" to quit): ', resolve);
        });

        if (query.toLowerCase() === "exit") {
            rl.close();
            break;
        }

        try {
            // Generate a response using the LLM
            const prompt = `You are a helpful financial assistant with access to blockchain tools.
The user has access to the following tools:
${tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}

User query: ${query}

Provide a helpful response explaining how to solve this task using the available tools. Include specific details about which tool to use and what parameters to provide.`;

            const response = await llm.complete({
                prompt,
            });

            console.log("Assistant:", response.text);

            // Ask which tool to use
            const toolChoice = await new Promise<string>((resolve) => {
                rl.question('Which tool would you like to use? (enter tool number or "none"): ', resolve);
            });

            if (toolChoice.toLowerCase() !== "none") {
                const toolIndex = parseInt(toolChoice) - 1;
                if (isNaN(toolIndex) || toolIndex < 0 || toolIndex >= tools.length) {
                    console.log("Invalid tool selection.");
                    continue;
                }

                const selectedTool = tools[toolIndex];
                console.log(`Using tool: ${selectedTool.name}`);
                    
                // Get parameters for the tool
                const paramsInput = await new Promise<string>((resolve) => {
                    rl.question('Enter parameters as JSON: ', resolve);
                });
                
                try {
                    const params = JSON.parse(paramsInput);
                    const result = await selectedTool.invoke(params);
                    console.log("Tool result:", result);
                } catch (e) {
                    console.error("Error parsing or executing with parameters:", e);
                }
            }
        } catch (error) {
            console.error("Error processing your request:", error);
        }
    }
})(); 