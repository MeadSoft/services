import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IEntity } from '@meadsoft/common-server';
import { ChangeHistoryService } from './change-history.service';

@Injectable()
export class EntityService {
    constructor(private readonly changeHistoryService: ChangeHistoryService) {}

    createId(): string {
        return uuidv4();
    }

    initialize(userId: string, entity: IEntity): void {
        entity.id = this.createId();
        this.changeHistoryService.initialize(userId, entity);
    }
}
