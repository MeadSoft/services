import { ConflictException, Injectable } from '@nestjs/common';
import type { IPrinciple } from '@meadsoft/iam-contracts';
import { PrincipleRepository } from '../database/repositories/principle.repo';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class PrincipleService {
    constructor(private readonly principleRepo: PrincipleRepository) {}

    /**
     * Registers a new principle with a local email and password.
     * @param email the email to register the principle with
     * @param password the password the principle could use to login
     * @param displayName the display name of the principle
     * @returns the created principle account
     */
    async registerLocal(
        email: string,
        password: string,
        displayName?: string,
    ): Promise<IPrinciple> {
        const existing = await this.principleRepo.findByEmail(email);
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await this.hashPassword(password);
        const now = new Date().toISOString();

        const principle = await this.principleRepo.createOne({
            id: uuidv7(),
            email,
            displayName: displayName ?? null,
            isActive: true,
            createdDate: now,
            updatedDate: now,
            createdById: null,
            updatedById: null,
        });

        await this.ensureLoginMethod(principle.id, {
            provider: 'local',
            providerPrincipleId: principle.id,
            providerEmail: email,
        });

        return principle;
    }
}
