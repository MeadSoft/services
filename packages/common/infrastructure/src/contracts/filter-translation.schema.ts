import { IFilter, NotImplementedException } from '@meadsoft/common';
import { Result } from 'ts-results';

export interface IFilterTranslationService<
    TFilterImpl = unknown,
    TTableImpl = unknown,
> {
    translate(
        filters: IFilter[] | null,
        tables?: TTableImpl[],
    ): Result<TFilterImpl | undefined, Error>;
}

/**
 * Dummy class intended to be used only for a token during dependency injection
 */
export class FilterTranslationService implements IFilterTranslationService {
    translate(): Result<unknown, Error> {
        throw new NotImplementedException();
    }
}
