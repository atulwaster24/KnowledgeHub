import { AppError} from "../../shared/errors/AppError.js";

export class EmailAlreadyExistsError extends AppError {
    constructor() {
        super("Email already in use", 409);
    }
}


export class UsernameAlreadyExistsError extends AppError {
    constructor() {
        super("Username already in use", 409);
    }
}


export class InvalidCredentialsError extends AppError {
    constructor() {
        super("Invalid email or password", 401);
    }
};