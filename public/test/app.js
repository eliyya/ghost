import e from "express";
const app = e()

app.get('/',(req,res) => {
    res.json("hola mundo")
})


async function conecion()  {
    const connection = await mysql.createConnection({
        user: 'root',
        host: 'localhost',
        password: 'asdr123ubal890',
        database: 'companydb',
        port: 3306
    })
    return connection
}

app.get('/',(req,res) => {
    res.send("hola ")
    
})




app.listen(3000,() => {
    console.log("servidor corriendo en el puerto http://localhost:3000")
})