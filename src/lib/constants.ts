if (!process.env.NEXT_JWT_SECRET) throw new Error('NEXT_JWT_SECRET is not set in .env')

export const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET)

export const COOKIE = {
    SESSION: 'session'
}

import { Snowflake } from '@sapphire/snowflake'

export const snowflake = new Snowflake(new Date(process.env.NEXT_SNOWFLAKE_DATE??'2024-02-05'))