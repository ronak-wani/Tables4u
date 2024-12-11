import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let FetchRestaurant = (name, address) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT restaurantID, numberOfTables FROM Restaurants WHERE name = ? AND address = ?;", [name, address], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    let checkTableAvailable = (restaurantID, day, time) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Reservations WHERE restaurantID = ? AND day =? AND time = ?;", [restaurantID, day, time], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    try{
        const rows = await FetchRestaurant(event.name, event.address, event.tableID)
        if (rows.length === 0) {
            throw new Error("Restaurant not found");
        }

        const { restaurantID, numberOfTables } = rows[0];

        const reservations = await checkTableAvailable(restaurantID, event.day, event.time)
        let tablesOccupied = numberOfTables - reservations.length
        if (reservations.length === 0) {
            response = {
                statusCode: 200,
                result: {
                    "restaurantID": restaurantID,
                    "tableID": 1,
                    "day": event.day,
                    "time": event.time,
                }
            }
        }
        else if (tablesOccupied === 0) {
            response = {
                statusCode: 200,
                result: {
                    "restaurantID": restaurantID,
                    "tableID": -1,
                    "day": event.day,
                    "time": event.time,
                }
            }
        }
        else{
            response = {
                statusCode: 200,
                result: {
                    "restaurantID": restaurantID,
                    "tableID": reservations.length + 1,
                    "day": event.day,
                    "time": event.time,
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