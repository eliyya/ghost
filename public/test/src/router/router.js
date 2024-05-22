import { Router } from "express"
import { conecion } from "../db/db"

const rutas = Router()

export  function Pagina() {
    rutas.get('/empleados',async (req,res) => {
        const connection = await conecion()
        const [row] = connection.query(`SELECT * FROM employee;`)
        res.send(row)
    })
}

