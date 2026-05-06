/**
 * A standardized interface for defining fully qualified field metadata
 *
 * Intended to be used with backend filtering services when deciding how to apply
 * filters to infrastructure queries.
 */
export interface IFieldMetadata<T = Record<string, unknown>> {
    service: string;
    resource: string;
    field: keyof T;
}

/**
 * Helper function to create field metadata objects with type safety.
 *
 * ---
 *
 * Example: Creating field metadata for the 'email' field of the IPrinciple interface
 *
 * ```ts
 * const emailFieldMetadata = createFieldMetadata<IPrinciple>(
 *   'iam',
 *   'principle',
 *   'email'
 * );
 * ```
 *
 * ---
 *
 * Example: Creating a factory function to create metadata for multiple fields on the IPrinciple interface
 *
 * ```ts
 * function principleFieldMetadataFactory(fieldName: string): IFieldMetadata<IPrinciple> {
 *   return createFieldMetadata<IPrinciple>('iam', 'principle', fieldName);
 * }
 *
 * const emailMetadata = principleFieldMetadataFactory('email');
 * const displayNameMetadata = principleFieldMetadataFactory('displayName');
 * ```
 */
export function createFieldMetadata<T extends Record<string, unknown>>(
    serviceName: string,
    resourceName: string,
    fieldName: keyof T,
): IFieldMetadata<T> {
    return {
        service: serviceName,
        resource: resourceName,
        field: fieldName,
    };
}
