import {Snowflake} from '@sapphire/snowflake'
const snowflakeDate = new Date(process.env.NEXT_SNOWFLAKE_DATE??'2024-02-05')

const snow = new Snowflake(snowflakeDate)

import { hash, compare } from 'bcrypt'
const pass = await hash("admin", 10)
console.log(pass)
console.log(await hash("admin", 10))
console.log(await compare("admin", pass))


console.log(snow.generate())
