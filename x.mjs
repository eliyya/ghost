import {Snowflake} from '@sapphire/snowflake'

import { hash, compare } from 'bcrypt'
const pass = await hash("admin", 10)
console.log(pass)
console.log(await hash("admin", 10))
console.log(await compare("admin", pass))

const snowflakeDate = new Date(process.env.NEXT_SNOWFLAKE_DATE??'2024-02-05')

const snow = new Snowflake(snowflakeDate)
console.log(snow.generate())
