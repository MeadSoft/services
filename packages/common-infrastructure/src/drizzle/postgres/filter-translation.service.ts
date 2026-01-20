import { Injectable } from '@nestjs/common';
import { SQL } from 'drizzle-orm';
import { IFilterTranslationService } from 'src/contracts/filter-translation.schema';

@Injectable()
export class DrizzlePgFilterTranslationService implements IFilterTranslationService<SQL> {
    translate(): SQL {
        return new SQL([undefined]);
    }
}
