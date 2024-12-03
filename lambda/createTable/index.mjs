import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let CreateTable = (restaurantID, tableID, numberOfSeats) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO Tables (restaurantID, tableID, numberOfSeats) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE numberOfSeats=?;", [restaurantID, tableID, numberOfSeats, numberOfSeats], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    try{
        const table = await CreateTable(event.restaurantID, event.tableID, event.numberOfSeats)
        response = {
            statusCode: 200,
            result: {
                "restaurantID" : event.restaurantID,
                "tableID" : event.tableID,
                "numberOfSeats" : event.numberOfSeats
            }
        }
    }
    catch(err) {
        response = {statusCode: 400, error: err}
    }

    pool.end()
    return response;
}