import { Get, Param, Type } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
    validateUuid,
    InvalidIDException,
    Entity,
    IQueryService,
} from '@meadsoft/common';

export function createQueryController<TModel extends Entity>(
    model: Type<TModel>,
) {
    class QueryController {
        constructor(public readonly service: IQueryService<TModel>) {}

        @Get(':id')
        @ApiOkResponse({ type: model })
        async findById(@Param('id') id: string): Promise<TModel | null> {
            if (validateUuid(id) === false) {
                throw new InvalidIDException();
            }
            const item = await this.service.findOne(id);
            if (item === null) {
                return null;
            }
            return item;
        }

        @Get()
        @ApiOkResponse({ type: model, isArray: true })
        async findAll(): Promise<TModel[]> {
            return await this.service.findMany();
        }
    }

    return QueryController;
}
