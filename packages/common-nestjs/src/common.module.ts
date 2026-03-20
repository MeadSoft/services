import { Module } from '@nestjs/common';
import { EntityService } from './services/entity.service';
import { ChangeHistoryService } from './services/change-history.service';

@Module({
    providers: [EntityService, ChangeHistoryService],
    exports: [EntityService, ChangeHistoryService],
})
export class CommonModule {}
