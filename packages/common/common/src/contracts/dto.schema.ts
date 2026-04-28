// import { z } from 'zod';

// TODO: implement a zod schema for DTO objects. DTO objects are expected to
//       only contain primitive types or complex objects containing only
//       primitive types. No functions, methods, or class instances allowed.
// export const DtoSchema = z.object({
//     id: z.string().or(z.null()),
// });

// export type IDTO = z.infer<typeof DtoSchema>;
export type IDTO = Record<string, unknown>;
