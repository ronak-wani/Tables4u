import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let DeleteRestauraunt = () => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM Restaurants WHERE name = ? AND address = ?;", [event.name, event.address], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    let FindRestaurant = (name, address) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT name, address FROM Restaurants WHERE name = ? AND address = ?", [name, address], (error, rows) => {
                if (error) { return reject(error); }
                let output = JSON.parse(JSON.stringify(rows))
                return resolve(output[0]);
            })
        })
    }

    if (event.adminPass === process.env.ADMIN_PASS) {
        const foundIt = await FindRestaurant(event.name, event.address)
        try {
            if ((foundIt.name === event.name) && (foundIt.address === event.address)) {
                try {
                    const deleteStatus = await DeleteRestauraunt()
                    response = {
                        statusCode: 200,
                        success: true
                    }
                }
                catch (err) {
                    response = { statusCode: 400, error: err }
                }
            }
        }
        catch {
            response = {
                statusCode: 400,
                success: false,
                error: "Restaurant not found"
            }
        }


    }
    else {
        response = { statusCode: 400, error: "Incorrect Admin Password" }
    }

    pool.end()
    return response;
}