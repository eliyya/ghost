import { Snowflake } from '@sapphire/snowflake'

if (!process.env.NEXT_JWT_SECRET)
    throw new Error('NEXT_JWT_SECRET is not set in .env')

export const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET)

export const COOKIES = {
    SESSION: 'ghost-session',
}

export const HEADERS = {
    PATHNAME: 'pathname',
}

export const snowflake = new Snowflake(
    new Date(process.env.NEXT_SNOWFLAKE_DATE ?? '2024-02-05'),
)

export enum RegisterUserErrorMessages {
    TakenUsername = 'Username already in use',
    InvalidName = 'Invalid Name',
    InvalidPassword = 'Invalid Password',
    Internal = 'Internal Server Error',
}

export enum RegisterUserSuccessMessages {
    UserCreated = 'User Created',
}
