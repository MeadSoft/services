import { DomainEvent } from './domain-event';
import { IDomainEventPublisher } from './domain-event-publisher';

export class InMemoryEventPublisher implements IDomainEventPublisher {
    private readonly handlers: Map<
        string,
        Array<(event: DomainEvent) => void>
    > = new Map();

    subscribe(eventName: string, handler: (event: DomainEvent) => void): void {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, []);
        }
        const handlers = this.handlers.get(eventName);
        if (!handlers) return;
        handlers.push(handler);
    }

    async publish(event: DomainEvent): Promise<void> {
        const eventName = event.getEventName();
        const handlers = this.handlers.get(eventName) ?? [];
        for (const handler of handlers) {
            try {
                await Promise.resolve(() => {
                    handler(event);
                });
            } catch (error) {
                console.error(`Error handling event ${eventName}:`, error);
            }
        }
    }

    async publishAll(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            await this.publish(event);
        }
    }
}
