import { Body, Delete, Param, Post, Put, Type, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { ZodObject } from 'zod';
import {
    validateUuid,
    InvalidIDException,
    Entity,
    SYSTEM_UUID,
    ICommandService,
} from '@meadsoft/common';

export function createCommandController<TNewModel, TModel extends Entity>(
    model: Type<TModel>,
    newModelSchema: ZodObject,
    modelSchema: ZodObject,
) {
    class CommandController {
        constructor(public service: ICommandService<TNewModel, TModel>) {}

        @Post()
        @UsePipes(new ZodValidationPipe(newModelSchema))
        @ApiCreatedResponse({ type: model })
        async create(@Body() item: TNewModel): Promise<TModel> {
            const result = await this.service.createOne(SYSTEM_UUID, item);
            if (result.err) {
                throw result.val;
            }
            return result.val;
        }

        @Put(':id')
        @UsePipes(new ZodValidationPipe(modelSchema))
        @ApiOkResponse({ type: model })
        async update(
            @Param('id') id: string,
            @Body() updates: TModel,
        ): Promise<TModel | undefined> {
            const result = await this.service.updateOne(
                SYSTEM_UUID,
                id,
                updates,
            );
            if (result.err) {
                throw result.val;
            }
            return result.val;
        }

        @Delete(':id')
        @ApiOkResponse({ type: Boolean })
        async delete(@Param('id') id: string): Promise<boolean> {
            if (validateUuid(id) === false) {
                throw new InvalidIDException();
            }
            const result = await this.service.deleteOne(SYSTEM_UUID, id);
            if (result.err) {
                throw result.val;
            }
            return result.val;
        }
    }

    return CommandController;
}
