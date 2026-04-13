import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { ChatRequestSchema } from './chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    @HttpCode(200)
    async chat(@Body() body: unknown, @Res() res: Response): Promise<void> {
        const parsed = ChatRequestSchema.safeParse(body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        try {
            for await (const text of this.chatService.stream(parsed.data)) {
                res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
        } finally {
            res.end();
        }
    }
}
