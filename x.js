
import { hash, compare } from 'bcrypt'
const pass = await hash("admin", 10)
console.log(pass)
console.log(await hash("admin", 10))
console.log(await compare("admin", pass))
