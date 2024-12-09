import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let checkClosedDay = (restaurantID, day) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM ClosedDays WHERE restaurantID = ? AND day = ?", [restaurantID, day], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    try{
        const rows = await checkClosedDay(event.restaurantID, event.day)
        if (rows.length === 0) {
            response = {
                statusCode: 200,
                result:{
                    "canBook": true,
                    "message": "The restaurant is open on the given day"
                }
            }
        }
        else{
            response = {
                statusCode: 301,
                result:{
                    "canBook": false,
                    "message": "The restaurant is closed on the given day"
                }
            }
        }
    }
    catch(err) {
        response = {statusCode: 400, error: err}
    }

    pool.end()
    return response;
}