import { Injectable } from '@nestjs/common';
import { IChangeHistory, IUpdateHistory } from '../../../http-server/src';

@Injectable()
export class ChangeHistoryService {
    initialize<TOutput extends IChangeHistory>(
        userId: string,
        item: TOutput,
    ): TOutput {
        item.createdById = userId;
        item.createdDate = new Date().toISOString();
        item.updatedById = userId;
        item.updatedDate = new Date().toISOString();
        return item;
    }

    create(userId: string): IChangeHistory {
        return {
            createdById: userId,
            createdDate: new Date().toISOString(),
            updatedById: userId,
            updatedDate: new Date().toISOString(),
        };
    }

    update<TOutput extends IUpdateHistory>(
        userId: string,
        updates: TOutput,
    ): TOutput {
        updates.updatedDate = new Date().toISOString();
        updates.updatedById = userId;
        return updates;
    }
}
