import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let checkRestaurants = (day, time, isActive) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Restaurants WHERE openHour <= ? AND closeHour > ? AND isActive = ? AND restaurantID NOT IN (SELECT restaurantID FROM ClosedDays WHERE day = ?);", [time, time, isActive, day], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }


    try {
        const rows = await checkRestaurants(event.day, event.time, "Y")
        response = {
            statusCode: 200,
            restaurants: rows
        }
    }
    catch (err) {
        response = { statusCode: 400, error: err }
    }
    pool.end();
    return response;
}