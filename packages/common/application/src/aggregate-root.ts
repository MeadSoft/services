import { Entity } from '@meadsoft/common';
import { DomainEvent } from './events/domain-event';

export abstract class AggregateRoot extends Entity {
    private domainEvents: DomainEvent[] = [];

    protected addDomainEvent(event: DomainEvent): void {
        this.domainEvents.push(event);
    }

    public getDomainEvents(): DomainEvent[] {
        return [...this.domainEvents];
    }

    public clearDomainEvents(): void {
        this.domainEvents = [];
    }
}
