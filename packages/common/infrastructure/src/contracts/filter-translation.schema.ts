import { IFilter, NotImplementedException } from '../../../http-server/src';

export interface IFilterTranslationService<TFilterImpl = unknown> {
    translate(...filters: IFilter[]): TFilterImpl | undefined;
}

/**
 * Dummy class intended to be used only for a token during dependency injection
 */
export class FilterTranslationService implements IFilterTranslationService {
    translate(): unknown {
        throw new NotImplementedException();
    }
}
