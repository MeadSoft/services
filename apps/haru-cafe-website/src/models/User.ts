export class User {
    id: string;
    email: string | undefined;
    roles: string[];

    constructor(id: string, email: string | undefined, roles: string[]) {
        this.id = id;
        this.email = email;
        this.roles = roles;
    }
}
