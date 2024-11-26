import mysql from 'mysql'

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })

    let DeleteConstant = (name) => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Restaurants WHERE restaurantID=?", [name], (error, rows) => {
                if (error) { return reject(error); }
                if ((rows) && (rows.affectedRows === 1)) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }

    let response

    try {
        const result = await DeleteConstant(event.name)
        if (result) {
            response = { statusCode: 200, result: { "success" : true }}
        } else {
            response = { statusCode: 400, error: "No such constant" }
        }
    } catch (err) {
        response = { statusCode: 400, error: err }
    }

    pool.end()     // close DB connections

    return response;
}

