import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { CHATBOT_REGISTRY } from './chatbot-registry';
import { ChatRequest } from './chat.dto';

@Injectable()
export class ChatService {
    private readonly client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    async *stream(request: ChatRequest): AsyncGenerator<string> {
        const config = CHATBOT_REGISTRY[request.chatbotType];
        if (!config) {
            throw new Error(`Unknown chatbot type: ${request.chatbotType}`);
        }

        const stream = this.client.messages.stream({
            model: 'claude-opus-4-6',
            max_tokens: 1024,
            system: [
                {
                    type: 'text',
                    text: config.systemPrompt,
                    cache_control: { type: 'ephemeral' },
                },
            ],
            messages: request.messages,
        });

        for await (const event of stream) {
            if (
                event.type === 'content_block_delta' &&
                event.delta.type === 'text_delta'
            ) {
                yield event.delta.text;
            }
        }

        const finalMessage = await stream.finalMessage();
        Logger.debug(
            `Chat tokens — input: ${finalMessage.usage.input_tokens}, output: ${finalMessage.usage.output_tokens}, cache_read: ${finalMessage.usage.cache_read_input_tokens ?? 0}`,
            ChatService.name,
        );
    }
}
