import bcrypt from "bcrypt";

import { findUserByEmail, findUserByUsername, createUser } from "./auth.repository.js";

import { EmailAlreadyExistsError, UsernameAlreadyExistsError } from "./auth.errors.js";

import { logger } from "../../config/logger.js";


const  SALT_ROUNDS = 10;

export const registerUser = async ({email, username, password}) => {
    const existingUser = await findUserByEmail(email);
    if (existingUser){
        logger.warn({email}, "Registration failed: Email exists");
        throw new EmailAlreadyExistsError();
    }


    const existingUsername = await findUserByUsername(username);
    if (existingUsername){
        logger.warn({username}, "Regisration failed: Username exists");
        throw new UsernameAlreadyExistsError();
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await createUser({email, username, password: hashedPassword});

    logger.info({userId:user.id}, "User registered successfully");
    return {
        id: user.id,
        email: user.email,
        username: user.username
    };
};