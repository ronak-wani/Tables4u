import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let fetchReservation = (restaurantID, day) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Reservations where restaurantID = ? AND day = ?;", [restaurantID, day], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    try{
        const all_reservations = await fetchReservation(event.restaurantID, event.day)
        if(all_reservations.length === 0){
            response = {
                statusCode: 200,
                result: "0"
            }
            return response;
        }
        else{
            response = {
                statusCode: 200,
                result: all_reservations
            }
        }
    }
    catch(err) {
        response = {statusCode: 400, error: err}
    }

    pool.end()
    return response;
}