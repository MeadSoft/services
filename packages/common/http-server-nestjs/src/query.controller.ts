import { Get, Param, Type } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { validateUuid, Entity, IQueryService, IFilter } from '@meadsoft/common';
import { InvalidIDException } from '@meadsoft/common-nestjs';

export function createQueryController<TModel extends Entity>(
    model: Type<TModel>,
    serviceName: string,
    resourceName: string,
) {
    class QueryController {
        constructor(public readonly service: IQueryService<TModel>) {}

        @Get(':id')
        @ApiOkResponse({ type: model })
        async findById(@Param('id') id: string): Promise<TModel | null> {
            if (validateUuid(id) === false) {
                throw new InvalidIDException();
            }
            const idFilter: IFilter = {
                service: serviceName,
                resource: resourceName,
                field: 'id',
                operator: 'eq',
                value: id,
            };
            const item = await this.service.findFirst([idFilter]);
            if (item === null) {
                return null;
            }
            return item;
        }

        @Get()
        @ApiOkResponse({ type: model, isArray: true })
        async findAll(): Promise<TModel[]> {
            return await this.service.findMany(null);
        }
    }

    return QueryController;
}
