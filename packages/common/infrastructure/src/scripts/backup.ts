import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import { join } from 'path';
import { Environment } from '@meadsoft/common';
import { ICrudRepository, InfrastructureConfig, ISeed, ISeedData } from '..';

const JSON_INDENT = 2;

export type IBackupConfig = {
    tableName: string;
    repository: ICrudRepository;
};

export function generateBackupFilename(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '.');
    return `backup-${timestamp}.json`;
}

export async function backupRepositories(
    infraConfig: InfrastructureConfig,
    configs: IBackupConfig[],
    backupFolderpath: string,
    backupFilename?: string,
): Promise<void> {
    const backups: ISeedData[] = [];
    let totalRecords = 0;
    console.log('\nStarting backup...\n');
    // Backup each table using repository's findMany()
    for (const { tableName, repository } of configs) {
        console.log(`Backing up ${tableName}...`);
        const data = await repository.findMany();
        backups.push({ tableName, data });
        console.log(`✓ ${tableName}: ${data.length.toString()} records`);
        totalRecords += data.length;
    }
    if (!fs.existsSync(backupFolderpath)) {
        await fsPromises.mkdir(backupFolderpath, { recursive: true });
    }
    const filename = backupFilename ?? generateBackupFilename();
    const filepath = join(backupFolderpath, filename);
    if (!(infraConfig.APP_ENV in Environment)) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const appEnv: Environment = infraConfig.APP_ENV as Environment;
    const backupData: ISeed = {
        timestamp: new Date().toISOString(),
        appEnv: appEnv,
        totalRecords,
        tables: backups,
    };
    await fsPromises.writeFile(
        filepath,
        JSON.stringify(backupData, null, JSON_INDENT),
        'utf-8',
    );
    console.log(`\n✓ Backup completed successfully!`);
    console.log(`  Total records: ${totalRecords.toString()}`);
    console.log(`  File: ${filepath}`);
}
