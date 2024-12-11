import mysql from 'mysql'

export const handler = async (event) => {

    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })

    let response={};

    let DeleteReservation = (confirmation, email) => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Reservations WHERE confirmation = ? AND email = ?;", [confirmation, email], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.affectedRows === 1)) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }

    try {
        console.log(event)
        const result = await DeleteReservation(event.confirmation, event.email)
        if (result) {
            response = { statusCode: 200, result: { "success" : true }}
        } else {
            response = { statusCode: 400, error: "No such reservation" }
        }
    } catch (err) {
        console.log(err)
        response = { statusCode: 400, error: err }
    }

    pool.end();

    return response;
}

