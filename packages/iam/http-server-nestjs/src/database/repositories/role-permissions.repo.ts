import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { IamUnitOfWork } from '../iam-database.service';
import { rolePermissionsTable } from '../tables/role-permissions.table';
import type { IRolePermission } from '@meadsoft/iam-contracts';

@Injectable()
export class RolePermissionsRepository {
    constructor(private readonly unitOfWork: IamUnitOfWork) {}

    async findByRoleId(roleId: string): Promise<IRolePermission[]> {
        return this.unitOfWork
            .getDatabase()
            .select()
            .from(rolePermissionsTable)
            .where(eq(rolePermissionsTable.roleId, roleId));
    }

    async createOne(data: IRolePermission): Promise<IRolePermission> {
        const [result] = await this.unitOfWork
            .getDatabase()
            .insert(rolePermissionsTable)
            .values(data)
            .returning();
        return result;
    }

    async deleteOne(roleId: string, permissionId: string): Promise<void> {
        await this.unitOfWork
            .getDatabase()
            .delete(rolePermissionsTable)
            .where(
                and(
                    eq(rolePermissionsTable.roleId, roleId),
                    eq(rolePermissionsTable.permissionId, permissionId),
                ),
            );
    }
}
