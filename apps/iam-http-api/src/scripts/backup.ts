import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import {
    IBackupConfig,
    backupRepositories,
    InfrastructureConfig,
} from '@meadsoft/common-infrastructure';
import { ERROR_EXIT_CODE, SUCCESS_EXIT_CODE } from '@meadsoft/common';
import { IamModule } from '@meadsoft/iam-http-server-nestjs';

async function main() {
    const app = await NestFactory.create(IamModule);
    const config = app.get(InfrastructureConfig);
    const repositories: IBackupConfig[] = [];
    await backupRepositories(
        config,
        repositories,
        join(__dirname, '..', 'backups'),
    );
    await app.close();
    process.exit(SUCCESS_EXIT_CODE);
}

// Run the backup
main().catch((error: unknown) => {
    console.error('Backup failed:', error);
    process.exit(ERROR_EXIT_CODE);
});
