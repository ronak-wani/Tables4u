import mysql from 'mysql'

export const handler = async (event) => {

    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })

    let response={};

    let DeleteConstant = (name, address) => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Restaurants WHERE name = ? AND address = ?;", [name, address], (error, rows) => {
                console.log("Name: " + name);
                console.log("Address: " + address);
                console.log(rows)
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
        const result = await DeleteConstant(event.name, event.address)
        if (result) {
            response = { statusCode: 200, result: { "success" : true }}
        } else {
            response = { statusCode: 400, error: "No such constant" }
        }
    } catch (err) {
        console.log(err)
        response = { statusCode: 400, error: err }
    }

    pool.end()     // close DB connections

    return response;
}

