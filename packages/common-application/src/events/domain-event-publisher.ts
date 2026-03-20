import { NotImplementedException } from '@meadsoft/common-server';
import { DomainEvent } from './domain-event';

export interface IDomainEventPublisher {
    publish(event: DomainEvent): Promise<void>;
    publishAll(events: DomainEvent[]): Promise<void>;
}

export class DomainEventPublisher implements IDomainEventPublisher {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async publish(_event: DomainEvent): Promise<void> {
        await Promise.reject(new NotImplementedException());
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async publishAll(_events: DomainEvent[]): Promise<void> {
        await Promise.reject(new NotImplementedException());
    }
}
