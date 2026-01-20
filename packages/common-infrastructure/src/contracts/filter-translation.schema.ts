import { IFilter, NotImplementedException } from '@meadsoft/common';

export interface IFilterTranslationService<TFilterImpl = unknown> {
    translate(...filters: IFilter[]): TFilterImpl;
}

/**
 * Dummy class intended to be used only for a token during dependency injection
 */
export class FilterTranslationService implements IFilterTranslationService {
    translate(): unknown {
        throw new NotImplementedException();
    }
}
