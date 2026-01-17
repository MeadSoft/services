import { IFilter, NotImplementedException } from '@meadsoft/common';
import { Injectable } from '@nestjs/common';
import { SQL } from 'drizzle-orm';
import { IFilterTranslationService } from 'src/contracts/filter-translation.schema';

@Injectable()
export class DrizzlePgFilterTranslationService implements IFilterTranslationService<SQL> {
    translate(...filters: IFilter[]): SQL[] {
        console.log(filters);
        throw new NotImplementedException();
    }
}
