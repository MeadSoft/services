export abstract class DomainEvent {
    public readonly occurredOn: Date;
    public readonly eventVersion: number;

    constructor() {
        this.occurredOn = new Date();
        this.eventVersion = 1;
    }

    abstract getAggregateId(): string;
    abstract getEventName(): string;
}
