export class DatatypeValidationError extends Error {
    constructor(datatype: string, value: string) {
        const message = `The value ${value} is not a valid ${datatype}`;
        super(message);
        this.name = 'ValidationError';
    }
}

// Define ANSI escape codes for colors
const red = '\x1b[31m';
const reset = '\x1b[0m'; // Resets the color back to default

export function printError(error: any) {
    console.log(`${red}${error}${reset}`);
}
