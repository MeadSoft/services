import { Module } from '@nestjs/common';
import { SaltingService } from '@meadsoft/common-server';
import { EntityService } from './services/entity.service';
import { ChangeHistoryService } from './services/change-history.service';

@Module({
    providers: [EntityService, ChangeHistoryService, SaltingService],
    exports: [EntityService, ChangeHistoryService, SaltingService],
})
export class CommonModule {}
