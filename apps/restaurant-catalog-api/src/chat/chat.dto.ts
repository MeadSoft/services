import { z } from 'zod';

export const ChatMessageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
});

export const ChatRequestSchema = z.object({
    messages: z.array(ChatMessageSchema).min(1),
    chatbotType: z.string().default('menu'),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
