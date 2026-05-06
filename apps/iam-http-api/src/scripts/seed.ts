import { NestFactory } from '@nestjs/core';
import { ISeedConfig, seedFromFile } from '@meadsoft/common-infrastructure';
import { ERROR_EXIT_CODE } from '@meadsoft/common';
import {
    IamModule,
    PrincipleService,
    // ORGANIZATIONAL_RESOURCES_TABLE_NAME,
    // PERMISSIONS_TABLE_NAME,
    // POLICIES_TABLE_NAME,
    // POLICY_BINDINGS_TABLE_NAME,
    // ROLE_PERMISSIONS_TABLE_NAME,
    // ROLES_TABLE_NAME,
} from '@meadsoft/iam-http-server-nestjs';
import {
    PRINCIPLE_LOGIN_METHODS_RESOURCE_NAME,
    PRINCIPLES_RESOURCE_NAME,
    PrincipleLoginMethodSchema,
    PrincipleSchema,
} from '@meadsoft/iam-contracts';
import { PrincipleLoginMethodService } from '@meadsoft/iam-http-server-nestjs';

const seedFileName = `seeds/backup-2026-01-17T14.36.29.427Z.json`;

async function main() {
    const app = await NestFactory.createApplicationContext(IamModule);

    const seedConfigs: ISeedConfig[] = [
        {
            tableName: PRINCIPLES_RESOURCE_NAME,
            crudService: app.get(PrincipleService),
            schema: PrincipleSchema,
        },
        {
            tableName: PRINCIPLE_LOGIN_METHODS_RESOURCE_NAME,
            crudService: app.get(PrincipleLoginMethodService),
            schema: PrincipleLoginMethodSchema,
        },
        // {
        //     tableName: ROLES_TABLE_NAME,
        //     crudService: null,
        //     schema: null,
        // },
        // { tableName: ORGANIZATIONAL_RESOURCES_TABLE_NAME, crudService: null, schema: null }
        // { tableName: ROLES_TABLE_NAME, crudService: null, schema: null }
        // { tableName: PERMISSIONS_TABLE_NAME, crudService: null, schema: null }
        // { tableName: POLICIES_TABLE_NAME, crudService: null, schema: null }
        // { tableName: POLICY_BINDINGS_TABLE_NAME, crudService: null, schema: null }
        // { tableName: ROLE_PERMISSIONS_TABLE_NAME, crudService: null, schema: null }
    ];

    await seedFromFile(seedConfigs, seedFileName);
    await app.close();
}

main().catch((error: unknown) => {
    console.error('✗ Seeding failed:', error);
    process.exit(ERROR_EXIT_CODE);
});
