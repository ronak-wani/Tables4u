import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let getRestaurantInfo = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT numberOfTables, openHour, closeHour FROM Restaurants WHERE restaurantID = ?", [event.restaurantID], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    let getTablesInfo = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT numberOfSeats FROM Tables WHERE restaurantID = ?", [event.restaurantID], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    let getReservationsInfo = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT tableID, numberOfSeats, time FROM Reservations WHERE restaurantID = ? AND day = ?", [event.restaurantID, event.day], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    if (event.adminPass === process.env.ADMIN_PASS) {

        try {
            const restaurantInfo = await getRestaurantInfo()
            const tablesInfo = await getTablesInfo()
            const reservationsInfo = await getReservationsInfo()
            if(reservationsInfo.length === 0){
                response = {
                    statusCode: 200,
                    numberOfTables: restaurantInfo[0].numberOfTables,
                    openHour: restaurantInfo[0].openHour,
                    closeHour: restaurantInfo[0].closeHour,
                    tableCapacity: tablesInfo,
                    result: "0"
                }
                return response;
            }
            response = {
                statusCode: 200,
                result: {
                    numberOfTables: restaurantInfo[0].numberOfTables,
                    openHour: restaurantInfo[0].openHour,
                    closeHour: restaurantInfo[0].closeHour,
                    tableCapacity: tablesInfo,
                    reservations: reservationsInfo
                }
            }
        }
        catch (err) {
            response = { statusCode: 400, error: err }
        }
    }
    else {
        response = { statusCode: 400, error: "Incorrect Admin Password" }
    }



    pool.end()
    return response;
}