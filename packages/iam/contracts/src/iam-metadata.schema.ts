import { z } from 'zod';

export const IamMetadataSchema = z.object({
    serviceName: z.string().nonempty(),
    roles: z.array(
        z.object({
            name: z.string().nonempty(),
            permissions: z.array(z.string().nonempty()),
        }),
    ),
});
export type IIamMetadata = z.infer<typeof IamMetadataSchema>;
