import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })
    let response = {}

    let ActivateRestaurant = (name, address, password) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Restaurants SET isActive = 'Y' WHERE name = ? AND address = ? AND password = ?;", [name, address, password], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    try{
        const all_restaurants = await ActivateRestaurant(event.name, event.address, event.password)
        response = {
            statusCode: 200,
            result: {
                "name" : event.name,
                "isActive" : event.isActive,
                "address" : event.address
            }
        }
    }
    catch(err) {
        response = {statusCode: 400, error: err}
    }




    pool.end()
    return response;
}