import mysql from 'mysql';

export const handler = async (event) => {
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
})
let response={};

let createConstant = (name, address, numberOfTables) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM Restaurants WHERE name = ? AND address = ?;", [name, address, numberOfTables], (error, rows) => {
            console.log("Name: " + name);
            console.log("Address: " + address);
            console.log("Number of Tables: " + numberOfTables);
            console.log(rows)
            if (error) { return reject(error); }
            if ((rows) && (rows.affectedRows === 1)) {
                return resolve(true);
            } else {
                return resolve(false);
            }
        });
    });
}
    try{
        console.log(event)
        const result = await createConstant(event.name, event.address, event.numberOfTables)
        if (result) {
            response = { statusCode: 200, result: { "success" : true }}
        } else {
            response = { statusCode: 400, error: "failed" }
        }
    }   
    catch (error) {
    response.statusCode = 400
    response.error = error
}

pool.end()
    return response;
}