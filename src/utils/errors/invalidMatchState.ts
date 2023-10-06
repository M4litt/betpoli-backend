type ErrorName = 'InvalidMatchState';

export class InvalidMatchState extends Error {
    name: ErrorName;
    
    constructor(message: string) {
        super(message);
        this.name = 'InvalidMatchState';
    }
}