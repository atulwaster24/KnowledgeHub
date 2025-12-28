import prisma from "../../shared/db/prisma.js";

export const findUserByEmail = (email) => {
    return prisma.user.findUnique({where: {email}});
};

export const findUserByUsername = (username) => {
    return prisma.user.findUnique({where: {username}});
};


export const createUser = (data) => {
    return prisma.user.create({data});
}