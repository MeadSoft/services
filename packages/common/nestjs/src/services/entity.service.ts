import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { IEntity } from '@meadsoft/common';
import { ChangeHistoryService } from './change-history.service';

@Injectable()
export class EntityService {
    constructor(private readonly changeHistoryService: ChangeHistoryService) {}

    createId(): string {
        return uuidv7();
    }

    initialize(userId: string, entity: IEntity): void {
        entity.id = this.createId();
        this.changeHistoryService.initialize(userId, entity);
    }
}
