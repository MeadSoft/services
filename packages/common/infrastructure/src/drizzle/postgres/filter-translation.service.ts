import { Injectable } from '@nestjs/common';
import { SQL } from 'drizzle-orm';
import { IFilterTranslationService } from '../../contracts/filter-translation.schema';

@Injectable()
export class DrizzlePgFilterTranslationService implements IFilterTranslationService<SQL> {
    translate(): SQL | undefined {
        return undefined;
    }
}
