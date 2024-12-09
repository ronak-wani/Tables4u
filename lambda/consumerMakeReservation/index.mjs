import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}


    const getRestaurantID = (name, address) => {
        return new Promise((resolve, reject) => {
            pool.query(
                "SELECT restaurantID FROM Restaurants WHERE name = ? AND address = ?;", [name, address], (error, results) => {
                    if (error) {return reject(error)}
                    return resolve(results);
                })
        })
    };

    const createReservation = (restaurantID, tableID, partySize, confirmation, day, time, email) => {
        return new Promise((resolve, reject) => {
            pool.query(
                "INSERT INTO Reservations (restaurantID, tableID, partySize, confirmation, day, time, email) VALUES (?, ?, ?, ?, ?, ?, ?);",
                [restaurantID, tableID, partySize, confirmation, day, time, email], (error, results) => {
                    if (error) {return reject(error)}
                    return resolve(results.insertId);
                }
            );
        });
    };

    try {
        const rows = await getRestaurantID(event.name, event.address);
        if (rows.length === 0) {
            throw new Error("Restaurant not found");
        }
        const { restaurantID } = rows[0];
        const reservationID = await createReservation(restaurantID, event.tableID, event.partySize, event.confirmation, event.day, event.time, event.email);
        response = {
            statusCode: 200,
            result: {
                restaurantID: restaurantID,
                tableID: event.tableID,
                partySize: event.partySize,
                confirmation: event.confirmation,
                day: event.day,
                time: event.time,
                email: event.email
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