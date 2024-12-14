import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let findRestaurantID = (name, address) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT restaurantID FROM Restaurants WHERE name = ? AND address = ?;",
                [name, address], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows);
                })
        })
    }


    let findTableIDs = (day, time, restaurantID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT tableID FROM Tables WHERE restaurantID = ? AND tableID <= (SELECT numberOfTables FROM Restaurants WHERE restaurantID = ?) AND tableID NOT IN (SELECT tableID FROM Reservations WHERE restaurantID = ? AND day = ? AND time = ?);",
                [restaurantID, restaurantID, restaurantID, day, time], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows);
                })
        })
    }

    let findTableCapacities = (day, time, restaurantID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT numberOfSeats FROM Tables WHERE restaurantID = ? AND tableID <= (SELECT numberOfTables FROM Restaurants WHERE restaurantID = ?) AND tableID NOT IN (SELECT tableID FROM Reservations WHERE restaurantID = ? AND day = ? AND time = ?);",
                [restaurantID, restaurantID, restaurantID, day, time], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows);
                })
        })
    }


    try {
        console.log("got -1")
        const restaurantID = await findRestaurantID(event.name, event.address)
        console.log("resID = " + Number(restaurantID))
        console.log("got 0")
        const IDs = await findTableIDs(event.day, event.time, restaurantID[0].restaurantID)
        console.log("got 1")
        const capacities = await findTableCapacities(event.day, event.time, restaurantID[0].restaurantID)
        console.log("got2")

        let IDnos = []
        let tableCapacities = []
        let i = 0
        for (const theID of IDs){
            IDnos[i] = IDs[i].tableID
            tableCapacities[i] = capacities[i].numberOfSeats
            i= i+1
        }

        response = {
            statusCode: 200,
            result: {
                restaurantID: restaurantID[0].restaurantID,
                tableIDs: IDnos,
                capacities: tableCapacities
            },
        }
    }
    catch {
        response = {
            statusCode: 400,
            success: false,
            error: "failure"
        }
    }



    pool.end()
    return response;
}