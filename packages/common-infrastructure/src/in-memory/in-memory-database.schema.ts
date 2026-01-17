export class InMemoryTransaction {
    db: InMemoryDatabase;

    constructor(db: InMemoryDatabase) {
        this.db = db;
    }
}

export class InMemoryDatabase {
    db: Record<string, object>;

    constructor() {
        this.db = {} as Record<string, object>;
    }

    async transaction<TResult>(
        work: (transaction: InMemoryTransaction) => Promise<TResult>,
    ): Promise<TResult> {
        const transaction = new InMemoryTransaction(this);
        return await work(transaction);
    }
}
