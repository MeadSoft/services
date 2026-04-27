import { REGEX } from '../constants/regex';

export function validateUuid(id: string) {
    return REGEX.UUID.test(id);
}
