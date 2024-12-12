import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let DeleteReservation = () => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Reservations WHERE confirmation = ? AND email = ?;", [event.confirmation, event.email], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    let FindReservation = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT confirmation, email FROM Reservations WHERE confirmation = ? AND email = ?", [event.confirmation, event.email], (error, rows) => {
                if (error) { return reject(error); }
                let output = JSON.parse(JSON.stringify(rows))
                return resolve(output[0]);
            })
        })
    }
    if (event.adminPass === process.env.ADMIN_PASS) {
        const foundIt = await FindReservation()
                try {
            if ((("" + foundIt.confirmation) === ("" + event.confirmation)) && ("" + foundIt.email === "" + event.email)) { /**/
                try {
                    const deleteStatus = await DeleteReservation()
                    response = {
                        statusCode: 200,
                        success: true
                    }
                }
                catch (err) {
                    response = { statusCode: 401, error: err }
                }
            }
        }
        catch {
            response = {
                statusCode: 400,
                success: false,
                error: "Reservation not found"
            }
        }
    }
    else {
        response = { statusCode: 400, error: "Incorrect Admin Password" }
    }

    //response = { statusCode: 500, error: "Something went wrong" }
    pool.end()
    return response;
}