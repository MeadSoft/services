export class NotImplementedException extends Error {
    constructor(message = 'This functionality is not implemented.') {
        super(message);
        this.name = 'NotImplementedException';
    }
}
