import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let checkClosedDay = (day) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM ClosedDays WHERE day = ?;", [day], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    let listRestaurants = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Restaurants WHERE isActive = 'Y';", (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    let skipRestaurants = (restaurantID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Restaurants WHERE isActive = 'Y' AND restaurantID != ?;", [restaurantID], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    try{
        const rows = await checkClosedDay(event.day)
        if (rows.length === 0) {
            const restaurants = await listRestaurants()
            response = {
                statusCode: 200,
                result:restaurants
            }
        }
        else{
            for (let i = 0; i < rows.length; i++) {
                const restaurants = await skipRestaurants(rows[i].restaurantID)
                response = {
                    statusCode: 200,
                    result: restaurants
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