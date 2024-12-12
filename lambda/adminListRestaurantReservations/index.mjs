import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let ListRestaurauntReservations = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT tableID, numberOfSeats, confirmation, day, time, email FROM Reservations WHERE restaurantID = ?", [event.restaurantID], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    if (event.adminPass === process.env.ADMIN_PASS) {

        try {
            const all_reservations = await ListRestaurauntReservations()
            response = {
                statusCode: 200,
                reservations: all_reservations,

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