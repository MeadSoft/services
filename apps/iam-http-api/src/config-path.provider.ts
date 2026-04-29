import { CONFIG_PATH_TOKEN } from '@meadsoft/common-server';
import path from 'path';

export const ConfigPathProvider = {
    provide: CONFIG_PATH_TOKEN,
    useFactory: () => path.join(__dirname, '..'),
};
